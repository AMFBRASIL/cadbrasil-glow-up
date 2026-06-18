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

  const result = await fetchCnpjFromProvider(digits);
  if (result.ok === false) {
    return { ok: false, error: result.message };
  }
  return { ok: true, data: result.data };
}
