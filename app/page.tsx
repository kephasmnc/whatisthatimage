// app/page.tsx
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { UploadZone } from "@/components/UploadZone";
import { ControlsBar } from "@/components/ControlsBar";
import { PromptResult } from "@/components/PromptResult";
import type { AspectRatio, MJVersion } from "@/lib/types";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("4:5");
  const [mjVersion, setMjVersion] = useState<MJVersion>("6.1");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultError, setResultError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const compressImage = useCallback((file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const MAX = 1200;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", 0.85);
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!file) return;

    setIsLoading(true);
    setPrompt(null);
    setResultError(null);

    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("image", compressed, file.name.replace(/\.[^.]+$/, ".jpg"));
      formData.append("aspectRatio", aspectRatio);
      formData.append("mjVersion", mjVersion);

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
  }, [file, aspectRatio, mjVersion]);

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
          <div className="flex items-baseline gap-3">
            <h1 className="text-white font-mono text-2xl tracking-tight">
              MJ Prompt Generator
            </h1>
            <span className="text-white/20 font-mono text-xs">v1.0</span>
          </div>
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
          onAspectRatioChange={setAspectRatio}
          onVersionChange={setMjVersion}
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
