import type { CnpjLookupResult } from "@/lib/cnpj-lookup";

export type CnpjLookupClientResult =
  | { ok: true; data: CnpjLookupResult }
  | { ok: false; error: string; code?: string };

export async function lookupCnpjClient(cnpjDigits: string): Promise<CnpjLookupClientResult> {
  const res = await fetch(`/api/cnpj/lookup?cnpj=${encodeURIComponent(cnpjDigits)}`, {
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as CnpjLookupClientResult;
  if (!json || typeof json !== "object" || !("ok" in json)) {
    return {
      ok: false,
      error: "Consulta CNPJ indisponível no momento. Tente novamente.",
      code: "invalid_response",
    };
  }
  return json;
}
