"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Lock,
  Settings,
  ShieldCheck,
  UserCheck,
  UserPlus,
  ZoomIn,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type FlowMode = "novo" | "existente";

type StepImage = {
  src: string;
  alt: string;
  modalTitle?: string;
};

type Step = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  points: string[];
  ctaLabel?: string;
  ctaHref?: string;
  previewImages?: StepImage[];
  institutionalDisclaimer?: string;
  assistantPromptSections?: Array<{ title: string; items: string[] }>;
};

const assistantPromptSections: Array<{ title: string; items: string[] }> = [
  {
    title: "CONSULTAS DO CADASTRO SICAF",
    items: [
      "Mostrar meu nível 1 do SICAF",
      "Consultar nível 2 do meu cadastro",
      "Ver meu nível 3",
      "Como está meu nível 4?",
      "Abrir nível 5 do SICAF",
      "Consultar meus níveis cadastrados",
      "Verificar situação dos meus níveis",
      "Meu cadastro está completo?",
    ],
  },
  {
    title: "CERTIDÕES E DOCUMENTOS",
    items: [
      "Onde fica a certidão estadual?",
      "Onde fica a certidão municipal?",
      "Qual nível fica a certidão federal?",
      "Qual documento está vencido?",
      "Quais certidões preciso atualizar?",
      "Meu SICAF possui pendências?",
      "Verificar documentos vencendo",
      "Mostrar documentos obrigatórios",
      "O que falta no meu cadastro?",
      "Minha certidão do FGTS está válida?",
      "Minha certidão federal venceu?",
      "Onde envio meus documentos?",
      "Como anexar documentos no SICAF?",
    ],
  },
  {
    title: "CONSULTAS EMPRESARIAIS",
    items: [
      "Consultar meu CNPJ",
      "Ver dados da minha empresa",
      "Mostrar razão social",
      "Meu cadastro está ativo?",
      "Meu SICAF está válido?",
      "Qual validade do meu CRC?",
      "Consultar situação cadastral",
      "Minha empresa está habilitada?",
    ],
  },
  {
    title: "EMISSÃO DE DOCUMENTOS",
    items: [
      "Emitir CRC",
      "Gerar CRC atualizado",
      "Baixar CRC",
      "Emitir Situação do Fornecedor",
      "Gerar relatório do SICAF",
      "Imprimir comprovante do SICAF",
      "Baixar certidões",
      "Exportar meu cadastro",
    ],
  },
  {
    title: "AJUDA E SUPORTE",
    items: [
      "Como atualizar meu SICAF?",
      "Como renovar meu SICAF?",
      "Como faço o cadastro no SICAF?",
      "O que é CRC?",
      "O que significa nível 1?",
      "O que significa nível 2?",
      "O que significa nível 3?",
      "O que significa nível 4?",
      "O que significa nível 5?",
      "Meu SICAF venceu, e agora?",
      "Quanto tempo demora a atualização?",
      "Como resolver pendências?",
      "O sistema não abre",
      "Meu certificado digital não funciona",
      "Não consigo acessar o Compras.gov.br",
      "Como instalar o Assistente SICAF?",
      "O Assistente SICAF é seguro?",
    ],
  },
  {
    title: "COMANDOS MAIS HUMANIZADOS",
    items: [
      "O que está faltando no meu SICAF?",
      "Meu cadastro está certo?",
      "Pode verificar minhas pendências?",
      "Me ajuda a atualizar meu SICAF",
      "Quero renovar meu cadastro",
      "Quero emitir meu CRC",
      "Verificar se minha empresa está habilitada",
      "Estou com problema no nível 3",
      "Minha certidão venceu?",
      "O que preciso fazer agora?",
      "Me orientar passo a passo",
      "Fazer análise completa do meu SICAF",
    ],
  },
  {
    title: "ALERTAS INTELIGENTES",
    items: [
      "Sua certidão municipal vence em 5 dias.",
      "Seu CRC está próximo do vencimento.",
      "Existem pendências no nível 2.",
      "Seu SICAF está regular.",
      "Detectamos documentos faltando.",
      "Seu cadastro possui inconsistências.",
      "Seu cadastro está apto para licitações.",
    ],
  },
];

