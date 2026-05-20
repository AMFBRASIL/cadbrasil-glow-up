import type { Metadata } from "next";
import AssistenteUsoContent from "./AssistenteUsoContent";

const SITE_URL = "https://cadastro.cadbrasil.com.br";

export const metadata: Metadata = {
  title: "Como atualizar o SICAF com o Assistente CADBRASIL — Passo a passo",
  description:
    "Guia completo: instalar o Assistente no Chrome, portal do fornecedor, validar CNPJ, baixar e enviar PDF da Situação do Fornecedor, pendências, Nível 3 e Nível 4 no SICAF.",
  alternates: { canonical: `${SITE_URL}/assistente-uso` },
  openGraph: {
    title: "Atualizar SICAF com Assistente CADBRASIL",
    description:
      "Passo a passo intuitivo do cadastro SICAF com IA: PDF, níveis 3 e 4, finalização e suporte CADBRASIL.",
    url: `${SITE_URL}/assistente-uso`,
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
      { "@type": "ListItem", position: 2, name: "Uso do Assistente no SICAF", item: `${SITE_URL}/assistente-uso` },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

function HowToJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Como atualizar o SICAF com o Assistente CADBRASIL",
    description:
      "Processo integrado ao Assistente CADBRASIL: instalação no Chrome, portal do fornecedor, validação de CNPJ, PDF da Situação do Fornecedor, análise de pendências e atualização dos níveis 3 e 4.",
    totalTime: "PT45M",
    step: [
      { "@type": "HowToStep", name: "Instalar o Assistente", text: "Instale a extensão CadBrasil no Google Chrome." },
      { "@type": "HowToStep", name: "Portal do fornecedor", text: "Acesse o portal, + Detalhes e Acessar SICAF." },
      { "@type": "HowToStep", name: "Login e validar CNPJ", text: "Entre no SICAF com certificado ou GOV.BR e valide o CNPJ no assistente." },
      { "@type": "HowToStep", name: "Baixar Situação do Fornecedor", text: "Consulta → Situação do Fornecedor → gere e baixe o PDF." },
      { "@type": "HowToStep", name: "Enviar PDF ao assistente", text: "Envie o PDF para análise automática de pendências." },
      { "@type": "HowToStep", name: "Verificar pendências", text: "Revise certidões vencidas e níveis incompletos indicados pela IA." },
      { "@type": "HowToStep", name: "Atualizar Nível 3", text: "Cadastro → Nível 3 → IR PARA PRÓXIMO NÍVEL." },
      { "@type": "HowToStep", name: "Atualizar Nível 4", text: "Cadastro → Nível 4 → atualize certidões manualmente." },
      { "@type": "HowToStep", name: "Finalização", text: "Gere novo PDF, reenvie ao assistente e confirme que não há pendências." },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default function AssistenteUsoPage() {
  return (
    <>
      <BreadcrumbJsonLd />
      <HowToJsonLd />
      <AssistenteUsoContent />
    </>
  );
}
