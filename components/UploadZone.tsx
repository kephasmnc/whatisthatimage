// components/UploadZone.tsx
// NOTE: User-facing strings are intentionally in Portuguese — brand voice decision.
"use client";

import { useCallback, useState } from "react";
import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB } from "@/lib/types";

interface UploadZoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onError: (msg: string) => void;
  disabled?: boolean;
}

export function UploadZone({
  file,
  onFileSelect,
  onError,
  disabled,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const processFile = useCallback(
    (f: File) => {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        onError("Tipo de arquivo inválido. Use JPEG, PNG ou WebP.");
        return;
      }
      const sizeMB = f.size / (1024 * 1024);
      if (sizeMB > MAX_FILE_SIZE_MB) {
        onError(`Arquivo muito grande. Máximo: ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      const url = URL.createObjectURL(f);
      setPreview(url);
      onFileSelect(f);
    },
    [onFileSelect, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) processFile(dropped);
    },
    [processFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) processFile(selected);
    },
    [processFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative w-full rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
        ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        ${isDragging ? "border-white/60 bg-white/5" : "border-white/20 hover:border-white/40"}
      `}
      style={{ minHeight: preview ? "auto" : "280px" }}
    >
      <input
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleInputChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      {preview ? (
        <div className="relative w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-full object-cover max-h-[480px] rounded-xl"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 rounded-xl">
            <p className="text-white text-sm font-mono">Clique para trocar</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-16 gap-4 px-6 text-center">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/40"
            >
              <path
                d="M10 3v10M6 7l4-4 4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-white/60 text-sm font-mono">
              Arraste uma imagem aqui
            </p>
            <p className="text-white/30 text-xs font-mono mt-1">
              ou clique para selecionar · JPEG, PNG, WebP · máx{" "}
              {MAX_FILE_SIZE_MB}MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
