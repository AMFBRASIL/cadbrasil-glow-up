/** Gera senha temporária forte (uso no servidor). */
export function gerarSenhaTemporaria(): string {
  const maiusculas = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const minusculas = "abcdefghijkmnpqrstuvwxyz";
  const numeros = "23456789";
  const especiais = "!@#$%&*";
  const todos = maiusculas + minusculas + numeros + especiais;
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  let senha = pick(maiusculas) + pick(minusculas) + pick(numeros) + pick(especiais);
  for (let i = 0; i < 8; i++) senha += pick(todos);
  return senha.split("").sort(() => Math.random() - 0.5).join("");
}
