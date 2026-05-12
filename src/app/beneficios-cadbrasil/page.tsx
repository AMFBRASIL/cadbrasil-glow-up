import type { Metadata } from "next";
import BeneficiosContent from "./BeneficiosContent";

const SITE_URL = "https://cadastro.cadbrasil.com.br";

export const metadata: Metadata = {
  title: "Benefícios CADBRASIL — Plataforma e Assistente IA para SICAF",
  description:
    "Conheça os benefícios da CADBRASIL: plataforma moderna, Assistente IA, gestão de documentos, controle de prazos e suporte para SICAF e licitações.",
  alternates: { canonical: `${SITE_URL}/beneficios-cadbrasil` },
  openGraph: {
    title: "Benefícios CADBRASIL — Plataforma e Assistente IA para SICAF",
    description:
      "Plataforma moderna + Assistente com IA para organizar documentos, acompanhar prazos e reduzir erros no SICAF.",
    url: `${SITE_URL}/beneficios-cadbrasil`,
    type: "website",
    locale: "pt_BR",
    siteName: "CADBRASIL",
  },
};

function BreadcrumbJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Benefícios CADBRASIL", item: `${SITE_URL}/beneficios-cadbrasil` },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default function BeneficiosCadbrasilPage() {
  return (
    <>
      <BreadcrumbJsonLd />
      <BeneficiosContent />
    </>
  );
}
