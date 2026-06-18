"use server";

import { fetchCnpjFromProvider, onlyDigitsCnpj, type CnpjLookupResult } from "@/lib/cnpj-lookup";

export type CnpjLookupActionResult =
  | { ok: true; data: CnpjLookupResult }
  | { ok: false; error: string };

export async function lookupCnpjAction(cnpj: string): Promise<CnpjLookupActionResult> {
  const digits = onlyDigitsCnpj(cnpj);
  if (digits.length !== 14) {
    return { ok: false, error: "CNPJ inválido" };
  }

  try {
    const data = await fetchCnpjFromProvider(digits);
    if (!data) {
      return { ok: false, error: "CNPJ não localizado" };
    }
    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("CNPJ_WS_API_TOKEN")) {
      return { ok: false, error: "Serviço de consulta indisponível" };
    }
    return { ok: false, error: "Erro ao consultar CNPJ" };
  }
}
