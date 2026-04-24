# Como Resolver o Erro de Acesso ao MySQL

## Erro
```
Access denied for user 'u460638534_adm'@'191.17.253.75' (using password: YES)
```

## Causa
O usuário MySQL foi criado apenas para um host específico (ex: `localhost`) e não tem permissão para conectar de outros IPs. Mesmo que o banco esteja "liberado geral %", o **usuário** precisa ter permissão para conectar de qualquer IP.

## ⚠️ IMPORTANTE
- **Banco liberado** ≠ **Usuário com permissão**
- O usuário precisa existir com `@'%'` (qualquer host) ou `@'191.17.253.75'` (IP específico)
- Execute os comandos SQL como usuário **root** ou com privilégios **GRANT**

## Diagnóstico

**Primeiro, execute o script de diagnóstico** para verificar a situação atual:

1. Abra `diagnostico_mysql.sql`
2. Execute no phpMyAdmin ou MySQL Workbench
3. Verifique se o usuário existe com `host = '%'`

## Solução

### Opção 1: Via SQL (Recomendado)

Execute o script `fix_mysql_user_permissions.sql` no seu banco MySQL:

1. **Acesse o phpMyAdmin** ou MySQL Workbench
2. **Execute no banco `mysql`** (banco de sistema, não no banco de dados da aplicação)
3. **Execute os comandos** do script:

```sql
-- Criar usuário para qualquer host
CREATE USER IF NOT EXISTS 'u460638534_adm'@'%' IDENTIFIED BY '3IoMI5r*Mu3#';

-- Conceder privilégios
GRANT ALL PRIVILEGES ON u460638534_adm.* TO 'u460638534_adm'@'%';

-- Aplicar mudanças
FLUSH PRIVILEGES;
```

### Opção 2: Via cPanel / Painel de Controle

1. Acesse **"Usuários MySQL"** ou **"Remote MySQL"**
2. Edite o usuário `u460638534_adm`
3. Altere o **Host** de `localhost` para `%` (qualquer host)
4. Salve as alterações

### Opção 3: Adicionar IP Específico

Se o hosting não permite `%`, adicione o IP específico:

```sql
CREATE USER IF NOT EXISTS 'u460638534_adm'@'191.17.253.75' IDENTIFIED BY '3IoMI5r*Mu3#';
GRANT ALL PRIVILEGES ON u460638534_adm.* TO 'u460638534_adm'@'191.17.253.75';
FLUSH PRIVILEGES;
```

## Verificação

Após executar, verifique se o usuário foi criado:

```sql
SELECT user, host FROM mysql.user WHERE user = 'u460638534_adm';
```

Deve retornar pelo menos uma linha com `host = '%'` ou o IP específico.

## Teste

1. **Reinicie o servidor Node.js**
2. **Acesse** `http://localhost:3013/health` — deve mostrar `"database": "connected"`
3. **Tente fazer um cadastro** novamente

## ⚠️ Se ainda não funcionar

Alguns hostings (como Hostinger) podem ter restrições adicionais:

1. **Verifique no painel de controle** se há "Remote MySQL" ou "Acesso Remoto MySQL"
2. **Adicione o IP** `191.17.253.75` na lista de IPs permitidos
3. **Verifique firewall** do servidor MySQL
4. **Contate o suporte** do hosting se necessário

## Scripts Disponíveis

- `diagnostico_mysql.sql` - Verifica a configuração atual
- `fix_mysql_user_permissions.sql` - Corrige as permissões do usuário
