"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Download,
  Headphones,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  ZoomIn,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { montarWhatsAppHref } from "@/lib/cadbrasil-atendimento";

const PORTAL_FORNECEDOR = "https://fornecedor.cadbrasil.com.br";
const CHROME_STORE_ASSISTENTE =
  "https://chromewebstore.google.com/detail/cadbrasil-%E2%80%94-assistente-si/cdhhdgcabgbjdambnhkmdibhnmfkaicd";

type StepImage = { src: string; alt: string; modalTitle?: string; caption?: string };

type UsoAssistente = {
  title: string;
  points: string[];
  tip?: string;
  images: StepImage[];
};

type Etapa = {
  numero: "01" | "02";
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  points: string[];
  tip?: string;
  ctaLabel?: string;
  ctaHref?: string;
  images: StepImage[];
  /** Conteúdo extra no fim da etapa (ex.: Etapa 02 — como usar após instalar). */
  usoAssistente?: UsoAssistente;
};

const etapas: Etapa[] = [
  {
    numero: "01",
    icon: LayoutDashboard,
    title: "Etapa 01 — Dentro da CADBRASIL (portal do fornecedor)",
    subtitle:
      "Tudo acontece no seu painel: abrir a empresa, ir ao SICAF e acionar a verificação/instalação do Assistente pelos botões do sistema.",
    points: [
      "Acesse o portal do fornecedor CADBRASIL e abra o menu Cadastro SICAF → Credenciamentos SICAF.",
      "Na lista, localize sua empresa e clique no botão verde + Detalhes (imagem 03) para ver níveis, documentos e pendências.",
      "Na tela de detalhes, clique em Acessar SICAF (imagem 04) para seguir o fluxo rumo ao governo com o assistente da CADBRASIL.",
      "O portal pode exibir a verificação do Assistente (imagem 05): se não estiver instalado, use o botão para instalar; se já estiver, continue para usar no SICAF.",
    ],
    tip: "As telas 03, 04 e 05 são sequência única desta etapa: sempre dentro do ecossistema CADBRASIL, guiando o clique até a instalação ou confirmação do Assistente.",
    ctaLabel: "Abrir portal do fornecedor",
    ctaHref: PORTAL_FORNECEDOR,
    images: [
      {
        src: "/instalador-assistente-03.png",
        alt: "Credenciamentos SICAF — botão + Detalhes",
        modalTitle: "Etapa 01 — Figura 03 (+ Detalhes)",
        caption: "Figura 03 — + Detalhes",
      },
      {
        src: "/instalador-assistente-04.png",
        alt: "Detalhes da empresa — botão Acessar SICAF",
        modalTitle: "Etapa 01 — Figura 04 (Acessar SICAF)",
        caption: "Figura 04 — Acessar SICAF",
      },
      {
        src: "/instalador-assistente-05.png",
        alt: "Verificação do Assistente — instalado ou não instalado",
        modalTitle: "Etapa 01 — Figura 05 (verificação)",
        caption: "Figura 05 — Verificação / instalar pelo portal",
      },
    ],
  },
  {
    numero: "02",
    icon: Download,
    title: "Etapa 02 — Instalar e usar o Assistente no SICAF",
    subtitle:
      "Primeiro a instalação na Chrome Web Store (figura 07), depois o assistente ativo no portal (figura 06). Por fim, veja como consultar, atualizar níveis e validar alterações com a IA.",
    points: [
      "Abra a página da extensão CadBrasil — Assistente SICAF na Chrome Web Store (figura 07, primeiro). Clique em Usar no Chrome e confirme em Adicionar extensão.",
      "Aguarde a instalação: o ícone da CADBRASIL aparece na barra do Chrome. Feche e reabra o SICAF se o portal ainda não reconhecer a extensão.",
      "Com a extensão ativa, no portal oficial do SICAF use o botão verde Assistente CadBrasil (figura 06, em seguida): o painel lateral abre com a IA pronta para ajudar.",
    ],
    tip: "A ordem das figuras 07 e 06 é proposital: primeiro instala no Chrome; depois o assistente aparece e funciona dentro do SICAF.",
    ctaLabel: "Abrir extensão na Chrome Web Store",
    ctaHref: CHROME_STORE_ASSISTENTE,
    images: [
      {
        src: "/instalador-assistente-07.png",
        alt: "Chrome Web Store — Usar no Chrome e Adicionar extensão",
        modalTitle: "Etapa 02 — Figura 07 (instalação no Chrome)",
        caption: "Figura 07 — primeiro: instalar no Chrome",
      },
      {
        src: "/instalador-assistente-06.png",
        alt: "Portal SICAF com Assistente CadBrasil aberto",
        modalTitle: "Etapa 02 — Figura 06 (assistente instalado / em uso)",
        caption: "Figura 06 — em seguida: assistente instalado no SICAF",
      },
    ],
    usoAssistente: {
      title: "Como usar o Assistente já instalado",
      points: [
        "No portal do SICAF, clique no botão flutuante verde Assistente CadBrasil (selo IA) para abrir o chat lateral.",
        "Digite o que precisa em linguagem natural — por exemplo: atualizar o nível I do SICAF, consultar certidões ou ver pendências. O assistente responde com orientações passo a passo.",
        "No próprio SICAF, use o menu Cadastro e escolha o nível desejado (I a VI), preencha ou atualize os dados e salve, seguindo o que a IA indicar.",
        "Depois de alterar dados no SICAF, baixe o PDF da Situação do Fornecedor e envie pelo botão Enviar Situação do Fornecedor — PDF no assistente: a IA confere se as atualizações ficaram corretas.",
      ],
      tip: "Enviar o PDF da Situação do Fornecedor é o jeito mais seguro de a IA validar o que você fez no portal oficial, sem substituir o cadastro no governo.",
      images: [
        {
          src: "/instalador-assistente-uso.png",
          alt: "Infográfico: níveis do SICAF, menu Cadastro, chat do Assistente CadBrasil e envio do PDF da Situação do Fornecedor",
          modalTitle: "Etapa 02 — Como consultar e atualizar com o Assistente",
          caption: "Uso no dia a dia — chat, níveis e Situação do Fornecedor (PDF)",
        },
      ],
    },
  },
];

