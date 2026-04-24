-- =============================================================================
-- Script de Diagnóstico MySQL
-- Execute este script para verificar a configuração do usuário
-- =============================================================================

-- 1. Verificar TODOS os usuários com esse nome (pode ter múltiplos hosts)
SELECT 
    user, 
    host,
    plugin,
    authentication_string
FROM mysql.user 
WHERE user = 'u460638534_adm'
ORDER BY host;

-- 2. Verificar privilégios do usuário
SHOW GRANTS FOR 'u460638534_adm'@'%';

-- 3. Se o usuário não existir com '@%', você verá um erro
-- Nesse caso, execute o script fix_mysql_user_permissions.sql

-- =============================================================================
-- SOLUÇÃO RÁPIDA (execute se o usuário '@%' não existir):
-- =============================================================================

-- Opção A: Criar usuário para qualquer host
CREATE USER IF NOT EXISTS 'u460638534_adm'@'%' IDENTIFIED BY '3IoMI5r*Mu3#';
GRANT ALL PRIVILEGES ON u460638534_adm.* TO 'u460638534_adm'@'%';
FLUSH PRIVILEGES;

-- Opção B: Se o hosting não permite '%', adicione o IP específico
-- CREATE USER IF NOT EXISTS 'u460638534_adm'@'191.17.253.75' IDENTIFIED BY '3IoMI5r*Mu3#';
-- GRANT ALL PRIVILEGES ON u460638534_adm.* TO 'u460638534_adm'@'191.17.253.75';
-- FLUSH PRIVILEGES;

-- =============================================================================
-- Verificar novamente após criar
-- =============================================================================
SELECT user, host FROM mysql.user WHERE user = 'u460638534_adm';
