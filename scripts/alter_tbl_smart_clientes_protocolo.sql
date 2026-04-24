-- =============================================================================
-- Script de alteração: tbl_smart_clientes
-- Objetivo: Adicionar Protocolo CADBRASIL e Nome Fantasia para o fluxo de cadastro
-- Executar em ambiente de homologação antes de produção.
-- =============================================================================

-- USE sua_base;  -- substituir pelo nome da base

-- 1. Protocolo CADBRASIL (ex: CAD-XXXX-XXXX-XXXX) — gerado pelo backend
ALTER TABLE `tbl_smart_clientes`
  ADD COLUMN `ProtocoloCadbrasil` VARCHAR(20) DEFAULT NULL
  AFTER `ukId`;

-- 2. Nome Fantasia (formulário envia; tabela não possui)
ALTER TABLE `tbl_smart_clientes`
  ADD COLUMN `NomeFantasia` VARCHAR(200) DEFAULT NULL
  AFTER `RazaoSocial`;

-- 3. (Opcional) Índice para consulta por protocolo
-- ALTER TABLE `tbl_smart_clientes`
--   ADD UNIQUE KEY `uk_ProtocoloCadbrasil` (`ProtocoloCadbrasil`);

-- Verificar: DESCRIBE tbl_smart_clientes;
