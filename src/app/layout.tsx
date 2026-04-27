import type { Metadata } from "next";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cadastro CADBRASIL — SICAF, licitações e consultoria",
  description:
    "Cadastre sua empresa na CADBRASIL e fale com especialistas em SICAF e licitações. Processo rápido, seguro e com suporte humano.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <WhatsAppFloatButton />
        </Providers>
      </body>
    </html>
  );
}
