import type { Metadata } from "next";
import DocumentosContent from "./DocumentosContent";

const SITE_URL = "https://cadastro.cadbrasil.com.br";

export const metadata: Metadata = {
  title: "Documentos SICAF — Checklist completo para cadastro e habilitação",
  description:
    "Lista completa de documentos necessários para credenciamento, habilitação jurídica, fiscal, trabalhista e qualificação econômico-financeira no SICAF.",
  alternates: { canonical: `${SITE_URL}/documentos-sicaf` },
  openGraph: {
    title: "Documentos SICAF — Checklist completo para habilitação",
    description:
      "Organize os documentos por categoria para evitar pendências e acelerar a habilitação em licitações públicas.",
    url: `${SITE_URL}/documentos-sicaf`,
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
      { "@type": "ListItem", position: 2, name: "Documentos SICAF", item: `${SITE_URL}/documentos-sicaf` },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

function ItemListJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Documentos necessários para cadastro SICAF",
    description: "Checklist de documentos organizados por categoria para habilitação no SICAF.",
    numberOfItems: 4,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Documentos de credenciamento" },
      { "@type": "ListItem", position: 2, name: "Habilitação jurídica e fiscal" },
      { "@type": "ListItem", position: 3, name: "Regularidade trabalhista e previdenciária" },
      { "@type": "ListItem", position: 4, name: "Qualificação econômico-financeira" },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default function DocumentosSicafPage() {
  return (
    <>
      <BreadcrumbJsonLd />
      <ItemListJsonLd />
      <DocumentosContent />
    </>
  );
}
