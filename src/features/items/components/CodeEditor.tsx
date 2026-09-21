"use client";

import { useState } from "react";
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string | null;
  readOnly?: boolean;
  className?: string;
}

const MIN_HEIGHT = 128;
const MAX_HEIGHT = 400;

const MONACO_THEME = "devstash-dark";

/**
 * Editor background is transparent so the container's own `bg-muted`
 * shows through — keeps the editor in step with the app's oklch palette
 * instead of a hardcoded hex that would drift from it.
 */
const defineTheme: BeforeMount = (monaco) => {
  monaco.editor.defineTheme(MONACO_THEME, {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#00000000",
      "editorLineNumber.foreground": "#71717a",
      "editorLineNumber.activeForeground": "#d4d4d8",
      "editor.lineHighlightBackground": "#ffffff0d",
      "editorCursor.foreground": "#e4e4e7",
      "editorIndentGuide.background": "#ffffff14",
      "scrollbarSlider.background": "#ffffff1f",
      "scrollbarSlider.hoverBackground": "#ffffff33",
      "scrollbarSlider.activeBackground": "#ffffff4d",
    },
  });
};

/** Freeform language text (as typed on the item) to a Monaco language id. */
function toMonacoLanguage(language?: string | null): string {
  const normalized = language?.trim().toLowerCase();
  if (!normalized) return "plaintext";

  const aliases: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    yml: "yaml",
    md: "markdown",
    py: "python",
    rb: "ruby",
    "c++": "cpp",
  };

  return aliases[normalized] ?? normalized;
}

export function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  className,
}: CodeEditorProps) {
  const [height, setHeight] = useState(MIN_HEIGHT);
  const [copied, setCopied] = useState(false);

  function syncHeight(instance: editor.IStandaloneCodeEditor) {
    const contentHeight = instance.getContentHeight();
    setHeight(Math.min(Math.max(contentHeight, MIN_HEIGHT), MAX_HEIGHT));
  }

  const handleMount: OnMount = (instance) => {
    syncHeight(instance);
    instance.onDidContentSizeChange(() => syncHeight(instance));
  };

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-muted",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f56]" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="size-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex items-center gap-3">
          {language ? (
            <span className="font-mono text-xs text-muted-foreground">
              {language}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy code"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        </div>
      </div>
      <div style={{ height }}>
        <Editor
          value={value}
          language={toMonacoLanguage(language)}
          theme={MONACO_THEME}
          beforeMount={defineTheme}
          onMount={handleMount}
          onChange={(nextValue) => onChange?.(nextValue ?? "")}
          options={{
            readOnly,
            domReadOnly: readOnly,
            minimap: { enabled: false },
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            padding: { top: 12, bottom: 12 },
            scrollBeyondLastLine: false,
            renderLineHighlight: readOnly ? "none" : "line",
            lineNumbers: readOnly ? "off" : "on",
            glyphMargin: false,
            folding: !readOnly,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </div>
  );
}
