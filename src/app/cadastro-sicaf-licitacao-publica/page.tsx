import { SeoGuidePageShell } from "@/components/SeoGuidePageShell";
import { cadastroLicitacaoGuide } from "@/lib/seo-guides/config";
import { buildGuideMetadata } from "@/lib/seo-guides/metadata";

export const metadata = buildGuideMetadata(cadastroLicitacaoGuide);

export default function CadastroSicafLicitacaoPage() {
  return <SeoGuidePageShell guide={cadastroLicitacaoGuide} />;
}
