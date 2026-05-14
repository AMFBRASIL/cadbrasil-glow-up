import type { Metadata } from "next";
import InstaladorAssistenteContent from "./InstaladorAssistenteContent";

const SITE_URL = "https://cadastro.cadbrasil.com.br";

export const metadata: Metadata = {
  title: "Instalador do Assistente CADBRASIL — Extensão Chrome e uso no SICAF",
  description:
    "Etapa 01: portal CADBRASIL (03–05). Etapa 02: Chrome (07), assistente no SICAF (06) e como usar a IA, níveis do cadastro e PDF da Situação do Fornecedor.",
  alternates: { canonical: `${SITE_URL}/instalador-assistente-cadbrasil` },
  openGraph: {
    title: "Instalador do Assistente CADBRASIL no SICAF",
    description:
      "Portal CADBRASIL (03–05), instalação no Chrome (07), assistente no SICAF (06) e guia de uso com IA e Situação do Fornecedor (PDF).",
    url: `${SITE_URL}/instalador-assistente-cadbrasil`,
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
      {
        "@type": "ListItem",
        position: 2,
        name: "Instalador do Assistente CADBRASIL",
        item: `${SITE_URL}/instalador-assistente-cadbrasil`,
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

function HowToJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Como instalar e usar o Assistente CADBRASIL no SICAF",
    description:
      "Etapa 01 no portal CADBRASIL (figuras 03 a 05). Etapa 02: Chrome Web Store (07), assistente no SICAF (06) e uso da IA com níveis do cadastro e envio do PDF da Situação do Fornecedor para validação.",
    totalTime: "PT20M",
    step: [
      {
        "@type": "HowToStep",
        name: "Etapa 01 — Portal CADBRASIL",
        text: "No Cadastro SICAF, clique em + Detalhes, depois em Acessar SICAF e siga a verificação do Assistente (figuras 03, 04 e 05).",
      },
      {
        "@type": "HowToStep",
        name: "Etapa 02 — Chrome e SICAF",
        text: "Instale a extensão na Chrome Web Store (figura 07 primeiro). Em seguida, no SICAF, use o botão Assistente CadBrasil com a extensão ativa (figura 06).",
      },
      {
        "@type": "HowToStep",
        name: "Uso do Assistente instalado",
        text: "Converse com a IA, navegue pelos níveis do cadastro no menu Cadastro do SICAF e, após alterações, envie o PDF da Situação do Fornecedor pelo botão dedicado no assistente para validação.",
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default function InstaladorAssistenteCadbrasilPage() {
  return (
    <>
      <BreadcrumbJsonLd />
      <HowToJsonLd />
      <InstaladorAssistenteContent />
    </>
  );
}
