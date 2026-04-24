# Configuração de Redirecionamentos Nginx - CADBRASIL

## 📋 Redirecionamentos 301 para URLs Antigas (PHP → React)

Adicione estas regras de redirecionamento **ANTES** do bloco `location /api` na configuração do Nginx.

## ✅ Configuração Completa

```nginx
server
{
    listen 80;
    listen 443 ssl http2;
    server_name cadbrasil.com.br;
    index index.html index.htm default.htm default.html;
    
    # IMPORTANTE: Pasta do frontend (build do React/Vite)
    root /www/wwwroot/cadbrasil.com.br/dist;
    
    #SSL-START SSL related configuration
    # ... (manter configuração SSL existente) ...
    #SSL-END
    
    #REWRITE-START Pseudo-static related configuration
    include /www/server/panel/vhost/rewrite/node_cadbrasil.conf;
    #REWRITE-END
    
    #Files or directories forbidden to access
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.svn|\.project|LICENSE|README.md|package.json|package-lock.json|\.env|node_modules) {
        return 404;
    }
    
    #One-click application for SSL certificate verification directory related settings
    location /.well-known/ {
        root  /www/wwwroot/cadbrasil.com.br/;
    }

    # ============================================
    # REDIRECIONAMENTOS 301 - URLs ANTIGAS (PHP)
    # ============================================
    # Adicione estas regras ANTES do location /api
    
    # Redirecionamentos simples para home
    rewrite ^/credenciamento/?$ / permanent;
    rewrite ^/leituraia/?$ / permanent;
    rewrite ^/consultoria/?$ / permanent;
    rewrite ^/servicos/?$ / permanent;
    rewrite ^/informativos/?$ / permanent;
    rewrite ^/artigo-sicaf/?$ / permanent;
    rewrite ^/artigo-licitacoes/?$ / permanent;
    rewrite ^/artigo-editais/?$ / permanent;
    rewrite ^/artigo-certidoes/?$ / permanent;
    rewrite ^/documentos/?$ / permanent;
    rewrite ^/transparencia/?$ / permanent;
    rewrite ^/blog/?$ / permanent;
    
    # Redirecionamentos específicos
    rewrite ^/sobre-cadbrasil-sicaf-comprasnet/?$ /quem-somos permanent;
    rewrite ^/servicos-cadbrasil-digital-sicaf-comprasnet/?$ / permanent;
    rewrite ^/category/blog/?$ / permanent;
    rewrite ^/sicaf-contato-cadbrasil-suporte-acesso/?$ /contato permanent;
    rewrite ^/sicaf-cadastro-unificado-de-fornecedores/?$ / permanent;
    rewrite ^/o-seguro-garantia-na-nova-lei-de-licitacoes/?$ / permanent;
    rewrite ^/tabela-de-precos-cadbrasil/?$ / permanent;
    rewrite ^/quem-pode-se-cadastrar-no-sicaf/?$ / permanent;
    rewrite ^/quais-sao-as-modalidades-de-licitacoes/?$ / permanent;
    rewrite ^/nova-lei-de-licitacoes-2024-entenda-as-propostas-e-mudancas/?$ / permanent;
    rewrite ^/como-participar-de-licitacoes-agora-com-a-nova-lei/?$ / permanent;
    rewrite ^/credenciamento-sicaf-digital/?$ / permanent;
    rewrite ^/como-se-cadastrar/?$ /cadastro permanent;
    rewrite ^/tag/seguro-licitacoes/?$ / permanent;
    rewrite ^/category/departments/?$ / permanent;
    rewrite ^/team/?$ / permanent;
    rewrite ^/category/negocios/?$ / permanent;
    rewrite ^/category/servicos-para-o-setor-publico/?$ / permanent;
    rewrite ^/o-sicaf-centralizacao-de-cadastro-e-habilitacao-de-fornecedores-para-licitacoes-publicas/?$ / permanent;
    rewrite ^/services/arts-culture/?$ / permanent;
    rewrite ^/shop/?$ / permanent;
    rewrite ^/category/licitacoes/?$ / permanent;
    rewrite ^/os-8-servicos-e-produtos-mais-vendidos-em-licitacao/?$ / permanent;
    rewrite ^/entenda-a-nova-lei-de-licitacoes-e-o-atestado-de-capacidade-tecnica/?$ / permanent;
    rewrite ^/entendendo-o-processo-de-licitacao-o-que-e-e-como-funciona/?$ / permanent;
    rewrite ^/prazos-de-validade-de-certidoes-para-licitacoes/?$ / permanent;
    rewrite ^/2024/?$ / permanent;
    rewrite ^/events/2023-09-11/?$ / permanent;
    rewrite ^/documentos\.html$ / permanent;
    rewrite ^/events/2023-04-18/?$ / permanent;
    rewrite ^/index\.html$ / permanent;
    rewrite ^/home/?$ / permanent;
    rewrite ^/events/2025-08-07/?$ / permanent;
    rewrite ^/events/category/festivals/list/?$ / permanent;
    rewrite ^/wp/govtpress/services-details/?$ / permanent;
    rewrite ^/tag/kit/?$ / permanent;
    rewrite ^/home-02/?$ / permanent;
    rewrite ^/checkout/?$ / permanent;
    
    # Redirecionamento genérico para qualquer URL não encontrada (404)
    # Isso será tratado pelo React Router, mas podemos adicionar aqui também
    # O React Router já trata isso com a página NotFound que redireciona para home

    # HTTP reverse proxy related settings begin >>>
    location ~ /purge(/.*) {
        proxy_cache_purge cache_one $host$request_uri$is_args$args;
    }

    # API Backend - Proxy reverso para Node.js (APENAS /api)
    location /api {
        proxy_pass http://127.0.0.1:3012;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header REMOTE-HOST $remote_addr;
        add_header X-Cache $upstream_cache_status;

        proxy_connect_timeout 30s;
        proxy_read_timeout 86400s;
        proxy_send_timeout 30s;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }
    # End of HTTP reverse proxy related settings <<<

    # Frontend - Servir arquivos estáticos do React/Vite
    location / {
        # Tentar servir arquivo, se não existir, servir index.html (SPA routing)
        try_files $uri $uri/ /index.html;
    }
    
    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    access_log  /www/wwwlogs/cadbrasil.log;
    error_log  /www/wwwlogs/cadbrasil.error.log;
}
```

