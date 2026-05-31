/** Estimativa determinística para exibição motivacional (não é dado oficial de edital). */
export function estimateLicitacoesForSegment(segmento: string, cnpj = ""): number {
  const base = `${segmento.trim().toLowerCase()}|${cnpj.replace(/\D/g, "")}`;
  let hash = 0;
  for (let i = 0; i < base.length; i += 1) {
    hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
  }
  return 180 + (hash % 520);
}

export function formatLicitacoesCount(count: number): string {
  const rounded = Math.floor(count / 10) * 10;
  return `${rounded}+`;
}

export function shortenSegmentLabel(segmento: string, max = 72): string {
  const trimmed = segmento.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trim()}…`;
}
