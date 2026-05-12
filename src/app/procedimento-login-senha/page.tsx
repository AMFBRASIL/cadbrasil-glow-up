import type { Metadata } from "next";
import LoginSenhaContent from "./LoginSenhaContent";

const SITE_URL = "https://cadastro.cadbrasil.com.br";

export const metadata: Metadata = {
  title: "Login e Senha — Como acessar e recuperar senha na CADBRASIL",
  description:
    "Guia rápido para criar cadastro, recuperar acesso e redefinir senha na plataforma CADBRASIL para fornecedores.",
  alternates: { canonical: `${SITE_URL}/procedimento-login-senha` },
  openGraph: {
    title: "Login e Senha — Como acessar a plataforma CADBRASIL",
    description:
      "Passo a passo para criar cadastro, recuperar acesso e redefinir senha quando necessário.",
    url: `${SITE_URL}/procedimento-login-senha`,
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
      { "@type": "ListItem", position: 2, name: "Login e Senha", item: `${SITE_URL}/procedimento-login-senha` },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

function HowToJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Como fazer login e recuperar senha na CADBRASIL",
    description: "Guia rápido para criar cadastro, recuperar acesso e redefinir senha na plataforma CADBRASIL.",
    step: [
      { "@type": "HowToStep", position: 1, name: "Novo Cadastro", text: "Acesse a plataforma CADBRASIL e preencha os dados solicitados." },
      { "@type": "HowToStep", position: 2, name: "Recuperar senha", text: "Na tela de login, clique em recuperar senha e siga as instruções por e-mail." },
      { "@type": "HowToStep", position: 3, name: "Criar nova senha", text: "Defina uma senha forte e tente o login novamente." },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default function ProcedimentoLoginSenhaPage() {
  return (
    <>
      <BreadcrumbJsonLd />
      <HowToJsonLd />
      <LoginSenhaContent />
    </>
  );
}
