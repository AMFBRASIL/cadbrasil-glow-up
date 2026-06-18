import { NextResponse } from "next/server";
import { fetchCnpjFromProvider, onlyDigitsCnpj } from "@/lib/cnpj-lookup";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const digits = onlyDigitsCnpj(searchParams.get("cnpj") || "");

  if (digits.length !== 14) {
    return NextResponse.json({ ok: false, error: "CNPJ inválido" }, { status: 400 });
  }

  try {
    const data = await fetchCnpjFromProvider(digits);
    if (!data) {
      return NextResponse.json({ ok: false, error: "CNPJ não localizado" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("CNPJ_WS_API_TOKEN")) {
      return NextResponse.json({ ok: false, error: "Serviço de consulta indisponível" }, { status: 503 });
    }
    if (err instanceof Error && err.name === "TimeoutError") {
      return NextResponse.json({ ok: false, error: "Consulta CNPJ expirou. Tente novamente." }, { status: 504 });
    }
    console.error("[cnpj/lookup]", err);
    return NextResponse.json({ ok: false, error: "Erro ao consultar CNPJ" }, { status: 502 });
  }
}
