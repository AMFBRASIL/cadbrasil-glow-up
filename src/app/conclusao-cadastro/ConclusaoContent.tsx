"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  FileUp,
  Headphones,
  KeyRound,
  Lock,
  Loader2,
  ShieldCheck,
  Sparkles,
  Clock,
  Star,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { trackConversion } from "@/lib/utm";
import { PagamentoTaxaDialog, type PagamentoTaxaDados } from "@/components/PagamentoTaxaDialog";

const FORNECEDOR_PORTAL_URL = "https://fornecedor.cadbrasil.com.br";

const highlights = [
  { icon: Sparkles, title: "Atendimento especializado", desc: "Time dedicado a SICAF e licitações" },
  { icon: Clock, title: "Processo rápido", desc: "Cadastro em poucos minutos" },
  { icon: Headphones, title: "Suporte profissional", desc: "Consultoria humana e ágil" },
  { icon: Lock, title: "Dados seguros", desc: "Conformidade com a LGPD" },
];

const benefits = [
  "Especialistas em SICAF e licitações",
  "Suporte consultivo personalizado",
  "Atendimento ágil e prioritário",
  "Processo simplificado de ponta a ponta",
];

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

function SuccessCard({ data }: { data: CadastroData }) {
  const [pagamentoDialogOpen, setPagamentoDialogOpen] = useState(false);

  const pagamentoDados: PagamentoTaxaDados = {
    protocolo: data.protocolo,
    tipoPessoa: data.tipoPessoa,
    nomeResponsavel: data.nome,
    razaoSocial: data.tipoPessoa === "PJ" ? data.razaoSocial : undefined,
    cnpj: data.tipoPessoa === "PJ" ? data.documento : undefined,
    cpf: data.tipoPessoa === "PF" ? data.documento : undefined,
    email: data.email,
    telefone: data.telefone,
    rua: data.rua,
    numero: data.numero,
    complemento: data.complemento || undefined,
    bairro: data.bairro,
    cep: data.cep,
    cidade: data.cidade,
    estado: data.estado,
  };

  return (
    <>
      <div className="bg-card rounded-3xl shadow-elevated border border-border/60 p-6 md:p-8 animate-fade-up">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
            Cadastro enviado com sucesso
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg text-balance mb-5 leading-relaxed">
            Para agilizar: entre no portal,{" "}
            <strong className="font-semibold text-foreground">quite a taxa da licença</strong> e envie os documentos.
            Assim o processo já pode ser iniciado.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border bg-muted/25 px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Protocolo</span>
            <code className="font-mono text-xs md:text-sm font-semibold text-foreground tracking-tight">{data.protocolo}</code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(data.protocolo);
                toast.success("Protocolo copiado!");
              }}
              className="rounded-md p-1.5 text-primary hover:bg-primary-soft transition-smooth"
              aria-label="Copiar protocolo"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Guarde o protocolo para falar com o suporte, se precisar.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setPagamentoDialogOpen(true)}
            className="group flex flex-col rounded-2xl border-2 border-primary/25 bg-gradient-soft p-5 text-left shadow-soft transition-smooth hover:border-primary/45 hover:shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-cta text-primary-foreground shadow-soft">
              <CreditCard className="h-5 w-5" />
            </div>
            <p className="font-display text-base font-bold text-foreground">Pagar taxa da licença</p>
            <p className="mt-2 flex-1 text-xs text-muted-foreground leading-relaxed">
              Gere <strong className="font-medium text-foreground">boleto</strong> ou{" "}
              <strong className="font-medium text-foreground">PIX</strong> pela Efí (Gerencianet). O valor é cobrado para o protocolo do seu cadastro.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Boleto ou PIX — gerar cobrança
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>

          <a
            href={FORNECEDOR_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-border/80 bg-card p-5 text-left shadow-soft transition-smooth hover:border-primary/30 hover:shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <FileUp className="h-5 w-5" />
            </div>
            <p className="font-display text-base font-bold text-foreground">Enviar documentos</p>
            <p className="mt-2 flex-1 text-xs text-muted-foreground leading-relaxed">
              Envie a documentação solicitada pelo sistema no portal do fornecedor. Você pode fazer isso após o pagamento ou conforme as instruções na sua área logada.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Abrir portal — documentos
              <ExternalLink className="h-4 w-4 opacity-80 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>

        <div className="mt-5 flex items-start justify-center gap-2 rounded-xl border border-border/70 bg-muted/20 px-4 py-3 text-center sm:text-left">
          <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Acesso ao portal:</span> use o e-mail{" "}
            <span className="font-medium text-foreground">{data.emailAcesso}</span> e a senha definida no cadastro.
            <span className="hidden sm:inline"> </span>
            <span className="block sm:inline text-muted-foreground/90">
              Conexão segura · mesmo site para pagamento e envio de arquivos.
            </span>
          </p>
        </div>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center text-balance">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-success" />
          Pagamento via Efí · envio de documentos no portal oficial CADBRASIL
        </p>

        <div className="mt-5 flex justify-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-4 py-2 rounded-lg transition-smooth"
          >
            Fazer novo cadastro
          </Link>
        </div>
      </div>

      <PagamentoTaxaDialog
        open={pagamentoDialogOpen}
        onOpenChange={setPagamentoDialogOpen}
        dados={pagamentoDados}
      />
    </>
  );
}

