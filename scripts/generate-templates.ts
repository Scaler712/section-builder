/**
 * Template Generation Script
 *
 * Generates 228 pre-built HTML templates (19 design systems x 12 section types)
 * by calling the Claude API in batch.
 *
 * Usage:
 *   cd tools/section-builder
 *   ANTHROPIC_API_KEY=sk-ant-... npm run generate-templates
 *
 * Options (append after --):
 *   --design-system=<id>    Generate only for a specific design system
 *   --section-type=<id>     Generate only for a specific section type
 *   --concurrency=<n>       Parallel requests (default: 5)
 *   --dry-run               Show what would be generated without calling API
 *   --force                 Regenerate even if files exist
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import { designSystems, type DesignSystem } from "@/lib/design-systems";
import { templates as allTemplates, type SectionTemplate } from "@/lib/templates";
import { SYSTEM_PROMPT, buildDesignSystemContext } from "@/lib/ai-prompt";
import { sanitizeHtml } from "@/lib/sanitize";

// --- Constants ---
const OUTPUT_DIR = path.resolve(__dirname, "../public/templates");
const REGISTRY_PATH = path.join(OUTPUT_DIR, "registry.json");
const MODEL = "claude-sonnet-4-5-20250929";
const MAX_RETRIES = 2;
const MIN_HTML_LENGTH = 100;

// --- Build user prompt for a specific template ---
function buildTemplatePrompt(
  designSystem: DesignSystem,
  template: SectionTemplate
): string {
  const parts: string[] = [];

  parts.push(`Generate a "${template.id}" section for a generic SaaS/digital product sales page.`);
  parts.push(`Language: English`);
  parts.push(`\n## Design System Override`);
  parts.push(buildDesignSystemContext(designSystem));
  parts.push(`\nSection-specific guidance: ${template.aiPromptHints}`);

  if (designSystem.referenceHtml) {
    parts.push(`\nDesign System Reference HTML (THIS is your primary visual guide — replicate this aesthetic, layout patterns, shadows, animations, and typography exactly for the "${template.id}" section type):\n${designSystem.referenceHtml}`);
    parts.push(`\nGeneric template structure (use only for content structure hints, NOT visual style):\n${template.defaultHtml}`);
  } else {
    parts.push(`\nReference HTML (use as structural guide):\n${template.defaultHtml}`);
  }

  return parts.join("\n");
}

// --- Main generation function ---
async function generateTemplate(
  client: Anthropic,
  designSystem: DesignSystem,
  template: SectionTemplate,
  attempt: number = 0
): Promise<string> {
  const userPrompt = buildTemplatePrompt(designSystem, template);

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const cleaned = sanitizeHtml(text);

  if (cleaned.length < MIN_HTML_LENGTH) {
    if (attempt < MAX_RETRIES) {
      console.warn(`  Warning: ${designSystem.id}/${template.id}: too short (${cleaned.length} chars), retrying... (${attempt + 1}/${MAX_RETRIES})`);
      return generateTemplate(client, designSystem, template, attempt + 1);
    }
    throw new Error(`Output too short after ${MAX_RETRIES} retries: ${cleaned.length} chars`);
  }

  return `<!-- Generated: ${designSystem.id}/${template.id} -->\n${cleaned}`;
}

// --- Concurrency limiter ---
async function withConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number,
  onProgress?: (completed: number, total: number) => void
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;
  let completed = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const index = nextIndex++;
      results[index] = await tasks[index]!();
      completed++;
      onProgress?.(completed, tasks.length);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// --- CLI ---
async function main() {
  const args = process.argv.slice(2);
  const flags = Object.fromEntries(
    args
      .filter((a) => a.startsWith("--"))
      .map((a) => {
        const [k, v] = a.slice(2).split("=");
        return [k, v ?? "true"];
      })
  );

  const filterDesignSystem = flags["design-system"] || null;
  const filterSectionType = flags["section-type"] || null;
  const concurrency = parseInt(flags["concurrency"] || "5", 10);
  const dryRun = "dry-run" in flags;
  const force = "force" in flags;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey && !dryRun) {
    console.error("Error: ANTHROPIC_API_KEY environment variable required");
    console.error("Usage: ANTHROPIC_API_KEY=sk-ant-... npm run generate-templates");
    process.exit(1);
  }

  // Apply filters
  let filteredDesignSystems = [...designSystems];
  let filteredTemplates = [...allTemplates];

  if (filterDesignSystem) {
    filteredDesignSystems = filteredDesignSystems.filter((ds) => ds.id === filterDesignSystem);
    if (filteredDesignSystems.length === 0) {
      console.error(`Design system "${filterDesignSystem}" not found`);
      console.error(`Available: ${designSystems.map((ds) => ds.id).join(", ")}`);
      process.exit(1);
    }
  }
  if (filterSectionType) {
    filteredTemplates = filteredTemplates.filter((t) => t.id === filterSectionType);
    if (filteredTemplates.length === 0) {
      console.error(`Section type "${filterSectionType}" not found`);
      console.error(`Available: ${allTemplates.map((t) => t.id).join(", ")}`);
      process.exit(1);
    }
  }

  const totalTemplates = filteredDesignSystems.length * filteredTemplates.length;
  console.log(`\nTemplate Generator`);
  console.log(`==================`);
  console.log(`Design systems: ${filteredDesignSystems.length}`);
  console.log(`Section types:  ${filteredTemplates.length}`);
  console.log(`Total:          ${totalTemplates} templates`);
  console.log(`Concurrency:    ${concurrency}`);
  console.log(`Force:          ${force}`);

  if (dryRun) {
    console.log(`\n--- DRY RUN ---`);
    for (const ds of filteredDesignSystems) {
      for (const tpl of filteredTemplates) {
        const outFile = path.join(OUTPUT_DIR, ds.id, `${tpl.id}.html`);
        const exists = fs.existsSync(outFile);
        console.log(`  ${ds.id}/${tpl.id}.html ${exists ? "(exists)" : ""}`);
      }
    }
    return;
  }

  const client = new Anthropic({ apiKey });

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Load existing registry if resuming
  let registry: Record<string, Record<string, { file: string; size: number }>> = {};
  if (fs.existsSync(REGISTRY_PATH) && !force) {
    try {
      registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));
    } catch {
      // Start fresh
    }
  }

  // Build task list
  const tasks: { designSystem: DesignSystem; template: SectionTemplate }[] = [];

  for (const ds of filteredDesignSystems) {
    for (const tpl of filteredTemplates) {
      tasks.push({ designSystem: ds, template: tpl });
    }
  }

  const errors: string[] = [];
  let skipped = 0;
  const startTime = Date.now();

  // Generate with concurrency
  await withConcurrency(
    tasks.map((task) => async () => {
      const { designSystem, template } = task;
      const dsDir = path.join(OUTPUT_DIR, designSystem.id);
      const outFile = path.join(dsDir, `${template.id}.html`);
      const relFile = `${designSystem.id}/${template.id}.html`;

      // Skip if already exists and not forcing
      if (!force && fs.existsSync(outFile)) {
        const stat = fs.statSync(outFile);
        if (stat.size > MIN_HTML_LENGTH) {
          if (!registry[designSystem.id]) registry[designSystem.id] = {};
          registry[designSystem.id]![template.id] = { file: relFile, size: stat.size };
          skipped++;
          return;
        }
      }

      try {
        const html = await generateTemplate(client, designSystem, template);

        fs.mkdirSync(dsDir, { recursive: true });
        fs.writeFileSync(outFile, html, "utf-8");

        if (!registry[designSystem.id]) registry[designSystem.id] = {};
        registry[designSystem.id]![template.id] = { file: relFile, size: html.length };
      } catch (err) {
        const msg = `${relFile}: ${err instanceof Error ? err.message : String(err)}`;
        errors.push(msg);
        console.error(`\n  ERROR: ${msg}`);
      }
    }),
    concurrency,
    (completed, total) => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const pct = ((completed / total) * 100).toFixed(0);
      process.stdout.write(`\r  Progress: ${completed}/${total} (${pct}%) | ${elapsed}s elapsed`);
    }
  );

  console.log("\n");

  // Write registry
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf-8");
  console.log(`Registry: ${REGISTRY_PATH}`);

  // Summary
  const successCount = Object.values(registry).reduce(
    (sum, ds) => sum + Object.keys(ds).length,
    0
  );
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n--- Summary ---`);
  console.log(`Total in registry: ${successCount}`);
  console.log(`Skipped (existing): ${skipped}`);
  console.log(`Generated this run: ${totalTemplates - skipped - errors.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Time: ${elapsed}s`);

  if (errors.length > 0) {
    console.log(`\nFailed:`);
    errors.forEach((e) => console.log(`  - ${e}`));
    console.log(`\nRe-run to retry failed templates (existing ones will be skipped).`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
