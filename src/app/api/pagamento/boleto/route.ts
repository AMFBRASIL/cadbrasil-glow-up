import { NextResponse } from "next/server";
import { pagamentoBodySchema } from "@/lib/validations/pagamento";
import {
  dadosPagamentoParaInsert,
  ensureTaxaCadastroPortal,
  insertPagamentoGerencianetAguardando,
  marcarPagamentoGerencianetErro,
  marcarPagamentoGerencianetGeradoBoleto,
  resolveClienteSicafPorProtocolo,
  resolveValorCobrancaCentavos,
} from "@/lib/pagamento-registro";
import {
  boletoExpireAt,
  buildBankingBilletCustomer,
  centsToBRLString,
  getEfiPay,
} from "@/lib/efipay";

export const dynamic = "force-dynamic";

function expireDateOnly(expireAt: string | null | undefined): string | null {
  if (!expireAt || typeof expireAt !== "string") return null;
  const d = expireAt.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null;
}

function parseEfiError(e: unknown): string {
  if (e && typeof e === "object") {
    const o = e as Record<string, unknown>;
    if (typeof o.error_description === "string") return o.error_description;
    if (o.error_description && typeof o.error_description === "object") {
      const desc = o.error_description as Record<string, unknown>;
      const property = typeof desc.property === "string" ? desc.property : "";
      const message = typeof desc.message === "string" ? desc.message : "";
      if (property && message) return `${property}: ${message}`;
      if (message) return message;
    }
    if (typeof o.mensagem === "string") return String(o.mensagem);
    if (typeof o.message === "string") return o.message;
    const cause = o.cause as Record<string, unknown> | undefined;
    if (cause && typeof cause.error_description === "string") return cause.error_description;
    if (cause?.error_description && typeof cause.error_description === "object") {
      const desc = cause.error_description as Record<string, unknown>;
      const property = typeof desc.property === "string" ? desc.property : "";
      const message = typeof desc.message === "string" ? desc.message : "";
      if (property && message) return `${property}: ${message}`;
      if (message) return message;
    }
  }
  if (e instanceof Error) return e.message;
  return "Erro ao gerar boleto.";
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = pagamentoBodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || "Dados inválidos";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }

  const data = parsed.data;

  let persist:
    | { taxaId: number; pagamentoId: number; valorCentavos: number }
    | undefined;

  try {
    const valorCentavos = await resolveValorCobrancaCentavos();
    const resolved = await resolveClienteSicafPorProtocolo(data.protocolo);
    if (!resolved) {
      return NextResponse.json(
        { success: false, error: "Protocolo não encontrado. Conclua o cadastro antes de pagar." },
        { status: 404 }
      );
    }
    const snapForm = dadosPagamentoParaInsert(data);
    const taxaId = await ensureTaxaCadastroPortal({
      sicafId: resolved.sicafId,
      clienteId: resolved.clienteId,
      protocolo: data.protocolo,
      valorCentavos,
    });
    const dataVencimento = expireDateOnly(boletoExpireAt());
    const pagamentoId = await insertPagamentoGerencianetAguardando({
      clienteId: resolved.clienteId,
      taxaId,
      tipo: "boleto",
      valorCentavos,
      protocolo: data.protocolo,
      descricao: `Licença CADBRASIL / SICAF — ${data.protocolo}`,
      dataVencimento,
      clienteNome: snapForm.clienteNome,
      clienteDocumento: snapForm.clienteDocumento,
      clienteEmail: snapForm.clienteEmail,
    });
    persist = { taxaId, pagamentoId, valorCentavos };
  } catch (err) {
    console.error("[pagamento/boleto] DB preparação", err);
    return NextResponse.json({ success: false, error: "Serviço temporariamente indisponível." }, { status: 503 });
  }

  if (!persist) {
    return NextResponse.json({ success: false, error: "Serviço temporariamente indisponível." }, { status: 503 });
  }

  const valorCents = persist.valorCentavos;
  const notificationUrl = process.env.EFI_NOTIFICATION_URL?.trim();

  try {
    const efipay = getEfiPay();
    const customer = buildBankingBilletCustomer(data);

    const response = await efipay.createOneStepCharge(
      {},
      {
        items: [
          {
            name: "Taxa licença CADBRASIL / SICAF",
            value: valorCents,
            amount: 1,
          },
        ],
        metadata: {
          custom_id: data.protocolo,
          ...(notificationUrl ? { notification_url: notificationUrl } : {}),
        },
        payment: {
          banking_billet: {
            customer,
            expire_at: boletoExpireAt(),
            message: `CADBRASIL — Protocolo ${data.protocolo}`,
          },
        },
      }
    );

    const payload = response?.data;
    if (!payload) {
      await marcarPagamentoGerencianetErro(persist.pagamentoId, "Resposta inválida da Efí.");
      return NextResponse.json({ success: false, error: "Resposta inválida da Efí." }, { status: 502 });
    }

    if (payload.refusal) {
      await marcarPagamentoGerencianetErro(persist.pagamentoId, payload.refusal.reason || "Cobrança recusada.");
      return NextResponse.json(
        { success: false, error: payload.refusal.reason || "Cobrança recusada." },
        { status: 400 }
      );
    }

    try {
      await marcarPagamentoGerencianetGeradoBoleto({
        pagamentoId: persist.pagamentoId,
        taxaId: persist.taxaId,
        gnChargeId:
          typeof payload.charge_id === "number"
            ? payload.charge_id
            : typeof payload.charge_id === "string"
              ? Number(payload.charge_id) || null
              : null,
        barcode: payload.barcode ?? null,
        link: (payload.billet_link ?? payload.link) ?? null,
        pdf: payload.pdf?.charge ?? null,
        gnResponse: payload,
      });
    } catch (persistErr) {
      console.error("[pagamento/boleto] persistência pós-geração", persistErr);
    }

    return NextResponse.json({
      success: true,
      charge_id: payload.charge_id,
      barcode: payload.barcode ?? null,
      billet_link: payload.billet_link ?? payload.link ?? null,
      pdf_url: payload.pdf?.charge ?? null,
      expire_at: payload.expire_at ?? null,
      total: payload.total ?? valorCents,
      valor_formatado: centsToBRLString(payload.total ?? valorCents),
    });
  } catch (e) {
    try {
      if (persist) await marcarPagamentoGerencianetErro(persist.pagamentoId, parseEfiError(e));
    } catch {
      /* ignore */
    }
    const code = e && typeof e === "object" && "code" in e ? String((e as { code?: string }).code) : "";
    if (code === "EFI_CONFIG_INCOMPLETA") {
      return NextResponse.json(
        { success: false, error: "Pagamento não configurado no servidor (credenciais Efí)." },
        { status: 503 }
      );
    }
    console.error("[pagamento/boleto]", e);
    return NextResponse.json({ success: false, error: parseEfiError(e) }, { status: 502 });
  }
}
