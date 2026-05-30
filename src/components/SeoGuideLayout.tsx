"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileText,
  Landmark,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { SeoGuideConfig, SeoGuideIconKey } from "@/lib/seo-guides/types";
import { CADASTRO_URL } from "@/lib/seo-guides/types";

const ICONS: Record<SeoGuideIconKey, ComponentType<{ className?: string }>> = {
  shield: ShieldCheck,
  file: FileText,
  check: CheckCircle2,
  landmark: Landmark,
  refresh: RefreshCw,
  clipboard: ClipboardList,
  scale: Scale,
  users: Users,
  alert: AlertCircle,
  sparkles: Sparkles,
};

type Props = {
  guide: SeoGuideConfig;
};

export function SeoGuideLayout({ guide }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container max-w-7xl flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="font-display font-extrabold text-foreground tracking-tight">CADBRASIL</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">SICAF · Licitações</p>
            </div>
          </Link>
          <a
            href={CADASTRO_URL}
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft hover:shadow-card transition-smooth"
          >
            Cadastrar no SICAF
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      <main className="relative">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-grid opacity-50 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <section className="relative container max-w-7xl pt-10 md:pt-16 pb-10 md:pb-14">
          <div className="max-w-4xl space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft border border-primary/10 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary-glow opacity-70 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-glow" />
              </span>
              {guide.badge}
            </div>

            <div className="space-y-4">
              <h1 className="font-display font-extrabold text-foreground text-balance text-4xl md:text-5xl leading-[1.05]">
                {guide.h1}
              </h1>
              <p className="seo-guide-intro text-lg text-muted-foreground text-balance max-w-3xl leading-relaxed">
                {guide.intro}
              </p>
            </div>

            <a
              href={CADASTRO_URL}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-cta px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-soft hover:shadow-card transition-smooth"
            >
              Cadastrar no SICAF com a CADBRASIL
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {guide.steps && guide.steps.length > 0 && (
          <section className="container max-w-7xl pb-12 md:pb-14" aria-labelledby="passos-titulo">
            <h2 id="passos-titulo" className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              Passo a passo
            </h2>
            <ol className="grid gap-4 md:grid-cols-2">
              {guide.steps.map((step, index) => (
                <li
                  key={step.name}
                  id={`passo-${index + 1}`}
                  className="flex gap-4 p-5 rounded-2xl bg-card border border-border/70 shadow-soft"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground font-display font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground leading-tight">{step.name}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="container max-w-7xl pb-12 md:pb-16" aria-labelledby="conteudo-titulo">
          <h2 id="conteudo-titulo" className="sr-only">
            Conteúdo detalhado
          </h2>
          <div className="grid gap-4">
            {guide.sections.map((section) => {
              const Icon = ICONS[section.icon];
              return (
                <article
                  key={section.title}
                  className="p-6 md:p-7 rounded-2xl bg-card border border-border/70 shadow-soft hover:shadow-card transition-smooth"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <h2 className="font-display font-bold text-xl text-foreground">{section.title}</h2>
                      {section.subtitle ? (
                        <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                      ) : null}
                      <ul className="space-y-2.5">
                        {section.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm md:text-[15px] text-muted-foreground leading-relaxed"
                          >
                            <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-primary-glow shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="container max-w-7xl pb-14" aria-labelledby="faq-titulo">
          <h2 id="faq-titulo" className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
            Perguntas frequentes
          </h2>
          <Accordion type="single" collapsible className="rounded-2xl border border-border/70 bg-card px-4 md:px-6">
            {guide.faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="seo-guide-faq-answer text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="container max-w-7xl pb-14">
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-soft/80 to-card p-6 md:p-8 shadow-soft">
            <h2 className="font-display text-2xl font-bold text-foreground">{guide.ctaTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">{guide.ctaDescription}</p>
            <a
              href={CADASTRO_URL}
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-soft hover:shadow-card transition-smooth"
            >
              Cadastrar no SICAF — CADBRASIL
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {guide.flowSteps && guide.flowSteps.length > 0 && (
          <section className="bg-gradient-hero relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="container max-w-7xl py-14 md:py-16 relative">
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
                  {guide.flowTitle ?? "Fluxo recomendado"}
                </p>
                <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
                  {guide.flowSteps.map((item, index) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <span className="px-3.5 py-2 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-semibold text-primary-foreground">
                        {item}
                      </span>
                      {index < guide.flowSteps!.length - 1 ? (
                        <ArrowRight className="w-4 h-4 text-primary-foreground/70" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {guide.relatedGuides.length > 0 && (
          <section className="container max-w-7xl py-12 md:py-14">
            <h2 className="font-display text-xl font-bold text-foreground mb-5">Guias relacionados SICAF</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {guide.relatedGuides.map((related) => (
                <Link
                  key={related.href}
                  href={related.href}
                  className="group p-4 rounded-2xl bg-card border border-border/70 shadow-soft hover:border-primary/30 hover:shadow-card transition-smooth"
                >
                  <p className="font-semibold text-foreground group-hover:text-primary transition-smooth">
                    {related.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{related.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border/60 bg-card">
        <div className="container max-w-7xl py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CADBRASIL · Assessoria SICAF e licitações</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={CADASTRO_URL} className="hover:text-foreground transition-smooth font-semibold text-primary">
              Cadastrar no SICAF
            </a>
            <Link href="/" className="hover:text-foreground transition-smooth">
              Página inicial
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
