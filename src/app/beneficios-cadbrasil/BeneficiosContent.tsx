"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  ZoomIn,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type BenefitImage = {
  src: string;
  alt: string;
  modalTitle?: string;
};

type BenefitSection = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  points: string[];
  previewImages?: BenefitImage[];
};

const benefitSections: BenefitSection[] = [
  {
    icon: Sparkles,
    title: "1. Plataforma moderna para toda jornada SICAF",
    subtitle: "Tudo centralizado em um só lugar para ganhar agilidade.",
    points: [
      "Cadastro, gestão da empresa e acompanhamento do processo em painel visual.",
      "Fluxo simples para acessar etapas, documentos e status sem perder contexto.",
      "Experiência pensada para reduzir dúvidas e acelerar tomada de decisão.",
    ],
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-00.png",
        alt: "Tela inicial de cadastro e onboarding da CADBRASIL",
        modalTitle: "Plataforma CADBRASIL — cadastro inicial",
      },
      {
        src: "/procedimentos-cadbrasil-01.png",
        alt: "Painel do fornecedor para iniciar a operação",
        modalTitle: "Painel do fornecedor",
      },
    ],
  },
  {
    icon: Clock3,
    title: "2. Controle de prazos, níveis e evolução do SICAF",
    subtitle: "Mais previsibilidade para evitar vencimentos e atrasos.",
    points: [
      "Visão dos níveis SICAF, validade e andamento em telas organizadas.",
      "Ações claras para continuar o processo (detalhes da empresa e acesso ao SICAF).",
      "Menos retrabalho com acompanhamento contínuo da situação cadastral.",
    ],
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-02.png",
        alt: "Tela do cadastro SICAF com visão de empresa e status",
        modalTitle: "Gestão de prazos e status",
      },
      {
        src: "/procedimentos-cadbrasil-03.png",
        alt: "Acesso rápido às ações do processo no SICAF",
        modalTitle: "Ações rápidas no processo SICAF",
      },
      {
        src: "/procedimentos-cadbrasil-04b.png",
        alt: "Destaque para o botão Acessar SICAF no painel da empresa",
        modalTitle: "Clique em ACESSAR SICAF",
      },
    ],
  },
  {
    icon: Bot,
    title: "3. Assistente CADBRASIL com IA aplicada ao processo",
    subtitle: "Apoio inteligente para orientar cada etapa do fornecedor.",
    points: [
      "Instalação assistida e verificação automática de ambiente.",
      "Orientações em tempo real para execução no SICAF do governo.",
      "Consultas e respostas em linguagem natural para reduzir erros operacionais.",
    ],
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-05.png",
        alt: "Tela de instalação do Assistente CADBRASIL",
        modalTitle: "Instalação do Assistente CADBRASIL",
      },
      {
        src: "/procedimentos-cadbrasil-06.png",
        alt: "Assistente aberto dentro do SICAF com orientações",
        modalTitle: "Assistente em ação no SICAF",
      },
      {
        src: "/procedimentos-cadbrasil-04.png",
        alt: "Fluxo de acesso ao SICAF com assistente",
        modalTitle: "SICAF com Assistente CADBRASIL",
      },
    ],
  },
  {
    icon: FileCheck2,
    title: "4. Inteligência para documentos e compliance",
    subtitle: "Mais segurança para manter o cadastro regular e apto.",
    points: [
      "Comandos prontos para certidões, CRC, pendências e situação do fornecedor.",
      "Suporte às rotinas de emissão e atualização documental.",
      "Padronização do atendimento para manter qualidade e consistência.",
    ],
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-textos.png",
        alt: "Painel com perguntas e comandos disponíveis no assistente",
        modalTitle: "Biblioteca de comandos do assistente",
      },
    ],
  },
  {
    icon: TrendingUp,
    title: "5. Benefício real para competir em licitações",
    subtitle: "Mais velocidade operacional para focar em resultados.",
    points: [
      "Tempo reduzido para organizar documentação e acompanhar validade.",
      "Menos falhas de processo com apoio contínuo de plataforma + assistente.",
      "Fornecedor mais preparado para participar de licitações públicas e privadas.",
    ],
  },
];

