import { SeoGuideLayout } from "@/components/SeoGuideLayout";
import { buildGuideJsonLd } from "@/lib/seo-guides/metadata";
import type { SeoGuideConfig } from "@/lib/seo-guides/types";

type Props = {
  guide: SeoGuideConfig;
};

export function SeoGuidePageShell({ guide }: Props) {
  const jsonLdBlocks = buildGuideJsonLd(guide);

  return (
    <>
      {jsonLdBlocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <SeoGuideLayout guide={guide} />
    </>
  );
}
