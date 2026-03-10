/**
 * Content Injector — takes pre-built template HTML + parsed content
 * and produces populated HTML via DOM manipulation.
 *
 * Strategy: templates vary in class names across design systems, so
 * we use priority selector chains that try multiple selectors per
 * element. For repeatable items (testimonials, FAQ, pricing, etc.)
 * we use clone-and-trim: clone the first item as a template, clear
 * the container, then fill and append clones for each content item.
 */

import type {
  SectionContent,
  HeroContent,
  PainPointsContent,
  SolutionContent,
  BenefitsContent,
  TestimonialsContent,
  PricingContent,
  FaqContent,
  CtaContent,
  GuaranteeContent,
  AboutContent,
  VideoContent,
} from "./content-types";

// ── Entry point ──

export function injectContent(templateHtml: string, content: SectionContent): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${templateHtml}</body>`, "text/html");

  switch (content.type) {
    case "hero":
      injectHero(doc, content);
      break;
    case "pain-points":
      injectPainPoints(doc, content);
      break;
    case "solution-transition":
      injectSolution(doc, content);
      break;
    case "benefits-grid":
      injectBenefits(doc, content);
      break;
    case "testimonials":
      injectTestimonials(doc, content);
      break;
    case "pricing":
      injectPricing(doc, content);
      break;
    case "faq":
      injectFaq(doc, content);
      break;
    case "cta":
      injectCta(doc, content);
      break;
    case "guarantee":
      injectGuarantee(doc, content);
      break;
    case "about-bio":
      injectAbout(doc, content);
      break;
    case "video-embed":
      injectVideo(doc, content);
      break;
  }

  return doc.body.innerHTML;
}

// ── Per-type injectors ──

function injectHero(doc: Document, c: HeroContent): void {
  const root = doc.querySelector(".sb-hero") || doc.body;

  if (c.badge) {
    injectBadge(root, c.badge);
  }

  setText(root.querySelector("h1"), c.headline);

  if (c.subheadline) {
    setText(
      queryFirst(root,
        ".sb-sub",
        ".sb-subtitle",
        ".sb-section-sub",
        "p:not(.sb-trust):not(.sb-badge):not(.sb-microcopy):not(.sb-proof-text)"
      ),
      c.subheadline
    );
  }

  if (c.cta) {
    const ctaEl = queryFirst(root,
      "a.sb-cta-btn",
      ".sb-btn-primary",
      'a[class*="cta"]',
      ".sb-btn",
      "a[href]"
    );
    setText(ctaEl, c.cta);
  }

  if (c.trust) {
    const trustEl = queryFirst(root, ".sb-trust", ".sb-proof-text", ".sb-proof");
    setText(trustEl, c.trust);
  }
}

function injectPainPoints(doc: Document, c: PainPointsContent): void {
  const root = doc.querySelector(".sb-pain-points") || doc.body;

  injectBadge(root, c.badge);
  injectHeadline(root, c.headline);
  injectSubtitle(root, c.subtitle);

  cloneAndFill(root, [".sb-pain-item", ".sb-card"], c.points, (clone, item) => {
    setText(clone.querySelector("h3"), item.title);
    const descEl = queryFirst(clone, ".sb-pain-text p", "p:not(.sb-badge):not(.sb-label)");
    setText(descEl, item.description);
  });
}

function injectSolution(doc: Document, c: SolutionContent): void {
  const root = doc.querySelector(".sb-solution-transition") || doc.body;

  injectBadge(root, c.badge);

  // Solution headline is often inside .sb-pivot
  const pivotH2 = root.querySelector(".sb-pivot h2");
  if (pivotH2) {
    setText(pivotH2, c.headline);
  } else {
    injectHeadline(root, c.headline);
  }

  if (c.subtitle) {
    const subEl = queryFirst(root,
      ".sb-pivot p:not(.sb-badge):not(.sb-label)",
      ".sb-subtitle",
      ".sb-section-sub",
      ".sb-sub"
    );
    setText(subEl, c.subtitle);
  }

  // Body text goes into empathy section or first available p
  if (c.body) {
    const empathy = root.querySelector(".sb-empathy");
    const bodyContainer = empathy || root;
    const paragraphs = bodyContainer.querySelectorAll("p:not(.sb-badge):not(.sb-label):not(.sb-subtitle)");

    if (paragraphs.length > 0) {
      const bodyParts = c.body.split(/\n\n?/).filter((s) => s.trim());
      for (var i = 0; i < paragraphs.length; i++) {
        setText(paragraphs[i], bodyParts[i] || "");
      }
      // If more body parts than paragraphs, add them
      if (empathy) {
        for (var j = paragraphs.length; j < bodyParts.length; j++) {
          const p = doc.createElement("p");
          p.textContent = bodyParts[j]!;
          empathy.appendChild(p);
        }
      }
    }
  }

  // Bullets
  if (c.bullets && c.bullets.length > 0) {
    const ul = root.querySelector("ul");
    if (ul) {
      ul.innerHTML = "";
      for (var k = 0; k < c.bullets.length; k++) {
        const li = doc.createElement("li");
        li.textContent = c.bullets[k]!;
        ul.appendChild(li);
      }
    }
  }
}

function injectBenefits(doc: Document, c: BenefitsContent): void {
  // atmospheric-glass uses .sb-benefits, default uses .sb-benefits-grid
  const root = doc.querySelector(".sb-benefits-grid")
    || doc.querySelector(".sb-benefits")
    || doc.body;

  injectBadge(root, c.badge);
  injectHeadline(root, c.headline);
  injectSubtitle(root, c.subtitle);

  cloneAndFill(root,
    [".sb-card", ".sb-benefits-card", ".sb-benefit-card", ".sb-item"],
    c.items,
    (clone, item) => {
      setText(clone.querySelector("h3"), item.title);
      const descEl = queryFirst(clone, "p:not(.sb-badge):not(.sb-label)");
      setText(descEl, item.description);
    }
  );
}

function injectTestimonials(doc: Document, c: TestimonialsContent): void {
  const root = doc.querySelector(".sb-testimonials") || doc.body;

  injectBadge(root, c.badge);
  injectHeadline(root, c.headline);
  injectSubtitle(root, c.subtitle);

  cloneAndFill(root,
    [".sb-card", ".sb-testimonial-card"],
    c.items,
    (clone, item) => {
      // Quote text — varies widely across design systems
      const quoteEl = queryFirst(clone,
        "blockquote",
        ".sb-quote",
        "p.sb-quote",
        ".sb-testimonial-quote"
      );
      if (quoteEl) {
        // Only add quotes if the text doesn't already have them
        const quoteText = item.quote.startsWith('"') ? item.quote : `"${item.quote}"`;
        setText(quoteEl, quoteText);
      }

      // Author name — many variants
      const nameEl = queryFirst(clone,
        ".sb-name",
        ".sb-testimonial-name",
        ".sb-author-info h4",
        ".sb-author-info .sb-name",
        ".sb-author h4"
      );
      setText(nameEl, item.name);

      // Author role
      const roleEl = queryFirst(clone,
        ".sb-role",
        ".sb-testimonial-role",
        ".sb-author-info span:not(.sb-name)",
        ".sb-author-info .sb-role"
      );
      setText(roleEl, item.role);

      // Avatar initials — try multiple avatar selectors
      const avatarEl = queryFirst(clone, ".sb-avatar", ".sb-testimonial-avatar");
      if (avatarEl) {
        const initials = item.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        avatarEl.textContent = initials;
      }
    }
  );
}

function injectPricing(doc: Document, c: PricingContent): void {
  const root = doc.querySelector(".sb-pricing") || doc.body;

  injectBadge(root, c.badge);
  injectHeadline(root, c.headline);
  injectSubtitle(root, c.subtitle);

  // default uses .sb-plan, atmospheric uses .sb-pricing-card
  cloneAndFill(root,
    [".sb-plan", ".sb-pricing-card", ".sb-card"],
    c.tiers,
    (clone, tier) => {
      // Plan name — .sb-plan-name (default) or .sb-tier (atmospheric)
      const nameEl = queryFirst(clone, ".sb-plan-name", ".sb-tier", "h3");
      setText(nameEl, tier.name);

      // Price — handle period span inside price div
      const priceEl = queryFirst(clone, ".sb-plan-price", ".sb-price");
      if (priceEl) {
        const periodSpan = priceEl.querySelector("span");
        if (periodSpan && tier.period) {
          // Set the text node before the span, keep span for period
          const textNode = Array.from(priceEl.childNodes).find(
            (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()
          );
          if (textNode) {
            textNode.textContent = tier.price;
          } else {
            priceEl.insertBefore(doc.createTextNode(tier.price), periodSpan);
          }
          periodSpan.textContent = tier.period;
        } else {
          priceEl.textContent = tier.price + (tier.period ? ` ${tier.period}` : "");
        }
      }

      // Description (optional, some templates have it)
      const descEl = queryFirst(clone, ".sb-plan-desc", ".sb-desc");
      if (descEl && !tier.features.length) {
        // Only touch if no features to show
      }

      // Features list
      const ul = clone.querySelector("ul");
      if (ul && tier.features.length > 0) {
        const existingLi = ul.querySelector("li");
        ul.innerHTML = "";
        for (var i = 0; i < tier.features.length; i++) {
          if (existingLi) {
            const li = existingLi.cloneNode(true) as HTMLElement;
            const checkSpan = li.querySelector(".sb-check, .sb-icon, svg");
            if (checkSpan) {
              // Keep the check mark, clear text nodes, add new text
              const textNodes = Array.from(li.childNodes).filter(
                (n) => n.nodeType === Node.TEXT_NODE
              );
              textNodes.forEach((n) => (n.textContent = ""));
              li.appendChild(doc.createTextNode(" " + tier.features[i]!));
            } else {
              li.textContent = tier.features[i]!;
            }
            ul.appendChild(li);
          } else {
            const li = doc.createElement("li");
            li.textContent = tier.features[i]!;
            ul.appendChild(li);
          }
        }
      }

      // CTA button — many variants
      const ctaEl = queryFirst(clone,
        ".sb-plan-btn",
        ".sb-btn",
        ".sb-btn-primary",
        "a[href]"
      );
      setText(ctaEl, tier.cta);

      // Featured/highlighted tier
      if (tier.highlighted) {
        clone.classList.add("sb-featured");
      } else {
        clone.classList.remove("sb-featured");
        const popularBadge = queryFirst(clone, ".sb-popular-tag", ".sb-popular");
        if (popularBadge) popularBadge.remove();
      }
    }
  );
}

function injectFaq(doc: Document, c: FaqContent): void {
  const root = doc.querySelector(".sb-faq") || doc.body;

  injectBadge(root, c.badge);
  injectHeadline(root, c.headline);
  injectSubtitle(root, c.subtitle);

  cloneAndFill(root,
    [".sb-accordion-item", ".sb-faq-item"],
    c.items,
    (clone, item) => {
      // Question — varies by design system
      const questionEl = queryFirst(clone,
        ".sb-accordion-trigger span",
        ".sb-accordion-header h3",
        ".sb-faq-q h3",
        "h3",
        ".sb-accordion-trigger"
      );
      setText(questionEl, item.question);

      // Answer
      const answerEl = queryFirst(clone,
        ".sb-accordion-body-inner p",
        ".sb-accordion-body p",
        ".sb-faq-a p",
        "p"
      );
      setText(answerEl, item.answer);
    }
  );
}

function injectCta(doc: Document, c: CtaContent): void {
  const root = doc.querySelector(".sb-cta") || doc.body;

  injectHeadline(root, c.headline);

  if (c.subtitle) {
    // atmospheric uses .sb-lead, default uses .sb-section-sub
    const subEl = queryFirst(root,
      ".sb-section-sub",
      ".sb-lead",
      ".sb-subtitle",
      ".sb-sub"
    );
    setText(subEl, c.subtitle);
  }

  // CTA button — atmospheric uses .sb-btn-primary
  const ctaEl = queryFirst(root,
    "a.sb-cta-btn",
    ".sb-btn-primary",
    'a[class*="cta"]',
    ".sb-btn",
    "a[href]"
  );
  setText(ctaEl, c.cta);

  if (c.trust) {
    // atmospheric uses .sb-proof, default uses .sb-urgency
    const trustEl = queryFirst(root,
      ".sb-urgency",
      ".sb-proof",
      ".sb-trust",
      ".sb-proof-text"
    );
    setText(trustEl, c.trust);
  }
}

function injectGuarantee(doc: Document, c: GuaranteeContent): void {
  const root = doc.querySelector(".sb-guarantee") || doc.body;

  injectBadge(root, c.badge);
  injectHeadline(root, c.headline);

  // Body — search multiple containers for paragraphs
  // default: .sb-guarantee-text or .sb-guarantee-inner > p
  // atmospheric: .sb-guarantee-card > p
  const paragraphs = root.querySelectorAll(
    ".sb-guarantee-text, .sb-guarantee-inner > p, .sb-guarantee-card > p"
  );
  if (paragraphs.length > 0) {
    const bodyParts = c.body.split(/\n\n?/).filter((s) => s.trim());
    for (var i = 0; i < paragraphs.length && i < bodyParts.length; i++) {
      setText(paragraphs[i], bodyParts[i]!);
    }
    // Clear remaining paragraphs if fewer body parts
    for (var j = bodyParts.length; j < paragraphs.length; j++) {
      setText(paragraphs[j], "");
    }
  }
}

function injectAbout(doc: Document, c: AboutContent): void {
  const root = doc.querySelector(".sb-about-bio") || doc.body;

  injectBadge(root, c.badge);
  injectHeadline(root, c.headline);

  // Body paragraphs — default uses .sb-bio-content, atmospheric uses .sb-text-col
  const bioContent = root.querySelector(".sb-bio-content")
    || root.querySelector(".sb-text-col")
    || root;
  const paragraphs = bioContent.querySelectorAll(
    "p:not(.sb-badge):not(.sb-label):not(.sb-stat-label):not(.sb-stat-number):not(.sb-stat-num):not(.sb-role):not(.sb-photo-label)"
  );
  if (paragraphs.length > 0) {
    const bodyParts = c.body.split(/\n\n?/).filter((s) => s.trim());
    for (var i = 0; i < paragraphs.length && i < bodyParts.length; i++) {
      setText(paragraphs[i], bodyParts[i]!);
    }
  }

  // Credentials → stats row
  if (c.credentials && c.credentials.length > 0) {
    // default uses .sb-stat-item, atmospheric uses .sb-stat
    const stats = root.querySelectorAll(".sb-stat-item, .sb-stat");
    for (var k = 0; k < stats.length && k < c.credentials.length; k++) {
      // default uses .sb-stat-number, atmospheric uses .sb-stat-num
      const label = stats[k]!.querySelector(".sb-stat-label");
      const number = stats[k]!.querySelector(".sb-stat-number, .sb-stat-num");
      // Try to parse "2,400+ Members" format
      const parts = c.credentials[k]!.match(/^([0-9,+.%$€£]+)\s+(.+)$/);
      if (parts && number && label) {
        number.textContent = parts[1]!;
        label.textContent = parts[2]!;
      } else if (number) {
        number.textContent = c.credentials[k]!;
      } else if (label) {
        label.textContent = c.credentials[k]!;
      }
    }
  }
}

function injectVideo(doc: Document, c: VideoContent): void {
  const root = doc.querySelector(".sb-video-embed") || doc.body;

  injectBadge(root, c.badge);
  injectHeadline(root, c.headline);
  injectSubtitle(root, c.subtitle);

  if (c.videoUrl) {
    const iframe = root.querySelector("iframe");
    if (iframe) {
      iframe.setAttribute("src", c.videoUrl);
    }
  }
}

// ── Shared helpers ──

function setText(el: Element | null | undefined, text: string): void {
  if (!el || !text) return;
  el.textContent = text;
}

/**
 * Try multiple selectors against a root element, return first match.
 */
function queryFirst(root: Element | Document, ...selectors: string[]): Element | null {
  for (var i = 0; i < selectors.length; i++) {
    try {
      const el = root.querySelector(selectors[i]!);
      if (el) return el;
    } catch {
      // Invalid selector — skip
    }
  }
  return null;
}

/**
 * Inject badge text into the first badge-like element found.
 */
function injectBadge(root: Element | Document, badge?: string): void {
  if (!badge) return;
  const el = queryFirst(root, ".sb-badge", ".sb-label", ".sb-pill", ".sb-coord");
  setText(el, badge);
}

/**
 * Inject headline into the first h2 or h1 found.
 */
function injectHeadline(root: Element | Document, headline: string): void {
  const el = root.querySelector("h2") || root.querySelector("h1");
  setText(el, headline);
}

/**
 * Inject subtitle into the first subtitle-like element found.
 */
function injectSubtitle(root: Element | Document, subtitle?: string): void {
  if (!subtitle) return;
  const el = queryFirst(root,
    ".sb-section-sub",
    ".sb-subtitle",
    ".sb-sub",
    ".sb-lead",
    ".sb-section-title + p",
    "h2 + p"
  );
  setText(el, subtitle);
}

/**
 * Clone-and-trim: find repeatable items in the template, clone the first
 * one as a template, remove originals, insert filled clones at the same position.
 *
 * Uses the last item's nextSibling as a reference node to maintain correct
 * DOM position (before any trailing decorative elements like glow divs).
 */
function cloneAndFill<T>(
  root: Element | Document,
  itemSelectors: string[],
  items: T[],
  fillFn: (clone: HTMLElement, item: T) => void
): void {
  if (items.length === 0) return;

  // Find all existing repeatable items
  var existingItems: Element[] = [];
  for (var s = 0; s < itemSelectors.length; s++) {
    const found = root.querySelectorAll(itemSelectors[s]!);
    if (found.length > 0) {
      existingItems = Array.from(found);
      break;
    }
  }

  if (existingItems.length === 0) return;

  // Get the container (parent of the first item)
  const container = existingItems[0]!.parentElement;
  if (!container) return;

  // Clone the first item as our template
  const templateItem = existingItems[0]!.cloneNode(true) as HTMLElement;

  // Use the last item's nextSibling as the insertion reference.
  // This correctly handles cases where items are followed by decorative
  // elements (glow divs, etc.) that should remain at the end.
  const lastItem = existingItems[existingItems.length - 1]!;
  const referenceNode = lastItem.nextSibling;

  // Remove all existing items from the container
  for (const item of existingItems) {
    item.remove();
  }

  // Clone, fill, and insert at the original position
  for (var j = 0; j < items.length; j++) {
    const clone = templateItem.cloneNode(true) as HTMLElement;
    fillFn(clone, items[j]!);
    if (referenceNode && referenceNode.parentNode === container) {
      container.insertBefore(clone, referenceNode);
    } else {
      container.appendChild(clone);
    }
  }
}
