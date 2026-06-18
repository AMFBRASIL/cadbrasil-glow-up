import { NextResponse } from "next/server";
import { fetchCnpjFromProvider, onlyDigitsCnpj } from "@/lib/cnpj-lookup";

export const dynamic = "force-dynamic";
/** CNPJ.ws pode levar >10s; evita corte da função na Vercel (default 10s). */
export const maxDuration = 30;

const STATUS_BY_CODE = {
  not_found: 404,
  unauthorized: 503,
  not_configured: 503,
  rate_limit: 429,
  timeout: 504,
  provider_error: 502,
} as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const digits = onlyDigitsCnpj(searchParams.get("cnpj") || "");

  if (digits.length !== 14) {
    return NextResponse.json({ ok: false, error: "CNPJ inválido" }, { status: 400 });
  }

  const result = await fetchCnpjFromProvider(digits);
  if (result.ok === false) {
    const status = STATUS_BY_CODE[result.code] ?? 502;
    return NextResponse.json({ ok: false, error: result.message, code: result.code }, { status });
  }

  return NextResponse.json({ ok: true, data: result.data });
}
