"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Bot,
  ArrowRight,
  LifeBuoy,
  Wrench,
  ZoomIn,
  AlertTriangle,
  MessageCircle,
  Send,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const steps = [
  {
    icon: Lock,
    title: "1. Acessar a plataforma nova",
    highlight: false,
    points: [
      "Entre na plataforma oficial do fornecedor.",
      "Use seu e-mail e senha ja cadastrados.",
      "Se nao lembrar a senha, use a opcao de recuperar acesso.",
    ],
    ctaLabel: "Acessar plataforma nova",
    ctaHref: "https://fornecedor.cadbrasil.com.br",
    previewImages: [
      {
        src: "/procedimento-clientes-etapa-1-1.png",
        alt: "Tela de login da plataforma CadBrasil fornecedor",
        modalTitle: "Acessar a plataforma nova — login",
      },
    ],
  },
  {
    icon: Wrench,
    title: "2. Abrir Meu SICAF em + Detalhes e instalar o Assistente CADBRASIL",
    highlight: false,
    points: [
      'No menu, acesse "Meu SICAF".',
      'Clique em "+ Detalhes" para abrir o processo do fornecedor.',
      "Instale a extensao Assistente CADBRASIL e siga as telas de orientacao.",
    ],
    ctaLabel: "Instalar Assistente CADBRASIL",
    ctaHref:
      "https://chromewebstore.google.com/detail/cadbrasil-%E2%80%94-assistente-si/cdhhdgcabgbjdambnhkmdibhnmfkaicd",
    previewImages: [
      {
        src: "/procedimento-clientes-etapa-2-1.png",
        alt: "Lista de credenciamentos SICAF com destaque para o botao + Detalhes",
        modalTitle: "Acessando Meu SICAF",
      },
      {
        src: "/procedimento-clientes-etapa-2-2.png",
        alt: "Painel lateral com detalhes da empresa e opcoes do processo",
        modalTitle: "Acessando empresa — + Detalhes",
      },
    ],
  },
  {
    icon: Bot,
    title: "3. Conversar com o Assistente CADBRASIL e enviar a situacao do fornecedor",
    highlight: true,
    points: [
      "Todo o processo do SICAF deve ser feito atraves do Assistente CADBRASIL — ele e a ferramenta principal para cadastro, atualizacao e envio de dados.",
      "O Assistente orienta cada campo, valida documentos automaticamente e reduz erros no preenchimento.",
      "Envie a situacao atual do fornecedor pelo Assistente para que a equipe CADBRASIL acompanhe o processo em tempo real.",
      "Documentos, certidoes e pendencias sao verificados e encaminhados diretamente pelo Assistente — nao e necessario enviar separadamente.",
    ],
    alertMessage: "Atencao: todo o processo do SICAF deve ser conduzido pelo Assistente CADBRASIL. Ele e obrigatorio para garantir o correto preenchimento e envio dos dados ao governo.",
    previewImages: [
      {
        src: "/procedimento-clientes-etapa-4-1.png",
        alt: "Acessando o Assistente CADBRASIL no sistema",
        modalTitle: "Acessando ASSISTENTE",
      },
      {
        src: "/procedimento-clientes-etapa-4-2.png",
        alt: "Conversando com o Assistente CADBRASIL",
        modalTitle: "Conversando com o Assistente",
      },
      {
        src: "/procedimento-clientes-etapa-4-3.png",
        alt: "Enviando situacao do fornecedor no Assistente CADBRASIL",
        modalTitle: "Conversando com o Assistente - Situacao",
      },
    ],
  },
  {
    icon: LifeBuoy,
    title: "4. Abrir ticket de suporte",
    highlight: false,
    points: [
      "Se precisar de ajuda, abra um ticket diretamente na plataforma.",
      "Descreva o problema com detalhes e, se possivel, inclua prints.",
      "Acompanhe as respostas da equipe e conclua as pendencias.",
    ],
  },
];

const quickFlow = ["Plataforma", "Meu SICAF", "Assistente CADBRASIL", "Ticket", "Concluido"];

export default function ClientesExistentesContent() {
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
            Fluxo para clientes ja cadastrados
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
                Guia rapido para Novos cadastros e Atualizar dados no SICAF
              </h1>
              <p className="text-lg text-muted-foreground text-balance max-w-3xl leading-relaxed">
                Siga estes passos para usar a nova plataforma com mais rapidez, mantendo seu processo organizado e com suporte.
              </p>
            </div>
          </div>
        </section>

        <section className="container max-w-7xl pb-12 md:pb-16">
          <div className="grid gap-4">
            {steps.map((step) => (
              <article
                key={step.title}
                className={`p-6 md:p-7 rounded-2xl shadow-soft hover:shadow-card transition-smooth ${
                  step.highlight
                    ? "bg-gradient-to-br from-primary/[0.06] via-card to-emerald-500/[0.04] border-2 border-primary/40 ring-1 ring-primary/20"
                    : "bg-card border border-border/70"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      step.highlight
                        ? "bg-gradient-to-br from-primary to-emerald-600 text-white shadow-md"
                        : "bg-primary-soft text-primary"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className={`font-display font-bold text-xl ${step.highlight ? "text-primary" : "text-foreground"}`}>
                        {step.title}
                      </h2>
                      {step.highlight && (
                        <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-wide">
                          <MessageCircle className="w-3.5 h-3.5" />
                          Etapa principal do processo
                        </span>
                      )}
                    </div>

                    {"alertMessage" in step && step.alertMessage ? (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/60 dark:border-amber-500/30">
                        <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 leading-relaxed">
                          {step.alertMessage}
                        </p>
                      </div>
                    ) : null}

                    <ul className="space-y-2.5">
                      {step.points.map((point) => (
                        <li
                          key={point}
                          className={`flex items-start gap-2.5 leading-relaxed ${
                            step.highlight
                              ? "text-sm md:text-[15px] text-foreground/90 font-medium"
                              : "text-sm md:text-[15px] text-muted-foreground"
                          }`}
                        >
                          {step.highlight ? (
                            <Send className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-primary-glow shrink-0" />
                          )}
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

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

                    {"previewImages" in step && step.previewImages?.length ? (
                      <div className={`rounded-xl p-3 ${
                        step.highlight
                          ? "border-2 border-primary/30 bg-primary/[0.04]"
                          : "border border-primary/20 bg-primary-soft/40"
                      }`}>
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
                Fluxo rapido para clientes ativos
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
