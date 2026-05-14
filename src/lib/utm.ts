export interface UtmData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  gclid: string;
  gbraid: string;
  gad_source: string;
  gad_campaignid: string;
  msclkid: string;
  landing_page: string;
  referrer: string;
  captured_at: string;
}

declare global {
  interface Window {
    gtag?: (...args: [string, ...unknown[]]) => void;
    dataLayer?: Record<string, unknown>[];
    uetq?: (string | Record<string, unknown>)[];
  }
}

const STORAGE_KEY = "cadbrasil_utm";
const SESSION_ENGAGEMENT_KEY = "cadbrasil_ads_engagement_fired";

/** ID Google Ads (mesmo do `layout.tsx` — gtag config). */
const GOOGLE_ADS_AW_ID = "AW-16460586067";

function resolveEngagementSendTo(): string | undefined {
  const full = process.env.NEXT_PUBLIC_GADS_ENGAGEMENT_SEND_TO?.trim();
  if (full) return full;
  const label = process.env.NEXT_PUBLIC_GADS_ENGAGEMENT_LABEL?.trim();
  if (label) return `${GOOGLE_ADS_AW_ID}/${label}`;
  return undefined;
}

const TRACKING_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "gad_source",
  "gad_campaignid",
  "msclkid",
] as const;

/**
 * Captura parametros UTM da URL atual e persiste em sessionStorage + localStorage.
 * Deve ser chamado o mais cedo possivel (antes de qualquer navegação SPA).
 *
 * Heuristicas:
 *  - gclid/gad_source/gbraid sem utm_source → google/cpc
 *  - msclkid sem utm_source → bing/cpc
 *  - utm_campaign vazio → usa gad_campaignid como fallback
 */
export function captureUtmParams(): void {
  try {
    const fullUrl = window.location.href;
    const searchString = window.location.search;

    let params = new URLSearchParams(searchString);

    if (!params.has("utm_source") && !params.has("gclid") && !params.has("msclkid")) {
      const match = fullUrl.match(/[?&](utm_|gclid|msclkid)/);
      if (match) {
        const queryPart = fullUrl.substring(fullUrl.indexOf(match[0]));
        params = new URLSearchParams(queryPart.startsWith("?") ? queryPart : "?" + queryPart);
      }
    }

    const hasTracking = TRACKING_QUERY_KEYS.some((k) => params.has(k));
    if (!hasTracking) return;

    const hasGoogleAuto = params.has("gclid") || params.has("gad_source") || params.has("gbraid");
    const hasMsclk = params.has("msclkid");

    const utmData: UtmData = {
      utm_source: params.get("utm_source") || (hasGoogleAuto ? "google" : hasMsclk ? "bing" : ""),
      utm_medium: params.get("utm_medium") || (hasGoogleAuto || hasMsclk ? "cpc" : ""),
      utm_campaign: params.get("utm_campaign") || params.get("gad_campaignid") || "",
      utm_term: params.get("utm_term") || "",
      utm_content: params.get("utm_content") || "",
      gclid: params.get("gclid") || "",
      gbraid: params.get("gbraid") || "",
      gad_source: params.get("gad_source") || "",
      gad_campaignid: params.get("gad_campaignid") || "",
      msclkid: params.get("msclkid") || "",
      landing_page: window.location.pathname + window.location.search,
      referrer: document.referrer || "",
      captured_at: new Date().toISOString(),
    };

    const json = JSON.stringify(utmData);
    sessionStorage.setItem(STORAGE_KEY, json);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (e) {
    console.warn("[UTM] Erro ao capturar params:", e);
  }
}

export function getUtmParams(): UtmData | null {
  try {
    const fromSession = sessionStorage.getItem(STORAGE_KEY);
    if (fromSession) return JSON.parse(fromSession) as UtmData;
    const fromLocal = localStorage.getItem(STORAGE_KEY);
    if (fromLocal) return JSON.parse(fromLocal) as UtmData;
  } catch (e) {
    console.warn("[UTM] Erro ao ler params:", e);
  }
  return null;
}

export function getUtmForPayload(): Record<string, string> {
  const utm = getUtmParams();
  return {
    utm_source: utm?.utm_source || "",
    utm_medium: utm?.utm_medium || "",
    utm_campaign: utm?.utm_campaign || "",
    utm_term: utm?.utm_term || "",
    utm_content: utm?.utm_content || "",
    gclid: utm?.gclid || "",
    gbraid: utm?.gbraid || "",
    gad_source: utm?.gad_source || "",
    gad_campaignid: utm?.gad_campaignid || "",
    msclkid: utm?.msclkid || "",
    landing_page: utm?.landing_page || "",
    referrer: utm?.referrer || "",
  };
}

/**
 * Conversão Google Ads do tipo "Engagement" (evento gerado no Google Ads / Google tag).
 * Configure `NEXT_PUBLIC_GADS_ENGAGEMENT_SEND_TO` (ex.: AW-16460586067/AbCdEfGhIj) ou
 * só `NEXT_PUBLIC_GADS_ENGAGEMENT_LABEL` (sufixo após AW-16460586067/).
 *
 * Equivale a:
 *   gtag('event', 'ads_conversion_engagement', { send_to, ... })
 */
export function trackGoogleAdsEngagement(extraParams?: Record<string, unknown>): void {
  try {
    const utm = getUtmParams();
    const sendTo = resolveEngagementSendTo();

    const gtagParams: Record<string, unknown> = {
      ...(sendTo ? { send_to: sendTo } : {}),
      ...(utm?.utm_term && { keyword: utm.utm_term }),
      ...(utm?.utm_campaign && { campaign: utm.utm_campaign }),
      ...(utm?.utm_source && { source: utm.utm_source }),
      ...(utm?.gclid && { gclid: utm.gclid }),
      ...extraParams,
    };

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "ads_conversion_engagement", gtagParams);
    }

    if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: "ads_conversion_engagement",
        ...gtagParams,
      });
    }
  } catch (e) {
    console.warn("[Tracking] ads_conversion_engagement:", e);
  }
}

