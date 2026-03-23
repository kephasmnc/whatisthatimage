// app/layout.tsx
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "MJ Prompt Generator",
  description:
    "Upload an image, get a Midjourney prompt with gritty fashion film aesthetic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={mono.variable}>
      <body className="bg-[#0a0a0a] text-white antialiased min-h-screen">
        {children}
        <Toaster theme="dark" position="bottom-center" />
      </body>
    </html>
  );
}
