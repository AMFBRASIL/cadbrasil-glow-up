-- =============================================================================
-- Cadastro portal — ajustes de schema (idempotente via INFORMATION_SCHEMA)
-- Execute no banco da aplicação (ex.: cadbrasilsys), após SQL_SISTEMA_NOVO.SQL
-- =============================================================================

-- 1) Protocolo CADBRASIL em clientes (documento CADASTRO_PORTAL_FLUXO_E_TABELAS.md)
SET @db := DATABASE();
SET @sql := (
  SELECT IF(
    EXISTS(
      SELECT 1 FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'clientes' AND COLUMN_NAME = 'ProtocoloCadbrasil'
    ),
    'SELECT ''clientes.ProtocoloCadbrasil já existe'' AS msg',
    'ALTER TABLE clientes ADD COLUMN ProtocoloCadbrasil VARCHAR(32) NULL COMMENT ''Protocolo gerado no cadastro portal (SICAF-...)'' AFTER observacoes'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2) Google Ads campaign id em tracking_sessoes (payload utm / doc de tracking)
SET @sql := (
  SELECT IF(
    EXISTS(
      SELECT 1 FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'tracking_sessoes' AND COLUMN_NAME = 'gad_campaignid'
    ),
    'SELECT ''tracking_sessoes.gad_campaignid já existe'' AS msg',
    'ALTER TABLE tracking_sessoes ADD COLUMN gad_campaignid VARCHAR(100) NULL COMMENT ''Google Ads campaign id'' AFTER gad_source'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'alter_cadastro_portal.sql concluído.' AS resultado;
