import { SeoGuidePageShell } from "@/components/SeoGuidePageShell";
import { documentosCadastroGuide } from "@/lib/seo-guides/config";
import { buildGuideMetadata } from "@/lib/seo-guides/metadata";

export const metadata = buildGuideMetadata(documentosCadastroGuide);

export default function DocumentosNecessariosCadastroSicafPage() {
  return <SeoGuidePageShell guide={documentosCadastroGuide} />;
}
