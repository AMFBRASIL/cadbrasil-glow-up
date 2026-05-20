"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Chrome,
  Download,
  ExternalLink,
  FileSearch,
  FileUp,
  Headphones,
  KeyRound,
  Layers,
  LayoutDashboard,
  ListChecks,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Upload,
  Wrench,
  ZoomIn,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { montarWhatsAppHref } from "@/lib/cadbrasil-atendimento";

const PORTAL_FORNECEDOR = "https://fornecedor.cadbrasil.com.br";
const CHROME_STORE_ASSISTENTE =
  "https://chromewebstore.google.com/detail/cadbrasil-%E2%80%94-assistente-si/cdhhdgcabgbjdambnhkmdibhnmfkaicd";

type StepImage = { src: string; alt: string; modalTitle?: string; caption?: string };

type Passo = {
  numero: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  points: string[];
  menuPath?: string[];
  checklist?: string[];
  highlight?: string;
  tip?: string;
  ctaLabel?: string;
  ctaHref?: string;
  images?: StepImage[];
};

const passos: Passo[] = [
  {
    numero: "1",
    icon: Chrome,
    title: "Instalar o Assistente CADBRASIL",
    subtitle: "O primeiro passo é instalar a extensão oficial no Google Chrome.",
    points: [
      "Abra a Chrome Web Store e instale CadBrasil — Assistente SICAF.",
      "Clique em Usar no Chrome e confirme em Adicionar extensão.",
      "Após instalar, o assistente ficará ativo automaticamente sempre que você acessar o SICAF.",
    ],
    tip: "Recomendamos utilizar o Google Chrome para evitar incompatibilidades com o portal do governo e com a extensão.",
    ctaLabel: "Instalar na Chrome Web Store",
    ctaHref: CHROME_STORE_ASSISTENTE,
    images: [
      {
        src: "/instalador-assistente-07.png",
        alt: "Chrome Web Store — instalar Assistente CadBrasil",
        modalTitle: "Passo 1 — Instalação no Chrome",
        caption: "Instalação da extensão",
      },
    ],
  },
  {
    numero: "2",
    icon: LayoutDashboard,
    title: "Acessar o portal do fornecedor",
    subtitle: "Entre no painel CADBRASIL antes de abrir o SICAF do governo.",
    points: [
      "Acesse o Portal do Fornecedor CADBRASIL com seu login.",
      "No menu, abra Cadastro SICAF → Credenciamentos SICAF.",
      "Na lista da empresa, clique em + Detalhes.",
      "Em seguida, clique em Acessar SICAF — o sistema abrirá o portal oficial já preparado para o Assistente CADBRASIL.",
    ],
    ctaLabel: "Abrir portal do fornecedor",
    ctaHref: PORTAL_FORNECEDOR,
    images: [
      {
        src: "/instalador-assistente-03.png",
        alt: "Credenciamentos SICAF — botão + Detalhes",
        modalTitle: "Passo 2 — + Detalhes",
        caption: "+ Detalhes",
      },
      {
        src: "/instalador-assistente-04.png",
        alt: "Detalhes da empresa — Acessar SICAF",
        modalTitle: "Passo 2 — Acessar SICAF",
        caption: "Acessar SICAF",
      },
    ],
  },
  {
    numero: "3",
    icon: KeyRound,
    title: "Acessar o SICAF e validar no Assistente",
    subtitle: "Faça login no governo e vincule o CNPJ no assistente.",
    points: [
      "No portal oficial do SICAF, faça login com Certificado Digital ou Conta GOV.BR.",
      "Abra o Assistente CADBRASIL (botão verde no canto da tela).",
      "Informe o CNPJ da empresa e clique em VALIDAR.",
    ],
    highlight:
      "A validação permite que o assistente identifique automaticamente a situação cadastral do fornecedor e personalize as orientações.",
    images: [
      {
        src: "/instalador-assistente-06.png",
        alt: "Portal SICAF com Assistente CadBrasil aberto",
        modalTitle: "Passo 3 — Login e validação CNPJ",
        caption: "Assistente no SICAF",
      },
    ],
  },
  {
    numero: "4",
    icon: Download,
    title: "Baixar a Situação do Fornecedor",
    subtitle: "Gere o PDF oficial no SICAF — ele será a base da análise da IA.",
    points: [
      "Dentro do SICAF, siga exatamente o caminho do menu indicado abaixo.",
      "Na tela de Situação do Fornecedor, pesquise e abra o relatório da sua empresa.",
      "Gere e baixe o PDF da situação cadastral do fornecedor (salve na pasta Downloads).",
    ],
    menuPath: ["Consulta", "Situação do Fornecedor", "Pesquisar", "Situação do Fornecedor"],
    images: [
      {
        src: "/instalador-assistente-uso.png",
        alt: "Menu Consulta e Situação do Fornecedor no SICAF",
        modalTitle: "Passo 4 — Caminho no menu SICAF",
        caption: "Consulta → Situação do Fornecedor",
      },
    ],
  },
  {
    numero: "5",
    icon: Upload,
    title: "Enviar o PDF para o Assistente",
    subtitle: "O assistente lê o documento e monta o diagnóstico das pendências.",
    points: [
      "Volte ao painel do Assistente CADBRASIL (ainda no SICAF).",
      "Use o botão Enviar Situação do Fornecedor — PDF e selecione o arquivo que você baixou.",
      "Aguarde a leitura automática do documento.",
    ],
    checklist: [
      "Ler automaticamente o PDF",
      "Identificar pendências e certidões vencidas",
      "Informar quais níveis do SICAF precisam de atualização",
    ],
    highlight: "O assistente funciona como um “radar inteligente” do SICAF: você enxerga o que falta antes de atualizar nível por nível.",
    images: [
      {
        src: "/instalador-assistente-06.png",
        alt: "Assistente com botão para enviar PDF da Situação do Fornecedor",
        modalTitle: "Passo 5 — Enviar PDF",
        caption: "Enviar Situação do Fornecedor (PDF)",
      },
    ],
  },
  {
    numero: "6",
    icon: FileSearch,
    title: "Verificar as certidões pendentes",
    subtitle: "Revise tudo o que a IA apontou antes de alterar cadastros no governo.",
    points: [
      "Após a análise do PDF, leia com atenção o que o Assistente CADBRASIL exibiu.",
      "Anote certidões vencidas, pendências no cadastro e níveis incompletos.",
      "Só então siga para os passos de atualização nos níveis 3 e 4.",
    ],
    checklist: [
      "Certidões vencidas",
      "Pendências no cadastro",
      "Níveis incompletos",
      "Necessidade de atualização manual (principalmente no Nível 4)",
    ],
    tip: "Verifique atentamente cada pendência indicada — ela guia o que você deve corrigir no SICAF.",
  },
  {
    numero: "7",
    icon: Layers,
    title: "Atualizar o Nível 3 automaticamente",
    subtitle: "O SICAF pode validar automaticamente parte das exigências deste nível.",
    points: [
      "No SICAF, abra o menu Cadastro e escolha Nível 3.",
      "Clique em IR PARA PRÓXIMO NÍVEL (ou equivalente na sua tela).",
      "O sistema realizará a atualização automática das validações disponíveis neste nível.",
    ],
    menuPath: ["Cadastro", "Nível 3"],
    tip: "Siga as orientações do Assistente sobre o Nível 3 — ele indica se ainda falta algo após a validação automática.",
  },
  {
    numero: "8",
    icon: Wrench,
    title: "Validar manualmente o Nível 4",
    subtitle: "Certidões estaduais, municipais e trabalhistas costumam exigir envio manual aqui.",
    points: [
      "Acesse Cadastro → Nível 4 no SICAF.",
      "Atualize manualmente cada certidão pendente que o Assistente CADBRASIL indicou.",
      "Envie sempre PDFs válidos, legíveis e dentro da validade.",
    ],
    menuPath: ["Cadastro", "Nível 4"],
    checklist: [
      "Certidões estaduais",
      "Certidões municipais",
      "Certidões trabalhistas",
      "Documentações específicas do seu ramo",
    ],
    tip: "O Nível 4 raramente se resolve só com um clique — reserve tempo para anexar cada documento corretamente.",
  },
];

