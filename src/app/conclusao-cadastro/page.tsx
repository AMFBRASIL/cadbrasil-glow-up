import type { Metadata } from "next";
import { Suspense } from "react";
import ConclusaoContent from "./ConclusaoContent";

const SITE_URL = "https://cadastro.cadbrasil.com.br";
const PAGE_URL = `${SITE_URL}/conclusao-cadastro`;
const OG_IMAGE = `${SITE_URL}/hero-bg.jpg`;
const PORTAL_AUTH_URL = "https://fornecedor.cadbrasil.com.br/auth";

export const metadata: Metadata = {
  title: "Conta criada — continue seu processo",
  description:
    "Sua conta CADBRASIL foi criada. Faltam apenas 2 passos: enviar documentos e ativar sua licença no portal do fornecedor.",
  keywords: [
    "cadastro SICAF concluído",
    "portal fornecedor CADBRASIL",
    "envio documentos SICAF",
    "ativar licença CADBRASIL",
    "credenciamento SICAF",
    "CADBRASIL",
  ],
  alternates: { canonical: PAGE_URL },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Conta criada — continue seu processo | CADBRASIL",
    description:
      "Você concluiu 60% do processo. Envie documentos e ative sua licença para iniciar a análise especializada.",
    url: PAGE_URL,
    type: "website",
    locale: "pt_BR",
    siteName: "CADBRASIL",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "CADBRASIL — Continue seu cadastro SICAF no portal do fornecedor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conta criada — continue seu processo | CADBRASIL",
    description:
      "Faltam 2 passos: enviar documentos e ativar sua licença na plataforma CADBRASIL.",
    images: [OG_IMAGE],
  },
  authors: [{ name: "CADBRASIL", url: SITE_URL }],
  category: "SICAF",
};

function ConclusaoJsonLd() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Conclusão do cadastro", item: PAGE_URL },
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Conta criada — continue seu processo CADBRASIL",
    description:
      "Página de continuidade após cadastro: envie documentos e ative a licença no portal do fornecedor CADBRASIL.",
    url: PAGE_URL,
    inLanguage: "pt-BR",
    isPartOf: { "@type": "WebSite", name: "CADBRASIL", url: SITE_URL },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-seo-speakable='intro']", "[data-seo-speakable='next-steps']"],
    },
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Concluir cadastro SICAF na CADBRASIL após criar a conta",
    description:
      "Dois passos finais no portal do fornecedor: enviar documentação e ativar a licença da plataforma.",
    totalTime: "PT6M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enviar documentação",
        text: "Acesse o portal do fornecedor CADBRASIL e envie os documentos solicitados para análise cadastral.",
        url: PORTAL_AUTH_URL,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Ativar licença",
        text: "Conclua a ativação da licença CADBRASIL no portal para iniciar a análise especializada.",
        url: PORTAL_AUTH_URL,
      },
    ],
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Assessoria SICAF — CADBRASIL",
    description:
      "Plataforma e assessoria para credenciamento SICAF, gestão documental, certidões e acompanhamento cadastral.",
    provider: { "@type": "Organization", name: "CADBRASIL", url: SITE_URL },
    areaServed: { "@type": "Country", name: "Brasil" },
    url: PORTAL_AUTH_URL,
    serviceType: "Assessoria SICAF",
  };

  const blocks = [breadcrumb, webPage, howTo, service];

  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}

export default function ConclusaoCadastroPage() {
  return (
    <>
      <ConclusaoJsonLd />
      <Suspense>
        <ConclusaoContent />
      </Suspense>
    </>
  );
}
