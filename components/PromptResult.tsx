// components/PromptResult.tsx
"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PromptResultProps {
  prompt: string | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
  canRegenerate: boolean;
}

export function PromptResult({
  prompt,
  isLoading,
  error,
  onRegenerate,
  canRegenerate,
}: PromptResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-3 mt-6">
        <Skeleton className="h-4 w-full bg-white/10" />
        <Skeleton className="h-4 w-5/6 bg-white/10" />
        <Skeleton className="h-4 w-4/6 bg-white/10" />
        <Skeleton className="h-4 w-3/4 bg-white/10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mt-6 p-4 rounded-xl border border-red-500/30 bg-red-500/5">
        <p className="text-red-400 text-sm font-mono">{error}</p>
        {canRegenerate && (
          <button
            onClick={onRegenerate}
            className="mt-3 text-xs font-mono text-white/50 hover:text-white/80 underline underline-offset-2 transition-colors"
          >
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  if (!prompt) return null;

  return (
    <div className="w-full mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-white/40 text-xs font-mono uppercase tracking-widest">
          Prompt gerado
        </span>
        <div className="flex gap-3">
          <button
            onClick={onRegenerate}
            disabled={!canRegenerate}
            className="text-xs font-mono text-white/40 hover:text-white/70 disabled:opacity-30 transition-colors"
          >
            Regerar
          </button>
          <button
            onClick={handleCopy}
            className={`text-xs font-mono transition-colors ${
              copied ? "text-green-400" : "text-white/60 hover:text-white"
            }`}
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
      </div>
      <div
        className="w-full p-4 rounded-xl border border-white/10 bg-white/[0.03] cursor-pointer hover:bg-white/[0.05] transition-colors"
        onClick={handleCopy}
      >
        <p className="text-white/80 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
          {prompt}
        </p>
      </div>
      <p className="text-white/20 text-xs font-mono text-center">
        Clique no prompt para copiar
      </p>
    </div>
  );
}