const stepsNovoCadastro: Step[] = [
  {
    icon: UserPlus,
    title: "1. Cadastro inicial na CADBRASIL",
    points: [
      "Acesse o cadastro inicial e informe os dados da empresa com atenção.",
      "Finalize o cadastro para liberar a licença e iniciar seu atendimento.",
      "Após envio, guarde o protocolo para pagamento e suporte.",
    ],
    ctaLabel: "Fazer cadastro inicial",
    ctaHref: "https://cadastro.cadbrasil.com.br/",
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-00.png",
        alt: "Tela de cadastro inicial da CADBRASIL",
        modalTitle: "Cadastro inicial",
      },
    ],
  },
  {
    icon: Lock,
    title: "2. Acessar o painel do fornecedor",
    points: [
      "Entre no portal do fornecedor com e-mail e senha cadastrados.",
      "Se necessário, recupere a senha antes de continuar o processo.",
    ],
    ctaLabel: "Abrir portal do fornecedor",
    ctaHref: "https://fornecedor.cadbrasil.com.br",
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-01.png",
        alt: "Acesso ao painel do fornecedor no portal CADBRASIL",
        modalTitle: "Acessando painel do fornecedor",
      },
    ],
  },
  {
    icon: UserCheck,
    title: "3. Entrar no SICAF dentro do portal",
    points: [
      "No painel, localize sua empresa e abra as opções do processo.",
      "Use o botão de acesso ao SICAF para abrir o fluxo no governo.",
    ],
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-02.png",
        alt: "Acesso ao SICAF pelo painel lateral da empresa",
        modalTitle: "Acessando SICAF dentro do portal",
      },
      {
        src: "/procedimentos-cadbrasil-03.png",
        alt: "Tela de credenciamento com destaque para o botão de acesso ao SICAF",
        modalTitle: "Acessando SICAF pelo botão",
      },
    ],
  },
  {
    icon: Bot,
    title: "4. Abrir o SICAF com Assistente CADBRASIL",
    points: [
      "Ao entrar no SICAF, valide se o assistente está ativo para orientar os próximos passos.",
      "Com o assistente ativo, o processo fica guiado e com menos risco de erro.",
    ],
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-04.png",
        alt: "Acesso ao SICAF com orientações do assistente",
        modalTitle: "SICAF com Assistente",
      },
    ],
  },
  {
    icon: Settings,
    title: "5. Instalar o Assistente CADBRASIL",
    points: [
      "Caso o assistente não esteja instalado, faça a instalação pela extensão oficial.",
      "Após instalar, volte ao fluxo e abra novamente o SICAF.",
    ],
    ctaLabel: "Instalar Assistente CADBRASIL",
    ctaHref:
      "https://chromewebstore.google.com/detail/cadbrasil-%E2%80%94-assistente-si/cdhhdgcabgbjdambnhkmdibhnmfkaicd",
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-05.png",
        alt: "Tela de verificação e instalação do Assistente CADBRASIL",
        modalTitle: "Instalando Assistente CADBRASIL",
      },
    ],
  },
  {
    icon: Bot,
    title: "6. Acessar o assistente dentro do SICAF do governo",
    points: [
      "No portal oficial do governo, clique no botão do assistente para abrir o painel lateral.",
      "Use o assistente durante todo o processo para consultar dados e executar tarefas.",
    ],
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-06.png",
        alt: "Abertura do assistente dentro do SICAF do governo",
        modalTitle: "Assistente dentro do SICAF",
      },
    ],
    institutionalDisclaimer:
      "A CADBRASIL é uma assessoria especializada e não possui vínculo com o Governo. Prestamos serviços para auxiliar o fornecedor em todo o processo no SICAF, com orientação técnica e acompanhamento.",
  },
  {
    icon: CheckCircle2,
    title: "7. Perguntas que podem ser feitas no assistente",
    points: [
      "No final, consulte a lista de comandos e perguntas sugeridas.",
      "Use esse material para consultas de níveis SICAF, certidões e suporte diário.",
    ],
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-textos.png",
        alt: "Lista de perguntas e comandos disponíveis no assistente CADBRASIL",
        modalTitle: "Perguntas e comandos do assistente",
      },
    ],
    assistantPromptSections,
  },
];

