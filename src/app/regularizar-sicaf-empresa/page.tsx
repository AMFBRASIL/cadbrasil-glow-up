import { SeoGuidePageShell } from "@/components/SeoGuidePageShell";
import { regularizarSicafGuide } from "@/lib/seo-guides/config";
import { buildGuideMetadata } from "@/lib/seo-guides/metadata";

export const metadata = buildGuideMetadata(regularizarSicafGuide);

export default function RegularizarSicafPage() {
  return <SeoGuidePageShell guide={regularizarSicafGuide} />;
}
