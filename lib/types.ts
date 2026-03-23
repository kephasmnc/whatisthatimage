// lib/types.ts
export type AspectRatio = "9:16" | "4:5" | "1:1" | "16:9";
export type MJVersion = "6.1" | "7";
export type ImageStyle = "photo" | "digital" | "art";

export interface GenerateResponse {
  prompt: string;
}

export interface GenerateError {
  error: string;
}

export const ASPECT_RATIOS: AspectRatio[] = ["9:16", "4:5", "1:1", "16:9"];
export const MJ_VERSIONS: MJVersion[] = ["6.1", "7"];
export const MAX_FILE_SIZE_MB = 10;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const IMAGE_STYLES: { value: ImageStyle; label: string; description: string }[] = [
  { value: "photo", label: "Foto", description: "Fotografia real, analógica ou digital" },
  { value: "digital", label: "CGI / Digital", description: "Arte digital, 3D, motion graphics, ilustração vetorial" },
  { value: "art", label: "Arte / Pintura", description: "Pintura, desenho, arte conceitual, aquarela" },
];
