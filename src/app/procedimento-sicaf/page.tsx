import type { Metadata } from "next";
import SicafContent from "./SicafContent";

const SITE_URL = "https://cadastro.cadbrasil.com.br";

export const metadata: Metadata = {
  title: "Procedimento SICAF — Guia passo a passo para credenciamento",
  description:
    "Guia completo para credenciamento no SICAF: cadastro, portal do fornecedor, pagamento, documentos, instalação do Assistente CADBRASIL e atualização.",
  alternates: { canonical: `${SITE_URL}/procedimento-sicaf` },
  openGraph: {
    title: "Procedimento SICAF — Guia passo a passo",
    description:
      "Siga este fluxo para concluir seu processo de credenciamento no SICAF com clareza, rapidez e suporte da equipe CADBRASIL.",
    url: `${SITE_URL}/procedimento-sicaf`,
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
      { "@type": "ListItem", position: 2, name: "Procedimento SICAF", item: `${SITE_URL}/procedimento-sicaf` },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

function HowToJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Como fazer o credenciamento no SICAF com a CADBRASIL",
    description: "Passo a passo completo para cadastro e credenciamento no SICAF, do cadastro inicial até a atualização da plataforma.",
    totalTime: "PT30M",
    step: [
      { "@type": "HowToStep", position: 1, name: "Realizar o Cadastro", text: "Acesse cadastro.cadbrasil.com.br e preencha seus dados." },
      { "@type": "HowToStep", position: 2, name: "Acessar o Portal", text: "Faça login no portal do fornecedor." },
      { "@type": "HowToStep", position: 3, name: "Iniciar Processo SICAF", text: "Emita a guia de pagamento e realize o pagamento da licença." },
      { "@type": "HowToStep", position: 4, name: "Documentos e Assistente", text: "Envie documentos e instale o Assistente CADBRASIL." },
      { "@type": "HowToStep", position: 5, name: "Usar o Assistente", text: "Ative o Assistente Virtual SICAF e siga o passo a passo automatizado." },
      { "@type": "HowToStep", position: 6, name: "Atualizar plataforma", text: "Envie a situação do fornecedor para atualizar os níveis SICAF." },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default function ProcedimentoSicafPage() {
  return (
    <>
      <BreadcrumbJsonLd />
      <HowToJsonLd />
      <SicafContent />
    </>
  );
}