function LoadingCard() {
  return (
    <div className="bg-card rounded-3xl shadow-elevated border border-border/60 p-6 md:p-8 animate-fade-up">
      <div className="flex flex-col items-center justify-center py-16 gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <div className="text-center space-y-1.5">
          <h2 className="font-display text-lg font-bold text-foreground">Processando informações...</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Estamos carregando os dados do seu cadastro. Aguarde um instante.
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="bg-card rounded-3xl shadow-elevated border border-destructive/30 p-6 md:p-8 animate-fade-up">
      <div className="flex flex-col items-center text-center gap-4 py-8">
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

  const rightContent = loading
    ? <LoadingCard />
    : error
      ? <ErrorCard message={error} />
      : data
        ? <SuccessCard data={data} />
        : <LoadingCard />;

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
            Conexão segura · Dados protegidos pela LGPD
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-grid opacity-50 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <section className="relative container max-w-7xl pt-10 md:pt-16 pb-16 md:pb-24">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-start">
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft border border-primary/10 text-xs font-semibold text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary-glow opacity-70 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-glow" />
                </span>
                Atendimento ativo agora
              </div>

              <div className="space-y-5">
                <h1 className="font-display font-extrabold text-foreground text-balance text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.05]">
                  Assistente Digital para Cadastramento no{" "}
                  <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    SICAF
                  </span>{" "}
                  e{" "}
                  <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    Comprasnet
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground text-balance max-w-xl leading-relaxed">
                  Cadastre sua empresa com a <strong className="text-foreground font-semibold">CADBRASIL</strong> e venda para o Governo Federal com segurança. Habilitação no{" "}
                  <strong className="text-foreground font-semibold">SICAF</strong>, suporte completo no{" "}
                  <strong className="text-foreground font-semibold">Comprasnet</strong> e participação em licitações públicas.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
                {highlights.map((h) => (
                  <div
                    key={h.title}
                    className="group flex items-start gap-3 p-4 rounded-2xl bg-card border border-border/70 shadow-soft hover:shadow-card hover:border-primary-glow/40 transition-smooth"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0 group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-smooth">
                      <h.icon className="w-[18px] h-[18px]" strokeWidth={2.2} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-tight">{h.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden lg:flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-full border-2 border-background bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-[10px] font-bold text-primary-foreground"
                      >
                        {["JM", "RS", "CL", "AP"][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">+2.500 empresas atendidas</p>
                  </div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <p className="text-2xl font-display font-extrabold text-foreground leading-none">
                    15<span className="text-primary-glow">+</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">anos de mercado</p>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-2xl overflow-hidden min-h-[280px]">
                <Image
                  src="/hero-bg.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover rounded-[2rem]"
                  aria-hidden
                  priority
                />
              </div>

              {rightContent}

              <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Seus dados são enviados com segurança e analisados por nossa equipe.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="container max-w-7xl py-14 md:py-20 relative">
            <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 items-center">
              <div className="text-primary-foreground space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Por que CADBRASIL</p>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl text-balance leading-tight">
                  Solidez institucional. Agilidade de uma plataforma moderna.
                </h2>
                <p className="text-primary-foreground/80 max-w-md">
                  Há mais de uma década ajudando empresas a vencer licitações com processos claros, suporte humano e tecnologia.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((b) => (
                  <div
                    key={b}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary-glow shrink-0" />
                    <p className="text-sm font-medium text-primary-foreground">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container max-w-7xl py-12">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, t: "Segurança em primeiro lugar", d: "Criptografia em trânsito e conformidade total com a LGPD." },
              { icon: Headphones, t: "Atendimento humano", d: "Especialistas reais conduzem seu processo do início ao fim." },
              { icon: FileCheck, t: "Autoridade no SICAF", d: "Anos de experiência com cadastros, recursos e atualizações." },
            ].map((c) => (
              <div key={c.t} className="p-6 rounded-2xl bg-card border border-border/70 shadow-soft">
                <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-3">
                  <c.icon className="w-5 h-5" />
                </div>
                <p className="font-display font-bold text-foreground">{c.t}</p>
                <p className="text-sm text-muted-foreground mt-1">{c.d}</p>
              </div>
            ))}
          </div>
        </section>
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
