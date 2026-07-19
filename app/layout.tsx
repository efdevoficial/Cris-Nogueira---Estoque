import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estoque | Cris Nogueira",
  description: "Sistema de estoque da Cris Nogueira - Rendas & Sonhos"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
