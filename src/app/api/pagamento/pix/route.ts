import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { pagamentoBodySchema } from "@/lib/validations/pagamento";
import { assertProtocoloCadastro } from "@/lib/pagamento-protocolo";
import { buildPixDevedor, centsToBRLString, getEfiPay, getPixChave, getValorCents } from "@/lib/efipay";

export const dynamic = "force-dynamic";

function parseEfiError(e: unknown): string {
  if (e && typeof e === "object") {
    const o = e as Record<string, unknown>;
    if (typeof o.error_description === "string") return o.error_description;
    if (typeof o.mensagem === "string") return String(o.mensagem);
    if (typeof o.message === "string") return o.message;
    const nome = o.nome as string | undefined;
    const mensagem = o.mensagem as string | undefined;
    if (nome && mensagem) return `${nome}: ${mensagem}`;
  }
  if (e instanceof Error) return e.message;
  return "Erro ao gerar PIX.";
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
    console.error("[pagamento/pix] DB", err);
    return NextResponse.json({ success: false, error: "Serviço temporariamente indisponível." }, { status: 503 });
  }

  const valorCents = getValorCents();
  const valorOriginal = centsToBRLString(valorCents);

  const pixExpiracao = Math.min(
    86400,
    Math.max(300, Number(process.env.EFI_PIX_EXPIRACAO_SEGUNDOS ?? "3600"))
  );

  try {
    const efipay = getEfiPay();
    const chave = getPixChave();
    const devedor = buildPixDevedor(data);

    const cob = await efipay.pixCreateImmediateCharge(
      {},
      {
        calendario: { expiracao: Number.isFinite(pixExpiracao) ? pixExpiracao : 3600 },
        devedor,
        valor: { original: valorOriginal },
        chave,
        solicitacaoPagador: `CADBRASIL ${data.protocolo}`,
        infoAdicionais: [{ nome: "protocolo", valor: data.protocolo.slice(0, 50) }],
      }
    );

    const pixCopiaECola = cob.pixCopiaECola;
    if (!pixCopiaECola) {
      return NextResponse.json({ success: false, error: "PIX gerado sem código copia e cola." }, { status: 502 });
    }

    const qr_code_base64 = await QRCode.toDataURL(pixCopiaECola, { margin: 2, width: 280 });

    return NextResponse.json({
      success: true,
      txid: cob.txid,
      pixCopiaECola,
      qr_code_base64,
      valor: valorOriginal,
      expiracao_segundos: cob.calendario?.expiracao ?? pixExpiracao,
    });
  } catch (e) {
    const code = e && typeof e === "object" && "code" in e ? String((e as { code?: string }).code) : "";
    if (code === "EFI_CONFIG_INCOMPLETA" || code === "EFI_PIX_CHAVE_INDEFINIDA") {
      return NextResponse.json(
        {
          success: false,
          error:
            code === "EFI_PIX_CHAVE_INDEFINIDA"
              ? "Chave PIX não configurada (EFI_PIX_CHAVE)."
              : "Pagamento não configurado no servidor (credenciais Efí).",
        },
        { status: 503 }
      );
    }
    console.error("[pagamento/pix]", e);
    return NextResponse.json({ success: false, error: parseEfiError(e) }, { status: 502 });
  }
}
