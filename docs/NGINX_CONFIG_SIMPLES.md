# Configuração Nginx Simplificada - Apenas Mudanças Necessárias

## ⚠️ IMPORTANTE
**NÃO modifique a seção SSL!** O painel não permite alterações nessa seção.

## ✅ O que você precisa mudar:

### 1. Mudar o `root` (linha ~4)
```nginx
# ANTES:
# root /www/wwwroot/cadbrasil.com/server/;

# DEPOIS:
root /www/wwwroot/cadbrasil.com/dist/;
```

### 2. Substituir o `location /` (linha ~60-70)
```nginx
# REMOVER este bloco:
# location / {
#     proxy_pass http://127.0.0.1:3013;
#     ...
# }

# ADICIONAR estes blocos ANTES do location / final:

# API - Proxy reverso APENAS para rotas /api
location /api {
        proxy_pass http://127.0.0.1:3013;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    proxy_connect_timeout 30s;
    proxy_read_timeout 86400s;
    proxy_send_timeout 30s;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}

# Health check do backend
location /health {
        proxy_pass http://127.0.0.1:3013;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

# Frontend - Servir arquivos estáticos (DEVE SER O ÚLTIMO location /)
location / {
    try_files $uri $uri/ /index.html;
}
```

## 📋 Configuração Completa (para referência)

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name cadbrasil.com;
    index index.html index.htm default.htm default.html;
    
    # MUDANÇA 1: Alterar root para dist/
    root /www/wwwroot/cadbrasil.com/dist/;
    
    #CERT-APPLY-CHECK--START
    include /www/server/panel/vhost/nginx/well-known/cadbrasilteste.conf;
    #CERT-APPLY-CHECK--END
    
    #SSL-START SSL related configuration
    # ⚠️ NÃO MODIFICAR NADA AQUI - MANTER EXATAMENTE COMO ESTÁ
    #HTTP_TO_HTTPS_START
    if ($server_port !~ 443){
        rewrite ^(/.*)$ https://$host$1 permanent;
    }
    #HTTP_TO_HTTPS_END
    ssl_certificate    /www/server/panel/vhost/cert/cadbrasilteste/fullchain.pem;
    ssl_certificate_key    /www/server/panel/vhost/cert/cadbrasilteste/privkey.pem;
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_tickets on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    add_header Strict-Transport-Security "max-age=31536000";
    error_page 497  https://$host$request_uri;
    #SSL-END
    
    #REWRITE-START Pseudo-static related configuration
    include /www/server/panel/vhost/rewrite/node_cadbrasilteste.conf;
    #REWRITE-END
    
    #Files or directories forbidden to access
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.svn|\.project|LICENSE|README.md|package.json|package-lock.json|\.env|node_modules) {
        return 404;
    }
    
    #One-click application for SSL certificate verification directory related settings
    location /.well-known/ {
        root  /www/wwwroot/cadbrasil.com/;
    }

    # MUDANÇA 2: Adicionar location /api (ANTES do location /)
    location /api {
        proxy_pass http://127.0.0.1:3013;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 30s;
        proxy_read_timeout 86400s;
        proxy_send_timeout 30s;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # MUDANÇA 3: Adicionar location /health
    location /health {
        proxy_pass http://127.0.0.1:3013;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # MUDANÇA 4: Substituir location / (DEVE SER O ÚLTIMO)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    access_log  /www/wwwlogs/cadbrasilteste.log;
    error_log  /www/wwwlogs/cadbrasilteste.error.log;
}
```

## 🎯 Passo a Passo no Painel

1. **Abra a configuração do nginx no painel**
2. **Localize a linha `root`** (geralmente linha 4-5)
   - Mude de `root /www/wwwroot/cadbrasil.com/server/;` 
   - Para: `root /www/wwwroot/cadbrasil.com/dist/;`

3. **Localize o bloco `location / {`** (geralmente no final, antes dos logs)
   - **REMOVA** o bloco que tem `proxy_pass http://127.0.0.1:3013;`
   - **ADICIONE** os 3 blocos novos (`location /api`, `location /health`, `location /`)

4. **NÃO toque em NADA na seção SSL** (entre `#SSL-START` e `#SSL-END`)

5. **Salve a configuração**

## ✅ Verificação

Após salvar:
```bash
# Testar configuração
nginx -t

# Se OK, recarregar
nginx -s reload
```