const stepsClienteExistente: Step[] = [
  {
    icon: Lock,
    title: "1. Acessar portal do fornecedor",
    points: [
      "Entre com seu e-mail e senha no portal do fornecedor.",
      "Caso não lembre a senha, use a recuperação na tela de login.",
    ],
    ctaLabel: "Entrar no portal",
    ctaHref: "https://fornecedor.cadbrasil.com.br",
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-01.png",
        alt: "Tela de login no portal do fornecedor",
        modalTitle: "Portal do fornecedor",
      },
    ],
  },
  {
    icon: UserCheck,
    title: "2. Abrir empresa e acessar SICAF",
    points: [
      "No cadastro SICAF, clique em + Detalhes e depois em Acessar SICAF.",
      "Confirme que abriu o fluxo correto da empresa ativa.",
    ],
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-02.png",
        alt: "Acesso da empresa no painel lateral",
        modalTitle: "Acessando empresa",
      },
      {
        src: "/procedimentos-cadbrasil-03.png",
        alt: "Botão de acesso ao SICAF no portal",
        modalTitle: "Acessando SICAF pelo botão",
      },
      {
        src: "/procedimentos-cadbrasil-04b.png",
        alt: "Painel da empresa com destaque para o botão ACESSAR SICAF",
        modalTitle: "Clique em ACESSAR SICAF",
      },
    ],
  },
  {
    icon: Settings,
    title: "3. Instalar ou validar o assistente",
    points: [
      "Se o assistente não estiver disponível, instale pela Chrome Web Store.",
      "Depois da instalação, retorne ao portal e acesse novamente o SICAF.",
    ],
    ctaLabel: "Instalar Assistente CADBRASIL",
    ctaHref:
      "https://chromewebstore.google.com/detail/cadbrasil-%E2%80%94-assistente-si/cdhhdgcabgbjdambnhkmdibhnmfkaicd",
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-05.png",
        alt: "Fluxo de instalação do assistente CADBRASIL",
        modalTitle: "Instalando assistente",
      },
    ],
  },
  {
    icon: Bot,
    title: "4. Usar o assistente no SICAF",
    points: [
      "Abra o assistente no SICAF do governo e siga os direcionamentos.",
      "Faça consultas, valide pendências e execute tarefas com apoio da IA.",
    ],
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-06.png",
        alt: "Assistente aberto no SICAF para execução do processo",
        modalTitle: "Assistente ativo no SICAF",
      },
    ],
  },
  {
    icon: CheckCircle2,
    title: "5. Perguntas e textos recomendados",
    points: [
      "Consulte a lista final de comandos para agilizar seu atendimento.",
      "Use as perguntas prontas para níveis SICAF, certidões, CRC e regularidade.",
    ],
    previewImages: [
      {
        src: "/procedimentos-cadbrasil-textos.png",
        alt: "Referência de perguntas para uso no assistente",
        modalTitle: "Textos e perguntas do assistente",
      },
    ],
    assistantPromptSections,
  },
];

