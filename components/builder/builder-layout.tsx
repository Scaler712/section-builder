"use client";

import { useState, useCallback } from "react";
import { TemplatePicker } from "./template-picker";
import { AiGenerator } from "./ai-generator";
import { ApiKeyInput } from "./api-key-input";
import { HtmlEditor } from "./html-editor";
import { PreviewPanel } from "./preview-panel";
import { OutputBar } from "./output-bar";
import { templateMap } from "@/lib/templates";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

type Device = "desktop" | "tablet" | "mobile";

export function BuilderLayout() {
  const [html, setHtml] = useState("");
  const [device, setDevice] = useState<Device>("desktop");
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");

  const selectTemplate = useCallback((id: string) => {
    setActiveTemplate(id);
    const t = templateMap[id];
    if (t) setHtml(t.defaultHtml);
  }, []);

  const handleAiGenerated = useCallback((generatedHtml: string) => {
    setHtml(generatedHtml);
  }, []);

  const clear = useCallback(() => {
    setHtml("");
    setActiveTemplate(null);
  }, []);

  const sidebar = (
    <>
      <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />
      <Separator className="my-4" />
      <TemplatePicker activeTemplate={activeTemplate} onSelect={selectTemplate} />
      <Separator className="my-4" />
      <AiGenerator
        activeTemplate={activeTemplate}
        onGenerated={handleAiGenerated}
        onTemplateChange={selectTemplate}
        apiKey={apiKey}
      />
    </>
  );

  return (
    <div className="h-screen flex flex-col">
      <OutputBar html={html} device={device} onDeviceChange={setDevice} onClear={clear} />

      {/* Desktop: 3-panel */}
      <div className="flex-1 hidden lg:grid lg:grid-cols-[280px_1fr_1fr] overflow-hidden">
        <ScrollArea className="border-r bg-white p-4">
          {sidebar}
        </ScrollArea>
        <div className="border-r overflow-hidden">
          <HtmlEditor value={html} onChange={setHtml} />
        </div>
        <PreviewPanel html={html} device={device} />
      </div>

      {/* Mobile/Tablet: tabbed layout */}
      <div className="flex-1 lg:hidden overflow-hidden">
        <Tabs defaultValue="templates" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-2 grid grid-cols-3">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="templates" className="flex-1 overflow-auto p-4">
            {sidebar}
          </TabsContent>
          <TabsContent value="editor" className="flex-1 overflow-hidden">
            <HtmlEditor value={html} onChange={setHtml} />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 overflow-hidden">
            <PreviewPanel html={html} device={device} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
