"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  Lock,
  CreditCard,
  FolderOpen,
  Bot,
  ArrowRight,
  ZoomIn,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const steps = [
  {
    icon: UserPlus,
    title: "1. Realizar o Cadastro",
    points: [
      "Acesse o site oficial da CADBRASIL: https://cadastro.cadbrasil.com.br",
      'Clique em "Cadastro".',
      "Preencha seus dados corretamente (CNPJ/CPF, e-mail e telefone).",
      "Finalize o cadastro.",
    ],
    tip: "Dica: use um e-mail valido, pois sera seu principal canal de acesso e comunicacao.",
    ctaLabel: "Acessar site de cadastro",
    ctaHref: "https://cadastro.cadbrasil.com.br",
    previewImages: [
      {
        src: "/procedimento-etapa-1.png",
        alt: "Tela inicial da CADBRASIL para orientar o acesso ao cadastro",
      },
      {
        src: "/procedimento-etapa-1-2.png",
        alt: "Tela apos envio do cadastro com atalho para pagar a taxa inicial",
        modalTitle: "Efetuar o pagamento da TAXA cadbrasil",
      },
      {
        src: "/procedimento-etapa-1-3.png",
        alt: "Modal para escolher a forma de pagamento da taxa inicial",
        modalTitle: "Escolhendo forma de pagamento",
      },
    ],
  },
  {
    icon: Lock,
    title: "2. Acessar o Portal do Fornecedor",
    points: [
      "Apos o cadastro em https://cadastro.cadbrasil.com.br, acesse o Portal do Fornecedor.",
      "Faca login com seu usuario (e-mail) e senha cadastrada.",
      'Aqui comeca o "painel de controle" da sua jornada dentro da CADBRASIL.',
    ],
    ctaLabel: "Acessar portal do fornecedor",
    ctaHref: "https://fornecedor.cadbrasil.com.br",
    previewImages: [
      {
        src: "/procedimento-etapa-2-1.png",
        alt: "Tela de login do sistema para acessar o portal",
      },
      {
        src: "/procedimento-etapa-2-2.png",
        alt: "Dashboard inicial apos acesso ao portal",
      },
      {
        src: "/procedimento-etapa-2-3.png",
        alt: "Tela de credenciamentos SICAF no portal do fornecedor",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "3. Iniciar o Processo SICAF",
    points: [
      'Dentro do portal, acesse "Meus SICAF".',
      'Clique em "Emitir Guia de Pagamento".',
      "Realize o pagamento da licenca da plataforma.",
      "Apos o pagamento, o sistema libera automaticamente o inicio do processo.",
    ],
    previewImages: [
      {
        src: "/procedimento-etapa-3-1.png",
        alt: "Tela de credenciamentos SICAF com destaque para emitir guia de pagamento",
      },
    ],
  },
  {
    icon: FolderOpen,
    title: "4. Envio de Documentos + Instalacao do Assistente",
    points: [
      "Apos a confirmacao do pagamento, envie os documentos solicitados diretamente pelo sistema.",
      "Instale a extensao do navegador (Assistente SICAF).",
      "A extensao funciona como um copiloto e te guia dentro do sistema do governo.",
    ],
    ctaLabel: "Instalar Assistente SICAF",
    ctaHref:
      "https://chromewebstore.google.com/detail/cadbrasil-%E2%80%94-assistente-si/cdhhdgcabgbjdambnhkmdibhnmfkaicd",
    previewImages: [
      {
        src: "/procedimento-etapa-4-1.png",
        alt: "Acessando o botao para abrir o assistente SICAF",
        modalTitle: "Acessando ASSISTENTE",
      },
      {
        src: "/procedimento-etapa-4-2.png",
        alt: "Clicando em Meu SICAF para continuar o processo",
        modalTitle: "Clicando em MEU SICAF",
      },
      {
        src: "/procedimento-etapa-4-3.png",
        alt: "Aviso de extensao nao detectada no navegador Chrome",
        modalTitle: "Chrome nao detectado",
      },
    ],
  },
  {
    icon: Bot,
    title: "5. Utilizar o Assistente SICAF",
    points: [
      "Acesse o sistema do governo (SICAF).",
      "Ative o Assistente Virtual SICAF.",
      "Siga o passo a passo automatizado: preenchimento de dados, validacoes e orientacoes em tempo real.",
      "O assistente elimina duvidas e reduz erros, como ter um especialista ao seu lado durante todo o processo.",
    ],
    previewImages: [
      {
        src: "/procedimento-etapa-5-1.png",
        alt: "Conversando com o Assistente SICAF no painel lateral",
        modalTitle: "Conversando com o Assistente",
      },
    ],
  },
  {
    icon: ShieldCheck,
    title: "6. Atualizando plataforma Cadbrasil",
    points: [
      "No Assistente CADBRASIL, informe e envie a situacao atual do fornecedor.",
      "Esse envio e necessario para atualizar os niveis do SICAF dentro da plataforma CADBRASIL.",
      "Depois de atualizar, acompanhe no painel se os niveis foram refletidos corretamente.",
    ],
    previewImages: [
      {
        src: "/procedimento-etapa-6-1.png",
        alt: "Visualizacao dos niveis SICAF atualizados na plataforma",
        modalTitle: "Niveis SICAF na plataforma",
      },
      {
        src: "/procedimento-etapa-6-2.png",
        alt: "Assistente com acao para enviar situacao do fornecedor",
        modalTitle: "Enviando situacao no Assistente",
      },
    ],
  },
];

const quickFlow = ["Cadastro", "Portal", "Pagamento", "Documentos", "Assistente", "Atualizacao", "SICAF"];

export default function SicafContent() {
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
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">SICAF · Licitacoes</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-success" />
            Guia oficial para novos clientes
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
              Procedimento CADBRASIL
            </div>

            <div className="space-y-4">
              <h1 className="font-display font-extrabold text-foreground text-balance text-4xl md:text-5xl leading-[1.05]">
                Guia passo a passo para credenciamento no SICAF
              </h1>
              <p className="text-lg text-muted-foreground text-balance max-w-3xl leading-relaxed">
                Siga este fluxo para concluir seu processo com clareza, rapidez e suporte da equipe CADBRASIL.
              </p>
            </div>
          </div>
        </section>

        <section className="container max-w-7xl pb-12 md:pb-16">
          <div className="grid gap-4">
            {steps.map((step) => (
              <article
                key={step.title}
                className="p-6 md:p-7 rounded-2xl bg-card border border-border/70 shadow-soft hover:shadow-card transition-smooth"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h2 className="font-display font-bold text-xl text-foreground">{step.title}</h2>
                    <ul className="space-y-2.5">
                      {step.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                          <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-primary-glow shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    {step.tip ? (
                      <p className="text-sm text-primary font-medium bg-primary-soft/70 border border-primary/10 rounded-xl px-3 py-2.5">
                        {step.tip}
                      </p>
                    ) : null}
                    {"ctaHref" in step && step.ctaHref ? (
                      <div className="flex flex-col items-start gap-2.5">
                        {"ctaHref" in step && step.ctaHref ? (
                          <a
                            href={step.ctaHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-soft hover:shadow-card transition-smooth"
                          >
                            {step.ctaLabel}
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                    {"previewImages" in step && step.previewImages?.length ? (
                      <div className="rounded-xl border border-primary/20 bg-primary-soft/40 p-3">
                        <p className="text-xs font-semibold text-primary mb-2">
                          Exemplo visual de onde clicar ({step.previewImages.length} imagem{step.previewImages.length > 1 ? "ens" : ""})
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {step.previewImages.map((img, idx) => (
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
                                  <DialogTitle>{img.modalTitle || `${step.title} - Imagem ${idx + 1}`}</DialogTitle>
                                </DialogHeader>
                                <div className="flex items-center justify-center rounded-lg border border-border/70 bg-muted/20 p-2 sm:p-3 h-[calc(80vh-6.5rem)]">
                                  <Image
                                    src={img.src}
                                    alt={img.alt}
                                    width={1600}
                                    height={1000}
                                    className="w-full h-full object-contain"
                                    priority
                                  />
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
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Resumo visual</p>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary-foreground leading-tight">
                Fluxo rapido do processo
              </h2>
              <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
                {quickFlow.map((item, index) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span className="px-3.5 py-2 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-semibold text-primary-foreground">
                      {item}
                    </span>
                    {index < quickFlow.length - 1 ? <ArrowRight className="w-4 h-4 text-primary-foreground/70" /> : null}
                  </div>
                ))}
                <span className="px-3.5 py-2 rounded-xl bg-emerald-400/20 border border-emerald-300/30 text-sm font-bold text-emerald-200">
                  Concluido
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-card">
        <div className="container max-w-7xl py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CADBRASIL · Todos os direitos reservados</p>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-foreground transition-smooth">
              Voltar para pagina inicial
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
