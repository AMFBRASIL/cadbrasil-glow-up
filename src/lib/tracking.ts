export type TrackingParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  gad_source?: string;
  gad_campaignid?: string;
  msclkid?: string;
  fbclid?: string;
  landing_page?: string;
  referrer?: string;
};

const TRACKING_STORAGE_KEY = "cadbrasil_tracking_params";

const TRACKING_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "gad_source",
  "gad_campaignid",
  "msclkid",
  "fbclid",
] as const;

function pickTrackingKeys(params: TrackingParams): Record<string, string | null> {
  return TRACKING_QUERY_KEYS.reduce<Record<string, string | null>>((acc, key) => {
    acc[key] = params[key] || null;
    return acc;
  }, {});
}

function logTrackingCapture(current: TrackingParams, stored: TrackingParams, merged: TrackingParams) {
  console.info("[cadbrasil][tracking] Parametros Google/Bing capturados da URL", pickTrackingKeys(current));
  console.info("[cadbrasil][tracking] Parametros Google/Bing salvos anteriormente", pickTrackingKeys(stored));
  console.info("[cadbrasil][tracking] Payload de tracking enviado no cadastro", {
    ...pickTrackingKeys(merged),
    landing_page: merged.landing_page || null,
    referrer: merged.referrer || null,
  });
}

function readStoredTracking(): TrackingParams {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(TRACKING_STORAGE_KEY) || window.sessionStorage.getItem(TRACKING_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function storeTracking(params: TrackingParams) {
  if (typeof window === "undefined" || Object.keys(params).length === 0) return;

  const serialized = JSON.stringify(params);
  try {
    window.localStorage.setItem(TRACKING_STORAGE_KEY, serialized);
    window.sessionStorage.setItem(TRACKING_STORAGE_KEY, serialized);
  } catch {
    // Storage can be blocked in private browsing; the current payload still carries the data.
  }
}

export function getTrackingParamsForPayload(): TrackingParams {
  if (typeof window === "undefined") return {};

  const url = new URL(window.location.href);
  const stored = readStoredTracking();
  const current: TrackingParams = {
    landing_page: `${url.pathname}${url.search}`,
    referrer: document.referrer || stored.referrer,
  };

  for (const key of TRACKING_QUERY_KEYS) {
    const value = url.searchParams.get(key);
    if (value && value.trim()) current[key] = value.trim();
  }

  if ((current.gclid || current.gbraid || current.wbraid || current.gad_source) && !current.utm_source && !stored.utm_source) {
    current.utm_source = "google";
  }
  if ((current.gclid || current.gbraid || current.wbraid || current.gad_source) && !current.utm_medium && !stored.utm_medium) {
    current.utm_medium = "cpc";
  }
  if (current.msclkid && !current.utm_source && !stored.utm_source) {
    current.utm_source = "bing";
  }
  if (current.msclkid && !current.utm_medium && !stored.utm_medium) {
    current.utm_medium = "cpc";
  }
  if (!current.utm_campaign && current.gad_campaignid) {
    current.utm_campaign = current.gad_campaignid;
  }

  const merged = { ...stored, ...current };
  storeTracking(merged);
  logTrackingCapture(current, stored, merged);
  return merged;
}
