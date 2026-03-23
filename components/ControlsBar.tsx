// components/ControlsBar.tsx
"use client";

import {
  ASPECT_RATIOS,
  MJ_VERSIONS,
  IMAGE_STYLES,
  type AspectRatio,
  type MJVersion,
  type ImageStyle,
} from "@/lib/types";
import { Button } from "@/components/ui/button";

interface ControlsBarProps {
  aspectRatio: AspectRatio;
  mjVersion: MJVersion;
  imageStyle: ImageStyle;
  onAspectRatioChange: (ar: AspectRatio) => void;
  onVersionChange: (v: MJVersion) => void;
  onImageStyleChange: (s: ImageStyle) => void;
  onGenerate: () => void;
  canGenerate: boolean;
  isLoading: boolean;
}

export function ControlsBar({
  aspectRatio,
  mjVersion,
  imageStyle,
  onAspectRatioChange,
  onVersionChange,
  onImageStyleChange,
  onGenerate,
  canGenerate,
  isLoading,
}: ControlsBarProps) {
  return (
    <div className="flex flex-col gap-5 w-full">

      {/* Image Style */}
      <div className="flex flex-col gap-2">
        <span className="text-white/40 text-xs font-mono uppercase tracking-widest">
          Tipo de imagem
        </span>
        <div className="flex gap-2">
          {IMAGE_STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => onImageStyleChange(s.value)}
              title={s.description}
              className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-all duration-150
                ${
                  imageStyle === s.value
                    ? "border-white/80 text-white bg-white/10"
                    : "border-white/20 text-white/40 hover:border-white/40 hover:text-white/60"
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="text-white/20 text-xs font-mono">
          {IMAGE_STYLES.find((s) => s.value === imageStyle)?.description}
        </p>
      </div>

      {/* Aspect Ratio */}
      <div className="flex flex-col gap-2">
        <span className="text-white/40 text-xs font-mono uppercase tracking-widest">
          Aspect Ratio
        </span>
        <div className="flex gap-2">
          {ASPECT_RATIOS.map((ar) => (
            <button
              key={ar}
              onClick={() => onAspectRatioChange(ar)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-all duration-150
                ${
                  aspectRatio === ar
                    ? "border-white/80 text-white bg-white/10"
                    : "border-white/20 text-white/40 hover:border-white/40 hover:text-white/60"
                }`}
            >
              {ar}
            </button>
          ))}
        </div>
      </div>

      {/* MJ Version */}
      <div className="flex flex-col gap-2">
        <span className="text-white/40 text-xs font-mono uppercase tracking-widest">
          Midjourney Version
        </span>
        <div className="flex gap-2">
          {MJ_VERSIONS.map((v) => (
            <button
              key={v}
              onClick={() => onVersionChange(v)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-all duration-150
                ${
                  mjVersion === v
                    ? "border-white/80 text-white bg-white/10"
                    : "border-white/20 text-white/40 hover:border-white/40 hover:text-white/60"
                }`}
            >
              V{v}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={onGenerate}
        disabled={!canGenerate || isLoading}
        className="w-full mt-1 bg-white text-black hover:bg-white/90 font-mono text-sm h-12 rounded-xl disabled:opacity-30 transition-all"
      >
        {isLoading ? "Gerando..." : "Gerar Prompt"}
      </Button>
    </div>
  );
}
