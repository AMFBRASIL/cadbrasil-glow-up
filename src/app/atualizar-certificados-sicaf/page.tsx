import { SeoGuidePageShell } from "@/components/SeoGuidePageShell";
import { atualizarCertificadosGuide } from "@/lib/seo-guides/config";
import { buildGuideMetadata } from "@/lib/seo-guides/metadata";

export const metadata = buildGuideMetadata(atualizarCertificadosGuide);

export default function AtualizarCertificadosSicafPage() {
  return <SeoGuidePageShell guide={atualizarCertificadosGuide} />;
}
