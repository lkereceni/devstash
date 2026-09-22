"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}

// min-h-32 (128px) / max-h-[400px] below match CodeEditor's fluid-height bounds.
const HEIGHT_CLASSES = "min-h-32 max-h-[400px]";

export function MarkdownEditor({
  value,
  onChange,
  readOnly = false,
  className,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  const preview = (
    <div className={cn("markdown-preview overflow-y-auto p-3", HEIGHT_CLASSES)}>
      {value.trim() ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
      ) : (
        <p className="text-zinc-500">Nothing to preview.</p>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-white/10 bg-[#1e1e1e]",
        className
      )}
    >
      {readOnly ? (
        <>
          <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#2d2d2d] px-3 py-2">
            <span className="text-xs font-medium text-zinc-400">Preview</span>
            <CopyButton copied={copied} onCopy={handleCopy} />
          </div>
          {preview}
        </>
      ) : (
        <Tabs
          value={tab}
          onValueChange={(next) => setTab(next as "write" | "preview")}
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#2d2d2d] px-2 py-1.5">
            <TabsList className="h-7 gap-0.5 bg-transparent p-0">
              <TabsTrigger
                value="write"
                className="h-6 px-2.5 text-xs text-zinc-400 data-active:bg-white/10 data-active:text-zinc-100 data-active:shadow-none"
              >
                Write
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="h-6 px-2.5 text-xs text-zinc-400 data-active:bg-white/10 data-active:text-zinc-100 data-active:shadow-none"
              >
                Preview
              </TabsTrigger>
            </TabsList>
            <CopyButton copied={copied} onCopy={handleCopy} />
          </div>
          <TabsContent value="write" className="m-0">
            <Textarea
              value={value}
              onChange={(event) => onChange?.(event.target.value)}
              placeholder="Write markdown…"
              className={cn(
                "w-full overflow-y-auto rounded-none border-0 bg-transparent p-3 font-mono text-xs text-zinc-200 shadow-none placeholder:text-zinc-500 focus-visible:ring-0",
                HEIGHT_CLASSES
              )}
            />
          </TabsContent>
          <TabsContent value="preview" className="m-0">
            {preview}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function CopyButton({
  copied,
  onCopy,
}: {
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Copy markdown"
      className="text-zinc-400 transition-colors hover:text-zinc-200"
    >
      {copied ? (
        <Check className="size-3.5" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}
