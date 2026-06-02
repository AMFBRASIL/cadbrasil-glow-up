import type { Metadata } from "next";
import DiagnosticoSicafContent from "./DiagnosticoSicafContent";

const SITE_URL = "https://cadastro.cadbrasil.com.br";
const PAGE_URL = `${SITE_URL}/diagnostico-sicaf`;

export const metadata: Metadata = {
  title: "Diagnóstico SICAF Inteligente | CADBRASIL",
  description:
    "Faça uma consulta SICAF inteligente: verifique indicadores cadastrais, descubra seu Score SICAF e receba recomendações para licitações públicas.",
  keywords: [
    "consulta sicaf",
    "verificar sicaf",
    "cadastro sicaf",
    "atualização sicaf",
    "empresa apta para licitação",
    "licitações públicas",
    "credenciamento sicaf",
    "compras.gov.br",
    "score sicaf",
    "diagnóstico sicaf",
  ],
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Diagnóstico SICAF Inteligente | CADBRASIL",
    description:
      "Descubra se sua empresa está apta para licitações públicas com um diagnóstico consultivo e score inteligente.",
    url: PAGE_URL,
    type: "website",
    locale: "pt_BR",
    siteName: "CADBRASIL",
    images: [
      {
        url: `${SITE_URL}/hero-bg.jpg`,
        width: 1200,
        height: 630,
        alt: "Diagnóstico SICAF Inteligente - CADBRASIL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diagnóstico SICAF Inteligente | CADBRASIL",
    description:
      "Consulte indicadores cadastrais da sua empresa e receba recomendações para participação em licitações.",
    images: [`${SITE_URL}/hero-bg.jpg`],
  },
};

function DiagnosticoJsonLd() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Diagnóstico SICAF", item: PAGE_URL },
    ],
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Diagnóstico SICAF Inteligente",
    description:
      "Ferramenta consultiva para verificar aptidão da empresa para licitações públicas e identificar pontos de atenção no cadastro SICAF.",
    provider: {
      "@type": "Organization",
      name: "CADBRASIL",
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "Brasil" },
    serviceType: "Diagnóstico cadastral SICAF",
    url: PAGE_URL,
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "O diagnóstico SICAF é gratuito?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. O diagnóstico inicial é gratuito e sem compromisso.",
        },
      },
      {
        "@type": "Question",
        name: "O que o Score SICAF mostra?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O score mostra indicadores de aptidão cadastral e pontos de atenção que podem impactar a participação em licitações públicas.",
        },
      },
      {
        "@type": "Question",
        name: "Preciso já ter cadastro no SICAF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não. A análise também ajuda empresas que ainda não iniciaram o credenciamento no SICAF.",
        },
      },
    ],
  };

  const blocks = [breadcrumb, service, faq];
  return (
    <>
      {blocks.map((block, index) => (
        <script
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}

export default function DiagnosticoSicafPage() {
  return (
    <>
      <DiagnosticoJsonLd />
      <DiagnosticoSicafContent />
    </>
  );
}

