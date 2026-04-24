# 🔧 Solução para Erro de Build - Rollup

## Problema
```
Error: Cannot find module @rollup/rollup-linux-x64-gnu
```

Este é um bug conhecido do npm com dependências opcionais do Rollup.

## ✅ Solução

Execute os seguintes comandos no servidor:

```bash
# 1. Remover node_modules e package-lock.json
rm -rf node_modules package-lock.json

# 2. Limpar cache do npm
npm cache clean --force

# 3. Reinstalar dependências
npm install

# 4. Tentar build novamente
npm run build
```

## 🔄 Alternativa (se ainda não funcionar)

Se o problema persistir, tente instalar explicitamente o pacote do Rollup:

```bash
# Remover e reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force

# Instalar dependências com flag para forçar instalação de opcionais
npm install --force

# Ou instalar explicitamente o rollup para Linux
npm install @rollup/rollup-linux-x64-gnu --save-optional

# Depois fazer o build
npm run build
```

## 📝 Nota

Se você estiver em um servidor Linux de arquitetura diferente (ARM, por exemplo), pode ser necessário:

```bash
# Para ARM64
npm install @rollup/rollup-linux-arm64-gnu --save-optional

# Para verificar a arquitetura do sistema
uname -m
```

## ✅ Verificação

Após resolver, verifique se a pasta `dist/` foi criada:

```bash
ls -la dist/
```
