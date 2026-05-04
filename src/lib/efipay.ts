import EfiPay from "sdk-node-apis-efi";
import type { PagamentoBody } from "@/lib/validations/pagamento";

export function getValorCents(): number {
  const v = Number(process.env.EFI_COBRANCA_VALOR_CENTS ?? "9900");
  if (!Number.isFinite(v) || v < 100) return 9900;
  return Math.round(v);
}

export function centsToBRLString(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function getEfiPay(): EfiPay {
  const client_id = process.env.EFI_CLIENT_ID?.trim();
  const client_secret = process.env.EFI_CLIENT_SECRET?.trim();
  const certificate = process.env.EFI_CERTIFICATE_BASE64?.trim();

  if (!client_id || !client_secret || !certificate) {
    const e = new Error("EFI_CONFIG_INCOMPLETA");
    (e as Error & { code?: string }).code = "EFI_CONFIG_INCOMPLETA";
    throw e;
  }

  const sandbox = process.env.EFI_SANDBOX === "true";

  return new EfiPay({
    sandbox,
    client_id,
    client_secret,
    certificate,
    cert_base64: true,
  });
}

export function getPixChave(): string {
  const chave = process.env.EFI_PIX_CHAVE?.trim();
  if (!chave) {
    const e = new Error("EFI_PIX_CHAVE_INDEFINIDA");
    (e as Error & { code?: string }).code = "EFI_PIX_CHAVE_INDEFINIDA";
    throw e;
  }
  return chave;
}

function onlyDigits(s: string): string {
  return s.replace(/\D/g, "");
}

/**
 * Formato exigido pela Efí para boleto:
 * - DDD (2 dígitos) + número com 8 ou 9 dígitos
 * - sem código do país (55)
 */
function normalizeEfiPhone(raw: string): string | null {
  let digits = onlyDigits(raw || "");
  if (!digits) return null;

  if (digits.startsWith("55") && digits.length >= 12) {
    digits = digits.slice(2);
  }

  // Se vier com algum prefixo extra, mantém os últimos 11/10 dígitos (DDD + número).
  if (digits.length > 11) {
    digits = digits.slice(-11);
  }

  if (/^[1-9]{2}9?[0-9]{8}$/.test(digits)) return digits;
  return null;
}

export function boletoExpireAt(): string {
  const days = Math.min(30, Math.max(1, Number(process.env.EFI_BOLETO_DIAS_VENCIMENTO ?? "3")));
  const d = new Date();
  d.setDate(d.getDate() + (Number.isFinite(days) ? days : 3));
  return d.toISOString().slice(0, 10);
}

export function buildBankingBilletCustomer(data: PagamentoBody) {
  const phone = normalizeEfiPhone(data.telefone);
  const zipcode = onlyDigits(data.cep);
  const address = {
    street: data.rua.trim(),
    number: data.numero.trim(),
    neighborhood: data.bairro.trim(),
    zipcode,
    city: data.cidade.trim(),
    state: data.estado.trim().toUpperCase(),
    ...(data.complemento?.trim() ? { complement: data.complemento.trim() } : {}),
  };

  if (data.tipoPessoa === "PJ") {
    return {
      email: data.email.trim().toLowerCase(),
      ...(phone ? { phone_number: phone } : {}),
      juridical_person: {
        corporate_name: (data.razaoSocial || "").trim(),
        cnpj: onlyDigits(data.cnpj || ""),
      },
      address,
    };
  }

  return {
    name: data.nomeResponsavel.trim(),
    cpf: onlyDigits(data.cpf || ""),
    email: data.email.trim().toLowerCase(),
    ...(phone ? { phone_number: phone } : {}),
    address,
  };
}

export function buildPixDevedor(data: PagamentoBody): { nome: string; cpf?: string; cnpj?: string } {
  if (data.tipoPessoa === "PJ") {
    return {
      nome: (data.razaoSocial || data.nomeResponsavel).trim().slice(0, 100),
      cnpj: onlyDigits(data.cnpj || ""),
    };
  }
  return {
    nome: data.nomeResponsavel.trim().slice(0, 100),
    cpf: onlyDigits(data.cpf || ""),
  };
}
