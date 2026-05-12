import type { Metadata } from "next";
import ProcedimentosContent from "./ProcedimentosContent";

const SITE_URL = "https://cadastro.cadbrasil.com.br";

export const metadata: Metadata = {
  title: "Procedimentos CADBRASIL — Jornada completa no SICAF com Assistente IA",
  description:
    "Jornada completa no SICAF com o Assistente CADBRASIL: cadastro inicial, portal do fornecedor, instalação, uso do assistente e comandos prontos.",
  alternates: { canonical: `${SITE_URL}/procedimentos-cadbrasil` },
  openGraph: {
    title: "Procedimentos CADBRASIL — Jornada SICAF com Assistente IA",
    description:
      "Escolha se é cliente novo ou existente e siga o passo a passo completo para operar no SICAF com apoio do Assistente CADBRASIL.",
    url: `${SITE_URL}/procedimentos-cadbrasil`,
    type: "article",
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
      { "@type": "ListItem", position: 2, name: "Procedimentos CADBRASIL", item: `${SITE_URL}/procedimentos-cadbrasil` },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default function ProcedimentosCadbrasilPage() {
  return (
    <>
      <BreadcrumbJsonLd />
      <ProcedimentosContent />
    </>
  );
}
