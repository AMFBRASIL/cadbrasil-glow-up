-- =============================================================================
-- Script para corrigir permissões do usuário MySQL
-- Objetivo: Permitir conexão do usuário de qualquer host (%)
-- 
-- PROBLEMA: "Access denied for user 'u460638534_adm'@'191.17.253.75'"
-- SOLUÇÃO: Criar usuário com '@%' para aceitar conexões de qualquer IP
-- =============================================================================

-- IMPORTANTE: Execute este script como usuário root ou com privilégios GRANT
-- Execute via phpMyAdmin, MySQL Workbench, ou linha de comando MySQL

-- =============================================================================
-- PASSO 1: Verificar usuários existentes
-- =============================================================================
SELECT user, host FROM mysql.user WHERE user = 'u460638534_adm';

-- =============================================================================
-- PASSO 2: Remover usuário antigo se existir apenas para localhost/IP específico
-- (Opcional - descomente se necessário)
-- =============================================================================
-- DROP USER IF EXISTS 'u460638534_adm'@'localhost';
-- DROP USER IF EXISTS 'u460638534_adm'@'191.17.253.75';

-- =============================================================================
-- PASSO 3: Criar usuário para aceitar conexões de QUALQUER host (%)
-- =============================================================================
CREATE USER IF NOT EXISTS 'u460638534_adm'@'%' IDENTIFIED BY '3IoMI5r*Mu3#';

-- =============================================================================
-- PASSO 4: Conceder TODOS os privilégios no banco de dados
-- =============================================================================
GRANT ALL PRIVILEGES ON u460638534_adm.* TO 'u460638534_adm'@'%';

-- =============================================================================
-- PASSO 5: Aplicar as mudanças (OBRIGATÓRIO)
-- =============================================================================
FLUSH PRIVILEGES;

-- =============================================================================
-- PASSO 6: Verificar se foi criado corretamente
-- Deve mostrar pelo menos uma linha com host = '%'
-- =============================================================================
SELECT user, host FROM mysql.user WHERE user = 'u460638534_adm';

-- =============================================================================
-- ALTERNATIVA: Se o usuário já existe com '@%' mas a senha está errada
-- =============================================================================
-- ALTER USER 'u460638534_adm'@'%' IDENTIFIED BY '3IoMI5r*Mu3#';
-- FLUSH PRIVILEGES;

-- =============================================================================
-- NOTAS IMPORTANTES:
-- =============================================================================
-- 1. O símbolo '%' significa "qualquer host/IP"
-- 2. Se você tem acesso via cPanel, pode criar/editar o usuário pela interface:
--    - Acesse "Usuários MySQL" ou "Remote MySQL"
--    - Adicione o usuário com host '%' ou 'Any Host'
-- 3. Alguns hostings podem ter restrições de segurança que impedem '%'
--    - Nesse caso, você pode adicionar o IP específico: 'u460638534_adm'@'191.17.253.75'
-- 4. Após executar, teste a conexão novamente
-- =============================================================================
