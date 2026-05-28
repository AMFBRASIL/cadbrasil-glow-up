import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

const SITE_URL = "https://cadastro.cadbrasil.com.br";

export const metadata: Metadata = {
  title: "CADBRASIL — Cadastro SICAF, Licitações e Consultoria Especializada",
  description:
    "Cadastre sua empresa na CADBRASIL e fale com especialistas em SICAF e licitações públicas. Processo rápido, seguro, com suporte humano e conformidade LGPD.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "CADBRASIL — Cadastro SICAF, Licitações e Consultoria",
    description:
      "Cadastre sua empresa e fale com especialistas em SICAF e licitações. Processo rápido, seguro e com suporte humano.",
    url: SITE_URL,
    type: "website",
    locale: "pt_BR",
    siteName: "CADBRASIL",
  },
};

function ServiceJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Assessoria SICAF e Licitações — CADBRASIL",
    description:
      "Assessoria completa para cadastro e manutenção no SICAF, licitações públicas, documentação, certidões e habilitação de fornecedores junto ao governo.",
    provider: {
      "@type": "Organization",
      name: "CADBRASIL",
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    serviceType: "Assessoria em Licitações e SICAF",
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function FAQJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "O que é o SICAF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O SICAF (Sistema de Cadastramento Unificado de Fornecedores) é o sistema do Governo Federal para cadastro e habilitação de fornecedores que desejam participar de licitações públicas.",
        },
      },
      {
        "@type": "Question",
        name: "A CADBRASIL é um órgão público?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não. A CADBRASIL é uma empresa privada especializada em assessoria para SICAF e licitações. Não possui vínculo com o governo.",
        },
      },
      {
        "@type": "Question",
        name: "Como funciona o processo de cadastro na CADBRASIL?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O processo é simples: cadastre sua empresa no site, acesse o portal do fornecedor, instale o Assistente CADBRASIL e siga as orientações para completar o credenciamento no SICAF.",
        },
      },
      {
        "@type": "Question",
        name: "O que é o Assistente CADBRASIL?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "É uma extensão para o navegador Chrome que funciona como um copiloto durante o preenchimento no SICAF, validando campos, orientando cada etapa e reduzindo erros.",
        },
      },
      {
        "@type": "Question",
        name: "Quais documentos são necessários para o SICAF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Os documentos incluem contrato social, documentos de identificação, certidões federais, estaduais e municipais, CRF do FGTS, CNDT, balanço patrimonial e certidão de falência, entre outros.",
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <ServiceJsonLd />
      <FAQJsonLd />
      <LandingPage />
    </>
  );
}
