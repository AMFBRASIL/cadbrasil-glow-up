import type { Metadata } from "next";
import type { SeoGuideConfig } from "./types";
import { CADASTRO_URL, SITE_URL } from "./types";

export function buildGuideMetadata(guide: SeoGuideConfig): Metadata {
  const url = `${SITE_URL}/${guide.slug}`;

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    keywords: guide.keywords,
    alternates: { canonical: url },
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
      title: guide.ogTitle,
      description: guide.ogDescription,
      url,
      type: "article",
      locale: "pt_BR",
      siteName: "CADBRASIL",
      images: [
        {
          url: `${SITE_URL}/hero-bg.jpg`,
          width: 1200,
          height: 630,
          alt: guide.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.ogTitle,
      description: guide.ogDescription,
      images: [`${SITE_URL}/hero-bg.jpg`],
    },
    authors: [{ name: "CADBRASIL", url: SITE_URL }],
    category: "SICAF",
  };
}

export function buildGuideJsonLd(guide: SeoGuideConfig) {
  const url = `${SITE_URL}/${guide.slug}`;
  const now = new Date().toISOString();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: guide.h1, item: url },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.h1,
    description: guide.metaDescription,
    url,
    inLanguage: "pt-BR",
    datePublished: "2026-01-15",
    dateModified: now.split("T")[0],
    author: {
      "@type": "Organization",
      name: "CADBRASIL",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "CADBRASIL",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-cadbrasil.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: guide.keywords.join(", "),
    about: [
      { "@type": "Thing", name: "SICAF" },
      { "@type": "Thing", name: "Licitações públicas" },
      { "@type": "Thing", name: "Cadastro de fornecedores" },
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: guide.h1,
    description: guide.metaDescription,
    url,
    inLanguage: "pt-BR",
    isPartOf: { "@type": "WebSite", name: "CADBRASIL", url: SITE_URL },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".seo-guide-intro", ".seo-guide-faq-answer"],
    },
  };

  const faq =
    guide.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faqs.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const howTo =
    guide.schemaType === "HowTo" && guide.steps?.length
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: guide.h1,
          description: guide.metaDescription,
          totalTime: guide.totalTime ?? "PT45M",
          step: guide.steps.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.name,
            text: step.text,
            url: `${url}#passo-${index + 1}`,
          })),
        }
      : null;

  const serviceCta = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Cadastro e assessoria SICAF — CADBRASIL",
    description:
      "Assessoria especializada para cadastro, regularização e atualização no SICAF com suporte humano e Assistente CADBRASIL.",
    provider: { "@type": "Organization", name: "CADBRASIL", url: SITE_URL },
    areaServed: { "@type": "Country", name: "Brasil" },
    url: CADASTRO_URL,
    serviceType: "Assessoria SICAF",
  };

  return [breadcrumb, article, webPage, faq, howTo, serviceCta].filter(Boolean);
}