export default function ProcedimentosContent() {
  const [flowMode, setFlowMode] = useState<FlowMode>("novo");
  const [flowSelected, setFlowSelected] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string>("");
  const steps = useMemo(() => (flowMode === "novo" ? stepsNovoCadastro : stepsClienteExistente), [flowMode]);
  const quickFlow =
    flowMode === "novo"
      ? ["Cadastro", "Portal", "SICAF", "Assistente", "Perguntas", "Concluído"]
      : ["Portal", "Empresa", "SICAF", "Assistente", "Perguntas", "Concluído"];

  const handleCopyPrompt = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(text);
      window.setTimeout(() => setCopiedPrompt(""), 1800);
    } catch {
      setCopiedPrompt("");
    }
  };

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
            Procedimentos CADBRASIL
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-grid opacity-50 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <section className="relative container max-w-7xl pt-10 md:pt-16 pb-8">
          <div className="max-w-4xl space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft border border-primary/10 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary-glow opacity-70 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-glow" />
              </span>
              Procedimentos CADBRASIL
            </div>

            <div className="space-y-4">
              <h1 className="font-display font-extrabold text-foreground text-balance text-4xl md:text-5xl leading-[1.05]">
                Jornada completa no SICAF com o Assistente CADBRASIL
              </h1>
              <p className="text-lg text-muted-foreground text-balance max-w-3xl leading-relaxed">
                Escolha abaixo se você ainda vai iniciar seu cadastro ou se já é cliente da base. A página ajusta os
                procedimentos para cada momento.
              </p>
            </div>
          </div>
        </section>

        <section className="container max-w-7xl pb-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setFlowMode("novo");
                setFlowSelected(true);
              }}
              className={`rounded-3xl border p-6 md:p-8 text-left transition-smooth min-h-[170px] ${
                flowSelected && flowMode === "novo"
                  ? "border-primary/60 bg-gradient-to-br from-primary/20 via-primary-soft to-primary/10 shadow-card ring-2 ring-primary/25"
                  : "border-primary/35 bg-gradient-to-br from-primary/10 via-primary-soft/70 to-primary/5 hover:border-primary/60 hover:shadow-card"
              }`}
            >
              <p className="text-lg md:text-xl font-bold text-foreground">Não sou cliente</p>
              <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                Fluxo completo: cadastro inicial, portal, SICAF, instalação e uso do assistente.
              </p>
              <span className="mt-4 inline-flex rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                Clique para iniciar
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFlowMode("existente");
                setFlowSelected(true);
              }}
              className={`rounded-3xl border p-6 md:p-8 text-left transition-smooth min-h-[170px] ${
                flowSelected && flowMode === "existente"
                  ? "border-primary/60 bg-gradient-to-br from-primary/20 via-primary-soft to-primary/10 shadow-card ring-2 ring-primary/25"
                  : "border-primary/35 bg-gradient-to-br from-primary/10 via-primary-soft/70 to-primary/5 hover:border-primary/60 hover:shadow-card"
              }`}
            >
              <p className="text-lg md:text-xl font-bold text-foreground">Sou cliente</p>
              <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                Fluxo direto: portal, acesso ao SICAF, instalação do assistente e comandos finais.
              </p>
              <span className="mt-4 inline-flex rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                Clique para iniciar
              </span>
            </button>
          </div>
        </section>

        {flowSelected ? (
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

                    {step.ctaHref ? (
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

                    {step.previewImages?.length ? (
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
                                  <Image src={img.src} alt={img.alt} width={1800} height={1200} className="w-full h-full object-contain" priority />
                                </div>
                              </DialogContent>
                            </Dialog>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {step.institutionalDisclaimer ? (
                      <p className="rounded-xl border border-amber-200/60 bg-amber-50/80 px-3 py-2.5 text-xs leading-relaxed text-amber-900">
                        {step.institutionalDisclaimer}
                      </p>
                    ) : null}

                    {step.assistantPromptSections?.length ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex w-fit items-center gap-2 rounded-xl border border-primary/30 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary-soft transition-smooth"
                          >
                            Ver textos completos para o assistente
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl max-h-[88vh] overflow-y-auto p-4 sm:p-6">
                          <DialogHeader>
                            <DialogTitle>Comandos e perguntas para usar no Assistente CADBRASIL</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="rounded-xl border border-primary/20 bg-primary-soft/40 px-3 py-2.5 text-xs text-muted-foreground">
                              Clique em <strong className="text-foreground">Copiar</strong> para enviar a frase direto no assistente.
                            </div>
                            {step.assistantPromptSections.map((section) => (
                              <section
                                key={section.title}
                                className="rounded-2xl border border-border bg-card/70 p-3 sm:p-4 shadow-soft"
                              >
                                <h4 className="text-sm font-bold text-foreground">{section.title}</h4>
                                <ul className="mt-3 space-y-2">
                                  {section.items.map((item) => (
                                    <li
                                      key={item}
                                      className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/80 px-3 py-2"
                                    >
                                      <span className="text-sm text-foreground">{item}</span>
                                      <button
                                        type="button"
                                        onClick={() => void handleCopyPrompt(item)}
                                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/25 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft transition-smooth"
                                        aria-label={`Copiar texto: ${item}`}
                                      >
                                        {copiedPrompt === item ? (
                                          <>
                                            <Check className="h-3.5 w-3.5" />
                                            Copiado
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="h-3.5 w-3.5" />
                                            Copiar
                                          </>
                                        )}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </section>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        ) : (
          <section className="container max-w-7xl pb-12 md:pb-16">
            <div className="rounded-2xl border border-dashed border-primary/35 bg-primary-soft/30 px-6 py-8 text-center">
              <p className="text-base font-semibold text-foreground">
                Escolha acima se você é cliente ou ainda vai se cadastrar.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Após selecionar uma opção, mostramos o passo a passo completo logo abaixo.
              </p>
            </div>
          </section>
        )}

        {flowSelected ? (
        <section className="bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="container max-w-7xl py-14 md:py-16 relative">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Resumo visual</p>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary-foreground leading-tight">
                Fluxo do momento atual
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
        ) : null}
      </main>

      <footer className="border-t border-border/60 bg-card">
        <div className="container max-w-7xl py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CADBRASIL · Todos os direitos reservados</p>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-foreground transition-smooth">
              Voltar para página inicial
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
