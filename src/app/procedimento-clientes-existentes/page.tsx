import type { Metadata } from "next";
import ClientesExistentesContent from "./ClientesExistentesContent";

const SITE_URL = "https://cadastro.cadbrasil.com.br";

export const metadata: Metadata = {
  title: "Clientes existentes — Guia para atualizar dados no SICAF",
  description:
    "Passo a passo para clientes já cadastrados acessarem a nova plataforma, instalarem o Assistente CADBRASIL e atualizarem o SICAF.",
  alternates: { canonical: `${SITE_URL}/procedimento-clientes-existentes` },
  openGraph: {
    title: "Clientes existentes — Atualizar SICAF na CADBRASIL",
    description:
      "Guia rápido para clientes ativos usarem a nova plataforma com mais rapidez e suporte do Assistente CADBRASIL.",
    url: `${SITE_URL}/procedimento-clientes-existentes`,
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
      { "@type": "ListItem", position: 2, name: "Clientes existentes", item: `${SITE_URL}/procedimento-clientes-existentes` },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

function HowToJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Como atualizar o SICAF na nova plataforma CADBRASIL",
    description: "Guia para clientes já cadastrados acessarem a nova plataforma e usarem o Assistente CADBRASIL.",
    step: [
      { "@type": "HowToStep", position: 1, name: "Acessar a plataforma nova", text: "Entre com e-mail e senha já cadastrados." },
      { "@type": "HowToStep", position: 2, name: "Instalar o Assistente", text: "Abra Meu SICAF e instale o Assistente CADBRASIL." },
      { "@type": "HowToStep", position: 3, name: "Usar o Assistente", text: "Todo processo SICAF deve ser feito pelo Assistente — ele orienta e valida cada etapa." },
      { "@type": "HowToStep", position: 4, name: "Suporte", text: "Se precisar de ajuda, abra um ticket na plataforma." },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default function ProcedimentoClientesExistentesPage() {
  return (
    <>
      <BreadcrumbJsonLd />
      <HowToJsonLd />
      <ClientesExistentesContent />
    </>
  );
}
