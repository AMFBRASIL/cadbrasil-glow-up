import type { LucideIcon } from "lucide-react";

export type SeoGuideIconKey =
  | "shield"
  | "file"
  | "check"
  | "landmark"
  | "refresh"
  | "clipboard"
  | "scale"
  | "users"
  | "alert"
  | "sparkles";

export type SeoGuideSection = {
  title: string;
  subtitle?: string;
  items: string[];
  icon: SeoGuideIconKey;
};

export type SeoGuideFaq = {
  question: string;
  answer: string;
};

export type SeoGuideStep = {
  name: string;
  text: string;
};

export type SeoGuideRelated = {
  href: string;
  label: string;
  description: string;
};

export type SeoGuideConfig = {
  slug: string;
  badge: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string[];
  schemaType: "Article" | "HowTo";
  totalTime?: string;
  sections: SeoGuideSection[];
  steps?: SeoGuideStep[];
  faqs: SeoGuideFaq[];
  relatedGuides: SeoGuideRelated[];
  ctaTitle: string;
  ctaDescription: string;
  flowTitle?: string;
  flowSteps?: string[];
};

export const CADASTRO_URL = "https://cadastro.cadbrasil.com.br";
export const SITE_URL = "https://cadastro.cadbrasil.com.br";
