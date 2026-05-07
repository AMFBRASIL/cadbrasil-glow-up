import { montarWhatsAppHref, WHATSAPP_MENSAGEM_PADRAO } from "@/lib/cadbrasil-atendimento";

export function WhatsAppFloatButton() {
  const href = montarWhatsAppHref(WHATSAPP_MENSAGEM_PADRAO);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com atendimento pelo WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevated transition-smooth hover:scale-105 hover:shadow-cta focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 md:bottom-7 md:right-7 md:h-16 md:w-16"
    >
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background opacity-0 shadow-card transition-smooth translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
        Atendimento Whatsapp
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-8 w-8 md:h-9 md:w-9"
        fill="currentColor"
      >
        <path d="M16.04 4C9.42 4 4.03 9.38 4.03 16c0 2.12.56 4.18 1.62 6L4 28l6.15-1.61A11.93 11.93 0 0 0 16.04 28C22.66 28 28 22.62 28 16S22.66 4 16.04 4Zm0 21.96c-1.86 0-3.68-.5-5.26-1.45l-.38-.23-3.65.96.98-3.55-.25-.37A9.91 9.91 0 0 1 6.07 16c0-5.49 4.48-9.96 9.98-9.96 5.47 0 9.91 4.47 9.91 9.96s-4.44 9.96-9.92 9.96Zm5.46-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      </svg>
      <span className="sr-only">Falar com atendimento pelo WhatsApp</span>
    </a>
  );
}