const quickBenefits = ["Assistente IA", "Gestão de documentos", "Controle de prazos", "Apoio operacional", "Mais performance"];

export default function BeneficiosContent() {
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
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-success" />
            Benefícios CADBRASIL
          </div>
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
              Benefícios CADBRASIL
            </div>

            <div className="space-y-4">
              <h1 className="font-display font-extrabold text-foreground text-balance text-4xl md:text-5xl leading-[1.05]">
                Tecnologia, inteligência e suporte para seu SICAF render mais
              </h1>
              <p className="text-lg text-muted-foreground text-balance max-w-3xl leading-relaxed">
                A CADBRASIL combina plataforma moderna + Assistente CADBRASIL para organizar documentos, acompanhar
                prazos, reduzir erros e ajudar sua empresa a operar com mais segurança em licitações.
              </p>
            </div>
          </div>
        </section>

        <section className="container max-w-7xl pb-12 md:pb-16">
          <div className="grid gap-4">
            {benefitSections.map((section) => (
              <article
                key={section.title}
                className="p-6 md:p-7 rounded-2xl bg-card border border-border/70 shadow-soft hover:shadow-card transition-smooth"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <section.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h2 className="font-display font-bold text-xl text-foreground">{section.title}</h2>
                    <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                    <ul className="space-y-2.5">
                      {section.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                          <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-primary-glow shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {section.previewImages?.length ? (
                      <div className="rounded-xl border border-primary/20 bg-primary-soft/40 p-3">
                        <p className="text-xs font-semibold text-primary mb-2">
                          Exemplo visual ({section.previewImages.length} imagem{section.previewImages.length > 1 ? "ens" : ""})
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {section.previewImages.map((img, idx) => (
                            <Dialog key={`${img.src}-${idx}`}>
                              <DialogTrigger asChild>
                                <button
                                  type="button"
                                  className="group relative block rounded-lg overflow-hidden border border-primary/30 shadow-soft hover:shadow-card transition-smooth text-left"
                                >
                                  <Image
                                    src={img.src}
                                    alt={img.alt}
                                    width={900}
                                    height={600}
                                    className="w-full h-auto object-cover group-hover:scale-[1.015] transition-smooth"
                                  />
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2.5">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/90 text-[11px] font-bold text-slate-900">
                                      <ZoomIn className="w-3.5 h-3.5" />
                                      Clique para ampliar
                                    </span>
                                  </div>
                                </button>
                              </DialogTrigger>
                              <DialogContent className="w-[80vw] max-w-[80vw] h-[80vh] p-3 sm:p-5">
                                <DialogHeader>
                                  <DialogTitle>{img.modalTitle || `${section.title} - Imagem ${idx + 1}`}</DialogTitle>
                                </DialogHeader>
                                <div className="flex items-center justify-center rounded-lg border border-border/70 bg-muted/20 p-2 sm:p-3 h-[calc(80vh-6.5rem)]">
                                  <Image src={img.src} alt={img.alt} width={1800} height={1200} className="w-full h-full object-contain" priority />
                                </div>
                              </DialogContent>
                            </Dialog>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="container max-w-7xl py-14 md:py-16 relative">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Diferenciais</p>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary-foreground leading-tight">
                O que sua empresa ganha com a CADBRASIL
              </h2>
              <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
                {quickBenefits.map((item, index) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span className="px-3.5 py-2 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-semibold text-primary-foreground">
                      {item}
                    </span>
                    {index < quickBenefits.length - 1 ? <ArrowRight className="w-4 h-4 text-primary-foreground/70" /> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-card">
        <div className="container max-w-7xl py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CADBRASIL · Todos os direitos reservados</p>
          <div className="flex items-center gap-5">
            <Link href="/procedimentos-cadbrasil" className="hover:text-foreground transition-smooth">
              Ver procedimentos completos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
