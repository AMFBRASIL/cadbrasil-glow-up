"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  MessageCircle,
  QrCode,
  Receipt,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { montarWhatsAppHref } from "@/lib/cadbrasil-atendimento";
import { cn } from "@/lib/utils";

export type PagamentoTaxaDados = {
  protocolo: string;
  tipoPessoa: "PJ" | "PF";
  nomeResponsavel: string;
  razaoSocial?: string;
  cnpj?: string;
  cpf?: string;
  email: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dados: PagamentoTaxaDados | null;
};

type View = "menu" | "boleto-loading" | "boleto-result" | "pix-loading" | "pix-result";

type BoletoJson = {
  success?: boolean;
  error?: string;
  charge_id?: number;
  barcode?: string | null;
  billet_link?: string | null;
  pdf_url?: string | null;
  expire_at?: string | null;
  valor_formatado?: string;
};

type PixJson = {
  success?: boolean;
  error?: string;
  txid?: string;
  pixCopiaECola?: string;
  qr_code_base64?: string;
  valor?: string;
};

function valorHintLabel(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_COBRANCA_VALOR_CENTS?.trim();
  if (!raw) return undefined;
  const cents = Number(raw);
  if (!Number.isFinite(cents) || cents < 1) return undefined;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function portalFornecedorUrl(): string {
  const raw = process.env.NEXT_PUBLIC_PORTAL_URL?.trim();
  if (raw && raw.length > 0) return raw.replace(/\/$/, "");
  return "https://fornecedor.cadbrasil.com.br";
}

function whatsAppPagamentoHref(protocolo: string): string {
  const texto = `Olá! Meu protocolo é ${protocolo}. Preciso de ajuda com o pagamento da taxa da licença CADBRASIL.`;
  return montarWhatsAppHref(texto);
}

export function PagamentoTaxaDialog({ open, onOpenChange, dados }: Props) {
  const [view, setView] = useState<View>("menu");
  const [boleto, setBoleto] = useState<BoletoJson | null>(null);
  const [pix, setPix] = useState<PixJson | null>(null);

  useEffect(() => {
    if (!open) {
      setView("menu");
      setBoleto(null);
      setPix(null);
    }
  }, [open]);

  const payload = dados
    ? {
        protocolo: dados.protocolo,
        tipoPessoa: dados.tipoPessoa,
        nomeResponsavel: dados.nomeResponsavel,
        razaoSocial: dados.razaoSocial ?? "",
        cnpj: dados.cnpj ?? "",
        cpf: dados.cpf ?? "",
        email: dados.email,
        telefone: dados.telefone,
        rua: dados.rua,
        numero: dados.numero,
        complemento: dados.complemento ?? "",
        bairro: dados.bairro,
        cep: dados.cep,
        cidade: dados.cidade,
        estado: dados.estado,
      }
    : null;

  const gerarBoleto = async () => {
    if (!payload) return;
    setView("boleto-loading");
    setBoleto(null);
    try {
      const res = await fetch("/api/pagamento/boleto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as BoletoJson;
      if (!res.ok || !json.success) {
        toast.error(json.error || "Não foi possível gerar o boleto.");
        setView("menu");
        return;
      }
      setBoleto(json);
      setView("boleto-result");
      toast.success("Boleto gerado com sucesso.");
    } catch {
      toast.error("Erro de conexão ao gerar boleto.");
      setView("menu");
    }
  };

  const gerarPix = async () => {
    if (!payload) return;
    setView("pix-loading");
    setPix(null);
    try {
      const res = await fetch("/api/pagamento/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as PixJson;
      if (!res.ok || !json.success) {
        toast.error(json.error || "Não foi possível gerar o PIX.");
        setView("menu");
        return;
      }
      setPix(json);
      setView("pix-result");
      toast.success("PIX gerado. Escaneie ou copie o código.");
    } catch {
      toast.error("Erro de conexão ao gerar PIX.");
      setView("menu");
    }
  };

  const valorHint = valorHintLabel();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {view === "menu" ? "Pagamento da taxa" : view.includes("boleto") ? "Boleto bancário" : "PIX"}
          </DialogTitle>
          <DialogDescription className="text-left text-sm leading-relaxed">
            {view === "menu"
              ? "Taxa anual única da licença CADBRASIL na plataforma: você escolhe Boleto ou PIX e a cobrança é criada na hora para o seu protocolo."
              : null}
          </DialogDescription>
        </DialogHeader>

        {!dados ? (
          <p className="text-sm text-muted-foreground">Dados do cadastro indisponíveis.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs">
              <span className="font-semibold uppercase tracking-wide text-muted-foreground">Protocolo</span>
              <code className="font-mono font-medium text-foreground">{dados.protocolo}</code>
            </div>

            {view === "menu" && (
              <>
                <div className="rounded-xl border border-primary/20 bg-primary-soft/45 p-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <div>
                    <p className="font-semibold text-foreground">Taxa anual em valor único</p>
                    <p className="mt-1.5">
                      {valorHint ? (
                        <>
                          O valor de referência <strong className="text-foreground">{valorHint}</strong> corresponde à{" "}
                          <strong className="text-foreground">taxa anual única</strong> da sua licença na CADBRASIL (uma cobrança por período anual,
                          conforme contrato e regras da plataforma).
                        </>
                      ) : (
                        <>
                          Trata-se da <strong className="text-foreground">taxa anual única</strong> da licença. O valor exato será exibido ao gerar o
                          boleto ou o PIX abaixo.
                        </>
                      )}
                    </p>
                  </div>
                  <p>
                    A <strong className="text-foreground">geração do pagamento é imediata</strong>: ao escolher Boleto ou PIX, o sistema produz na hora
                    linha digitável, PDF ou código PIX para você quitar e seguir com documentação e atendimento no portal.
                  </p>
                  <div className="rounded-lg border border-border/80 bg-card/80 px-3 py-3 space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Suporte personalizado</p>
                    <ul className="space-y-2.5 text-xs leading-snug">
                      <li className="flex gap-2.5">
                        <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                        <span>
                          <a
                            href={whatsAppPagamentoHref(dados.protocolo)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary underline-offset-2 hover:underline"
                          >
                            WhatsApp
                          </a>
                          {" "}com seu protocolo já na mensagem para um atendimento direto.
                        </span>
                      </li>
                      <li className="flex gap-2.5">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                        <span>
                          Contato por <strong className="text-foreground">e-mail</strong> pela equipe (use o e-mail do seu cadastro e nossos retornos oficiais).
                        </span>
                      </li>
                      <li className="flex gap-2.5">
                        <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                        <span>
                          Abertura de <strong className="text-foreground">ticket</strong> no{" "}
                          <a
                            href={portalFornecedorUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary underline-offset-2 hover:underline"
                          >
                            portal do fornecedor
                          </a>
                          {" "}após o login, em Tickets/Suporte.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => void gerarBoleto()}
                    className={cn(
                      "flex flex-col rounded-2xl border-2 border-primary/25 bg-gradient-soft p-4 text-left shadow-soft transition-smooth",
                      "hover:border-primary/45 hover:shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                    )}
                  >
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-cta text-primary-foreground">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <span className="font-display font-bold text-foreground">Boleto</span>
                    <span className="mt-1 text-[11px] text-muted-foreground leading-snug">
                      Linha digitável e PDF para pagamento em qualquer banco.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void gerarPix()}
                    className={cn(
                      "flex flex-col rounded-2xl border border-border bg-card p-4 text-left shadow-soft transition-smooth",
                      "hover:border-primary/35 hover:shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
                    )}
                  >
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <QrCode className="h-4 w-4" />
                    </div>
                    <span className="font-display font-bold text-foreground">PIX</span>
                    <span className="mt-1 text-[11px] text-muted-foreground leading-snug">
                      QR Code e Pix Copia e Cola na hora.
                    </span>
                  </button>
                </div>

                <p className="flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  Cobrança gerada com segurança pela Efí (Gerencianet). Seu protocolo é conferido antes de emitir boleto ou PIX.
                </p>
              </>
            )}

            {(view === "boleto-loading" || view === "pix-loading") && (
              <div className="flex flex-col items-center justify-center gap-3 py-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {view === "boleto-loading" ? "Gerando boleto..." : "Gerando cobrança PIX..."}
                </p>
              </div>
            )}

            {view === "boleto-result" && boleto?.success && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  {boleto.valor_formatado ? (
                    <p className="text-sm">
                      Valor: <strong className="text-foreground">{boleto.valor_formatado}</strong>
                    </p>
                  ) : null}
                  {boleto.barcode ? (
                    <div>
                      <p className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">Linha digitável</p>
                      <p className="font-mono text-xs leading-relaxed break-all text-foreground bg-muted/40 rounded-lg p-3">
                        {boleto.barcode}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          void navigator.clipboard.writeText(boleto.barcode || "");
                          toast.success("Código copiado!");
                        }}
                      >
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        Copiar linha digitável
                      </Button>
                    </div>
                  ) : null}
                  {boleto.expire_at ? (
                    <p className="text-xs text-muted-foreground">Vencimento: {boleto.expire_at}</p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  {boleto.pdf_url ? (
                    <a
                      href={boleto.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-cta px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 transition-smooth"
                    >
                      Abrir PDF do boleto
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                  {boleto.billet_link ? (
                    <a
                      href={boleto.billet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary-soft transition-smooth"
                    >
                      Link do boleto
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>

                <Button type="button" variant="ghost" className="w-full" onClick={() => setView("menu")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Escolher outra forma
                </Button>
              </div>
            )}

            {view === "pix-result" && pix?.success && pix.pixCopiaECola && (
              <div className="space-y-4">
                {pix.valor ? (
                  <p className="text-sm text-center">
                    Valor: <strong className="text-foreground">R$ {pix.valor}</strong>
                  </p>
                ) : null}

                {pix.qr_code_base64 ? (
                  <div className="flex justify-center rounded-xl border border-border bg-white p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pix.qr_code_base64} alt="QR Code PIX" className="h-44 w-44 object-contain" />
                  </div>
                ) : null}

                <div>
                  <p className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">Pix Copia e Cola</p>
                  <p className="font-mono text-[10px] leading-relaxed break-all text-foreground bg-muted/40 rounded-lg p-3 max-h-28 overflow-y-auto">
                    {pix.pixCopiaECola}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full sm:w-auto"
                    onClick={() => {
                      void navigator.clipboard.writeText(pix.pixCopiaECola || "");
                      toast.success("PIX copiado!");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    Copiar código PIX
                  </Button>
                </div>

                {pix.txid ? (
                  <p className="text-[10px] text-muted-foreground text-center font-mono">txid: {pix.txid}</p>
                ) : null}

                <Button type="button" variant="ghost" className="w-full" onClick={() => setView("menu")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Escolher outra forma
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
