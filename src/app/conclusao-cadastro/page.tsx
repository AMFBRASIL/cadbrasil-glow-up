import type { Metadata } from "next";
import { Suspense } from "react";
import ConclusaoContent from "./ConclusaoContent";

const SITE_URL = "https://cadastro.cadbrasil.com.br";

export const metadata: Metadata = {
  title: "Cadastro concluído — CADBRASIL SICAF",
  description:
    "Seu cadastro na CADBRASIL foi concluído com sucesso. Acesse o protocolo, gere o boleto ou PIX para pagamento da licença e envie os documentos pelo portal.",
  alternates: { canonical: `${SITE_URL}/conclusao-cadastro` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Cadastro concluído — CADBRASIL SICAF",
    description:
      "Cadastro realizado com sucesso. Pague a taxa da licença e envie os documentos para iniciar o processo SICAF.",
    url: `${SITE_URL}/conclusao-cadastro`,
    type: "website",
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
      { "@type": "ListItem", position: 2, name: "Conclusão do cadastro", item: `${SITE_URL}/conclusao-cadastro` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function ConclusaoCadastroPage() {
  return (
    <>
      <BreadcrumbJsonLd />
      <Suspense>
        <ConclusaoContent />
      </Suspense>
    </>
  );
}
