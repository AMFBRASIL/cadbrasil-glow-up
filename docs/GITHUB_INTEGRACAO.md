# Integrar o projeto ao GitHub

Siga estes passos para conectar o **cadbrasil** a um repositório no GitHub.

---

## 1. Criar o repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login.
2. Clique em **"New repository"** (ou **+** → **New repository**).
3. Preencha:
   - **Repository name:** `cadbrasil` (ou o nome que preferir).
   - **Visibility:** Private ou Public.
   - **Não** marque "Add a README" (o projeto já tem arquivos).
4. Clique em **"Create repository"**.

---

## 2. No seu computador (pasta do projeto)

Abra o terminal na pasta raiz do projeto (onde está o `package.json`).

### Se ainda **não** tiver Git inicializado

```bash
git init
git add .
git commit -m "Initial commit - CADBRASIL frontend e backend"
```

### Se **já** tiver Git (já fez `git init` antes)

```bash
git status
# Se houver alterações não commitadas:
git add .
git commit -m "Preparar integração com GitHub"
```

### Conectar ao repositório remoto

Substitua `SEU_USUARIO` e `cadbrasil` pelo seu usuário/organização e nome do repositório:

```bash
git remote add origin https://github.com/SEU_USUARIO/cadbrasil.git
```

Ou com SSH (se você configurou chave SSH no GitHub):

```bash
git remote add origin git@github.com:SEU_USUARIO/cadbrasil.git
```

### Enviar o código

```bash
git branch -M main
git push -u origin main
```

---

## 3. O que **não** vai para o GitHub (já está no .gitignore)

- `node_modules/`
- `server/node_modules/`
- `.env`, `.env.development`, `.env.production`, `server/.env`
- `dist/`
- Certificados `*.p12`
- Logs e arquivos temporários

Assim, senhas, tokens e certificados ficam apenas na sua máquina e no servidor de produção.

---

## 4. Depois da integração

- **Clonar em outro lugar:**  
  `git clone https://github.com/SEU_USUARIO/cadbrasil.git`
- **Criar .env:**  
  Copie `server/.env.example` para `server/.env` e preencha com os valores corretos (nunca commite o `.env`).
- **CI no GitHub:**  
  Foi adicionado um workflow em `.github/workflows/ci.yml` que roda **lint** e **build** do frontend a cada push (opcional; você pode desativar em **Actions** no GitHub).

---

## 5. Resumo dos comandos (copiar e colar)

Substitua `SEU_USUARIO` e, se precisar, o nome do repositório:

```bash
cd d:\Projeto-NODE\cadbrasil

git init
git add .
git commit -m "Initial commit - CADBRASIL"

git remote add origin https://github.com/SEU_USUARIO/cadbrasil.git
git branch -M main
git push -u origin main
```

Se o Git já existia e o `origin` já estava configurado, use apenas:

```bash
git add .
git commit -m "Integração GitHub"
git push -u origin main
```
