-- =============================================================================
-- Script: create_usuario_tracking_google_ads.sql
-- Objetivo: Criar tabela de tracking de marketing/Google Ads para a nova plataforma
-- Observação: Não altera tabelas atuais; cria estrutura isolada para uso futuro.
-- =============================================================================

-- USE sua_base; -- substituir pelo nome da base quando for executar

CREATE TABLE IF NOT EXISTS usuarios_tracking_google_ads (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NULL,
  session_id VARCHAR(100) NULL,

  -- UTM padrão
  utm_source VARCHAR(255) NULL,
  utm_medium VARCHAR(255) NULL,
  utm_campaign VARCHAR(255) NULL,
  utm_term VARCHAR(500) NULL,
  utm_content VARCHAR(255) NULL,

  -- IDs Google Ads
  gclid VARCHAR(500) NULL,
  gbraid VARCHAR(500) NULL,
  gad_source VARCHAR(50) NULL,
  gad_campaignid VARCHAR(100) NULL,

  -- Contexto de origem
  landing_page VARCHAR(1000) NULL,
  referrer VARCHAR(1000) NULL,

  -- Controle temporal
  capturado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  convertido_em DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_usuarios_tracking_google_ads_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  INDEX idx_utga_usuario_id (usuario_id),
  INDEX idx_utga_session_id (session_id),
  INDEX idx_utga_capturado_em (capturado_em),
  INDEX idx_utga_gclid (gclid(191)),
  INDEX idx_utga_gbraid (gbraid(191)),
  INDEX idx_utga_utm_source_medium (utm_source, utm_medium),
  INDEX idx_utga_utm_campaign (utm_campaign),
  INDEX idx_utga_convertido_em (convertido_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exemplo de vínculo pós-cadastro:
-- UPDATE usuarios_tracking_google_ads
--    SET usuario_id = 123
--  WHERE session_id = 'sessao-abc-123' AND usuario_id IS NULL;
