"use client";

import { useCallback } from "react";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { EditorView } from "@codemirror/view";

interface HtmlEditorProps {
  value: string;
  onChange: (val: string) => void;
  onCursorLine?: (lineNumber: number, lineText: string) => void;
  onCursorOffset?: (offset: number) => void;
}

export function HtmlEditor({ value, onChange, onCursorLine, onCursorOffset }: HtmlEditorProps) {
  const cursorExtension = useCallback(() => {
    if (!onCursorLine && !onCursorOffset) return [];
    return EditorView.updateListener.of((update) => {
      if (update.selectionSet || update.docChanged) {
        const head = update.state.selection.main.head;
        if (onCursorOffset) onCursorOffset(head);
        if (onCursorLine) {
          var line = update.state.doc.lineAt(head);
          onCursorLine(line.number, line.text);
        }
      }
    });
  }, [onCursorLine, onCursorOffset]);

  return (
    <div className="h-full">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[html(), cursorExtension()]}
        theme="light"
        height="100%"
        style={{ height: "100%" }}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          bracketMatching: true,
          autocompletion: true,
        }}
      />
    </div>
  );
}