const quickFlow = [
  "Instalar",
  "Portal",
  "Login + CNPJ",
  "Baixar PDF",
  "Enviar IA",
  "Pendências",
  "Nível 3",
  "Nível 4",
  "Conferir",
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

function MenuPathBox({ steps }: { steps: string[] }) {
  return (
    <div className="rounded-xl border border-border/80 bg-muted/30 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Menu no SICAF</p>
      <div className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-foreground">
        {steps.map((step, i) => (
          <span key={step} className="inline-flex items-center gap-1.5">
            {i > 0 ? <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" /> : null}
            <span className="px-2 py-1 rounded-lg bg-card border border-border/70">{step}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AssistenteUsoContent() {
  const whatsAppSuporte = montarWhatsAppHref(
    "Olá! Preciso de suporte remoto via AnyDesk para atualizar meu SICAF com o Assistente CADBRASIL. Pode me orientar sobre o acesso?",
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
            Uso do Assistente no SICAF
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-grid opacity-50 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <section className="relative container max-w-7xl pt-10 md:pt-16 pb-8">
          <div className="max-w-4xl space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft border border-primary/10 text-xs font-semibold text-primary">
              <Rocket className="w-3.5 h-3.5" />
              Passo a passo completo
            </div>

            <div className="space-y-4">
              <h1 className="font-display font-extrabold text-foreground text-balance text-4xl md:text-5xl leading-[1.05]">
                Como atualizar o SICAF com o Assistente CADBRASIL
              </h1>
              <p className="text-lg text-muted-foreground text-balance max-w-3xl leading-relaxed">
                Guia intuitivo do início ao fim: instalação no Chrome, portal do fornecedor, validação do CNPJ, PDF da
                Situação do Fornecedor, análise inteligente de pendências e atualização dos níveis 3 e 4 no portal
                oficial.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-4 md:px-5 md:py-5 space-y-2">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm text-amber-950 leading-relaxed">
                  <p className="font-semibold text-amber-900">Importante</p>
                  <p>
                    O processo do SICAF foi modernizado e agora funciona integrado ao{" "}
                    <strong>Assistente CADBRASIL</strong>, tornando a atualização mais rápida, inteligente e organizada.
                  </p>
                  <p>
                    Recomendamos o <strong>Google Chrome</strong> e a extensão oficial da CADBRASIL. A CADBRASIL é
                    assessoria especializada — não possui vínculo com o Governo; auxiliamos o fornecedor no uso do
                    portal oficial.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
              <span>
                Instalação:{" "}
                <Link
                  href="/instalador-assistente-cadbrasil"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  guia do instalador
                </Link>
              </span>
              <span>
                Jornada completa:{" "}
                <Link href="/procedimentos-cadbrasil" className="font-semibold text-primary underline-offset-2 hover:underline">
                  procedimentos CADBRASIL
                </Link>
              </span>
            </p>
          </div>
        </section>

        <section className="container max-w-7xl pb-12 md:pb-16">
          <div className="grid gap-5">
            {passos.map((passo) => (
              <article
                key={passo.numero}
                className="p-6 md:p-7 rounded-2xl bg-card border border-border/70 shadow-soft hover:shadow-card transition-smooth"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground font-display text-lg font-extrabold shadow-soft">
                      {passo.numero}
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2 text-primary">
                        <passo.icon className="h-5 w-5 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider">Passo {passo.numero}</span>
                      </div>
                      <h2 className="font-display font-bold text-xl md:text-2xl text-foreground leading-tight">{passo.title}</h2>
                      {passo.subtitle ? (
                        <p className="text-sm text-muted-foreground leading-relaxed">{passo.subtitle}</p>
                      ) : null}
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {passo.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm md:text-[15px] text-muted-foreground leading-relaxed"
                      >
                        <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-primary-glow shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {passo.menuPath?.length ? <MenuPathBox steps={passo.menuPath} /> : null}

                  {passo.checklist?.length ? (
                    <div className="rounded-xl border border-primary/20 bg-primary-soft/35 px-4 py-3">
                      <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                        <ListChecks className="h-3.5 w-3.5" />
                        O assistente irá identificar
                      </p>
                      <ul className="grid gap-1.5 sm:grid-cols-2">
                        {passo.checklist.map((item) => (
                          <li key={item} className="text-sm text-foreground/90 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {passo.highlight ? (
                    <div className="rounded-xl border border-primary/30 bg-gradient-soft px-3 py-3 text-sm leading-relaxed text-foreground">
                      <span className="font-semibold text-primary">Destaque: </span>
                      {passo.highlight}
                    </div>
                  ) : null}

                  {passo.tip ? (
                    <div className="rounded-xl border border-primary/25 bg-primary-soft/50 px-3 py-3 text-xs leading-relaxed text-foreground/90">
                      <span className="font-semibold text-primary">Dica: </span>
                      {passo.tip}
                    </div>
                  ) : null}

                  {passo.ctaHref ? (
                    <a
                      href={passo.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-soft hover:shadow-card transition-smooth"
                    >
                      {passo.ctaLabel}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : null}

                  {passo.images?.length ? (
                    <div className="rounded-xl border border-primary/20 bg-primary-soft/40 p-3 md:p-4">
                      <p className="text-xs font-semibold text-primary mb-3">Referência visual — clique para ampliar</p>
                      <div
                        className={`grid gap-4 ${
                          passo.images.length >= 2 ? "sm:grid-cols-2" : "max-w-3xl"
                        }`}
                      >
                        {passo.images.map((img) => (
                          <ImageBlock key={img.src} img={img} stepTitle={passo.title} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}

            <article className="p-6 md:p-8 rounded-2xl border-2 border-success/35 bg-gradient-to-br from-success/10 via-card to-primary-soft/30 shadow-card">
              <div className="flex flex-wrap items-start gap-4 mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success text-success-foreground">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl md:text-2xl text-foreground">Finalização</h2>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Confirme que o cadastro está regular antes de participar de licitações.
                  </p>
                </div>
              </div>
              <ul className="space-y-2.5 mb-4">
                {[
                  "Gere novamente a Situação do Fornecedor no SICAF (mesmo caminho do Passo 4).",
                  "Envie o PDF atualizado ao Assistente CADBRASIL.",
                  "Verifique se todas as pendências foram removidas na análise da IA.",
                  "Se ainda houver alertas, repita os níveis indicados ou fale com o suporte CADBRASIL.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-success shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <Rocket className="h-4 w-4 text-primary" />
                O novo processo é mais rápido, inteligente e seguro com o Assistente CADBRASIL.
              </p>
            </article>

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
                  "Instalação do Assistente",
                  "Atualização do SICAF",
                  "Correção de pendências",
                  "Configuração do navegador",
                  "Auxílio nos níveis do SICAF",
                  "Envio e leitura do PDF da Situação do Fornecedor",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Bot className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-4">
                Caso tenha dificuldades e precise de <strong className="text-foreground">suporte via AnyDesk</strong> para acesso
                remoto da nossa equipe (instalação do Assistente, atualização do SICAF, correção de pendências e auxílio nos
                níveis), entre em contato pelo botão abaixo.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsAppSuporte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold shadow-soft hover:opacity-95 transition-smooth"
                >
                  <MessageCircle className="h-4 w-4" />
                  Solicitar suporte via AnyDesk — WhatsApp
                </a>
                <Link
                  href="/instalador-assistente-cadbrasil"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 text-sm font-semibold text-primary hover:bg-primary-soft transition-smooth"
                >
                  <FileUp className="h-4 w-4" />
                  Guia de instalação
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="container max-w-7xl py-14 md:py-16 relative">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Resumo do fluxo</p>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary-foreground leading-tight">
                Do Chrome ao SICAF regularizado
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
            <Link href="/instalador-assistente-cadbrasil" className="hover:text-foreground transition-smooth">
              Instalador do Assistente
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