## 📝 Como Aplicar

1. **Acesse o painel do servidor** (cPanel, Plesk, ou painel customizado)
2. **Abra a configuração do Nginx** para o domínio `cadbrasil.com.br`
3. **Localize a seção ANTES do `location /api`**
4. **Cole todas as regras de `rewrite`** listadas acima
5. **Salve a configuração**
6. **Teste a configuração:**
   ```bash
   nginx -t
   ```
7. **Se OK, recarregue o Nginx:**
   ```bash
   nginx -s reload
   # ou
   systemctl reload nginx
   ```

## ✅ Verificação

Após aplicar, teste alguns redirecionamentos:

```bash
# Testar redirecionamentos
curl -I https://cadbrasil.com.br/credenciamento
curl -I https://cadbrasil.com.br/quem-somos
curl -I https://cadbrasil.com.br/documentos.html
```

**Resposta esperada:** `HTTP/1.1 301 Moved Permanently` com `Location: https://cadbrasil.com.br/`

## 🎯 Benefícios

1. ✅ **SEO**: Redirecionamentos 301 preservam o ranking das páginas antigas
2. ✅ **Performance**: Redirecionamentos no nível do servidor são mais rápidos
3. ✅ **Compatibilidade**: Funciona mesmo se o JavaScript estiver desabilitado
4. ✅ **Fallback**: Se o React Router falhar, o Nginx ainda redireciona

## 📌 Notas Importantes

- **Ordem importa**: As regras de `rewrite` devem estar **ANTES** do `location /api`
- **301 vs 302**: Usamos `permanent` (301) para indicar que o redirecionamento é permanente
- **Regex**: Use `\.` para escapar pontos em URLs como `documentos.html`
- **Trailing slash**: As regras cobrem URLs com e sem barra final (`/?$`)

---

**Última atualização:** 26/01/2026
