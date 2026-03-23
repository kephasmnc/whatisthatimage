// app/page.tsx
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { UploadZone } from "@/components/UploadZone";
import { ControlsBar } from "@/components/ControlsBar";
import { PromptResult } from "@/components/PromptResult";
import type { AspectRatio, MJVersion, ImageStyle } from "@/lib/types";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("4:5");
  const [mjVersion, setMjVersion] = useState<MJVersion>("6.1");
  const [imageStyle, setImageStyle] = useState<ImageStyle>("photo");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultError, setResultError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!file) return;

    setIsLoading(true);
    setPrompt(null);
    setResultError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("aspectRatio", aspectRatio);
      formData.append("mjVersion", mjVersion);
      formData.append("imageStyle", imageStyle);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error || "Erro ao gerar o prompt.";
        setResultError(msg);
        toast.error(msg);
        return;
      }

      if (!data.prompt) {
        const msg = "Não conseguimos gerar um prompt. Tente novamente.";
        setResultError(msg);
        return;
      }

      setPrompt(data.prompt);
    } catch {
      const msg = "Falha na conexão. Verifique sua internet e tente novamente.";
      setResultError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [file, aspectRatio, mjVersion, imageStyle]);

  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
    setUploadError(null);
    setPrompt(null);
    setResultError(null);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-[720px] flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-white font-mono text-2xl tracking-tight">
            MJ Prompt Generator
          </h1>
          <p className="text-white/30 font-mono text-sm">
            Sobe uma imagem. Recebe um prompt.
          </p>
        </div>

        {/* Upload */}
        <UploadZone
          file={file}
          onFileSelect={handleFileSelect}
          onError={(msg) => setUploadError(msg)}
          disabled={isLoading}
        />

        {uploadError && (
          <p className="text-red-400 text-xs font-mono -mt-4">{uploadError}</p>
        )}

        {/* Controls */}
        <ControlsBar
          aspectRatio={aspectRatio}
          mjVersion={mjVersion}
          imageStyle={imageStyle}
          onAspectRatioChange={setAspectRatio}
          onVersionChange={setMjVersion}
          onImageStyleChange={setImageStyle}
          onGenerate={handleGenerate}
          canGenerate={!!file && !isLoading}
          isLoading={isLoading}
        />

        {/* Result */}
        <PromptResult
          prompt={prompt}
          isLoading={isLoading}
          error={resultError}
          onRegenerate={handleGenerate}
          canRegenerate={!!file && !isLoading}
        />
      </div>
    </main>
  );
}