const quickFlow = [
  "Etapa 01",
  "03 + Detalhes",
  "04 SICAF",
  "05 Verificar",
  "Etapa 02",
  "07 Chrome",
  "06 Abrir IA",
  "Chat + PDF",
];

function ImageBlock({ img, stepTitle }: { img: StepImage; stepTitle: string }) {
  return (
    <div className="space-y-1.5">
      {img.caption ? (
        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{img.caption}</p>
      ) : null}
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="group relative block w-full rounded-lg overflow-hidden border border-primary/30 shadow-soft hover:shadow-card transition-smooth text-left"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={1200}
              height={800}
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-smooth"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/90 text-[11px] font-bold text-slate-900">
                <ZoomIn className="w-3.5 h-3.5" />
                Clique para ampliar
              </span>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="w-[90vw] max-w-[90vw] h-[88vh] p-3 sm:p-5">
          <DialogHeader>
            <DialogTitle>{img.modalTitle || stepTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center rounded-lg border border-border/70 bg-muted/20 p-2 sm:p-3 h-[calc(88vh-6.5rem)]">
            <Image src={img.src} alt={img.alt} width={1800} height={1200} className="w-full h-full object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function InstaladorAssistenteContent() {
  const whatsAppSuporteInstalacao = montarWhatsAppHref(
    "Olá! Preciso de suporte remoto via AnyDesk para ajudar na instalação do Assistente CADBRASIL no Chrome. Pode me orientar sobre o acesso?",
  );

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
            Instalador do Assistente CADBRASIL
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-grid opacity-50 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <section className="relative container max-w-7xl pt-10 md:pt-16 pb-8">
          <div className="max-w-4xl space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft border border-primary/10 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary-glow opacity-70 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-glow" />
              </span>
              Duas etapas — instalação e uso do Assistente
            </div>

            <div className="space-y-3">
              <h1 className="font-display font-extrabold text-foreground text-balance text-4xl md:text-5xl leading-[1.08]">
                Instalador do Assistente CADBRASIL no SICAF
              </h1>
              <p className="text-lg text-muted-foreground text-balance max-w-2xl leading-relaxed">
                Guia visual com imagens na ordem correta: primeiro o fluxo no portal CADBRASIL, depois a instalação no
                Chrome e o uso do assistente dentro do SICAF.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 max-w-3xl">
              <div className="rounded-2xl border border-border/70 bg-card/80 px-4 py-4 shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">Etapa 01</p>
                <p className="text-sm text-foreground font-semibold leading-snug mb-2">Portal CADBRASIL</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Figuras <strong className="text-foreground">03 → 04 → 05</strong>: + Detalhes, Acessar SICAF e
                  verificação do Assistente.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/80 px-4 py-4 shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">Etapa 02</p>
                <p className="text-sm text-foreground font-semibold leading-snug mb-2">Chrome + SICAF</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Figuras <strong className="text-foreground">07 → 06</strong>, depois chat com IA, níveis do cadastro e
                  envio do PDF da Situação do Fornecedor.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container max-w-7xl pb-12 md:pb-16">
          <div className="grid gap-6">
            {etapas.map((etapa) => (
              <article
                key={etapa.numero}
                className="p-6 md:p-8 rounded-2xl bg-card border border-border/70 shadow-soft hover:shadow-card transition-smooth"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground font-display text-lg font-extrabold shadow-soft">
                      {etapa.numero}
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2 text-primary">
                        <etapa.icon className="h-5 w-5 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider">Etapa {etapa.numero}</span>
                      </div>
                      <h2 className="font-display font-bold text-xl md:text-2xl text-foreground leading-tight">{etapa.title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{etapa.subtitle}</p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 pl-0 md:pl-1">
                    {etapa.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm md:text-[15px] text-muted-foreground leading-relaxed"
                      >
                        <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-primary-glow shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {etapa.ctaHref ? (
                    <a
                      href={etapa.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-soft hover:shadow-card transition-smooth"
                    >
                      {etapa.ctaLabel}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : null}

                  {etapa.tip ? (
                    <div className="rounded-xl border border-primary/25 bg-primary-soft/50 px-3 py-3 text-xs leading-relaxed text-foreground/90">
                      <span className="font-semibold text-primary">Dica: </span>
                      {etapa.tip}
                    </div>
                  ) : null}

                  <div className="rounded-xl border border-primary/20 bg-primary-soft/40 p-3 md:p-4">
                    <p className="text-xs font-semibold text-primary mb-3">
                      Imagens desta etapa (ordem {etapa.numero === "01" ? "03 → 04 → 05" : "07 → 06"})
                    </p>
                    <div
                      className={`grid gap-4 ${
                        etapa.images.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-1 max-w-3xl"
                      }`}
                    >
                      {etapa.images.map((img) => (
                        <ImageBlock key={img.src} img={img} stepTitle={etapa.title} />
                      ))}
                    </div>
                  </div>

                  {etapa.usoAssistente ? (
                    <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary-soft/80 via-card to-primary-soft/40 p-4 md:p-6 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                          <Bot className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Mesma etapa 02</p>
                          <h3 className="font-display font-bold text-lg md:text-xl text-foreground">{etapa.usoAssistente.title}</h3>
                        </div>
                      </div>
                      <ul className="space-y-2.5">
                        {etapa.usoAssistente.points.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-2.5 text-sm md:text-[15px] text-muted-foreground leading-relaxed"
                          >
                            <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-primary shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      {etapa.usoAssistente.tip ? (
                        <div className="rounded-xl border border-amber-200/70 bg-amber-50/90 px-3 py-3 text-xs leading-relaxed text-amber-950">
                          <span className="font-semibold text-amber-900">Importante: </span>
                          {etapa.usoAssistente.tip}
                        </div>
                      ) : null}
                      <div className="rounded-xl border border-primary/25 bg-card/90 p-3 md:p-4">
                        <p className="text-xs font-semibold text-primary mb-3">Referência visual — clique para ampliar</p>
                        <div className="max-w-4xl mx-auto">
                          {etapa.usoAssistente.images.map((img) => (
                            <ImageBlock key={img.src} img={img} stepTitle={etapa.usoAssistente!.title} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
            <article className="p-6 md:p-8 rounded-2xl bg-card border border-border/70 shadow-soft">
              <div className="flex flex-wrap items-start gap-4 mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <Headphones className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl md:text-2xl text-foreground">Suporte remoto CADBRASIL</h2>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Nossa equipe realiza atendimento remoto via AnyDesk quando necessário.
                  </p>
                </div>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2 mb-4">
                {[
                  "Instalação da extensão no Chrome",
                  "Verificação se o assistente foi reconhecido",
                  "Acesso ao SICAF pelo portal CADBRASIL",
                  "Configuração do navegador",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Bot className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-4">
                Caso tenha dificuldades e precise de <strong className="text-foreground">suporte via AnyDesk</strong> para acesso
                remoto da nossa equipe na <strong className="text-foreground">instalação do Assistente CADBRASIL</strong>, entre em
                contato pelo botão abaixo.
              </p>
              <a
                href={whatsAppSuporteInstalacao}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold shadow-soft hover:opacity-95 transition-smooth"
              >
                <MessageCircle className="h-4 w-4" />
                Solicitar suporte via AnyDesk — WhatsApp
              </a>
            </article>
          </div>
        </section>

        <section className="bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="container max-w-7xl py-14 md:py-16 relative">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Resumo do fluxo</p>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary-foreground leading-tight">
                Portal CADBRASIL → Chrome → Assistente no SICAF → Uso com IA
              </h2>
              <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
                {quickFlow.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex items-center gap-2.5">
                    <span className="px-3.5 py-2 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-semibold text-primary-foreground">
                      {item}
                    </span>
                    {index < quickFlow.length - 1 ? <ArrowRight className="w-4 h-4 text-primary-foreground/70" /> : null}
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
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <Link href="/assistente-uso" className="hover:text-foreground transition-smooth">
              Uso do Assistente no SICAF
            </Link>
            <Link href="/procedimentos-cadbrasil" className="hover:text-foreground transition-smooth">
              Procedimentos CADBRASIL
            </Link>
            <Link href="/" className="hover:text-foreground transition-smooth">
              Página inicial
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
