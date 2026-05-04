import { NextResponse } from "next/server";
import { pagamentoBodySchema } from "@/lib/validations/pagamento";
import { assertProtocoloCadastro } from "@/lib/pagamento-protocolo";
import {
  boletoExpireAt,
  buildBankingBilletCustomer,
  centsToBRLString,
  getEfiPay,
  getValorCents,
} from "@/lib/efipay";

export const dynamic = "force-dynamic";

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

  try {
    await assertProtocoloCadastro(data.protocolo);
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? (err as { code?: string }).code : "";
    if (code === "PROTOCOLO_NAO_ENCONTRADO") {
      return NextResponse.json(
        { success: false, error: "Protocolo não encontrado. Conclua o cadastro antes de pagar." },
        { status: 404 }
      );
    }
    console.error("[pagamento/boleto] DB", err);
    return NextResponse.json({ success: false, error: "Serviço temporariamente indisponível." }, { status: 503 });
  }

  const valorCents = getValorCents();
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
      return NextResponse.json({ success: false, error: "Resposta inválida da Efí." }, { status: 502 });
    }

    if (payload.refusal) {
      return NextResponse.json(
        { success: false, error: payload.refusal.reason || "Cobrança recusada." },
        { status: 400 }
      );
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
