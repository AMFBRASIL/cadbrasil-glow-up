"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Bell,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  FileUp,
  FolderOpen,
  Headphones,
  History,
  LayoutDashboard,
  Loader2,
  Lock,
  PlayCircle,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { trackConversion } from "@/lib/utm";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FORNECEDOR_AUTH_URL = "https://fornecedor.cadbrasil.com.br/auth";
const PROGRESS_PERCENT = 60;

const PROGRESS_STEPS = [
  { label: "Cadastro da Empresa", done: true },
  { label: "Criação da Conta", done: true },
  { label: "Diagnóstico Inicial", done: true },
  { label: "Envio dos Documentos", done: false },
  { label: "Ativação da Licença", done: false },
  { label: "Análise Especializada", done: false },
] as const;

const REWARD_ITEMS = [
  "Nossa equipe analisará sua documentação",
  "Identificaremos pendências cadastrais",
  "Verificaremos requisitos do SICAF",
  "Validaremos certidões e documentos",
  "Orientaremos sua empresa em cada etapa",
  "Você acompanhará tudo pela plataforma",
] as const;

const LICENSE_BENEFITS = [
  { icon: LayoutDashboard, label: "Plataforma CADBRASIL" },
  { icon: FolderOpen, label: "Gestão documental" },
  { icon: ShieldCheck, label: "Credenciamento SICAF" },
  { icon: CalendarClock, label: "Monitoramento de vencimentos" },
  { icon: Search, label: "Consulta automática de certidões" },
  { icon: Bell, label: "Alertas inteligentes" },
  { icon: History, label: "Histórico documental" },
  { icon: Headphones, label: "Atendimento especializado" },
  { icon: Wrench, label: "Suporte técnico" },
  { icon: TrendingUp, label: "Acompanhamento contínuo" },
] as const;

const SECURITY_ITEMS = [
  "Ambiente seguro",
  "Conexão criptografada",
  "Armazenamento protegido",
  "Acesso restrito",
] as const;

type CadastroData = {
  protocolo: string;
  nome: string;
  email: string;
  emailAcesso: string;
  tipoPessoa: "PJ" | "PF";
  razaoSocial: string;
  nomeFantasia: string | null;
  documento: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  contrato: {
    plano: string;
    inicio: string;
    vencimento: string;
    status: string;
  } | null;
};

function resolveAuthUrl(): string {
  const raw = process.env.NEXT_PUBLIC_PORTAL_URL?.trim();
  if (raw && raw.length > 0) {
    const base = raw.replace(/\/$/, "");
    return base.endsWith("/auth") ? base : `${base}/auth`;
  }
  return FORNECEDOR_AUTH_URL;
}

function buildAuthUrl(email?: string): string {
  const base = resolveAuthUrl();
  if (!email?.trim()) return base;
  try {
    const url = new URL(base);
    url.searchParams.set("email", email.trim());
    return url.toString();
  } catch {
    return base;
  }
}

function goToPortal(data: CadastroData) {
  trackConversion("continuar_portal_cadastro", 985, {
    protocolo: data.protocolo,
    tipo_pessoa: data.tipoPessoa,
  });
  window.open(buildAuthUrl(data.emailAcesso), "_blank", "noopener,noreferrer");
}

function ContinueCta({
  data,
  className,
  compact,
}: {
  data: CadastroData;
  className?: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => goToPortal(data)}
      className={cn(
        "w-full rounded-2xl bg-gradient-cta text-primary-foreground shadow-glow transition-smooth hover:scale-[1.01] hover:shadow-elevated focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25",
        compact ? "px-4 py-3.5" : "px-6 py-5",
        className
      )}
    >
      <span className={cn("block font-display font-bold tracking-tight", compact ? "text-base" : "text-lg sm:text-xl")}>
        🚀 CONTINUAR AGORA
      </span>
      <span className={cn("block text-primary-foreground/85 mt-0.5", compact ? "text-[11px]" : "text-xs sm:text-sm")}>
        Enviar documentos e ativar minha licença
      </span>
    </button>
  );
}

function PlatformTourDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm font-semibold text-foreground shadow-soft transition-smooth hover:border-primary/30 hover:bg-primary-soft/40"
        >
          👀 Conhecer a plataforma primeiro
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Conheça a plataforma CADBRASIL</DialogTitle>
          <DialogDescription>
            Veja como funciona o portal do fornecedor antes de enviar seus documentos.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            {[
              "Painel centralizado com status do seu cadastro SICAF",
              "Envio de documentos e acompanhamento em tempo real",
              "Pagamento da licença e alertas de vencimento",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <Link
            href="/procedimentos-cadbrasil"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary-soft px-4 py-3 text-sm font-semibold text-primary transition-smooth hover:bg-primary-soft/80"
          >
            <PlayCircle className="h-4 w-4" />
            Ver tour passo a passo da plataforma
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProgressSection() {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-sm font-semibold text-foreground">Seu progresso</p>
        <span className="text-xs font-bold text-primary bg-primary-soft px-2.5 py-1 rounded-full">
          {PROGRESS_PERCENT}%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-gradient-cta transition-all duration-700"
          style={{ width: `${PROGRESS_PERCENT}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Você concluiu <strong className="text-foreground font-semibold">{PROGRESS_PERCENT}%</strong> do processo.
      </p>
      <ul className="space-y-2">
        {PROGRESS_STEPS.map((step) => (
          <li key={step.label} className="flex items-center gap-2.5 text-sm">
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                step.done
                  ? "bg-success/15 text-success"
                  : "border border-border bg-muted/50 text-muted-foreground"
              )}
            >
              {step.done ? <Check className="h-3 w-3" strokeWidth={3} /> : ""}
            </span>
            <span className={cn(step.done ? "text-foreground font-medium" : "text-muted-foreground")}>
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SuccessView({ data }: { data: CadastroData }) {
  const displayName =
    data.tipoPessoa === "PJ" && data.razaoSocial ? data.razaoSocial : data.nome;

  return (
    <>
      <div className="space-y-5 sm:space-y-6 pb-28 md:pb-8">
        {/* Cabeçalho */}
        <header className="text-center space-y-3 animate-fade-up">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 ring-4 ring-success/10">
            <CheckCircle2 className="h-9 w-9 text-success" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground text-balance leading-tight">
              🎉 Sua conta foi criada com sucesso!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed text-balance" data-seo-speakable="intro">
              {data.tipoPessoa === "PJ"
                ? "Sua empresa já possui acesso à plataforma CADBRASIL."
                : "Sua conta já possui acesso à plataforma CADBRASIL."}
              <span className="block mt-1">
                Agora faltam apenas alguns minutos para iniciarmos sua análise documental.
              </span>
            </p>
          </div>
          {displayName && (
            <p className="text-xs text-muted-foreground">
              {data.tipoPessoa === "PJ" ? "Empresa" : "Cadastro"}:{" "}
              <span className="font-medium text-foreground">{displayName}</span>
            </p>
          )}
        </header>

        <ProgressSection />

        {/* Próximos passos — destaque antes do scroll longo */}
        <section
          className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary-soft/60 to-card p-4 sm:p-5 shadow-soft"
          data-seo-speakable="next-steps"
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-1">
            Faltam apenas 2 passos para iniciar seu processo
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Você já fez a maior parte. Conclua agora e não perca o progresso.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-sm">📂</span>
                <p className="text-sm font-bold text-foreground">Passo 1 — Enviar documentação</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Envie os documentos solicitados para análise.
              </p>
              <p className="text-[11px] text-primary font-medium mt-2">Tempo estimado: 2 a 5 minutos</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-sm">💳</span>
                <p className="text-sm font-bold text-foreground">Passo 2 — Ativar sua licença</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Conclua a ativação da plataforma CADBRASIL.
              </p>
              <p className="text-[11px] text-primary font-medium mt-2">Tempo estimado: menos de 1 minuto</p>
            </div>
          </div>
        </section>

        {/* CTAs desktop — visíveis cedo no mobile via sticky também */}
        <div className="hidden md:block space-y-3">
          <ContinueCta data={data} />
          <PlatformTourDialog />
        </div>

        {/* O que acontece após */}
        <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-soft">
          <h2 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            O que acontece após a conclusão?
          </h2>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
            {REWARD_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                <Check className="h-4 w-4 shrink-0 text-success mt-0.5" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground border-t border-border/60 pt-3">
            Tempo médio para início da análise:{" "}
            <strong className="text-foreground">menos de 24 horas úteis</strong>.
          </p>
        </section>

        {/* Licença */}
        <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-soft">
          <h2 className="font-display text-base font-bold text-foreground mb-3">Sua licença inclui:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {LICENSE_BENEFITS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-foreground leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Segurança */}
        <section className="rounded-2xl border border-success/20 bg-success/5 p-4 sm:p-5">
          <h2 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-success" />
            Seus documentos estão protegidos
          </h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {SECURITY_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-foreground/90">
                <Lock className="h-3.5 w-3.5 text-success shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Seus documentos serão utilizados exclusivamente para análise e gestão cadastral.
          </p>
        </section>

        {/* Urgência leve */}
        <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3.5 sm:px-5">
          <p className="text-sm font-semibold text-foreground">
            Quanto antes concluir, mais rápido sua análise poderá começar
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Empresas que enviam sua documentação imediatamente costumam receber retorno mais rápido da equipe
            especializada.
          </p>
        </section>

        {/* Confiança */}
        <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-foreground leading-relaxed">
                Mais de <strong className="font-bold">2.500 empresas</strong> já utilizaram a plataforma CADBRASIL
                para auxiliar seus processos cadastrais.
              </p>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-muted-foreground ml-1">Atendimento especializado SICAF</span>
              </div>
            </div>
            <div className="shrink-0 text-center sm:text-right">
              <p className="font-display text-2xl font-extrabold text-foreground leading-none">
                15<span className="text-primary">+</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">anos de mercado</p>
            </div>
          </div>
        </section>

        {/* Acesso + protocolo */}
        <section className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3 space-y-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Acesso ao portal:</span> use o e-mail{" "}
            <span className="font-medium text-foreground">{data.emailAcesso}</span> e a senha definida no cadastro.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Protocolo</span>
            <code className="font-mono text-xs font-semibold text-foreground">{data.protocolo}</code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(data.protocolo);
                toast.success("Protocolo copiado!");
              }}
              className="rounded-md p-1 text-primary hover:bg-primary-soft transition-smooth"
              aria-label="Copiar protocolo"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        <div className="hidden md:block space-y-3 pt-1">
          <ContinueCta data={data} />
          <PlatformTourDialog />
        </div>

        <p className="text-center">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-smooth">
            Fazer novo cadastro
          </Link>
        </p>
      </div>

      {/* CTA fixo mobile */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-card/95 backdrop-blur-xl p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden shadow-elevated">
        <ContinueCta data={data} compact />
        <div className="mt-2">
          <PlatformTourDialog />
        </div>
      </div>
    </>
  );
}

function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 animate-fade-up">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
      <div className="text-center space-y-1.5">
        <h2 className="font-display text-lg font-bold text-foreground">Preparando sua área...</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Estamos carregando os dados do seu cadastro. Aguarde um instante.
        </p>
      </div>
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-16 animate-fade-up">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Protocolo não encontrado</h2>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      </div>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
}

export default function ConclusaoContent() {
  const searchParams = useSearchParams();
  const protocolo = searchParams.get("protocolo") || "";

  const [data, setData] = useState<CadastroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conversionFired, setConversionFired] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!protocolo) {
      setError("Nenhum protocolo informado na URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const controller = new AbortController();

    fetch(`/api/cadastro/${encodeURIComponent(protocolo)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Erro ao buscar dados.");
        setData(json as CadastroData);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message || "Não foi possível carregar os dados.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [protocolo, mounted]);

  useEffect(() => {
    if (data && !conversionFired) {
      trackConversion("cadastro_concluido", 985, {
        protocolo: data.protocolo,
        tipo_pessoa: data.tipoPessoa,
      });
      setConversionFired(true);
    }
  }, [data, conversionFired]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container max-w-3xl flex items-center justify-between h-14 sm:h-16 px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="font-display font-extrabold text-foreground text-sm sm:text-base tracking-tight">CADBRASIL</p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest">SICAF · Licitações</p>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-success shrink-0" />
            <span className="hidden sm:inline">Ambiente seguro</span>
            <span className="sm:hidden">Seguro</span>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="absolute inset-x-0 top-0 h-64 bg-grid opacity-40 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <div className="container max-w-3xl relative px-4 pt-6 sm:pt-10 pb-8">
          {loading ? (
            <LoadingView />
          ) : error ? (
            <ErrorView message={error} />
          ) : data ? (
            <SuccessView data={data} />
          ) : (
            <LoadingView />
          )}
        </div>
      </main>

      <footer className="border-t border-border/60 bg-card hidden md:block">
        <div className="container max-w-3xl py-5 px-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CADBRASIL · Todos os direitos reservados</p>
          <div className="flex items-center gap-1.5">
            <FileUp className="w-3.5 h-3.5" />
            <CreditCard className="w-3.5 h-3.5" />
            <span>Documentos e licença no portal oficial</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
