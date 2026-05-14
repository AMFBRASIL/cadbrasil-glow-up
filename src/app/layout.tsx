import type { Metadata } from "next";
import Script from "next/script";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";
import { Providers } from "./providers";
import "./globals.css";

const SITE_URL = "https://cadastro.cadbrasil.com.br";
const SITE_NAME = "CADBRASIL";
const SITE_DESCRIPTION =
  "Cadastre sua empresa na CADBRASIL e fale com especialistas em SICAF e licitações públicas. Processo rápido, seguro, com suporte humano e conformidade LGPD.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cadastro CADBRASIL — SICAF, licitações e consultoria",
    template: "%s | CADBRASIL",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "SICAF",
    "cadastro SICAF",
    "licitações públicas",
    "CADBRASIL",
    "credenciamento SICAF",
    "assessoria licitações",
    "fornecedor governo",
    "Compras.gov.br",
    "habilitação SICAF",
    "certidões SICAF",
    "CRC SICAF",
    "documentos licitação",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "CADBRASIL — Assessoria SICAF e Licitações Públicas",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/hero-bg.jpg`,
        width: 1200,
        height: 630,
        alt: "CADBRASIL — Especialistas em SICAF e licitações",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CADBRASIL — Assessoria SICAF e Licitações Públicas",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/hero-bg.jpg`],
  },
  verification: {
    google: "GT-KTPDP2TV",
  },
  other: {
    "msvalidate.01": "343231769",
  },
};

function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-cadbrasil.png`,
    description: SITE_DESCRIPTION,
    contactPoint: {
      "@type": "ContactPoint",
      email: "privacidade@cadbrasil.com.br",
      contactType: "customer service",
      availableLanguage: "Portuguese",
    },
    sameAs: [
      "https://fornecedor.cadbrasil.com.br",
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "pt-BR",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-head" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TRVTMS6M');`}
        </Script>

        {/* Google Ads & Google Tag — conversão "Engagement": ver trackGoogleAdsEngagement em src/lib/utm.ts */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16460586067"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','AW-16460586067');
gtag('config','GT-KTPDP2TV');`}
        </Script>

        {/* Microsoft Ads (Bing UET) */}
        <Script id="uet-init" strategy="afterInteractive">
          {`(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){
var o={ti:"343231769",enableAutoSpaTracking:true};
o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad");},
n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){
var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null);},
i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i);
})(window,document,"script","https://bat.bing.com/bat.js","uetq");`}
        </Script>

        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TRVTMS6M"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Providers>
          {children}
          <WhatsAppFloatButton />
        </Providers>
      </body>
    </html>
  );
}
