// lib/types.ts
export type AspectRatio = "9:16" | "4:5" | "1:1" | "16:9";
export type MJVersion = "6.1" | "7";

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