/** Dispara engagement uma vez por sessão de aba (sessionStorage), apenas se `NEXT_PUBLIC_GADS_ENGAGEMENT_AUTO=true`. */
export function scheduleGoogleAdsEngagementOncePerSession(): void {
  if (typeof window === "undefined") return;

  const auto =
    process.env.NEXT_PUBLIC_GADS_ENGAGEMENT_AUTO === "1" ||
    process.env.NEXT_PUBLIC_GADS_ENGAGEMENT_AUTO === "true";
  if (!auto) return;

  try {
    if (sessionStorage.getItem(SESSION_ENGAGEMENT_KEY)) return;
  } catch {
    return;
  }

  const delayMs = Number(process.env.NEXT_PUBLIC_GADS_ENGAGEMENT_DELAY_MS || 30000);
  const ms = Number.isFinite(delayMs) && delayMs >= 3000 ? delayMs : 30000;

  window.setTimeout(() => {
    try {
      if (sessionStorage.getItem(SESSION_ENGAGEMENT_KEY)) return;
      sessionStorage.setItem(SESSION_ENGAGEMENT_KEY, "1");
      trackGoogleAdsEngagement();
    } catch {
      /* ignore */
    }
  }, ms);
}

/**
 * Dispara evento de conversão simultaneamente para:
 *  1. Google Ads (gtag) → send_to: AW-16460586067 (constante no código)
 *  2. Google Tag Manager → dataLayer.push
 *  3. Microsoft Ads → uetq.push
 */
export function trackConversion(
  eventName: string,
  value?: number,
  extraParams?: Record<string, unknown>,
): void {
  try {
    const utm = getUtmParams();

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      const gtagParams: Record<string, unknown> = {
        send_to: GOOGLE_ADS_AW_ID,
        ...(value !== undefined && { value, currency: "BRL" }),
        ...(utm?.utm_term && { keyword: utm.utm_term }),
        ...(utm?.utm_campaign && { campaign: utm.utm_campaign }),
        ...(utm?.utm_source && { source: utm.utm_source }),
        ...(utm?.gclid && { gclid: utm.gclid }),
        ...extraParams,
      };
      window.gtag("event", eventName, gtagParams);
    }

    if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...(value !== undefined && { conversionValue: value, currency: "BRL" }),
        utmSource: utm?.utm_source || "",
        utmMedium: utm?.utm_medium || "",
        utmCampaign: utm?.utm_campaign || "",
        utmTerm: utm?.utm_term || "",
        utmContent: utm?.utm_content || "",
        gclid: utm?.gclid || "",
      });
    }

    if (typeof window !== "undefined" && Array.isArray(window.uetq)) {
      window.uetq.push("event", eventName, {
        revenue_value: value || 0,
        currency: "BRL",
      } as Record<string, unknown>);
    }
  } catch (e) {
    console.warn("[Tracking] Erro ao disparar evento:", e);
  }
}
