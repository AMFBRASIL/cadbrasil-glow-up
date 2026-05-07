/** Número do WhatsApp institucional (sem + ou espaços), formato wa.me */
export const WHATSAPP_ATENDIMENTO_NUMERO = "551121220202";

export const WHATSAPP_MENSAGEM_PADRAO = "Olá! Gostaria de falar com o atendimento da CADBRASIL.";

export function montarWhatsAppHref(texto: string): string {
  return `https://wa.me/${WHATSAPP_ATENDIMENTO_NUMERO}?text=${encodeURIComponent(texto)}`;
}
