-- ============================================================
-- CADBRASIL - Script MySQL Completo
-- Sistema de Gestão de Licitações e Documentos Governamentais
-- Gerado em: 2026-02-11
-- ============================================================
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = 'utf8mb4_unicode_ci';

SET FOREIGN_KEY_CHECKS = 0;

-- ===========================================
-- LIMPAR TODAS AS TABELAS (ordem inversa de dependência)
-- ===========================================

-- Módulo: Tracking Google Ads
DROP TABLE IF EXISTS tracking_eventos;
DROP TABLE IF EXISTS tracking_sessoes;

-- Módulo: Auditoria / Sistema
DROP TABLE IF EXISTS licitacao_documentos_exigidos;
DROP TABLE IF EXISTS pastas_documentos;
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS usuario_creditos_ia;
DROP TABLE IF EXISTS pacotes_leitura_ia;
DROP TABLE IF EXISTS templates_email;
DROP TABLE IF EXISTS configuracoes_sistema;

-- Módulo: Concorrência / Resultados
DROP TABLE IF EXISTS resultados_licitacao;
DROP TABLE IF EXISTS concorrentes;

-- Módulo: Análise de Edital
DROP TABLE IF EXISTS analise_cronograma;
DROP TABLE IF EXISTS analise_requisitos_habilitacao;
DROP TABLE IF EXISTS analise_pontos_atencao;
DROP TABLE IF EXISTS analise_documentos_exigidos;
DROP TABLE IF EXISTS analises_edital;

-- Módulo: Alertas / Notificações
DROP TABLE IF EXISTS configuracoes_notificacao;
DROP TABLE IF EXISTS alertas;

-- Módulo: Tickets / Suporte
DROP TABLE IF EXISTS ticket_mensagens;
DROP TABLE IF EXISTS tickets;

-- Módulo: Pagamentos Gerencianet (centralizado)
DROP TABLE IF EXISTS pagamentos_gerencianet;

-- Módulo: Taxas SICAF
DROP TABLE IF EXISTS taxas_sicaf;

-- Módulo: Renovações
DROP TABLE IF EXISTS manutencao_renovacoes;
DROP TABLE IF EXISTS sicaf_renovacoes;

-- Módulo: Manutenções
DROP TABLE IF EXISTS manutencao_boletos;
DROP TABLE IF EXISTS manutencoes;

-- Módulo: Propostas / Workflow
DROP TABLE IF EXISTS workflow_aprovacao;
DROP TABLE IF EXISTS propostas;

-- Módulo: Documentos
DROP TABLE IF EXISTS documentos;

-- Módulo: Certidões
DROP TABLE IF EXISTS certidoes;
DROP TABLE IF EXISTS tipo_certidoes;

-- Módulo: SICAF
DROP TABLE IF EXISTS sicaf_niveis;
DROP TABLE IF EXISTS sicaf_cadastros;

-- Módulo: Clientes
DROP TABLE IF EXISTS cliente_contatos;
DROP TABLE IF EXISTS clientes;

-- Módulo: Menus / Permissões / Usuários
DROP TABLE IF EXISTS menus;
DROP TABLE IF EXISTS permissoes_pagina;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS perfis_acesso;

-- Módulo: Licitações (tabelas com backticks)
DROP TABLE IF EXISTS coleta_logs;
DROP TABLE IF EXISTS atas_registro_preco;
DROP TABLE IF EXISTS contratos;
DROP TABLE IF EXISTS fornecedores_licitacao;
DROP TABLE IF EXISTS fornecedores;
DROP TABLE IF EXISTS itens_licitacao;
DROP TABLE IF EXISTS licitacoes;
DROP TABLE IF EXISTS uasgs;
DROP TABLE IF EXISTS orgaos;

-- ===========================================
-- 1. ÓRGÃOS PÚBLICOS
-- ===========================================
CREATE TABLE `orgaos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(50) NOT NULL,
  `nome` VARCHAR(500) NOT NULL,
  `sigla` VARCHAR(50) DEFAULT NULL,
  `esfera` VARCHAR(20) DEFAULT NULL COMMENT 'federal, estadual, municipal',
  `uf` VARCHAR(2) DEFAULT NULL,
  `municipio` VARCHAR(200) DEFAULT NULL,
  `cnpj` VARCHAR(20) DEFAULT NULL,
  `poder` VARCHAR(50) DEFAULT NULL,
  `tipo_administracao` VARCHAR(100) DEFAULT NULL,
  `endereco` TEXT DEFAULT NULL,
  `telefone` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(200) DEFAULT NULL,
  `site` VARCHAR(500) DEFAULT NULL,
  `origem` VARCHAR(50) NOT NULL DEFAULT 'compras_gov',
  `ativo` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_orgaos_codigo_origem` (`codigo`, `origem`),
  INDEX `idx_orgaos_nome` (`nome`(100)),
  INDEX `idx_orgaos_cnpj` (`cnpj`),
  INDEX `idx_orgaos_uf` (`uf`),
  INDEX `idx_orgaos_esfera` (`esfera`),
  FULLTEXT INDEX `ft_orgaos_nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 2. UASGs
-- ===========================================
CREATE TABLE `uasgs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo_uasg` VARCHAR(20) NOT NULL,
  `nome` VARCHAR(500) NOT NULL,
  `nome_resumido` VARCHAR(200) DEFAULT NULL,
  `orgao_id` INT UNSIGNED DEFAULT NULL,
  `cnpj` VARCHAR(20) DEFAULT NULL,
  `uf` VARCHAR(2) DEFAULT NULL,
  `municipio` VARCHAR(200) DEFAULT NULL,
  `cep` VARCHAR(10) DEFAULT NULL,
  `endereco` TEXT DEFAULT NULL,
  `telefone` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(200) DEFAULT NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `origem` VARCHAR(50) NOT NULL DEFAULT 'compras_gov',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_uasgs_codigo` (`codigo_uasg`),
  INDEX `idx_uasgs_nome` (`nome`(100)),
  INDEX `idx_uasgs_uf` (`uf`),
  INDEX `idx_uasgs_orgao` (`orgao_id`),
  CONSTRAINT `fk_uasgs_orgao` FOREIGN KEY (`orgao_id`) REFERENCES `orgaos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 3. LICITAÇÕES (Modelo Unificado)
-- ===========================================
CREATE TABLE `licitacoes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  /* Identificação */
  `numero_processo` VARCHAR(100) NOT NULL,
  `numero_controle_pncp` VARCHAR(100) DEFAULT NULL,
  `id_externo` VARCHAR(200) DEFAULT NULL COMMENT 'ID original na fonte',
  /* Classificação */
  `origem` VARCHAR(50) NOT NULL COMMENT 'compras_gov | pncp',
  `lei` VARCHAR(20) DEFAULT NULL COMMENT '8666 | 14133',
  `modalidade` VARCHAR(100) DEFAULT NULL,
  `modo_disputa` VARCHAR(100) DEFAULT NULL,
  `tipo` VARCHAR(100) DEFAULT NULL,
  `criterio_julgamento` VARCHAR(200) DEFAULT NULL,
  `amparo_legal` VARCHAR(200) DEFAULT NULL,
  /* Órgão */
  `orgao_id` INT UNSIGNED DEFAULT NULL,
  `uasg_id` INT UNSIGNED DEFAULT NULL,
  `codigo_orgao` VARCHAR(50) DEFAULT NULL,
  `nome_orgao` VARCHAR(500) DEFAULT NULL,
  `codigo_uasg` VARCHAR(20) DEFAULT NULL,
  `nome_uasg` VARCHAR(500) DEFAULT NULL,
  `uf` VARCHAR(2) DEFAULT NULL,
  `municipio` VARCHAR(200) DEFAULT NULL,
  `esfera` VARCHAR(20) DEFAULT NULL,
  /* Objeto */
  `objeto` TEXT DEFAULT NULL,
  `objeto_resumido` TEXT DEFAULT NULL,
  `informacoes_complementares` TEXT DEFAULT NULL,
  /* Datas */
  `data_publicacao` DATETIME DEFAULT NULL,
  `data_abertura` DATETIME DEFAULT NULL,
  `data_encerramento` DATETIME DEFAULT NULL,
  `data_resultado` DATETIME DEFAULT NULL,
  `data_homologacao` DATETIME DEFAULT NULL,
  /* Valores */
  `valor_estimado` DECIMAL(18,2) DEFAULT NULL,
  `valor_homologado` DECIMAL(18,2) DEFAULT NULL,
  `valor_total_itens` DECIMAL(18,2) DEFAULT NULL,
  /* Status */
  `status` VARCHAR(100) DEFAULT NULL,
  `situacao` VARCHAR(200) DEFAULT NULL,
  /* SRP */
  `srp` TINYINT(1) DEFAULT 0 COMMENT 'Sistema de Registro de Preços',
  /* Links */
  `link_edital` VARCHAR(1000) DEFAULT NULL,
  `link_portal` VARCHAR(1000) DEFAULT NULL,
  /* Metadados */
  `dados_originais` JSON DEFAULT NULL COMMENT 'JSON bruto da fonte',
  `coletado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_fonte_em` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_lic_processo` (`numero_processo`),
  INDEX `idx_lic_pncp` (`numero_controle_pncp`),
  INDEX `idx_lic_externo` (`id_externo`),
  INDEX `idx_lic_origem` (`origem`),
  INDEX `idx_lic_lei` (`lei`),
  INDEX `idx_lic_modalidade` (`modalidade`),
  INDEX `idx_lic_orgao` (`orgao_id`),
  INDEX `idx_lic_uasg_id` (`uasg_id`),
  INDEX `idx_lic_uasg` (`codigo_uasg`),
  INDEX `idx_lic_orgao_cod` (`codigo_orgao`),
  INDEX `idx_lic_uf` (`uf`),
  INDEX `idx_lic_esfera` (`esfera`),
  INDEX `idx_lic_status` (`status`),
  INDEX `idx_lic_pub` (`data_publicacao`),
  INDEX `idx_lic_abertura` (`data_abertura`),
  INDEX `idx_lic_srp` (`srp`),
  INDEX `idx_lic_origem_ext` (`origem`, `id_externo`),
  INDEX `idx_lic_uasg_proc` (`codigo_uasg`, `numero_processo`),
  FULLTEXT INDEX `ft_licitacoes_objeto` (`objeto`, `objeto_resumido`),
  CONSTRAINT `fk_licitacoes_orgao` FOREIGN KEY (`orgao_id`) REFERENCES `orgaos` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_licitacoes_uasg` FOREIGN KEY (`uasg_id`) REFERENCES `uasgs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 4. ITENS DE LICITAÇÃO
-- ===========================================
CREATE TABLE `itens_licitacao` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `licitacao_id` INT UNSIGNED NOT NULL,
  `numero_item` INT DEFAULT NULL,
  `tipo_item` VARCHAR(50) DEFAULT NULL COMMENT 'material | servico',
  `codigo_item` VARCHAR(50) DEFAULT NULL,
  `catmat_catser` VARCHAR(50) DEFAULT NULL,
  `descricao` TEXT DEFAULT NULL,
  `unidade_medida` VARCHAR(50) DEFAULT NULL,
  `quantidade` DECIMAL(18,4) DEFAULT NULL,
  `valor_unitario_estimado` DECIMAL(18,4) DEFAULT NULL,
  `valor_total_estimado` DECIMAL(18,2) DEFAULT NULL,
  `valor_unitario_homologado` DECIMAL(18,4) DEFAULT NULL,
  `valor_total_homologado` DECIMAL(18,2) DEFAULT NULL,
  `situacao` VARCHAR(100) DEFAULT NULL,
  `criterio_julgamento` VARCHAR(200) DEFAULT NULL,
  `beneficio_me_epp` TINYINT(1) DEFAULT 0,
  `dados_originais` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_itens_lic` (`licitacao_id`),
  INDEX `idx_itens_catmat` (`catmat_catser`),
  INDEX `idx_itens_num` (`numero_item`),
  INDEX `idx_itens_situacao` (`situacao`),
  FULLTEXT INDEX `ft_itens_descricao` (`descricao`),
  CONSTRAINT `fk_itens_licitacao` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 5. FORNECEDORES
-- ===========================================
CREATE TABLE `fornecedores` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cnpj_cpf` VARCHAR(20) DEFAULT NULL,
  `tipo_documento` VARCHAR(10) DEFAULT NULL COMMENT 'cnpj | cpf',
  `razao_social` VARCHAR(500) DEFAULT NULL,
  `nome_fantasia` VARCHAR(500) DEFAULT NULL,
  `porte` VARCHAR(50) DEFAULT NULL COMMENT 'me, epp, medio, grande',
  `uf` VARCHAR(2) DEFAULT NULL,
  `municipio` VARCHAR(200) DEFAULT NULL,
  `telefone` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(200) DEFAULT NULL,
  `origem` VARCHAR(50) NOT NULL DEFAULT 'compras_gov',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fornecedores` (`cnpj_cpf`, `origem`),
  INDEX `idx_forn_razao` (`razao_social`(100)),
  INDEX `idx_forn_uf` (`uf`),
  INDEX `idx_forn_porte` (`porte`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 6. FORNECEDORES x LICITAÇÃO
-- ===========================================
CREATE TABLE `fornecedores_licitacao` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `licitacao_id` INT UNSIGNED NOT NULL,
  `fornecedor_id` INT UNSIGNED NOT NULL,
  `item_id` INT UNSIGNED DEFAULT NULL,
  `situacao` VARCHAR(100) DEFAULT NULL,
  `vencedor` TINYINT(1) DEFAULT 0,
  `valor_proposta` DECIMAL(18,2) DEFAULT NULL,
  `valor_negociado` DECIMAL(18,2) DEFAULT NULL,
  `percentual_desconto` DECIMAL(8,4) DEFAULT NULL,
  `posicao_classificacao` INT DEFAULT NULL,
  `motivo_desclassificacao` TEXT DEFAULT NULL,
  `dados_originais` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_fl_lic` (`licitacao_id`),
  INDEX `idx_fl_forn` (`fornecedor_id`),
  INDEX `idx_fl_item` (`item_id`),
  INDEX `idx_fl_vencedor` (`vencedor`),
  CONSTRAINT `fk_fl_licitacao` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fl_fornecedor` FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fl_item` FOREIGN KEY (`item_id`) REFERENCES `itens_licitacao` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 7. CONTRATOS
-- ===========================================
CREATE TABLE `contratos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `licitacao_id` INT UNSIGNED DEFAULT NULL,
  `fornecedor_id` INT UNSIGNED DEFAULT NULL,
  `usuario_id` INT DEFAULT NULL COMMENT 'Usuário que cadastrou o contrato',
  `numero_contrato` VARCHAR(100) DEFAULT NULL,
  `id_externo` VARCHAR(200) DEFAULT NULL,
  `origem` VARCHAR(50) NOT NULL DEFAULT 'compras_gov',
  `codigo_orgao` VARCHAR(50) DEFAULT NULL,
  `nome_orgao` VARCHAR(500) DEFAULT NULL,
  `codigo_uasg` VARCHAR(20) DEFAULT NULL,
  `cnpj_orgao` VARCHAR(20) DEFAULT NULL,
  `objeto` TEXT DEFAULT NULL,
  `tipo` VARCHAR(100) DEFAULT NULL,
  `categoria` VARCHAR(100) DEFAULT NULL,
  `modalidade_licitacao` VARCHAR(100) DEFAULT NULL,
  `numero_processo` VARCHAR(100) DEFAULT NULL,
  `data_assinatura` DATETIME DEFAULT NULL,
  `data_publicacao` DATETIME DEFAULT NULL,
  `data_inicio_vigencia` DATETIME DEFAULT NULL,
  `data_fim_vigencia` DATETIME DEFAULT NULL,
  `prazo_execucao` INT DEFAULT NULL COMMENT 'Prazo de execução em meses',
  `valor_inicial` DECIMAL(18,2) DEFAULT NULL,
  `valor_global` DECIMAL(18,2) DEFAULT NULL,
  `valor_acumulado` DECIMAL(18,2) DEFAULT NULL,
  `situacao` VARCHAR(100) DEFAULT NULL,
  `cnpj_contratado` VARCHAR(20) DEFAULT NULL,
  `nome_contratado` VARCHAR(500) DEFAULT NULL,
  `dados_originais` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_cont_numero` (`numero_contrato`),
  INDEX `idx_cont_externo` (`id_externo`),
  INDEX `idx_cont_origem` (`origem`),
  INDEX `idx_cont_lic` (`licitacao_id`),
  INDEX `idx_cont_forn` (`fornecedor_id`),
  INDEX `idx_cont_uasg` (`codigo_uasg`),
  INDEX `idx_cont_situacao` (`situacao`),
  INDEX `idx_cont_assinatura` (`data_assinatura`),
  INDEX `idx_cont_vigencia` (`data_fim_vigencia`),
  FULLTEXT INDEX `ft_contratos_objeto` (`objeto`),
  CONSTRAINT `fk_contratos_lic` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_contratos_forn` FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 8. ATAS DE REGISTRO DE PREÇO
-- ===========================================
CREATE TABLE `atas_registro_preco` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `licitacao_id` INT UNSIGNED DEFAULT NULL,
  `numero_ata` VARCHAR(100) DEFAULT NULL,
  `id_externo` VARCHAR(200) DEFAULT NULL,
  `origem` VARCHAR(50) NOT NULL DEFAULT 'compras_gov',
  `codigo_orgao` VARCHAR(50) DEFAULT NULL,
  `nome_orgao` VARCHAR(500) DEFAULT NULL,
  `codigo_uasg` VARCHAR(20) DEFAULT NULL,
  `numero_processo` VARCHAR(100) DEFAULT NULL,
  `objeto` TEXT DEFAULT NULL,
  `data_assinatura` DATETIME DEFAULT NULL,
  `data_publicacao` DATETIME DEFAULT NULL,
  `data_inicio_vigencia` DATETIME DEFAULT NULL,
  `data_fim_vigencia` DATETIME DEFAULT NULL,
  `situacao` VARCHAR(100) DEFAULT NULL,
  `dados_originais` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_arp_numero` (`numero_ata`),
  INDEX `idx_arp_externo` (`id_externo`),
  INDEX `idx_arp_origem` (`origem`),
  INDEX `idx_arp_lic` (`licitacao_id`),
  INDEX `idx_arp_uasg` (`codigo_uasg`),
  INDEX `idx_arp_situacao` (`situacao`),
  INDEX `idx_arp_vigencia` (`data_fim_vigencia`),
  CONSTRAINT `fk_arp_lic` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 9. LOGS DE COLETA
-- ===========================================
CREATE TABLE `coleta_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fonte` VARCHAR(50) NOT NULL COMMENT 'compras_gov | pncp',
  `modulo` VARCHAR(100) NOT NULL,
  `status` VARCHAR(20) NOT NULL COMMENT 'iniciado | sucesso | erro | parcial',
  `registros_coletados` INT DEFAULT 0,
  `registros_novos` INT DEFAULT 0,
  `registros_atualizados` INT DEFAULT 0,
  `registros_erro` INT DEFAULT 0,
  `paginas_processadas` INT DEFAULT 0,
  `parametros` TEXT DEFAULT NULL,
  `erro_mensagem` TEXT DEFAULT NULL,
  `erro_stack` TEXT DEFAULT NULL,
  `data_referencia_inicio` DATETIME DEFAULT NULL,
  `data_referencia_fim` DATETIME DEFAULT NULL,
  `iniciado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `finalizado_em` DATETIME DEFAULT NULL,
  `duracao_ms` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_cl_fonte` (`fonte`),
  INDEX `idx_cl_modulo` (`modulo`),
  INDEX `idx_cl_status` (`status`),
  INDEX `idx_cl_inicio` (`iniciado_em`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;






-- ============================================================
-- 10. TABELAS DE USUÁRIOS E ACESSO
-- ============================================================

CREATE TABLE IF NOT EXISTS perfis_acesso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE,
  descricao VARCHAR(255),
  tipo ENUM('admin', 'gestor', 'analista', 'visualizador', 'cliente') NOT NULL DEFAULT 'visualizador',
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  avatar_iniciais VARCHAR(5),
  departamento VARCHAR(100),
  perfil_id INT NOT NULL,
  status ENUM('Ativo', 'Inativo') NOT NULL DEFAULT 'Ativo',
  ultimo_login DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (perfil_id) REFERENCES perfis_acesso(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissoes_pagina (
  id INT AUTO_INCREMENT PRIMARY KEY,
  perfil_id INT NOT NULL,
  pagina_id VARCHAR(50) NOT NULL,
  pagina_nome VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  permitido TINYINT(1) NOT NULL DEFAULT 0,
  UNIQUE KEY uk_perfil_pagina (perfil_id, pagina_id),
  FOREIGN KEY (perfil_id) REFERENCES perfis_acesso(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




-- ============================================================
-- NOVO: TABELA DE MENUS E NAVEGAÇÃO
-- ============================================================

CREATE TABLE IF NOT EXISTS menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descricao VARCHAR(255),
  categoria VARCHAR(50) NOT NULL COMMENT 'Licitações, Propostas, Documentos, Admin, Suporte, Usuários & Acesso, Sistema, Contratos',
  icone VARCHAR(50) COMMENT 'Nome do ícone lucide-react',
  rota VARCHAR(100) NOT NULL UNIQUE,
  ordem INT DEFAULT 0,
  menu_pai_id INT COMMENT 'Para submenu',
  ativo TINYINT(1) DEFAULT 1,
  requer_autenticacao TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_pai_id) REFERENCES menus(id) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserts dos menus principais (rotas devem coincidir com navigation.ts)
INSERT INTO menus (titulo, descricao, categoria, icone, rota, ordem, ativo) VALUES
('Dashboard', 'Dashboard principal do sistema', 'Dashboard', 'LayoutDashboard', '/', 1, 1),
('Cadastro SICAF', 'Gerenciamento SICAF', 'SICAF', 'Building2', '/sicaf', 10, 1),
('Alertas Inteligentes', 'Alertas automáticos de certidões e prazos', 'SICAF', 'ShieldAlert', '/smart-alerts', 11, 1),
('Licitações', 'Consulta de licitações', 'Licitações', 'FileSearch', '/bids', 20, 1),
('Leitura de Edital IA', 'Análise de edital com IA', 'Licitações', 'Brain', '/ai-reader', 21, 1),
('Inteligência Competitiva', 'Análise competitiva de licitações', 'Licitações', 'BarChart3', '/competitive', 22, 1),
('Gestão Contratos', 'Gerenciamento de contratos', 'Licitações', 'Briefcase', '/contracts', 23, 1),
('Contrato Digital', 'Contratos de serviço CadBrasil', 'Contratos', 'FileText', '/digital-contracts', 30, 1),
('Propostas', 'Gerenciamento de propostas', 'Propostas', 'FileText', '/proposals', 40, 1),
('Workflow de Aprovação', 'Aprovação de propostas', 'Propostas', 'GitBranch', '/workflow', 41, 1),
('Documentos', 'Gerenciamento de documentos', 'Documentos', 'FolderOpen', '/documents', 50, 1),
('Dashboard Admin', 'Dashboard administrativo', 'Admin', 'BarChart3', '/admin-dashboard', 60, 1),
('Clientes', 'Gerenciamento de clientes', 'Admin', 'Users', '/clients', 61, 1),
('Manutenções', 'Gestão de manutenções SICAF', 'Admin', 'Wrench', '/manutencoes', 62, 1),
('Relatórios', 'Relatórios do sistema', 'Admin', 'BarChart3', '/relatorios', 63, 1),
('Planos Edital IA', 'Gestão de pacotes de Leitura de Edital com IA', 'Admin', 'Brain', '/admin/planos-edital', 64, 1),
('Tracking Google', 'Tracking avançado Google Ads e conversões', 'Admin', 'Activity', '/google-ads-tracking', 65, 1),
('Usuários', 'Gerenciamento de usuários', 'Usuários & Acesso', 'UserCog', '/system-users', 70, 1),
('Perfis de Acesso', 'Gerenciamento de perfis', 'Usuários & Acesso', 'ShieldCheck', '/access-profiles', 71, 1),
('Tickets Admin', 'Suporte administrativo', 'Suporte', 'Ticket', '/tickets', 80, 1),
('Tickets Cliente', 'Suporte ao cliente', 'Suporte', 'Ticket', '/tickets-client', 81, 1),
('Configurações', 'Configurações do sistema', 'Sistema', 'Settings', '/settings', 90, 1);





-- ============================================================
-- 11. TABELA DE CLIENTES (EMPRESAS)
-- ============================================================

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL COMMENT '1 Usuário pode ter N Clientes',
  tipo_documento ENUM('CPF', 'CNPJ') NOT NULL DEFAULT 'CNPJ',
  documento VARCHAR(20) NOT NULL UNIQUE COMMENT 'CPF ou CNPJ do cliente',
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  inscricao_estadual VARCHAR(30),
  inscricao_municipal VARCHAR(30),
  email VARCHAR(255),
  telefone VARCHAR(20),
  celular VARCHAR(20),
  endereco VARCHAR(255),
  cidade VARCHAR(100),
  estado CHAR(2),
  cep VARCHAR(10),
  porte ENUM('MEI', 'ME', 'EPP', 'Média', 'Grande') DEFAULT 'ME',
  ramo_atividade VARCHAR(150),
  responsavel_nome VARCHAR(150),
  responsavel_cpf VARCHAR(14),
  responsavel_email VARCHAR(255),
  responsavel_telefone VARCHAR(20),
  status ENUM('Ativo', 'Pendente', 'Inativo') NOT NULL DEFAULT 'Ativo',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cliente_contatos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  nome VARCHAR(150) NOT NULL,
  cpf VARCHAR(20) DEFAULT NULL,
  cargo VARCHAR(100),
  email VARCHAR(255),
  telefone VARCHAR(20),
  principal TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. SICAF - CADASTRO DE FORNECEDORES
-- ============================================================

CREATE TABLE IF NOT EXISTS sicaf_cadastros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  status ENUM('Ativo', 'Pendente', 'Vencendo', 'Vencido') NOT NULL DEFAULT 'Pendente',
  data_ultima_atualizacao DATE,
  data_validade DATE,
  completude DECIMAL(5,2) DEFAULT 0.00,
  credenciamento_anual TINYINT(1) DEFAULT 0,
  manutencao_ativa TINYINT(1) DEFAULT 0,
  dias_validade INT DEFAULT 0,
  atualizacoes_usadas INT DEFAULT 0 COMMENT 'Qtd de atualizações de certidões realizadas no período anual',
  atualizacoes_reset_em DATE NULL COMMENT 'Data em que o contador foi resetado (pagamento SICAF anual)',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_cliente_sicaf (cliente_id) COMMENT '1 Cliente pode ter apenas 1 SICAF ativo',
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sicaf_niveis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sicaf_id INT NOT NULL,
  nivel ENUM('I', 'II', 'III', 'IV', 'V', 'VI') NOT NULL,
  habilitado TINYINT(1) DEFAULT 1,
  UNIQUE KEY uk_sicaf_nivel (sicaf_id, nivel),
  FOREIGN KEY (sicaf_id) REFERENCES sicaf_cadastros(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. TIPO DE CERTIDÕES, CERTIDÕES E DOCUMENTOS
-- ============================================================

CREATE TABLE IF NOT EXISTS tipo_certidoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE COMMENT 'Código interno para mapeamento (cnd_federal, crf_fgts, etc.)',
  nome VARCHAR(150) NOT NULL COMMENT 'Nome completo/exibição da certidão',
  descricao TEXT COMMENT 'Descrição detalhada do tipo de certidão',
  nivel_sicaf ENUM('I', 'II', 'III', 'IV', 'V', 'VI') COMMENT 'Nível SICAF associado (se aplicável)',
  orgao_emissor VARCHAR(150) COMMENT 'Órgão emissor padrão',
  ativo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS certidoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  sicaf_id INT,
  tipo_certidao_id INT NOT NULL COMMENT 'FK para tipo_certidoes',
  numero VARCHAR(100),
  nivel_sicaf ENUM('I', 'II', 'III', 'IV', 'V', 'VI'),
  data_emissao DATE,
  data_validade DATE,
  status ENUM('Válida', 'Vencendo', 'Vencida') NOT NULL DEFAULT 'Válida',
  dias_restantes INT DEFAULT 0,
  auto_renovar TINYINT(1) DEFAULT 0,
  arquivo_url VARCHAR(500),
  arquivo_nome VARCHAR(255),
  arquivo_tamanho VARCHAR(20),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (sicaf_id) REFERENCES sicaf_cadastros(id) ON DELETE SET NULL,
  FOREIGN KEY (tipo_certidao_id) REFERENCES tipo_certidoes(id) ON DELETE RESTRICT,
  INDEX idx_certidoes_cliente_tipo (cliente_id, tipo_certidao_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  nome VARCHAR(255) NOT NULL,
  pasta VARCHAR(100) COMMENT 'Contratos Sociais, Certidões, Propostas, Editais, Atestados, Balanços',
  tipo_arquivo ENUM('PDF', 'Excel', 'Word', 'Imagem', 'Outro') DEFAULT 'PDF',
  tamanho VARCHAR(20),
  nivel_sicaf ENUM('I', 'II', 'III', 'IV', 'V', 'VI'),
  data_validade DATE,
  status ENUM('valid', 'expiring', 'expired') DEFAULT 'valid',
  arquivo_url VARCHAR(500),
  data_upload DATE,
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
  FOREIGN KEY (uploaded_by) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. LICITAÇÕES
-- ============================================================

CREATE TABLE IF NOT EXISTS propostas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  licitacao_id INT UNSIGNED NOT NULL,
  cliente_id INT NOT NULL,
  numero_proposta VARCHAR(50),
  tipo ENUM('Comercial', 'Técnica', 'Técnica e Preço') DEFAULT 'Comercial',
  valor DECIMAL(15,2),
  prazo_entrega VARCHAR(100),
  status ENUM('Em elaboração', 'Aguardando revisão', 'Enviada', 'Vencedora', 'Perdedora') NOT NULL DEFAULT 'Em elaboração',
  progresso INT DEFAULT 0 COMMENT 'Percentual de conclusão 0-100',
  observacoes TEXT,
  anexos_url TEXT,
  criado_por INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (licitacao_id) REFERENCES licitacoes(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. WORKFLOW DE APROVAÇÃO
-- ============================================================

CREATE TABLE IF NOT EXISTS workflow_aprovacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proposta_id INT NOT NULL,
  etapa ENUM('analise', 'gestor', 'diretor', 'aprovada', 'rejeitada') NOT NULL DEFAULT 'analise',
  prazo DATE,
  observacao TEXT,
  aprovado_por INT,
  data_aprovacao DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (proposta_id) REFERENCES propostas(id) ON DELETE CASCADE,
  FOREIGN KEY (aprovado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 16. MANUTENÇÕES
-- ============================================================

CREATE TABLE IF NOT EXISTS manutencoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  cliente_id INT NOT NULL,
  tipo ENUM('Preventiva', 'Corretiva') NOT NULL DEFAULT 'Preventiva',
  plano VARCHAR(100) COMMENT 'Manutenção CADBRASIL, etc.',
  valor DECIMAL(15,2),
  status ENUM('Ativo', 'A Vencer', 'Vencido', 'Cancelado') NOT NULL DEFAULT 'Ativo',
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  dias_restantes INT DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_cliente_manutencao (cliente_id) COMMENT '1 Cliente pode ter apenas 1 Manutenção ativa',
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS manutencao_boletos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  manutencao_id INT NOT NULL,
  cliente_id INT NOT NULL COMMENT 'Desnormalizado para busca rápida',
  numero_boleto VARCHAR(100),
  valor DECIMAL(15,2) NOT NULL,
  mes_referencia INT NOT NULL COMMENT 'Mês de 1 a 12',
  ano_referencia INT NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status ENUM('Pendente', 'Pago', 'Atrasado', 'Cancelado') DEFAULT 'Pendente',
  forma_pagamento ENUM('Boleto', 'PIX') DEFAULT 'Boleto',
  codigo_barras VARCHAR(100),
  chave_pix VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manutencao_id) REFERENCES manutencoes(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. HISTÓRICO DE RENOVAÇÕES
-- ============================================================

CREATE TABLE IF NOT EXISTS sicaf_renovacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sicaf_id INT NOT NULL,
  cliente_id INT NOT NULL,
  ano_referencia INT NOT NULL,
  data_renovacao DATETIME NOT NULL,
  taxa_id INT COMMENT 'Referência à taxa paga para esta renovação',
  status ENUM('Concluída', 'Pendente', 'Cancelada') NOT NULL DEFAULT 'Concluída',
  renovado_por INT COMMENT 'Usuário que executou a renovação',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sicaf_id) REFERENCES sicaf_cadastros(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (renovado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS manutencao_renovacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  manutencao_id INT NOT NULL,
  cliente_id INT NOT NULL,
  data_renovacao DATETIME NOT NULL,
  data_inicio_novo DATE NOT NULL,
  data_fim_novo DATE NOT NULL,
  valor_novo DECIMAL(15,2) NOT NULL,
  status ENUM('Concluída', 'Pendente', 'Cancelada') NOT NULL DEFAULT 'Concluída',
  renovado_por INT COMMENT 'Usuário que executou a renovação',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manutencao_id) REFERENCES manutencoes(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (renovado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17.1 PAGAMENTOS GERENCIANET (CENTRALIZADO)
-- Armazena todo boleto ou PIX gerado via Gerencianet/Efí,
-- independente de ser SICAF ou Manutenção.
-- ============================================================

CREATE TABLE IF NOT EXISTS pagamentos_gerencianet (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- ── Vínculo com a origem ──
  cliente_id INT DEFAULT NULL,
  origem VARCHAR(30) NOT NULL DEFAULT 'sicaf' COMMENT 'Tipo de cobrança: sicaf, manutencao, pacote_ia',
  origem_id INT NOT NULL COMMENT 'ID da tabela de origem (taxas_sicaf.id, manutencao_boletos.id, compras_pacotes_ia.id)',

  -- ── Dados do pagamento ──
  tipo ENUM('boleto', 'pix') NOT NULL,
  valor DECIMAL(15,2) NOT NULL COMMENT 'Valor em reais',
  valor_centavos INT NOT NULL COMMENT 'Valor em centavos (enviado à API)',
  descricao VARCHAR(500) COMMENT 'Descrição do pagamento',
  protocolo VARCHAR(100) COMMENT 'Protocolo/referência interna',

  -- ── Vencimento ──
  data_vencimento DATE COMMENT 'Vencimento do boleto',
  data_pagamento DATETIME COMMENT 'Data/hora do pagamento confirmado',

  -- ── Status ──
  status ENUM('aguardando', 'gerado', 'pago', 'cancelado', 'expirado', 'erro') NOT NULL DEFAULT 'aguardando',

  -- ── Dados retornados pela Gerencianet (Boleto) ──
  gn_charge_id INT COMMENT 'charge_id retornado pela API (boleto)',
  gn_barcode VARCHAR(100) COMMENT 'Código de barras do boleto',
  gn_link VARCHAR(500) COMMENT 'Link do boleto para download/impressão',
  gn_pdf VARCHAR(500) COMMENT 'Link do PDF do boleto',

  -- ── Dados retornados pela Gerencianet (PIX) ──
  gn_txid VARCHAR(100) COMMENT 'txid da cobrança PIX',
  gn_loc_id INT COMMENT 'loc.id para QR Code',
  gn_qrcode_text TEXT COMMENT 'Código copia-e-cola do PIX',
  gn_qrcode_image TEXT COMMENT 'QR Code em base64 (imagem)',
  gn_e2eid VARCHAR(100) COMMENT 'endToEndId do pagamento confirmado',

  -- ── Resposta completa (para debug/auditoria) ──
  gn_response JSON COMMENT 'Resposta completa da API Gerencianet (JSON)',
  gn_error TEXT COMMENT 'Mensagem de erro caso tenha falhado',

  -- ── Dados do cliente no momento da geração ──
  cliente_nome VARCHAR(255),
  cliente_documento VARCHAR(20) COMMENT 'CPF ou CNPJ do cliente',
  cliente_email VARCHAR(255),

  -- ── Controle ──
  gerado_por INT COMMENT 'Usuário que solicitou a geração',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- ── Índices ──
  INDEX idx_pgto_cliente (cliente_id),
  INDEX idx_pgto_origem (origem, origem_id),
  INDEX idx_pgto_status (status),
  INDEX idx_pgto_tipo (tipo),
  INDEX idx_pgto_gn_charge (gn_charge_id),
  INDEX idx_pgto_gn_txid (gn_txid),
  INDEX idx_pgto_created (created_at),

  FOREIGN KEY (gerado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 18. TAXAS SICAF (RENOVAÇÃO ANUAL)
-- ============================================================

CREATE TABLE IF NOT EXISTS taxas_sicaf (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sicaf_id INT NOT NULL,
  cliente_id INT NOT NULL,
  descricao VARCHAR(255) DEFAULT 'Taxa de Renovação SICAF Anual',
  valor DECIMAL(15,2) NOT NULL DEFAULT 35.16,
  ano_referencia INT NOT NULL,
  forma_pagamento ENUM('Boleto', 'PIX'),
  status ENUM('Pendente', 'Pago', 'Aprovado', 'Cancelado') DEFAULT 'Pendente',
  codigo_barras VARCHAR(100),
  chave_pix VARCHAR(255),
  data_pagamento DATETIME,
  aprovado_por INT COMMENT 'ID do usuário que aprovou manualmente',
  data_aprovacao DATETIME COMMENT 'Data/hora da aprovação manual',
  observacao_aprovacao VARCHAR(500) COMMENT 'Justificativa da aprovação',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sicaf_id) REFERENCES sicaf_cadastros(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (aprovado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 19. TICKETS (SUPORTE)
-- ============================================================

CREATE TABLE IF NOT EXISTS tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  status ENUM('aberto', 'em_andamento', 'resolvido', 'fechado') NOT NULL DEFAULT 'aberto',
  prioridade ENUM('alta', 'media', 'baixa') NOT NULL DEFAULT 'media',
  categoria ENUM('suporte', 'bug', 'melhoria') NOT NULL DEFAULT 'suporte',
  cliente_id INT,
  criado_por INT NOT NULL,
  atribuido_a INT,
  sla_prazo DATETIME,
  sla_minutos_restantes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
  FOREIGN KEY (criado_por) REFERENCES usuarios(id),
  FOREIGN KEY (atribuido_a) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ticket_mensagens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  remetente_tipo ENUM('client', 'support') NOT NULL,
  remetente_nome VARCHAR(150) NOT NULL,
  remetente_id INT,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (remetente_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ticket_anexos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  mensagem_id INT DEFAULT NULL COMMENT 'Se vinculado a uma mensagem específica',
  nome_original VARCHAR(500) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  tamanho INT DEFAULT 0,
  mimetype VARCHAR(100),
  enviado_por INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (mensagem_id) REFERENCES ticket_mensagens(id) ON DELETE SET NULL,
  FOREIGN KEY (enviado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 20. ALERTAS E NOTIFICAÇÕES
-- ============================================================

CREATE TABLE IF NOT EXISTS alertas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('urgent', 'warning', 'info', 'success') NOT NULL DEFAULT 'info',
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(50) COMMENT 'Licitação, Certidão, SICAF, Oportunidade, etc.',
  referencia_tipo VARCHAR(50) COMMENT 'licitacao, certidao, sicaf, proposta, etc.',
  referencia_id INT,
  lido TINYINT(1) DEFAULT 0,
  usuario_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS configuracoes_notificacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  email_ativo TINYINT(1) DEFAULT 1,
  push_ativo TINYINT(1) DEFAULT 1,
  auto_renovar TINYINT(1) DEFAULT 0,
  resumo_diario TINYINT(1) DEFAULT 1,
  dias_antecedencia INT DEFAULT 7,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 21. LEITURA DE EDITAL COM IA
-- ============================================================

CREATE TABLE IF NOT EXISTS analises_edital (
  id INT AUTO_INCREMENT PRIMARY KEY,
  licitacao_id INT UNSIGNED,
  usuario_id INT NOT NULL,
  arquivo_nome VARCHAR(255),
  arquivo_url VARCHAR(500),
  orgao VARCHAR(255),
  uasg VARCHAR(50),
  modalidade VARCHAR(100),
  numero VARCHAR(50),
  objeto TEXT,
  valor_estimado DECIMAL(15,2),
  data_sessao DATETIME,
  localidade VARCHAR(100),
  criterio_julgamento VARCHAR(100),
  tipo_licitacao VARCHAR(100),
  exclusiva_me_epp TINYINT(1) DEFAULT 0,
  status ENUM('pendente', 'processando', 'concluido', 'erro') DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (licitacao_id) REFERENCES licitacoes(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS analise_documentos_exigidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  analise_id INT NOT NULL,
  documento VARCHAR(255) NOT NULL,
  FOREIGN KEY (analise_id) REFERENCES analises_edital(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS analise_pontos_atencao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  analise_id INT NOT NULL,
  descricao TEXT NOT NULL,
  FOREIGN KEY (analise_id) REFERENCES analises_edital(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS analise_requisitos_habilitacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  analise_id INT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  item VARCHAR(500) NOT NULL,
  FOREIGN KEY (analise_id) REFERENCES analises_edital(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS analise_cronograma (
  id INT AUTO_INCREMENT PRIMARY KEY,
  analise_id INT NOT NULL,
  evento VARCHAR(255) NOT NULL,
  data_evento DATETIME,
  status ENUM('concluido', 'proximo', 'futuro') DEFAULT 'futuro',
  FOREIGN KEY (analise_id) REFERENCES analises_edital(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 22. INTELIGÊNCIA COMPETITIVA
-- ============================================================

CREATE TABLE IF NOT EXISTS concorrentes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(20),
  vitorias INT DEFAULT 0,
  participacoes INT DEFAULT 0,
  taxa_vitoria DECIMAL(5,2) DEFAULT 0,
  valor_total DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS resultados_licitacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  licitacao_id INT UNSIGNED NOT NULL,
  resultado ENUM('Vencedor', '2º Lugar', '3º Lugar', 'Desclassificado', 'Não participou') NOT NULL,
  posicao INT,
  total_concorrentes INT,
  valor_proposto DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (licitacao_id) REFERENCES licitacoes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 23. CONFIGURAÇÕES DO SISTEMA
-- ============================================================

CREATE TABLE IF NOT EXISTS configuracoes_sistema (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT,
  categoria ENUM('empresa', 'licitacoes', 'integracoes', 'seguranca', 'email', 'notificacoes', 'aparencia', 'backup') DEFAULT 'empresa',
  descricao VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS templates_email (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  assunto VARCHAR(255),
  corpo_html TEXT,
  variaveis_disponiveis TEXT COMMENT 'JSON com variáveis dinâmicas',
  ativo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 24. PACOTES DE LEITURA IA
-- ============================================================

CREATE TABLE IF NOT EXISTS pacotes_leitura_ia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  quantidade_leituras INT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  descricao VARCHAR(255) DEFAULT NULL,
  recursos JSON COMMENT 'Lista de recursos incluídos no pacote',
  destaque TINYINT(1) DEFAULT 0 COMMENT 'Pacote em destaque (mais popular)',
  economia VARCHAR(50) DEFAULT NULL COMMENT 'Ex: 20% de economia',
  ativo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuario_creditos_ia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  creditos_totais INT DEFAULT 3,
  creditos_utilizados INT DEFAULT 0,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY uk_uci_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Leituras de edital realizadas
CREATE TABLE IF NOT EXISTS leituras_edital_ia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nome_arquivo VARCHAR(255) NOT NULL,
  tamanho_arquivo INT DEFAULT 0,
  caminho_arquivo VARCHAR(500) DEFAULT NULL,
  resultado JSON COMMENT 'Resultado completo da análise IA',
  texto_extraido LONGTEXT COMMENT 'Texto extraído do PDF/DOC',
  status ENUM('processando', 'concluido', 'erro') DEFAULT 'processando',
  erro_mensagem TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_lea_usuario (usuario_id),
  INDEX idx_lea_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Compras de pacotes de créditos IA
CREATE TABLE IF NOT EXISTS compras_pacotes_ia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  pacote_id INT NOT NULL,
  quantidade_creditos INT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  status ENUM('pendente', 'pago', 'cancelado') DEFAULT 'pendente',
  pagamento_id INT DEFAULT NULL COMMENT 'FK para pagamentos_gerencianet',
  data_pagamento DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (pacote_id) REFERENCES pacotes_leitura_ia(id),
  INDEX idx_cpi_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 25. AUDIT LOG (HISTÓRICO DE AÇÕES)
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_log (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  acao VARCHAR(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE, LOGIN, etc.',
  entidade VARCHAR(100) NOT NULL COMMENT 'clientes, licitacoes, certidoes, etc.',
  entidade_id INT,
  dados_anteriores JSON,
  dados_novos JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 26. PASTAS DE DOCUMENTOS
-- ============================================================

CREATE TABLE IF NOT EXISTS pastas_documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cor VARCHAR(50) DEFAULT 'text-blue-500',
  quantidade INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;





-- ============================================================
-- ============================================================
--                    DADOS INICIAIS (DEMO)
-- ============================================================
-- ============================================================

-- ============================================================
-- PERFIS DE ACESSO
-- ============================================================

INSERT INTO perfis_acesso (id, nome, descricao, tipo) VALUES
(1, 'Administrador', 'Acesso total a todas as funcionalidades do sistema', 'admin'),
(2, 'Gestor', 'Gerenciamento de licitações, propostas e equipe', 'gestor'),
(3, 'Analista', 'Análise de editais, propostas e documentos', 'analista'),
(4, 'Visualizador', 'Apenas visualização de dados, sem edição', 'visualizador'),
(5, 'Cliente', 'Acesso ao portal do cliente com visão limitada', 'cliente');

-- ============================================================
-- PERMISSÕES POR PERFIL
-- ============================================================

-- Administrador: acesso total
INSERT INTO permissoes_pagina (perfil_id, pagina_id, pagina_nome, categoria, permitido) VALUES
(1, 'dashboard', 'Dashboard', 'Principal', 1),
(1, 'alerts', 'Alertas', 'Principal', 1),
(1, 'bids', 'Licitações', 'Licitações', 1),
(1, 'ai-reader', 'Leitura IA', 'Licitações', 1),
(1, 'contracts', 'Contratos', 'Licitações', 1),
(1, 'proposals', 'Propostas', 'Propostas', 1),
(1, 'workflow', 'Workflow de Aprovação', 'Propostas', 1),
(1, 'sicaf', 'Cadastro SICAF', 'SICAF', 1),
(1, 'certificates', 'Certidões', 'SICAF', 1),
(1, 'documents', 'Documentos', 'Documentos', 1),
(1, 'clients', 'Clientes', 'Admin', 1),
(1, 'maintenance', 'Manutenções', 'Admin', 1),
(1, 'reports', 'Relatórios', 'Admin', 1),
(1, 'tickets-admin', 'Tickets Admin', 'Suporte', 1),
(1, 'tickets-client', 'Tickets Cliente', 'Suporte', 1),
(1, 'system-users', 'Usuários', 'Usuários & Acesso', 1),
(1, 'access-profiles', 'Perfil de Acesso', 'Usuários & Acesso', 1),
(1, 'settings', 'Configurações', 'Sistema', 1),
(1, 'competitive', 'Inteligência Competitiva', 'Sistema', 1),
(1, 'smart-alerts', 'Alertas Inteligentes', 'Sistema', 1);

-- Gestor
INSERT INTO permissoes_pagina (perfil_id, pagina_id, pagina_nome, categoria, permitido) VALUES
(2, 'dashboard', 'Dashboard', 'Principal', 1),
(2, 'alerts', 'Alertas', 'Principal', 1),
(2, 'bids', 'Licitações', 'Licitações', 1),
(2, 'ai-reader', 'Leitura IA', 'Licitações', 1),
(2, 'contracts', 'Contratos', 'Licitações', 1),
(2, 'proposals', 'Propostas', 'Propostas', 1),
(2, 'workflow', 'Workflow de Aprovação', 'Propostas', 1),
(2, 'sicaf', 'Cadastro SICAF', 'SICAF', 1),
(2, 'certificates', 'Certidões', 'SICAF', 1),
(2, 'documents', 'Documentos', 'Documentos', 1),
(2, 'clients', 'Clientes', 'Admin', 1),
(2, 'maintenance', 'Manutenções', 'Admin', 1),
(2, 'reports', 'Relatórios', 'Admin', 1),
(2, 'tickets-admin', 'Tickets Admin', 'Suporte', 1),
(2, 'system-users', 'Usuários', 'Usuários & Acesso', 0),
(2, 'access-profiles', 'Perfil de Acesso', 'Usuários & Acesso', 0),
(2, 'settings', 'Configurações', 'Sistema', 0),
(2, 'competitive', 'Inteligência Competitiva', 'Sistema', 1),
(2, 'smart-alerts', 'Alertas Inteligentes', 'Sistema', 1);

-- Atualizar permissões para incluir a nova página
INSERT INTO permissoes_pagina (perfil_id, pagina_id, pagina_nome, categoria, permitido) VALUES
-- Administrador
(1, 'digital-contracts', 'Contrato Digital', 'Contratos', 1),
-- Gestor
(2, 'digital-contracts', 'Contrato Digital', 'Contratos', 1),
-- Analista
(3, 'digital-contracts', 'Contrato Digital', 'Contratos', 1),
-- Visualizador
(4, 'digital-contracts', 'Contrato Digital', 'Contratos', 0),
-- Cliente
(5, 'digital-contracts', 'Contrato Digital', 'Contratos', 1);

-- Tracking Google Ads (apenas Admin e Gestor)
INSERT INTO permissoes_pagina (perfil_id, pagina_id, pagina_nome, categoria, permitido) VALUES
(1, 'google-ads-tracking', 'Tracking Google', 'Admin', 1),
(2, 'google-ads-tracking', 'Tracking Google', 'Admin', 1),
(3, 'google-ads-tracking', 'Tracking Google', 'Admin', 0),
(4, 'google-ads-tracking', 'Tracking Google', 'Admin', 0),
(5, 'google-ads-tracking', 'Tracking Google', 'Admin', 0);

-- Planos Edital IA (apenas Admin e Gestor)
INSERT INTO permissoes_pagina (perfil_id, pagina_id, pagina_nome, categoria, permitido) VALUES
(1, 'planos-edital', 'Planos Edital IA', 'Admin', 1),
(2, 'planos-edital', 'Planos Edital IA', 'Admin', 1),
(3, 'planos-edital', 'Planos Edital IA', 'Admin', 0),
(4, 'planos-edital', 'Planos Edital IA', 'Admin', 0),
(5, 'planos-edital', 'Planos Edital IA', 'Admin', 0);


-- Analista
INSERT INTO permissoes_pagina (perfil_id, pagina_id, pagina_nome, categoria, permitido) VALUES
(3, 'dashboard', 'Dashboard', 'Principal', 1),
(3, 'alerts', 'Alertas', 'Principal', 1),
(3, 'bids', 'Licitações', 'Licitações', 1),
(3, 'ai-reader', 'Leitura IA', 'Licitações', 1),
(3, 'contracts', 'Contratos', 'Licitações', 1),
(3, 'proposals', 'Propostas', 'Propostas', 1),
(3, 'workflow', 'Workflow de Aprovação', 'Propostas', 0),
(3, 'sicaf', 'Cadastro SICAF', 'SICAF', 0),
(3, 'documents', 'Documentos', 'Documentos', 1),
(3, 'clients', 'Clientes', 'Admin', 1),
(3, 'maintenance', 'Manutenções', 'Admin', 0),
(3, 'reports', 'Relatórios', 'Admin', 0),
(3, 'system-users', 'Usuários', 'Usuários & Acesso', 0),
(3, 'access-profiles', 'Perfil de Acesso', 'Usuários & Acesso', 0),
(3, 'settings', 'Configurações', 'Sistema', 0),
(3, 'smart-alerts', 'Alertas Inteligentes', 'Sistema', 1);

-- Visualizador
INSERT INTO permissoes_pagina (perfil_id, pagina_id, pagina_nome, categoria, permitido) VALUES
(4, 'dashboard', 'Dashboard', 'Principal', 1),
(4, 'alerts', 'Alertas', 'Principal', 1),
(4, 'bids', 'Licitações', 'Licitações', 1),
(4, 'documents', 'Documentos', 'Documentos', 1),
(4, 'ai-reader', 'Leitura IA', 'Licitações', 0),
(4, 'proposals', 'Propostas', 'Propostas', 0),
(4, 'sicaf', 'Cadastro SICAF', 'SICAF', 0),
(4, 'clients', 'Clientes', 'Admin', 0),
(4, 'system-users', 'Usuários', 'Usuários & Acesso', 0),
(4, 'access-profiles', 'Perfil de Acesso', 'Usuários & Acesso', 0),
(4, 'settings', 'Configurações', 'Sistema', 0);

-- Cliente
INSERT INTO permissoes_pagina (perfil_id, pagina_id, pagina_nome, categoria, permitido) VALUES
(5, 'dashboard', 'Dashboard', 'Principal', 1),
(5, 'tickets-client', 'Tickets Cliente', 'Suporte', 1),
(5, 'documents', 'Documentos', 'Documentos', 1),
(5, 'sicaf', 'Cadastro SICAF', 'SICAF', 1),
(5, 'certificates', 'Certidões', 'SICAF', 1);

-- ============================================================
-- USUÁRIOS DE TESTE
-- Senha padrão para todos: 'CadBrasil@2026' (hash fictício)
-- ============================================================

-- Senha padrão para todos os usuários seed: Cadbrasil@123
INSERT INTO usuarios (id, nome, email, senha_hash, telefone, avatar_iniciais, departamento, perfil_id, status) VALUES
(1, 'João Silva', 'joao@cadbrasil.com.br', '$2b$10$7qFnQmEL5TnjfvcW11ZK/O7HMIzQwAxoUfwwwukO4tUqIwxYe00ha', '(11) 99999-0001', 'JS', 'TI', 1, 'Ativo'),
(2, 'Maria Santos', 'maria@cadbrasil.com.br', '$2b$10$7qFnQmEL5TnjfvcW11ZK/O7HMIzQwAxoUfwwwukO4tUqIwxYe00ha', '(11) 99999-0002', 'MS', 'Comercial', 2, 'Ativo'),
(3, 'Pedro Costa', 'pedro@cadbrasil.com.br', '$2b$10$7qFnQmEL5TnjfvcW11ZK/O7HMIzQwAxoUfwwwukO4tUqIwxYe00ha', '(11) 99999-0003', 'PC', 'Licitações', 3, 'Ativo'),
(4, 'Ana Oliveira', 'ana@cadbrasil.com.br', '$2b$10$7qFnQmEL5TnjfvcW11ZK/O7HMIzQwAxoUfwwwukO4tUqIwxYe00ha', '(11) 99999-0004', 'AO', 'Propostas', 3, 'Inativo'),
(5, 'Carlos Souza', 'carlos@cadbrasil.com.br', '$2b$10$7qFnQmEL5TnjfvcW11ZK/O7HMIzQwAxoUfwwwukO4tUqIwxYe00ha', '(11) 99999-0005', 'CS', 'Financeiro', 4, 'Ativo'),
(6, 'Fernanda Lima', 'fernanda@cadbrasil.com.br', '$2b$10$7qFnQmEL5TnjfvcW11ZK/O7HMIzQwAxoUfwwwukO4tUqIwxYe00ha', '(11) 99999-0006', 'FL', 'Jurídico', 2, 'Ativo'),
-- Usuários clientes
(7, 'Roberto Mendes', 'roberto@abcconstrucoes.com.br', '$2b$10$7qFnQmEL5TnjfvcW11ZK/O7HMIzQwAxoUfwwwukO4tUqIwxYe00ha', '(11) 98765-4321', 'RM', NULL, 5, 'Ativo'),
(8, 'Luciana Ferreira', 'luciana@xyzservicos.com.br', '$2b$10$7qFnQmEL5TnjfvcW11ZK/O7HMIzQwAxoUfwwwukO4tUqIwxYe00ha', '(21) 99876-5432', 'LF', NULL, 5, 'Ativo'),
(9, 'Marcos Almeida', 'marcos@techsolutions.com.br', '$2b$10$7qFnQmEL5TnjfvcW11ZK/O7HMIzQwAxoUfwwwukO4tUqIwxYe00ha', '(31) 98765-1234', 'MA', NULL, 5, 'Ativo'),
(10, 'Paula Ribeiro', 'paula@constdelta.com.br', '$2b$10$hash_ficticio_cliente_paula', '(41) 99876-4321', 'PR', NULL, 5, 'Ativo');

-- ============================================================
-- CLIENTES (EMPRESAS)
-- ============================================================

INSERT INTO clientes (id, usuario_id, tipo_documento, documento, razao_social, nome_fantasia, email, telefone, cidade, estado, cep, porte, status) VALUES
(1, 1, 'CNPJ', '12.345.678/0001-90', 'ABC Construções Ltda', 'ABC Construções', 'contato@abcconstrucoes.com.br', '(11) 98765-4321', 'São Paulo', 'SP', '01001-000', 'EPP', 'Ativo'),
(2, 1, 'CNPJ', '23.456.789/0001-01', 'XYZ Serviços SA', 'XYZ Serviços', 'comercial@xyzservicos.com.br', '(21) 99876-5432', 'Rio de Janeiro', 'RJ', '20040-020', 'Média', 'Ativo'),
(3, 2, 'CNPJ', '34.567.890/0001-12', 'Tech Solutions ME', 'Tech Solutions', 'atendimento@techsolutions.com.br', '(31) 98765-1234', 'Belo Horizonte', 'MG', '30130-000', 'ME', 'Pendente'),
(4, 2, 'CNPJ', '45.678.901/0001-23', 'Construtora Delta EPP', 'Delta Construções', 'licitacao@constdelta.com.br', '(41) 99876-4321', 'Curitiba', 'PR', '80010-000', 'EPP', 'Ativo'),
(5, 1, 'CPF',  '123.456.789-00', 'Maria Silva Consultoria', 'Maria Consultoria', 'contato@omegatech.com.br', '(51) 98765-5678', 'Porto Alegre', 'RS', '90010-000', 'MEI', 'Ativo');

INSERT INTO cliente_contatos (cliente_id, nome, cargo, email, telefone, principal) VALUES
(1, 'Roberto Mendes', 'Diretor Comercial', 'roberto@abcconstrucoes.com.br', '(11) 98765-4321', 1),
(1, 'Carla Nunes', 'Gerente de Licitações', 'carla@abcconstrucoes.com.br', '(11) 98765-4322', 0),
(2, 'Luciana Ferreira', 'Diretora Administrativa', 'luciana@xyzservicos.com.br', '(21) 99876-5432', 1),
(3, 'Marcos Almeida', 'Sócio-Proprietário', 'marcos@techsolutions.com.br', '(31) 98765-1234', 1),
(4, 'Paula Ribeiro', 'Diretora de Licitações', 'paula@constdelta.com.br', '(41) 99876-4321', 1),
(5, 'Thiago Lopes', 'CEO', 'thiago@omegatech.com.br', '(51) 98765-5678', 1);

-- ============================================================
-- SICAF CADASTROS
-- ============================================================

INSERT INTO sicaf_cadastros (id, cliente_id, status, data_ultima_atualizacao, data_validade, completude, credenciamento_anual, manutencao_ativa, dias_validade) VALUES
(1, 1, 'Ativo', '2024-02-01', '2026-01-01', 100.00, 1, 1, 283),
(2, 2, 'Ativo', '2024-01-15', '2025-07-15', 85.00, 1, 1, 114),
(3, 3, 'Pendente', '2023-12-20', '2025-06-20', 60.00, 0, 0, 89),
(4, 4, 'Vencendo', '2023-02-10', '2025-03-10', 100.00, 1, 1, 28);

INSERT INTO sicaf_niveis (sicaf_id, nivel, habilitado) VALUES
(1, 'I', 1), (1, 'II', 1), (1, 'III', 1), (1, 'IV', 1),
(2, 'I', 1), (2, 'II', 1), (2, 'III', 1),
(3, 'I', 1), (3, 'II', 1),
(4, 'I', 1), (4, 'II', 1), (4, 'III', 1), (4, 'IV', 1), (4, 'V', 1), (4, 'VI', 1);

-- ============================================================
-- TIPOS DE CERTIDÕES
-- ============================================================

INSERT INTO tipo_certidoes (id, codigo, nome, descricao, nivel_sicaf, orgao_emissor) VALUES
(1,  'cnd_federal',                'CND Conjunta Federal (PGFN/RFB)',                'Certidão Negativa de Débitos relativos a Créditos Tributários Federais e à Dívida Ativa da União', 'III', 'Receita Federal / PGFN'),
(2,  'cnd_estadual',               'CND Estadual (ICMS)',                             'Certidão Negativa de Débitos Estaduais (ICMS e outros tributos estaduais)',                         'IV',  'Secretaria da Fazenda Estadual'),
(3,  'cnd_municipal',              'CND Municipal (ISS)',                             'Certidão Negativa de Débitos Municipais (ISS e outros tributos municipais)',                        'IV',  'Secretaria da Fazenda Municipal'),
(4,  'crf_fgts',                   'CRF FGTS',                                       'Certificado de Regularidade do FGTS',                                                              'III', 'Caixa Econômica Federal'),
(5,  'cndt_trabalhista',           'CNDT - Débitos Trabalhistas',                     'Certidão Negativa de Débitos Trabalhistas',                                                         'III', 'Tribunal Superior do Trabalho'),
(6,  'sicaf_crc',                  'CRC - Certificado de Registro Cadastral',         'Certificado de Registro Cadastral emitido pelo SICAF',                                              NULL,  'SICAF / ComprasNet'),
(7,  'certidao_negativa_falencia', 'Certidão Negativa de Falência/Recuperação',       'Certidão Negativa de Falência e Recuperação Judicial',                                              'VI',  'Poder Judiciário'),
(8,  'balanco_patrimonial',        'Balanço Patrimonial',                             'Balanço Patrimonial e demonstrações contábeis do último exercício',                                  'VI',  'Empresa / Contador'),
(9,  'contrato_social',            'Contrato Social / Ato Constitutivo',              'Contrato Social, Estatuto ou Ato Constitutivo em vigor',                                            'I',   'Junta Comercial'),
(10, 'documento_identidade',       'Documento de Identidade do Responsável',          'RG, CNH ou documento de identificação do responsável legal',                                        'I',   NULL),
(11, 'estatuto_consolidado',       'Estatuto ou Contrato Social Consolidado',         'Estatuto ou Contrato Social com todas as alterações consolidadas',                                   'II',  'Junta Comercial'),
(12, 'certidao_junta_comercial',   'Certidão Simplificada da Junta Comercial',        'Certidão Simplificada emitida pela Junta Comercial do Estado',                                      'II',  'Junta Comercial'),
(13, 'atestado_tecnico',           'Atestado de Capacidade Técnica',                  'Atestado(s) de Capacidade Técnica emitido(s) por contratante(s)',                                    'V',   'Entidade Contratante'),
(14, 'dre',                        'Demonstração de Resultado do Exercício (DRE)',    'DRE do último exercício social',                                                                    'VI',  'Empresa / Contador'),
(15, 'sicaf_situacao',             'Situação do Fornecedor no SICAF',                 'Relatório de Situação do Fornecedor emitido pelo SICAF',                                            NULL,  'SICAF / ComprasNet'),
(16, 'sicaf_geral',                'SICAF - Cadastro Geral',                          'Cadastro geral do SICAF com todos os níveis',                                                       NULL,  'SICAF / ComprasNet'),
(17, 'outro',                      'Outro Documento',                                 'Documento ou certidão não categorizado',                                                            NULL,  NULL);

-- ============================================================
-- CERTIDÕES
-- ============================================================

INSERT INTO certidoes (cliente_id, sicaf_id, tipo_certidao_id, numero, nivel_sicaf, data_emissao, data_validade, status, dias_restantes, auto_renovar) VALUES
(1, 1, 1,  '1234.5678.9012.3456', 'III', '2024-01-10', '2024-07-10', 'Válida', 150, 0),
(1, 1, 2,  'SP-2024-00123456',    'IV',  '2024-01-15', '2024-04-15', 'Válida', 60, 0),
(2, 2, 4,  '2024.0123.4567.8901', 'III', '2024-02-01', '2024-02-12', 'Vencendo', 5, 1),
(3, 3, 3,  'MUN-2024-789012',     'IV',  '2024-01-20', '2024-02-08', 'Vencendo', 1, 0),
(4, 4, 5,  'TST-2024-456789',     'III', '2024-01-05', '2024-02-05', 'Vencida', -2, 0),
(1, 1, 16, 'SICAF-123456789',     NULL,  '2024-01-01', '2025-01-01', 'Válida', 320, 0),
(1, 1, 9,  NULL,                   'I',   '2024-01-10', NULL,         'Válida', 0, 0),
(1, 1, 10, NULL,                   'I',   '2024-01-10', NULL,         'Válida', 0, 0),
(1, 1, 11, NULL,                   'II',  '2024-01-15', NULL,         'Válida', 0, 0),
(1, 1, 12, NULL,                   'II',  '2024-01-15', '2025-07-15', 'Válida', 0, 0),
(2, 2, 1,  NULL,                   'III', '2024-02-01', '2025-08-15', 'Válida', 0, 0),
(2, 2, 5,  NULL,                   'III', '2024-02-01', '2025-06-30', 'Válida', 0, 0),
(3, 3, 2,  NULL,                   'IV',  '2023-12-20', '2025-01-01', 'Vencida', -40, 0),
(4, 4, 13, NULL,                   'V',   '2023-12-05', NULL,         'Válida', 0, 0),
(4, 4, 8,  NULL,                   'VI',  '2023-12-05', NULL,         'Válida', 0, 0),
(4, 4, 14, NULL,                   'VI',  '2023-12-05', NULL,         'Válida', 0, 0);

-- ============================================================
-- LICITAÇÕES
-- ============================================================

INSERT INTO licitacoes (id, numero_processo, numero_controle_pncp, origem, lei, modalidade, modo_disputa, criterio_julgamento, nome_orgao, nome_uasg, uf, municipio, esfera, objeto_resumido, objeto, valor_estimado, srp, data_publicacao, data_abertura, situacao, status) VALUES
(1, 'PE 045/2024', '08032567000151-1-000123/2024', 'pncp', '14133', 'Pregão Eletrônico', 'Aberto', 'Menor Preço', 'Prefeitura Municipal de São Paulo', '9876 - Prefeitura Municipal de São Paulo', 'SP', 'São Paulo', 'Municipal', 'Aquisição de equipamentos de informática', 'Aquisição de equipamentos de informática para modernização do parque tecnológico municipal.', 450000.00, 0, '2024-02-01 10:00:00', '2024-02-15 14:00:00', 'Proposta', 'Em andamento'),
(2, 'CC 012/2024', '08032567000151-1-000456/2024', 'pncp', '14133', 'Concorrência', 'Fechado', 'Técnica e Preço', 'DNIT - Departamento Nacional de Infraestrutura', '3456 - DNIT', 'RS', 'Porto Alegre', 'Estadual', 'Construção de passarela de pedestres', 'Construção de passarela de pedestres na BR-290, km 112, município de Porto Alegre/RS.', 2800000.00, 0, '2024-02-05 08:00:00', '2024-02-20 09:00:00', 'Documentação', 'Em andamento'),
(3, 'TP 008/2024', '08032567000151-1-000789/2024', 'pncp', '14133', 'Tomada de Preços', 'Aberto', 'Menor Preço', 'Tribunal de Justiça do Estado', '5678 - TJ/RS', 'RS', 'Porto Alegre', 'Estadual', 'Serviços de manutenção predial', 'Contratação de empresa especializada em serviços de manutenção predial preventiva e corretiva.', 890000.00, 1, '2024-02-10 14:30:00', '2024-02-25 10:00:00', 'Análise de Edital', 'Aguardando'),
(4, 'PE 089/2024', '08032567000151-1-000321/2024', 'pncp', '14133', 'Pregão Eletrônico', 'Aberto', 'Menor Preço', 'Banco do Brasil', '1234 - Banco do Brasil', 'SC', 'Florianópolis', 'Municipal', 'Fornecimento de material de escritório', 'Fornecimento de material de escritório para as agências da região Sul.', 125000.00, 0, '2024-01-25 09:00:00', '2024-02-10 15:00:00', 'Homologada', 'Concluída'),
(5, 'PE 067/2024', '08032567000151-1-000654/2024', 'pncp', '14133', 'Pregão Eletrônico', 'Aberto', 'Menor Preço', 'Ministério da Saúde', '2345 - Ministério da Saúde', 'PE', 'Recife', 'Municipal', 'Serviços de limpeza e conservação', 'Contratação de empresa para prestação de serviços de limpeza e conservação predial.', 1200000.00, 1, '2024-02-12 11:00:00', '2024-02-28 14:00:00', 'Proposta', 'Em andamento');

-- ============================================================
-- PROPOSTAS
-- ============================================================

INSERT INTO propostas (id, licitacao_id, cliente_id, numero_proposta, tipo, valor, status, progresso, criado_por) VALUES
(1, 1, 1, 'PROP-2024-045', 'Comercial', 425000.00, 'Em elaboração', 75, 3),
(2, 2, 4, 'PROP-2024-044', 'Técnica e Preço', 2650000.00, 'Aguardando revisão', 100, 3),
(3, 3, 2, 'PROP-2024-043', 'Comercial', 780000.00, 'Enviada', 100, 3),
(4, 4, 3, 'PROP-2024-042', 'Comercial', 98500.00, 'Vencedora', 100, 3),
(5, 5, 1, 'PROP-2024-041', 'Comercial', 1100000.00, 'Em elaboração', 30, 3);

-- ============================================================
-- WORKFLOW DE APROVAÇÃO
-- ============================================================

INSERT INTO workflow_aprovacao (proposta_id, etapa, prazo, observacao) VALUES
(1, 'diretor', '2024-02-10', NULL),
(2, 'gestor', '2024-02-09', NULL),
(3, 'aprovada', '2024-02-08', NULL),
(4, 'aprovada', '2024-02-06', NULL),
(5, 'analise', '2024-02-07', NULL);

-- ============================================================
-- CONTRATOS
-- ============================================================

INSERT INTO contratos (id, numero_contrato, nome_orgao, tipo, valor_inicial, valor_global, data_inicio_vigencia, data_fim_vigencia, modalidade_licitacao, numero_processo, situacao, data_assinatura, data_publicacao, objeto, origem) VALUES
(1, 'CTR-2025/001', 'Ministério da Saúde', 'Fornecimento', 1250000.00, 1380000.00, '2025-01-15', '2026-01-14', 'Pregão Eletrônico', '25000.012345/2025-01', 'Ativo', '2025-01-10', '2025-01-12', 'Fornecimento de equipamentos de informática para unidades de saúde.', 'compras_gov'),
(2, 'CTR-2024/087', 'Tribunal Regional Federal - 1ª Região', 'Serviços', 890000.00, 890000.00, '2024-06-01', '2025-05-31', 'Concorrência', '0001234-56.2024.4.01.8000', 'Ativo', '2024-05-28', '2024-05-30', 'Prestação de serviços de manutenção predial preventiva e corretiva.', 'compras_gov'),
(3, 'CTR-2024/045', 'Universidade Federal de Minas Gerais', 'Tecnologia', 2100000.00, 2350000.00, '2024-03-01', '2025-02-28', 'Pregão Eletrônico', '23072.001234/2024-56', 'Concluído', '2024-02-25', '2024-02-27', 'Implantação de sistema de gestão acadêmica integrado.', 'compras_gov'),
(4, 'CTR-2025/012', 'Secretaria de Obras do DF', 'Obras', 5600000.00, 5600000.00, '2025-02-01', '2026-07-31', 'Concorrência', '00410-00001234/2025-01', 'Pendente', NULL, NULL, 'Construção de ponte sobre o Lago Paranoá - Etapa 2.', 'compras_gov'),
(5, 'CTR-2024/099', 'INSS - Instituto Nacional do Seguro Social', 'Serviços', 450000.00, 450000.00, '2024-08-01', '2025-07-31', 'Pregão Eletrônico', '35014.001234/2024-78', 'Suspenso', '2024-07-28', '2024-07-30', 'Serviços de digitalização e guarda de documentos.', 'compras_gov');

-- ============================================================
-- MANUTENÇÕES
-- ============================================================

INSERT INTO manutencoes (id, titulo, cliente_id, tipo, plano, valor, status, data_inicio, data_fim, dias_restantes) VALUES
(1, 'Manutenção CADBRASIL', 1, 'Preventiva', 'Manutenção CADBRASIL', 1860.00, 'Ativo', '2024-01-01', '2024-12-31', 320),
(2, 'Manutenção CADBRASIL', 2, 'Preventiva', 'Manutenção CADBRASIL', 1860.00, 'Ativo', '2024-03-01', '2025-02-28', 385),
(3, 'Manutenção CADBRASIL', 3, 'Preventiva', 'Manutenção CADBRASIL', 1860.00, 'A Vencer', '2023-06-01', '2024-05-31', 15),
(4, 'Manutenção CADBRASIL', 4, 'Preventiva', 'Manutenção CADBRASIL', 1860.00, 'Ativo', '2024-01-15', '2025-01-14', 340),
(5, 'Manutenção CADBRASIL', 5, 'Preventiva', 'Manutenção CADBRASIL', 1860.00, 'Vencido', '2023-01-01', '2023-12-31', 0);

INSERT INTO manutencao_boletos (manutencao_id, cliente_id, numero_boleto, valor, mes_referencia, ano_referencia, data_vencimento, data_pagamento, status, forma_pagamento) VALUES
(1, 1, 'BOL-2024-001', 155.00, 1, 2024, '2024-01-15', '2024-01-14', 'Pago', 'Boleto'),
(1, 1, 'BOL-2024-002', 155.00, 2, 2024, '2024-02-15', '2024-02-13', 'Pago', 'PIX'),
(1, 1, 'BOL-2024-003', 155.00, 3, 2024, '2024-03-15', NULL, 'Pendente', 'Boleto'),
(2, 2, 'BOL-2024-010', 155.00, 3, 2024, '2024-03-10', '2024-03-09', 'Pago', 'PIX'),
(2, 2, 'BOL-2024-011', 155.00, 4, 2024, '2024-04-10', NULL, 'Pendente', 'Boleto');

-- ============================================================
-- HISTÓRICO DE RENOVAÇÕES SICAF
-- ============================================================

INSERT INTO sicaf_renovacoes (sicaf_id, cliente_id, ano_referencia, data_renovacao, status, renovado_por, observacoes) VALUES
(1, 1, 2023, '2023-01-15 10:00:00', 'Concluída', 1, 'Renovação anual 2023'),
(1, 1, 2024, '2024-01-10 14:30:00', 'Concluída', 1, 'Renovação anual 2024'),
(1, 1, 2025, '2025-01-05 09:00:00', 'Concluída', 2, 'Renovação anual 2025'),
(2, 2, 2024, '2024-01-20 11:00:00', 'Concluída', 1, 'Renovação anual 2024'),
(2, 2, 2025, '2025-01-18 16:00:00', 'Concluída', 2, 'Renovação anual 2025'),
(4, 4, 2021, '2021-02-10 08:00:00', 'Concluída', 1, 'Renovação anual 2021'),
(4, 4, 2022, '2022-02-08 09:30:00', 'Concluída', 1, 'Renovação anual 2022'),
(4, 4, 2023, '2023-02-12 10:00:00', 'Concluída', 2, 'Renovação anual 2023'),
(4, 4, 2024, '2024-02-05 14:00:00', 'Concluída', 1, 'Renovação anual 2024'),
(4, 4, 2025, '2025-01-28 11:30:00', 'Concluída', 2, 'Renovação anual 2025');

-- ============================================================
-- HISTÓRICO DE RENOVAÇÕES MANUTENÇÃO
-- ============================================================

INSERT INTO manutencao_renovacoes (manutencao_id, cliente_id, data_renovacao, data_inicio_novo, data_fim_novo, valor_novo, status, renovado_por) VALUES
(1, 1, '2024-01-01 09:00:00', '2024-01-01', '2024-12-31', 10000.00, 'Concluída', 1),
(2, 2, '2024-03-01 10:00:00', '2024-03-01', '2025-02-28', 5400.00, 'Concluída', 2),
(4, 4, '2024-01-15 14:00:00', '2024-01-15', '2025-01-14', 24000.00, 'Concluída', 1);

-- ============================================================
-- TAXAS SICAF
-- ============================================================

INSERT INTO taxas_sicaf (sicaf_id, cliente_id, descricao, valor, ano_referencia, forma_pagamento, status) VALUES
(1, 1, 'Cadastro SICAF Anual 2026', 985.00, 2025, 'PIX', 'Pago'),
(2, 2, 'Cadastro SICAF Anual 2026', 985.00, 2025, 'Boleto', 'Pago'),
(4, 4, 'Cadastro SICAF Anual 2026', 985.00, 2026, NULL, 'Pendente');

-- ============================================================
-- TICKETS
-- ============================================================

INSERT INTO tickets (id, codigo, titulo, descricao, status, prioridade, categoria, cliente_id, criado_por, atribuido_a, sla_prazo, sla_minutos_restantes) VALUES
(1, 'TK-001', 'Erro ao renovar CND Federal', 'Sistema apresenta erro 500 ao tentar renovar certidão', 'aberto', 'alta', 'bug', 1, 7, 2, '2025-02-10 13:30:00', 45),
(2, 'TK-002', 'Dúvida sobre Nível VI SICAF', 'Cliente precisa de orientação sobre documentação', 'aberto', 'media', 'suporte', 2, 8, 1, '2025-02-10 18:15:00', 320),
(3, 'TK-003', 'Solicitar integração com ComprasNet', 'Necessidade de integração automática com portal', 'em_andamento', 'media', 'melhoria', 4, 10, 6, '2025-02-11 14:00:00', 1200),
(4, 'TK-004', 'Boleto de manutenção não gerado', 'Boleto de fevereiro não foi gerado automaticamente', 'em_andamento', 'alta', 'bug', 1, 7, 2, '2025-02-09 16:00:00', -120),
(5, 'TK-005', 'Atualização de dados cadastrais', 'Alteração de endereço e telefone', 'resolvido', 'baixa', 'suporte', 3, 9, 1, '2025-02-09 11:00:00', 600),
(6, 'TK-006', 'Relatório de certidões vencidas', 'Gerar relatório consolidado de todas certidões vencidas', 'resolvido', 'media', 'melhoria', 2, 8, 6, '2025-02-08 16:30:00', 1440),
(7, 'TK-007', 'Problema no login do portal', 'Acesso negado ao tentar acessar SICAF Gov', 'fechado', 'alta', 'bug', 4, 10, 2, '2025-02-05 13:00:00', 240),
(8, 'TK-008', 'Treinamento para novo funcionário', 'Novo colaborador precisa de acesso e treinamento', 'fechado', 'baixa', 'suporte', 3, 9, 1, '2025-02-04 10:00:00', 1440);

INSERT INTO ticket_mensagens (ticket_id, remetente_tipo, remetente_nome, remetente_id, mensagem, created_at) VALUES
(1, 'client', 'Roberto Mendes', 7, 'Estou tentando renovar a CND Federal mas aparece erro 500.', '2025-02-10 09:30:00'),
(1, 'support', 'Maria Santos', 2, 'Olá! Já estamos verificando o problema. Pode informar qual navegador está usando?', '2025-02-10 09:45:00'),
(1, 'client', 'Roberto Mendes', 7, 'Estou usando o Google Chrome versão 121.', '2025-02-10 10:00:00'),
(2, 'client', 'Luciana Ferreira', 8, 'Quais documentos são necessários para atingir o Nível VI no SICAF?', '2025-02-09 14:00:00'),
(2, 'support', 'João Silva', 1, 'Para o Nível VI você precisa dos seguintes documentos: Balanço Patrimonial, DRE e certidões de regularidade fiscal.', '2025-02-09 15:30:00'),
(4, 'client', 'Roberto Mendes', 7, 'O boleto de fevereiro não apareceu no sistema.', '2025-02-09 08:00:00'),
(4, 'support', 'Maria Santos', 2, 'Identificamos o problema. Estamos gerando o boleto manualmente.', '2025-02-09 10:00:00'),
(4, 'client', 'Roberto Mendes', 7, 'Obrigado, aguardo.', '2025-02-09 10:15:00'),
(4, 'support', 'Maria Santos', 2, 'Boleto gerado com sucesso. Pode verificar na área financeira.', '2025-02-09 14:00:00'),
(5, 'client', 'Marcos Almeida', 9, 'Preciso atualizar o endereço e telefone da empresa.', '2025-02-08 11:00:00'),
(5, 'support', 'João Silva', 1, 'Dados atualizados com sucesso!', '2025-02-09 09:00:00'),
(7, 'client', 'Paula Ribeiro', 10, 'Não consigo acessar o portal SICAF Gov. Aparece acesso negado.', '2025-02-05 09:00:00'),
(7, 'support', 'Maria Santos', 2, 'Resetamos suas credenciais. Tente novamente.', '2025-02-05 11:00:00'),
(7, 'client', 'Paula Ribeiro', 10, 'Funcionou! Obrigado.', '2025-02-05 12:00:00');

-- ============================================================
-- ALERTAS
-- ============================================================

INSERT INTO alertas (tipo, titulo, descricao, categoria, referencia_tipo, referencia_id, usuario_id) VALUES
('urgent', 'Proposta vence em 2 horas', 'PE 045/2024 - Prefeitura de São Paulo', 'Licitação', 'licitacao', 1, 1),
('warning', 'CND Federal vence em 3 dias', 'ABC Construções Ltda - Renovar até 10/02/2024', 'Certidão', 'certidao', 1, 1),
('warning', 'FGTS vence amanhã', 'XYZ Serviços SA - CRF precisa ser renovado', 'Certidão', 'certidao', 3, 1),
('info', 'Nova licitação disponível', 'Pregão Eletrônico 123/2024 - Ministério da Saúde', 'Oportunidade', 'licitacao', NULL, 1),
('success', 'Proposta enviada com sucesso', 'CC 012/2024 - DNIT - Aguardando resultado', 'Licitação', 'proposta', 3, 1),
('warning', 'SICAF precisa de atualização', 'Tech Solutions ME - Nível III pendente', 'SICAF', 'sicaf', 3, 1);

-- ============================================================
-- CONFIGURAÇÕES DE NOTIFICAÇÃO
-- ============================================================

INSERT INTO configuracoes_notificacao (usuario_id, email_ativo, push_ativo, auto_renovar, resumo_diario, dias_antecedencia) VALUES
(1, 1, 1, 0, 1, 7),
(2, 1, 1, 0, 1, 7),
(3, 1, 0, 0, 1, 15),
(7, 1, 1, 1, 1, 7),
(8, 1, 1, 0, 1, 7);

-- ============================================================
-- CONCORRENTES
-- ============================================================

INSERT INTO concorrentes (nome, cnpj, vitorias, participacoes, taxa_vitoria, valor_total) VALUES
('Alpha Serviços Ltda', '11.222.333/0001-44', 18, 42, 42.86, 2100000.00),
('Beta Soluções SA', '22.333.444/0001-55', 15, 35, 42.86, 1750000.00),
('Gamma Tech EPP', '33.444.555/0001-66', 12, 30, 40.00, 1400000.00),
('Delta Corp ME', '44.555.666/0001-77', 10, 28, 35.71, 980000.00);

INSERT INTO resultados_licitacao (licitacao_id, resultado, posicao, total_concorrentes, valor_proposto) VALUES
(1, 'Vencedor', 1, 8, 420000.00),
(2, '2º Lugar', 2, 12, 550000.00),
(3, 'Vencedor', 1, 5, 780000.00),
(4, 'Vencedor', 1, 15, 98500.00),
(5, 'Não participou', NULL, 6, NULL);

-- ============================================================
-- PASTAS DE DOCUMENTOS
-- ============================================================

INSERT INTO pastas_documentos (nome, cor, quantidade) VALUES
('Contratos Sociais', 'text-blue-500', 12),
('Certidões', 'text-emerald-500', 48),
('Propostas', 'text-purple-500', 24),
('Editais', 'text-amber-500', 36),
('Atestados', 'text-pink-500', 18),
('Balanços', 'text-cyan-500', 8);

-- ============================================================
-- DOCUMENTOS
-- ============================================================

INSERT INTO documentos (cliente_id, nome, pasta, tipo_arquivo, tamanho, data_upload, uploaded_by) VALUES
(1, 'Contrato Social - ABC Construções.pdf', 'Contratos Sociais', 'PDF', '2.4 MB', '2024-02-01', 1),
(2, 'CND Federal - XYZ Serviços.pdf', 'Certidões', 'PDF', '156 KB', '2024-02-05', 2),
(1, 'Proposta PE 045-2024.xlsx', 'Propostas', 'Excel', '890 KB', '2024-02-07', 3),
(NULL, 'Edital Pregão 089-2024.pdf', 'Editais', 'PDF', '4.2 MB', '2024-02-03', 3),
(4, 'Atestado Capacidade Técnica.pdf', 'Atestados', 'PDF', '1.1 MB', '2024-01-28', 2),
(3, 'Logo Empresa.png', 'Contratos Sociais', 'Imagem', '245 KB', '2024-01-15', 1);

-- ============================================================
-- PACOTES DE LEITURA IA
-- ============================================================

INSERT INTO pacotes_leitura_ia (nome, quantidade_leituras, preco, descricao, recursos, destaque, economia) VALUES
('Starter', 10, 49.90, '10 leituras de edital', '["10 leituras de edital","Extração de requisitos","Chat com IA básico","Exportação PDF"]', 0, NULL),
('Profissional', 50, 199.90, '50 leituras de edital', '["50 leituras de edital","Extração avançada com IA","Chat ilimitado por edital","Exportação PDF e DOCX","Comparação entre editais","Alertas de prazos"]', 1, '20% de economia'),
('Enterprise', 200, 599.90, '200 leituras de edital', '["200 leituras de edital","IA premium com análise profunda","Chat ilimitado + histórico","Todos os formatos de exportação","Comparação entre editais","Alertas de prazos + e-mail","Suporte prioritário","Multiusuário (até 5)"]', 0, '40% de economia');

INSERT INTO usuario_creditos_ia (usuario_id, creditos_totais, creditos_utilizados) VALUES
(1, 3, 1),
(2, 3, 0),
(3, 15, 3);

-- ============================================================
-- CONFIGURAÇÕES DO SISTEMA
-- ============================================================

INSERT INTO configuracoes_sistema (chave, valor, categoria, descricao) VALUES
-- Empresa
('empresa_nome', 'CadBrasil Licitações', 'empresa', 'Nome da empresa'),
('empresa_razao_social', 'CadBrasil Consultoria Ltda', 'empresa', 'Razão social da empresa'),
('empresa_cnpj', '99.888.777/0001-66', 'empresa', 'CNPJ da empresa'),
('empresa_email', 'contato@cadbrasil.com.br', 'empresa', 'Email principal'),
('empresa_telefone', '(11) 3000-0000', 'empresa', 'Telefone principal'),
('empresa_endereco', 'SBS Quadra 2, Bloco E, Sala 1001 - Brasília, DF - 70070-120', 'empresa', 'Endereço completo'),
('empresa_website', 'www.cadbrasil.com.br', 'empresa', 'Website da empresa'),
('empresa_inscricao_estadual', 'Isento', 'empresa', 'Inscrição estadual'),
-- Email / SMTP
('smtp_provider', 'gmail', 'email', 'Provedor de email (gmail, outlook, sendgrid, resend, ses, mailgun, smtp)'),
('smtp_metodo', 'smtp', 'email', 'Método de conexão (api ou smtp)'),
('smtp_host', 'smtp.gmail.com', 'email', 'Servidor SMTP'),
('smtp_porta', '587', 'email', 'Porta SMTP'),
('smtp_usuario', 'noreply@cadbrasil.com.br', 'email', 'Usuário / Email de autenticação SMTP'),
('smtp_senha', '', 'email', 'Senha / App Password do SMTP'),
('smtp_tls', 'true', 'email', 'Usar conexão TLS/SSL (true ou false)'),
('smtp_api_key', '', 'email', 'API Key do provedor de email (quando método = api)'),
('smtp_secret_key', '', 'email', 'Secret Key do provedor (SendGrid, Amazon SES)'),
('smtp_email_remetente', 'noreply@cadbrasil.com.br', 'email', 'Email do remetente para envio'),
('smtp_nome_remetente', 'CadBrasil Licitações', 'email', 'Nome de exibição do remetente'),
-- Integrações
('pncp_api_url', 'https://pncp.gov.br/api/consulta/v1', 'integracoes', 'URL da API do PNCP'),
('sicaf_api_url', 'https://comprasgovernamentais.gov.br/sicaf', 'integracoes', 'URL da API do SICAF'),
-- Licitações
('taxa_sicaf_anual', '35.16', 'licitacoes', 'Valor da taxa anual do SICAF (governo federal)'),
('valor_cadastro_sicaf', '985.00', 'licitacoes', 'Valor do serviço de cadastro SICAF anual CADBRASIL'),
('valor_manutencao_mensal', '155.00', 'licitacoes', 'Valor do plano de manutenção mensal CADBRASIL'),
('limite_atualizacoes_gratuitas', '3', 'licitacoes', 'Qtd de atualizações de certidões gratuitas incluídas no SICAF anual'),
('dias_alerta_certidao', '30', 'licitacoes', 'Dias antes do vencimento da certidão para alertar'),
('dias_alerta_prazo_licitacao', '5', 'licitacoes', 'Dias antes do prazo da licitação para alertar'),
('max_itens_pagina', '50', 'licitacoes', 'Limite de registros por página em listagens'),
('intervalo_atualizacao', '15', 'licitacoes', 'Frequência de busca por novas licitações (minutos)'),
('auto_busca_licitacoes', 'true', 'licitacoes', 'Buscar novas licitações automaticamente'),
('auto_renovacao_certidoes', 'false', 'licitacoes', 'Tentar renovar certidões automaticamente'),
('auto_analise_editais', 'true', 'licitacoes', 'Análise automática de editais com IA'),
-- Segurança
('sessao_timeout', '30', 'seguranca', 'Timeout de sessão em minutos'),
('2fa_obrigatorio', 'false', 'seguranca', 'Autenticação em dois fatores obrigatória'),
-- Notificações
('notif_novas_licitacoes', 'true', 'notificacoes', 'Alertar sobre novas licitações encontradas'),
('notif_vencimento_certidoes', 'true', 'notificacoes', 'Alertar sobre certidões próximas do vencimento'),
('notif_propostas_pendentes', 'true', 'notificacoes', 'Notificar sobre propostas aguardando aprovação'),
('notif_prazos_licitacao', 'true', 'notificacoes', 'Alertar sobre prazos de licitação'),
('notif_alertas_criticos', 'true', 'notificacoes', 'Certidões vencidas, prazos expirados'),
('notif_resumo_email', 'false', 'notificacoes', 'Receber resumo diário por email'),
-- Aparência
('aparencia_tema', 'dark', 'aparencia', 'Tema do sistema (dark ou light)'),
('aparencia_cor_principal', 'blue', 'aparencia', 'Cor principal do sistema'),
('aparencia_sidebar_compacta', 'false', 'aparencia', 'Sidebar compacta automática'),
-- Backup
('backup_automatico', 'true', 'backup', 'Backup automático diário habilitado'),
('backup_horario', '03:00', 'backup', 'Horário do backup automático');

-- ============================================================
-- TEMPLATES DE EMAIL (HTML avançado com layout moderno CadBrasil)
-- ============================================================

INSERT INTO templates_email (nome, assunto, corpo_html, variaveis_disponiveis) VALUES

-- ── 1. BEM-VINDO ──
('Bem-vindo ao CadBrasil', 'Bem-vindo ao CadBrasil, {{nome}}! 🎉', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8;color:#1e293b}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#1e40af,#6366f1);padding:48px 40px;text-align:center;position:relative}.header::after{content:"";position:absolute;bottom:0;left:0;right:0;height:60px;background:linear-gradient(transparent,rgba(255,255,255,.05))}.header .logo{width:56px;height:56px;background:rgba(255,255,255,.2);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff;margin-bottom:16px;backdrop-filter:blur(8px)}.header h1{color:#fff;font-size:26px;font-weight:700;margin-bottom:6px}.header p{color:rgba(255,255,255,.8);font-size:14px}.body{padding:40px}.body h2{font-size:20px;color:#1e293b;margin-bottom:16px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.info-card{background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin:24px 0}.info-card table{width:100%}.info-card td{padding:6px 0;font-size:14px}.info-card td:first-child{color:#64748b;width:120px}.info-card td:last-child{color:#1e293b;font-weight:600}.btn{display:inline-block;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;margin-top:8px;box-shadow:0 4px 16px rgba(37,99,235,.3)}.divider{height:1px;background:linear-gradient(90deg,transparent,#e2e8f0,transparent);margin:28px 0}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}.footer a{color:#2563eb;text-decoration:none}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="logo">CB</div><h1>Bem-vindo ao CadBrasil! 🎉</h1><p>Sua conta foi criada com sucesso</p></div><div class="body"><h2>Olá, {{nome}}!</h2><p>É um prazer tê-lo conosco. Sua conta no <strong>CadBrasil</strong> foi configurada e está pronta para uso.</p><div class="info-card"><table><tr><td>📧 Email:</td><td>{{email}}</td></tr><tr><td>🏢 Empresa:</td><td>{{empresa}}</td></tr><tr><td>📋 Perfil:</td><td>{{perfil}}</td></tr></table></div><p>Acesse o painel e comece a gerenciar suas licitações, certidões e propostas de forma inteligente.</p><div style="text-align:center;margin-top:24px"><a href="{{link_acesso}}" class="btn">Acessar Meu Painel →</a></div><div class="divider"></div><p style="font-size:13px;color:#64748b">Caso tenha dúvidas, nossa equipe está disponível pelo suporte. Estamos prontos para ajudar!</p></div><div class="footer"><p><strong>CadBrasil Consultoria Ltda</strong></p><p>Gestão inteligente de licitações e documentos</p><p style="margin-top:8px">Este é um email automático. Não responda diretamente.</p></div></div></div></body></html>', '["nome", "email", "empresa", "perfil", "link_acesso"]'),

-- ── 2. CERTIDÃO VENCENDO ──
('Certidão Vencendo', '⚠️ Alerta: {{certidao}} vence em {{dias}} dias', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8;color:#1e293b}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#d97706,#f59e0b);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.alert-box{background:#fffbeb;border:2px solid #fbbf24;border-radius:12px;padding:24px;margin:24px 0;text-align:center}.alert-box .days{font-size:48px;font-weight:800;color:#d97706;line-height:1}.alert-box .label{font-size:13px;color:#92400e;text-transform:uppercase;letter-spacing:1px;margin-top:4px}.detail-grid{display:flex;gap:16px;margin:20px 0}.detail-item{flex:1;background:#f8fafc;border-radius:10px;padding:16px;text-align:center}.detail-item .val{font-size:14px;font-weight:700;color:#1e293b}.detail-item .lbl{font-size:11px;color:#64748b;margin-top:2px}.btn{display:inline-block;background:linear-gradient(135deg,#d97706,#f59e0b);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 16px rgba(217,119,6,.3)}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">⚠️</div><h1>Certidão Vencendo</h1><p>Atenção ao prazo de validade</p></div><div class="body"><p>Prezado(a),</p><p>A certidão abaixo está próxima do vencimento e precisa ser renovada para manter a regularidade no SICAF.</p><div class="alert-box"><div class="days">{{dias}}</div><div class="label">dias restantes</div></div><table style="width:100%;border-collapse:collapse;margin:20px 0"><tr style="background:#f8fafc"><td style="padding:12px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0">Certidão</td><td style="padding:12px 16px;font-size:14px;font-weight:600;color:#1e293b;border-bottom:1px solid #e2e8f0">{{certidao}}</td></tr><tr><td style="padding:12px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0">Empresa</td><td style="padding:12px 16px;font-size:14px;font-weight:600;color:#1e293b;border-bottom:1px solid #e2e8f0">{{empresa}}</td></tr><tr style="background:#f8fafc"><td style="padding:12px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0">CNPJ</td><td style="padding:12px 16px;font-size:14px;font-weight:600;color:#1e293b;border-bottom:1px solid #e2e8f0">{{cnpj}}</td></tr><tr><td style="padding:12px 16px;font-size:13px;color:#64748b">Vencimento</td><td style="padding:12px 16px;font-size:14px;font-weight:700;color:#d97706">{{data_vencimento}}</td></tr></table><div style="text-align:center;margin-top:24px"><a href="{{link_renovar}}" class="btn">Renovar Certidão →</a></div></div><div class="footer"><p><strong>CadBrasil Consultoria</strong> · Gestão de Certidões</p><p>Email automático do sistema de monitoramento.</p></div></div></div></body></html>', '["certidao", "empresa", "cnpj", "dias", "data_vencimento", "link_renovar"]'),

-- ── 3. CERTIDÃO VENCIDA ──
('Certidão Vencida', '🔴 URGENTE: {{certidao}} está vencida — {{empresa}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#dc2626,#ef4444);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.urgent-box{background:#fef2f2;border:2px solid #fca5a5;border-radius:12px;padding:24px;margin:24px 0;text-align:center}.urgent-box .status{font-size:18px;font-weight:800;color:#dc2626;text-transform:uppercase;letter-spacing:2px}.urgent-box .detail{font-size:14px;color:#991b1b;margin-top:8px}.btn{display:inline-block;background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 16px rgba(220,38,38,.3)}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">🔴</div><h1>Certidão Vencida</h1><p>Ação imediata necessária</p></div><div class="body"><p>Prezado(a),</p><p>A certidão abaixo <strong>já está vencida</strong> e pode impedir a participação em licitações e o cadastro no SICAF.</p><div class="urgent-box"><div class="status">⛔ Documento Vencido</div><div class="detail"><strong>{{certidao}}</strong> — venceu em <strong>{{data_vencimento}}</strong></div></div><table style="width:100%;border-collapse:collapse;margin:20px 0"><tr style="background:#fef2f2"><td style="padding:12px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #fecaca">Empresa</td><td style="padding:12px 16px;font-size:14px;font-weight:600;color:#1e293b;border-bottom:1px solid #fecaca">{{empresa}}</td></tr><tr><td style="padding:12px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0">CNPJ</td><td style="padding:12px 16px;font-size:14px;font-weight:600;color:#1e293b;border-bottom:1px solid #e2e8f0">{{cnpj}}</td></tr><tr style="background:#fef2f2"><td style="padding:12px 16px;font-size:13px;color:#64748b">Nível SICAF</td><td style="padding:12px 16px;font-size:14px;font-weight:600;color:#dc2626">{{nivel_sicaf}}</td></tr></table><div style="text-align:center;margin-top:24px"><a href="{{link_renovar}}" class="btn">Regularizar Agora →</a></div></div><div class="footer"><p><strong>CadBrasil</strong> · Monitoramento de Certidões</p><p>Email de alerta crítico do sistema.</p></div></div></div></body></html>', '["certidao", "empresa", "cnpj", "data_vencimento", "nivel_sicaf", "link_renovar"]'),

-- ── 4. CERTIDÃO RENOVADA ──
('Certidão Renovada', '✅ Certidão {{certidao}} renovada com sucesso — {{empresa}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#059669,#10b981);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.success-box{background:#ecfdf5;border:2px solid #6ee7b7;border-radius:12px;padding:24px;text-align:center;margin:24px 0}.success-box .check{font-size:36px;margin-bottom:8px}.success-box .msg{font-size:16px;font-weight:700;color:#059669}.info-table{width:100%;border-collapse:collapse;margin:20px 0}.info-table td{padding:12px 16px;font-size:14px;border-bottom:1px solid #e2e8f0}.info-table td:first-child{color:#64748b;font-size:13px}.info-table td:last-child{font-weight:600;color:#1e293b}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">✅</div><h1>Certidão Renovada</h1><p>Documento atualizado com sucesso</p></div><div class="body"><p>Prezado(a),</p><p>Informamos que a certidão foi renovada com sucesso no sistema.</p><div class="success-box"><div class="check">✓</div><div class="msg">Renovação concluída</div></div><table class="info-table"><tr style="background:#f8fafc"><td>Certidão</td><td>{{certidao}}</td></tr><tr><td>Empresa</td><td>{{empresa}}</td></tr><tr style="background:#f8fafc"><td>Nova validade</td><td style="color:#059669;font-weight:700">{{nova_validade}}</td></tr><tr><td>Nível SICAF</td><td>{{nivel_sicaf}}</td></tr></table></div><div class="footer"><p><strong>CadBrasil</strong> · Gestão de Certidões</p><p>Email automático de confirmação.</p></div></div></div></body></html>', '["certidao", "empresa", "nova_validade", "nivel_sicaf"]'),

-- ── 5. BOLETO GERADO ──
('Boleto de Manutenção', 'Boleto de Manutenção {{mes}}/{{ano}} — R$ {{valor}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#1e40af,#3b82f6);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.valor-box{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:32px;text-align:center;margin:24px 0}.valor-box .label{font-size:12px;color:#3b82f6;text-transform:uppercase;letter-spacing:2px;font-weight:600}.valor-box .amount{font-size:40px;font-weight:800;color:#1e40af;margin:8px 0}.valor-box .due{font-size:14px;color:#64748b}.btn{display:inline-block;background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 16px rgba(30,64,175,.3)}.btn-outline{display:inline-block;border:2px solid #3b82f6;color:#3b82f6!important;padding:12px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;margin-left:12px}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">💳</div><h1>Boleto Disponível</h1><p>Referência: {{mes}}/{{ano}}</p></div><div class="body"><p>Prezado(a) {{nome}},</p><p>O boleto referente ao plano de manutenção mensal foi gerado e está disponível para pagamento.</p><div class="valor-box"><div class="label">Valor do Boleto</div><div class="amount">R$ {{valor}}</div><div class="due">Vencimento: <strong>{{vencimento}}</strong></div></div><table style="width:100%;border-collapse:collapse;margin:20px 0"><tr style="background:#f8fafc"><td style="padding:10px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0">Empresa</td><td style="padding:10px 16px;font-size:14px;font-weight:600;color:#1e293b;border-bottom:1px solid #e2e8f0">{{empresa}}</td></tr><tr><td style="padding:10px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0">Plano</td><td style="padding:10px 16px;font-size:14px;font-weight:600;color:#1e293b;border-bottom:1px solid #e2e8f0">{{plano}}</td></tr><tr style="background:#f8fafc"><td style="padding:10px 16px;font-size:13px;color:#64748b">Código de Barras</td><td style="padding:10px 16px;font-size:12px;font-family:monospace;color:#1e293b">{{codigo_barras}}</td></tr></table><div style="text-align:center;margin-top:24px"><a href="{{link_boleto}}" class="btn">Baixar Boleto (PDF) →</a></div></div><div class="footer"><p><strong>CadBrasil Consultoria</strong> · Financeiro</p><p>Dúvidas? Entre em contato pelo suporte.</p></div></div></div></body></html>', '["nome", "empresa", "mes", "ano", "valor", "vencimento", "plano", "codigo_barras", "link_boleto"]'),

-- ── 6. CONFIRMAÇÃO DE PAGAMENTO ──
('Confirmação de Pagamento', '✅ Pagamento confirmado — R$ {{valor}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#059669,#10b981);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.receipt{background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;margin:24px 0}.receipt-header{background:linear-gradient(135deg,#ecfdf5,#d1fae5);padding:20px;text-align:center;border-bottom:2px dashed #a7f3d0}.receipt-header .amount{font-size:32px;font-weight:800;color:#059669}.receipt-body{padding:20px}.receipt-body table{width:100%}.receipt-body td{padding:8px 0;font-size:13px}.receipt-body td:first-child{color:#64748b}.receipt-body td:last-child{color:#1e293b;font-weight:600;text-align:right}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">✅</div><h1>Pagamento Confirmado</h1><p>Recebemos seu pagamento com sucesso</p></div><div class="body"><p>Prezado(a) {{nome}},</p><p>Confirmamos o recebimento do pagamento conforme detalhes abaixo.</p><div class="receipt"><div class="receipt-header"><div style="font-size:12px;color:#059669;text-transform:uppercase;letter-spacing:2px;font-weight:600;margin-bottom:4px">Valor Pago</div><div class="amount">R$ {{valor}}</div></div><div class="receipt-body"><table><tr><td>Data do pagamento</td><td>{{data_pagamento}}</td></tr><tr><td>Empresa</td><td>{{empresa}}</td></tr><tr><td>Referência</td><td>{{referencia}}</td></tr><tr><td>Forma de pagamento</td><td>{{forma_pagamento}}</td></tr><tr><td>Protocolo</td><td style="font-family:monospace">{{protocolo}}</td></tr></table></div></div><p style="font-size:13px;color:#64748b;text-align:center">Obrigado por manter seu cadastro em dia!</p></div><div class="footer"><p><strong>CadBrasil Consultoria</strong> · Financeiro</p><p>Este é um comprovante automático.</p></div></div></div></body></html>', '["nome", "empresa", "valor", "data_pagamento", "referencia", "forma_pagamento", "protocolo"]'),

-- ── 7. TICKET ABERTO ──
('Ticket Aberto', 'Ticket {{codigo}} criado — {{titulo}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#7c3aed,#8b5cf6);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.ticket-card{background:linear-gradient(135deg,#faf5ff,#f3e8ff);border:2px solid #d8b4fe;border-radius:12px;padding:24px;margin:24px 0}.ticket-card .code{font-size:24px;font-weight:800;color:#7c3aed;font-family:monospace}.ticket-card .title{font-size:16px;color:#1e293b;font-weight:600;margin-top:8px}.status-badge{display:inline-block;background:#dbeafe;color:#2563eb;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;margin-top:8px}.btn{display:inline-block;background:linear-gradient(135deg,#7c3aed,#8b5cf6);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 16px rgba(124,58,237,.3)}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">🎫</div><h1>Ticket Criado</h1><p>Sua solicitação foi registrada</p></div><div class="body"><p>Prezado(a) {{nome}},</p><p>Seu ticket de suporte foi aberto com sucesso. Nossa equipe analisará sua solicitação e responderá em breve.</p><div class="ticket-card"><div class="code">#{{codigo}}</div><div class="title">{{titulo}}</div><div class="status-badge">{{status}}</div><p style="font-size:13px;color:#64748b;margin-top:12px;margin-bottom:0">Prioridade: <strong>{{prioridade}}</strong> · Aberto em: <strong>{{data_abertura}}</strong></p></div><div style="text-align:center;margin-top:24px"><a href="{{link_ticket}}" class="btn">Acompanhar Ticket →</a></div></div><div class="footer"><p><strong>CadBrasil</strong> · Suporte ao Cliente</p><p>Tempo médio de resposta: 4 horas úteis.</p></div></div></div></body></html>', '["nome", "codigo", "titulo", "status", "prioridade", "data_abertura", "link_ticket"]'),

-- ── 8. TICKET ATUALIZADO ──
('Ticket Atualizado', 'Ticket {{codigo}} — Nova resposta', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#6366f1,#818cf8);padding:40px;text-align:center}.header h1{color:#fff;font-size:22px;font-weight:700}.header p{color:rgba(255,255,255,.8);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.reply-box{background:#f8fafc;border-left:4px solid #6366f1;border-radius:0 12px 12px 0;padding:20px;margin:20px 0}.reply-box .author{font-size:13px;font-weight:700;color:#6366f1;margin-bottom:8px}.reply-box .msg{font-size:14px;color:#334155;line-height:1.7}.btn{display:inline-block;background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 16px rgba(99,102,241,.3)}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><h1>Ticket #{{codigo}} Atualizado</h1><p>{{titulo}}</p></div><div class="body"><p>Olá {{nome}},</p><p>Seu ticket recebeu uma nova resposta.</p><div class="reply-box"><div class="author">{{autor_resposta}} respondeu:</div><div class="msg">{{mensagem}}</div></div><p style="font-size:13px;color:#64748b">Status atual: <strong>{{status}}</strong></p><div style="text-align:center;margin-top:24px"><a href="{{link_ticket}}" class="btn">Ver Ticket Completo →</a></div></div><div class="footer"><p><strong>CadBrasil</strong> · Suporte</p></div></div></div></body></html>', '["nome", "codigo", "titulo", "status", "autor_resposta", "mensagem", "link_ticket"]'),

-- ── 9. LICITAÇÃO ENCONTRADA ──
('Licitação Encontrada', '🔍 Nova licitação compatível: {{numero_licitacao}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#0369a1,#0ea5e9);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.lic-card{background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:2px solid #7dd3fc;border-radius:12px;padding:24px;margin:24px 0}.lic-card .num{font-size:12px;color:#0369a1;text-transform:uppercase;letter-spacing:1px;font-weight:600}.lic-card .obj{font-size:16px;color:#0c4a6e;font-weight:700;margin:8px 0}.lic-card .details{display:flex;gap:16px;margin-top:12px;flex-wrap:wrap}.lic-card .det-item{background:rgba(255,255,255,.7);border-radius:8px;padding:8px 12px;font-size:12px}.det-item .lbl{color:#64748b}.det-item .val{color:#0c4a6e;font-weight:700}.btn{display:inline-block;background:linear-gradient(135deg,#0369a1,#0ea5e9);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 16px rgba(3,105,161,.3)}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">🔍</div><h1>Nova Licitação Encontrada</h1><p>Compatível com o perfil do seu cliente</p></div><div class="body"><p>Prezado(a),</p><p>Identificamos uma nova licitação que pode ser relevante para o seu cliente.</p><div class="lic-card"><div class="num">{{numero_licitacao}}</div><div class="obj">{{objeto}}</div><div class="details"><div class="det-item"><div class="lbl">Órgão</div><div class="val">{{orgao}}</div></div><div class="det-item"><div class="lbl">Modalidade</div><div class="val">{{modalidade}}</div></div><div class="det-item"><div class="lbl">Valor Estimado</div><div class="val">R$ {{valor_estimado}}</div></div><div class="det-item"><div class="lbl">Abertura</div><div class="val">{{data_abertura}}</div></div></div></div><div style="text-align:center;margin-top:24px"><a href="{{link_licitacao}}" class="btn">Ver Detalhes da Licitação →</a></div></div><div class="footer"><p><strong>CadBrasil</strong> · Monitoramento de Licitações</p><p>Email automático de busca inteligente.</p></div></div></div></body></html>', '["numero_licitacao", "objeto", "orgao", "modalidade", "valor_estimado", "data_abertura", "link_licitacao"]'),

-- ── 10. PRAZO DE LICITAÇÃO ENCERRANDO ──
('Prazo de Licitação Encerrando', '⏰ Prazo encerrando: {{numero_licitacao}} em {{dias}} dias', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#ea580c,#f97316);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.countdown{background:linear-gradient(135deg,#fff7ed,#ffedd5);border:2px solid #fdba74;border-radius:16px;padding:32px;text-align:center;margin:24px 0}.countdown .days{font-size:56px;font-weight:800;color:#ea580c;line-height:1}.countdown .label{font-size:13px;color:#9a3412;text-transform:uppercase;letter-spacing:1px;margin-top:4px}.info-row{display:flex;gap:12px;margin:20px 0}.info-item{flex:1;background:#f8fafc;border-radius:10px;padding:14px;text-align:center}.info-item .val{font-size:13px;font-weight:700;color:#1e293b}.info-item .lbl{font-size:11px;color:#64748b;margin-top:2px}.btn{display:inline-block;background:linear-gradient(135deg,#ea580c,#f97316);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 16px rgba(234,88,12,.3)}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">⏰</div><h1>Prazo Encerrando</h1><p>Licitação {{numero_licitacao}}</p></div><div class="body"><p>Atenção! O prazo para participação na licitação abaixo está se encerrando.</p><div class="countdown"><div class="days">{{dias}}</div><div class="label">dias restantes</div></div><table style="width:100%;border-collapse:collapse;margin:20px 0"><tr style="background:#f8fafc"><td style="padding:10px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0">Objeto</td><td style="padding:10px 16px;font-size:14px;font-weight:600;color:#1e293b;border-bottom:1px solid #e2e8f0">{{objeto}}</td></tr><tr><td style="padding:10px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0">Órgão</td><td style="padding:10px 16px;font-size:14px;font-weight:600;color:#1e293b;border-bottom:1px solid #e2e8f0">{{orgao}}</td></tr><tr style="background:#f8fafc"><td style="padding:10px 16px;font-size:13px;color:#64748b">Data limite</td><td style="padding:10px 16px;font-size:14px;font-weight:700;color:#ea580c">{{data_limite}}</td></tr></table><div style="text-align:center;margin-top:24px"><a href="{{link_licitacao}}" class="btn">Ver Licitação →</a></div></div><div class="footer"><p><strong>CadBrasil</strong> · Monitoramento de Prazos</p></div></div></div></body></html>', '["numero_licitacao", "objeto", "orgao", "dias", "data_limite", "link_licitacao"]'),

-- ── 11. PROPOSTA ENVIADA ──
('Proposta Enviada', '📤 Proposta enviada — Licitação {{numero_licitacao}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#4f46e5,#6366f1);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.proposal-card{background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;padding:24px;margin:24px 0}.proposal-card table{width:100%}.proposal-card td{padding:8px 0;font-size:14px}.proposal-card td:first-child{color:#64748b;font-size:13px;width:140px}.proposal-card td:last-child{color:#1e293b;font-weight:600}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">📤</div><h1>Proposta Enviada</h1><p>Registro de envio</p></div><div class="body"><p>Prezado(a),</p><p>A proposta foi enviada com sucesso para a licitação abaixo.</p><div class="proposal-card"><table><tr><td>Licitação</td><td>{{numero_licitacao}}</td></tr><tr><td>Empresa</td><td>{{empresa}}</td></tr><tr><td>Objeto</td><td>{{objeto}}</td></tr><tr><td>Valor proposto</td><td style="color:#4f46e5;font-size:18px">R$ {{valor_proposta}}</td></tr><tr><td>Data de envio</td><td>{{data_envio}}</td></tr><tr><td>Protocolo</td><td style="font-family:monospace">{{protocolo}}</td></tr></table></div><p style="font-size:13px;color:#64748b">Acompanhe o resultado pelo painel do CadBrasil.</p></div><div class="footer"><p><strong>CadBrasil</strong> · Gestão de Propostas</p></div></div></div></body></html>', '["numero_licitacao", "empresa", "objeto", "valor_proposta", "data_envio", "protocolo"]'),

-- ── 12. SICAF CADASTRO COMPLETO ──
('SICAF Cadastro Completo', '🏆 Cadastro SICAF 100% — {{empresa}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#059669,#10b981);padding:48px 40px;text-align:center}.header .icon{font-size:56px;margin-bottom:12px}.header h1{color:#fff;font-size:26px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.trophy{text-align:center;margin:32px 0}.trophy .circle{display:inline-block;width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#d1fae5,#a7f3d0);border:3px solid #34d399;line-height:100px;font-size:48px}.trophy .msg{font-size:20px;font-weight:800;color:#059669;margin-top:12px}.levels{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:24px 0}.level-badge{background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:600;color:#059669}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">🏆</div><h1>Cadastro SICAF Completo!</h1><p>Todos os níveis estão regularizados</p></div><div class="body"><p>Parabéns!</p><p>O cadastro SICAF da empresa <strong>{{empresa}}</strong> ({{cnpj}}) atingiu <strong>100% de completude</strong> em todos os níveis.</p><div class="trophy"><div class="circle">🏆</div><div class="msg">100% Completo</div></div><div class="levels"><div class="level-badge">✅ Nível I</div><div class="level-badge">✅ Nível II</div><div class="level-badge">✅ Nível III</div><div class="level-badge">✅ Nível IV</div><div class="level-badge">✅ Nível V</div><div class="level-badge">✅ Nível VI</div></div><p>Válido até: <strong>{{data_validade}}</strong></p><p style="font-size:13px;color:#64748b">A empresa está apta a participar de todas as modalidades de licitação pública.</p></div><div class="footer"><p><strong>CadBrasil</strong> · Gestão SICAF</p></div></div></div></body></html>', '["empresa", "cnpj", "data_validade"]'),

-- ── 13. RECUPERAÇÃO DE SENHA ──
('Recuperação de Senha', 'Redefinição de senha — CadBrasil', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#1e293b,#334155);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.7);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.code-box{background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:2px solid #e2e8f0;border-radius:12px;padding:28px;text-align:center;margin:24px 0}.code-box .label{font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:2px;font-weight:600;margin-bottom:8px}.code-box .code{font-size:36px;font-weight:800;color:#1e293b;letter-spacing:8px;font-family:monospace}.code-box .expires{font-size:12px;color:#94a3b8;margin-top:12px}.btn{display:inline-block;background:linear-gradient(135deg,#1e293b,#475569);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 16px rgba(30,41,59,.3)}.warning{background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:14px 18px;font-size:13px;color:#92400e;margin:20px 0}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">🔐</div><h1>Redefinir Senha</h1><p>Solicitação de recuperação</p></div><div class="body"><p>Olá {{nome}},</p><p>Recebemos uma solicitação para redefinir a senha da sua conta. Use o código abaixo ou clique no botão para criar uma nova senha.</p><div class="code-box"><div class="label">Código de Verificação</div><div class="code">{{codigo}}</div><div class="expires">Válido por {{minutos_expiracao}} minutos</div></div><div style="text-align:center"><a href="{{link_redefinir}}" class="btn">Redefinir Minha Senha →</a></div><div class="warning">⚠️ Se você não solicitou esta alteração, ignore este email. Sua senha permanecerá inalterada.</div></div><div class="footer"><p><strong>CadBrasil</strong> · Segurança da Conta</p><p>IP da solicitação: {{ip_solicitacao}}</p></div></div></div></body></html>', '["nome", "codigo", "link_redefinir", "minutos_expiracao", "ip_solicitacao"]'),

-- ── 14. RELATÓRIO MENSAL SICAF ──
('Relatório Mensal SICAF', '📊 Relatório Mensal SICAF — {{mes}}/{{ano}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#1e40af,#6366f1);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.stats-grid{display:flex;gap:12px;margin:24px 0;flex-wrap:wrap}.stat-card{flex:1;min-width:120px;background:#f8fafc;border-radius:12px;padding:20px;text-align:center;border:1px solid #e2e8f0}.stat-card .num{font-size:28px;font-weight:800;line-height:1}.stat-card .lbl{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:6px}.green{color:#059669}.orange{color:#d97706}.red{color:#dc2626}.blue{color:#2563eb}.summary-table{width:100%;border-collapse:collapse;margin:20px 0;border-radius:8px;overflow:hidden}.summary-table th{background:#f1f5f9;padding:10px 16px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;text-align:left}.summary-table td{padding:10px 16px;font-size:13px;color:#1e293b;border-bottom:1px solid #f1f5f9}.btn{display:inline-block;background:linear-gradient(135deg,#1e40af,#6366f1);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 16px rgba(30,64,175,.3)}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">📊</div><h1>Relatório Mensal SICAF</h1><p>{{mes}}/{{ano}} — Resumo de situação</p></div><div class="body"><p>Prezado(a),</p><p>Segue o resumo mensal do status dos seus clientes no SICAF.</p><div class="stats-grid"><div class="stat-card"><div class="num blue">{{total_clientes}}</div><div class="lbl">Clientes</div></div><div class="stat-card"><div class="num green">{{certidoes_validas}}</div><div class="lbl">Cert. Válidas</div></div><div class="stat-card"><div class="num orange">{{certidoes_vencendo}}</div><div class="lbl">Vencendo</div></div><div class="stat-card"><div class="num red">{{certidoes_vencidas}}</div><div class="lbl">Vencidas</div></div></div><p><strong>Resumo de ações:</strong></p><table class="summary-table"><tr><th>Ação</th><th>Qtd</th></tr><tr><td>Certidões renovadas no mês</td><td><strong>{{renovadas_mes}}</strong></td></tr><tr><td>Propostas enviadas</td><td><strong>{{propostas_enviadas}}</strong></td></tr><tr><td>Licitações monitoradas</td><td><strong>{{licitacoes_monitoradas}}</strong></td></tr><tr><td>Tickets resolvidos</td><td><strong>{{tickets_resolvidos}}</strong></td></tr></table><div style="text-align:center;margin-top:24px"><a href="{{link_painel}}" class="btn">Ver Relatório Completo →</a></div></div><div class="footer"><p><strong>CadBrasil</strong> · Relatório Automático</p><p>Gerado em {{data_geracao}}</p></div></div></div></body></html>', '["mes", "ano", "total_clientes", "certidoes_validas", "certidoes_vencendo", "certidoes_vencidas", "renovadas_mes", "propostas_enviadas", "licitacoes_monitoradas", "tickets_resolvidos", "link_painel", "data_geracao"]'),

-- ── 15. CONTRATO DE MANUTENÇÃO ──
('Contrato de Manutenção', '📋 Contrato de Manutenção — {{empresa}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#1e40af,#3b82f6);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.contract-box{background:#f8fafc;border-radius:12px;border:2px solid #e2e8f0;overflow:hidden;margin:24px 0}.contract-header{background:linear-gradient(135deg,#eff6ff,#dbeafe);padding:20px;text-align:center;border-bottom:2px dashed #bfdbfe}.contract-header .plan{font-size:20px;font-weight:800;color:#1e40af}.contract-header .price{font-size:14px;color:#3b82f6;margin-top:4px}.contract-body{padding:20px}.contract-body table{width:100%}.contract-body td{padding:8px 0;font-size:13px}.contract-body td:first-child{color:#64748b}.contract-body td:last-child{color:#1e293b;font-weight:600;text-align:right}.includes{margin:20px 0}.includes h4{font-size:14px;color:#1e293b;margin-bottom:12px}.includes .item{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px;color:#475569}.includes .item::before{content:"✅";font-size:14px}.btn{display:inline-block;background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 16px rgba(30,64,175,.3)}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">📋</div><h1>Contrato de Manutenção</h1><p>Proposta de serviço</p></div><div class="body"><p>Prezado(a) {{nome}},</p><p>Segue o contrato de prestação de serviço de manutenção mensal para a empresa <strong>{{empresa}}</strong>.</p><div class="contract-box"><div class="contract-header"><div class="plan">{{plano}}</div><div class="price">R$ {{valor_mensal}}/mês</div></div><div class="contract-body"><table><tr><td>Empresa</td><td>{{empresa}}</td></tr><tr><td>CNPJ</td><td>{{cnpj}}</td></tr><tr><td>Início</td><td>{{data_inicio}}</td></tr><tr><td>Vigência</td><td>{{vigencia}}</td></tr><tr><td>Valor anual</td><td style="color:#1e40af;font-size:16px">R$ {{valor_anual}}</td></tr></table></div></div><div class="includes"><h4>Serviços inclusos:</h4><div class="item">Monitoramento de certidões</div><div class="item">Renovação assistida de documentos</div><div class="item">Acompanhamento do SICAF</div><div class="item">Alertas de vencimento</div><div class="item">Suporte prioritário</div></div><div style="text-align:center;margin-top:24px"><a href="{{link_contrato}}" class="btn">Visualizar Contrato (PDF) →</a></div></div><div class="footer"><p><strong>CadBrasil Consultoria Ltda</strong></p><p>CNPJ: 99.888.777/0001-66</p></div></div></div></body></html>', '["nome", "empresa", "cnpj", "plano", "valor_mensal", "valor_anual", "data_inicio", "vigencia", "link_contrato"]'),

-- ── 16. ALERTA CRÍTICO DO SISTEMA ──
('Alerta Crítico do Sistema', '🚨 Alerta Crítico — {{tipo_alerta}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#7f1d1d,#dc2626);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.alert-card{background:#fef2f2;border:2px solid #fca5a5;border-radius:12px;padding:24px;margin:24px 0}.alert-card .type{font-size:12px;color:#dc2626;text-transform:uppercase;letter-spacing:2px;font-weight:700}.alert-card .msg{font-size:16px;color:#7f1d1d;font-weight:600;margin-top:8px}.alert-card .detail{font-size:14px;color:#991b1b;margin-top:8px;line-height:1.6}.btn{display:inline-block;background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 16px rgba(220,38,38,.3)}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">🚨</div><h1>Alerta Crítico</h1><p>Ação imediata necessária</p></div><div class="body"><p>Prezado(a) administrador,</p><p>O sistema detectou uma situação que requer atenção imediata.</p><div class="alert-card"><div class="type">{{tipo_alerta}}</div><div class="msg">{{mensagem}}</div><div class="detail">Empresa: <strong>{{empresa}}</strong><br>Detectado em: <strong>{{data_deteccao}}</strong><br>Severidade: <strong>{{severidade}}</strong></div></div><div style="text-align:center;margin-top:24px"><a href="{{link_acao}}" class="btn">Tomar Ação →</a></div></div><div class="footer"><p><strong>CadBrasil</strong> · Sistema de Alertas</p><p>Email de alerta automático.</p></div></div></div></body></html>', '["tipo_alerta", "mensagem", "empresa", "data_deteccao", "severidade", "link_acao"]'),

-- ── 17. RESUMO DIÁRIO ──
('Resumo Diário', '📬 Resumo do dia — {{data}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#1e40af,#6366f1);padding:44px 40px;text-align:center}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.section{margin:24px 0}.section h3{font-size:15px;color:#1e293b;font-weight:700;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #e2e8f0}.item-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f1f5f9}.item-row .icon{font-size:18px}.item-row .text{flex:1;font-size:14px;color:#475569}.item-row .badge{font-size:11px;font-weight:700;padding:4px 10px;border-radius:12px}.bg-green{background:#ecfdf5;color:#059669}.bg-orange{background:#fffbeb;color:#d97706}.bg-red{background:#fef2f2;color:#dc2626}.bg-blue{background:#eff6ff;color:#2563eb}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><h1>📬 Resumo do Dia</h1><p>{{data}} — CadBrasil</p></div><div class="body"><p>Olá {{nome}}, veja o que aconteceu hoje:</p><div class="section"><h3>📋 Certidões</h3><div class="item-row"><span class="icon">✅</span><span class="text">{{cert_validas}} certidões em dia</span><span class="badge bg-green">OK</span></div><div class="item-row"><span class="icon">⚠️</span><span class="text">{{cert_vencendo}} certidões vencendo nos próximos 30 dias</span><span class="badge bg-orange">Atenção</span></div><div class="item-row"><span class="icon">🔴</span><span class="text">{{cert_vencidas}} certidões vencidas</span><span class="badge bg-red">Urgente</span></div></div><div class="section"><h3>🔍 Licitações</h3><div class="item-row"><span class="icon">🆕</span><span class="text">{{novas_licitacoes}} novas licitações encontradas</span><span class="badge bg-blue">Novo</span></div><div class="item-row"><span class="icon">⏰</span><span class="text">{{prazos_encerrando}} prazos encerrando em breve</span><span class="badge bg-orange">Prazo</span></div></div><div class="section"><h3>🎫 Suporte</h3><div class="item-row"><span class="icon">📩</span><span class="text">{{tickets_abertos}} tickets abertos</span><span class="badge bg-blue">Abertos</span></div></div></div><div class="footer"><p><strong>CadBrasil</strong> · Resumo Automático Diário</p><p>Para desativar, acesse Configurações → Notificações.</p></div></div></div></body></html>', '["nome", "data", "cert_validas", "cert_vencendo", "cert_vencidas", "novas_licitacoes", "prazos_encerrando", "tickets_abertos"]'),

-- ── 18. NOVO CLIENTE CADASTRADO ──
('Novo Cliente Cadastrado', '👤 Novo cliente: {{empresa}} — {{cnpj}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#2563eb,#6366f1);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.client-card{background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:2px solid #e2e8f0;border-radius:12px;padding:24px;margin:24px 0}.client-card .name{font-size:20px;font-weight:800;color:#1e293b}.client-card .cnpj{font-size:14px;color:#64748b;font-family:monospace;margin-top:4px}.client-card table{width:100%;margin-top:16px}.client-card td{padding:6px 0;font-size:13px}.client-card td:first-child{color:#64748b;width:100px}.client-card td:last-child{color:#1e293b;font-weight:600}.btn{display:inline-block;background:linear-gradient(135deg,#2563eb,#6366f1);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 16px rgba(37,99,235,.3)}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">👤</div><h1>Novo Cliente Cadastrado</h1><p>Um novo cliente foi adicionado ao sistema</p></div><div class="body"><p>Olá,</p><p>Um novo cliente foi cadastrado no CadBrasil e precisa de configuração inicial.</p><div class="client-card"><div class="name">{{empresa}}</div><div class="cnpj">CNPJ: {{cnpj}}</div><table><tr><td>Responsável</td><td>{{responsavel}}</td></tr><tr><td>Email</td><td>{{email}}</td></tr><tr><td>Telefone</td><td>{{telefone}}</td></tr><tr><td>Plano</td><td>{{plano}}</td></tr><tr><td>Cadastrado em</td><td>{{data_cadastro}}</td></tr></table></div><div style="text-align:center;margin-top:24px"><a href="{{link_cliente}}" class="btn">Configurar Cliente →</a></div></div><div class="footer"><p><strong>CadBrasil</strong> · Gestão de Clientes</p></div></div></div></body></html>', '["empresa", "cnpj", "responsavel", "email", "telefone", "plano", "data_cadastro", "link_cliente"]'),

-- ── 19. RENOVAÇÃO DE PLANO ──
('Renovação de Plano', '🔄 Renovação de plano — {{empresa}}', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#7c3aed,#a78bfa);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.85);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.renew-box{background:linear-gradient(135deg,#faf5ff,#f3e8ff);border:2px solid #d8b4fe;border-radius:12px;padding:24px;margin:24px 0;text-align:center}.renew-box .plan{font-size:20px;font-weight:800;color:#7c3aed}.renew-box .period{font-size:14px;color:#6d28d9;margin-top:4px}.renew-box .price{font-size:32px;font-weight:800;color:#7c3aed;margin-top:12px}.renew-box .per{font-size:13px;color:#8b5cf6}.btn{display:inline-block;background:linear-gradient(135deg,#7c3aed,#a78bfa);color:#fff!important;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 16px rgba(124,58,237,.3)}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">🔄</div><h1>Renovação de Plano</h1><p>O plano do seu cliente precisa ser renovado</p></div><div class="body"><p>Prezado(a),</p><p>O plano de manutenção da empresa <strong>{{empresa}}</strong> está próximo do vencimento.</p><div class="renew-box"><div class="plan">{{plano}}</div><div class="period">Vigência: {{data_inicio}} a {{data_fim}}</div><div class="price">R$ {{valor}}</div><div class="per">por mês</div></div><table style="width:100%;border-collapse:collapse;margin:20px 0"><tr style="background:#f8fafc"><td style="padding:10px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0">Empresa</td><td style="padding:10px 16px;font-size:14px;font-weight:600;color:#1e293b;border-bottom:1px solid #e2e8f0">{{empresa}}</td></tr><tr><td style="padding:10px 16px;font-size:13px;color:#64748b">Vencimento atual</td><td style="padding:10px 16px;font-size:14px;font-weight:700;color:#7c3aed">{{data_fim}}</td></tr></table><div style="text-align:center;margin-top:24px"><a href="{{link_renovar}}" class="btn">Renovar Plano →</a></div></div><div class="footer"><p><strong>CadBrasil</strong> · Gestão de Planos</p></div></div></div></body></html>', '["empresa", "plano", "valor", "data_inicio", "data_fim", "link_renovar"]'),

-- ── 20. NOTIFICAÇÃO DE LOGIN ──
('Notificação de Login', '🔑 Novo login detectado na sua conta', '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f4f8}.wrapper{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#1e293b,#475569);padding:44px 40px;text-align:center}.header .icon{font-size:48px;margin-bottom:12px}.header h1{color:#fff;font-size:24px;font-weight:700}.header p{color:rgba(255,255,255,.7);font-size:14px;margin-top:6px}.body{padding:40px}.body p{color:#475569;line-height:1.8;font-size:15px;margin-bottom:14px}.login-info{background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;padding:24px;margin:24px 0}.login-info table{width:100%}.login-info td{padding:8px 0;font-size:14px}.login-info td:first-child{color:#64748b;font-size:13px;width:120px}.login-info td:last-child{color:#1e293b;font-weight:600}.warning{background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:14px 18px;font-size:13px;color:#92400e;margin:20px 0}.btn-danger{display:inline-block;background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff!important;padding:12px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;box-shadow:0 4px 16px rgba(220,38,38,.3)}.footer{background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #f1f5f9}.footer p{color:#94a3b8;font-size:12px;line-height:1.7}</style></head><body><div style="padding:24px"><div class="wrapper"><div class="header"><div class="icon">🔑</div><h1>Novo Login Detectado</h1><p>Segurança da sua conta</p></div><div class="body"><p>Olá {{nome}},</p><p>Detectamos um novo acesso à sua conta no CadBrasil. Confira os detalhes:</p><div class="login-info"><table><tr><td>📅 Data/hora</td><td>{{data_login}}</td></tr><tr><td>🌐 IP</td><td style="font-family:monospace">{{ip}}</td></tr><tr><td>📍 Localização</td><td>{{localizacao}}</td></tr><tr><td>💻 Dispositivo</td><td>{{dispositivo}}</td></tr><tr><td>🌍 Navegador</td><td>{{navegador}}</td></tr></table></div><div class="warning">⚠️ Se não foi você, recomendamos alterar sua senha imediatamente.</div><div style="text-align:center"><a href="{{link_seguranca}}" class="btn-danger">Não fui eu — Proteger conta</a></div></div><div class="footer"><p><strong>CadBrasil</strong> · Segurança</p></div></div></div></body></html>', '["nome", "data_login", "ip", "localizacao", "dispositivo", "navegador", "link_seguranca"]');

-- ============================================================
-- CONTRATOS DIGITAIS CADBRASIL (serviço)
-- ============================================================

CREATE TABLE IF NOT EXISTS contratos_digitais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  plano VARCHAR(100) NOT NULL DEFAULT 'Licença + Manutenção' COMMENT 'Tipo de plano contratado',
  data_inicio DATE NOT NULL,
  data_vencimento DATE NOT NULL,
  status ENUM('Pendente Assinatura', 'Assinado', 'Expirado', 'Cancelado') NOT NULL DEFAULT 'Pendente Assinatura',
  assinado_em DATETIME DEFAULT NULL,
  assinado_por VARCHAR(200) DEFAULT NULL COMMENT 'Nome completo do assinante',
  ip_assinatura VARCHAR(50) DEFAULT NULL COMMENT 'IP no momento da assinatura',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  INDEX idx_cd_status (status),
  INDEX idx_cd_cliente (cliente_id),
  INDEX idx_cd_vencimento (data_vencimento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 25. TRACKING GOOGLE ADS
-- ============================================================

CREATE TABLE IF NOT EXISTS tracking_sessoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- Identificação
  session_id VARCHAR(100) NOT NULL COMMENT 'ID único da sessão (UUID gerado no frontend)',
  cliente_id INT DEFAULT NULL COMMENT 'Vinculado ao cliente após conversão/cadastro',
  usuario_id INT DEFAULT NULL COMMENT 'Vinculado ao usuário após login',

  -- UTM Parameters (Google Ads padrão)
  utm_source VARCHAR(255) DEFAULT NULL COMMENT 'Origem do tráfego (google, facebook, bing, etc)',
  utm_medium VARCHAR(255) DEFAULT NULL COMMENT 'Meio (cpc, organic, email, referral, etc)',
  utm_campaign VARCHAR(255) DEFAULT NULL COMMENT 'Nome da campanha',
  utm_term VARCHAR(255) DEFAULT NULL COMMENT 'Termo de busca / palavra-chave',
  utm_content VARCHAR(255) DEFAULT NULL COMMENT 'Variação de anúncio / A/B test',

  -- Google Ads Specific
  gclid VARCHAR(255) DEFAULT NULL COMMENT 'Google Click Identifier',
  gbraid VARCHAR(255) DEFAULT NULL COMMENT 'Google Ads app campaign attribution (iOS)',
  wbraid VARCHAR(255) DEFAULT NULL COMMENT 'Google Ads web-to-app attribution',
  gad_source VARCHAR(50) DEFAULT NULL COMMENT 'Google Ads source type (1=Search, 2=Display, etc)',

  -- Facebook/Meta Ads
  fbclid VARCHAR(255) DEFAULT NULL COMMENT 'Facebook Click Identifier',

  -- Microsoft Ads
  msclkid VARCHAR(255) DEFAULT NULL COMMENT 'Microsoft Click Identifier',

  -- Navegação
  landing_page VARCHAR(1000) DEFAULT NULL COMMENT 'URL da página de entrada',
  referrer VARCHAR(1000) DEFAULT NULL COMMENT 'URL de origem (HTTP Referer)',
  exit_page VARCHAR(1000) DEFAULT NULL COMMENT 'Última página visitada antes de sair',

  -- Device & Browser Info
  user_agent TEXT COMMENT 'User-Agent completo do navegador',
  device_type ENUM('desktop', 'mobile', 'tablet', 'unknown') DEFAULT 'unknown',
  browser VARCHAR(100) DEFAULT NULL COMMENT 'Chrome, Firefox, Safari, Edge, etc',
  browser_version VARCHAR(50) DEFAULT NULL,
  os VARCHAR(100) DEFAULT NULL COMMENT 'Windows, macOS, iOS, Android, Linux',
  os_version VARCHAR(50) DEFAULT NULL,
  screen_resolution VARCHAR(20) DEFAULT NULL COMMENT '1920x1080, 375x812, etc',
  viewport_size VARCHAR(20) DEFAULT NULL COMMENT 'Tamanho visível do navegador',
  language VARCHAR(10) DEFAULT NULL COMMENT 'Idioma do navegador (pt-BR, en-US)',

  -- Geolocalização (via IP)
  ip_address VARCHAR(50) DEFAULT NULL,
  geo_country VARCHAR(100) DEFAULT NULL,
  geo_state VARCHAR(100) DEFAULT NULL,
  geo_city VARCHAR(100) DEFAULT NULL,

  -- Métricas de Engajamento
  pages_viewed INT DEFAULT 0 COMMENT 'Total de páginas visitadas na sessão',
  session_duration INT DEFAULT 0 COMMENT 'Duração da sessão em segundos',
  bounce TINYINT(1) DEFAULT 0 COMMENT 'Sessão de bounce (só 1 página)',
  scroll_depth_max INT DEFAULT 0 COMMENT 'Máx scroll depth (%) na landing page',

  -- Conversão
  converted TINYINT(1) DEFAULT 0 COMMENT 'Se converteu (cadastro, pagamento, etc)',
  conversion_type VARCHAR(100) DEFAULT NULL COMMENT 'signup, payment, lead, contact, etc',
  conversion_value DECIMAL(12,2) DEFAULT NULL COMMENT 'Valor monetário da conversão (R$)',
  conversion_at DATETIME DEFAULT NULL COMMENT 'Momento exato da conversão',

  -- Funil
  funnel_step VARCHAR(100) DEFAULT NULL COMMENT 'Último step: visit, lead, signup, payment',

  -- Timestamps
  first_visit_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Primeira interação',
  last_activity_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Última atividade',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Indexes
  INDEX idx_ts_session (session_id),
  INDEX idx_ts_cliente (cliente_id),
  INDEX idx_ts_usuario (usuario_id),
  INDEX idx_ts_gclid (gclid),
  INDEX idx_ts_utm_source (utm_source),
  INDEX idx_ts_utm_campaign (utm_campaign),
  INDEX idx_ts_converted (converted),
  INDEX idx_ts_created (created_at),
  INDEX idx_ts_funnel (funnel_step),
  INDEX idx_ts_device (device_type),

  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tracking_eventos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  sessao_id INT NOT NULL COMMENT 'FK para tracking_sessoes',
  cliente_id INT DEFAULT NULL,

  -- Evento
  evento VARCHAR(100) NOT NULL COMMENT 'page_view, click, form_submit, signup, payment, scroll, etc',
  categoria VARCHAR(100) DEFAULT NULL COMMENT 'navigation, engagement, conversion, interaction',
  acao VARCHAR(255) DEFAULT NULL COMMENT 'Ação específica (click_cta, submit_form, open_modal, etc)',
  rotulo VARCHAR(255) DEFAULT NULL COMMENT 'Label descritivo (nome do botão, seção, etc)',
  valor DECIMAL(12,2) DEFAULT NULL COMMENT 'Valor numérico associado (R$, %, etc)',

  -- Contexto da página
  pagina_url VARCHAR(1000) DEFAULT NULL COMMENT 'URL onde o evento aconteceu',
  pagina_titulo VARCHAR(255) DEFAULT NULL COMMENT 'Título da página',
  componente VARCHAR(255) DEFAULT NULL COMMENT 'Componente/seção onde ocorreu (hero, pricing, footer, etc)',

  -- Metadados extras (JSON flexível)
  metadata JSON DEFAULT NULL COMMENT 'Dados adicionais do evento em JSON',

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_te_sessao (sessao_id),
  INDEX idx_te_cliente (cliente_id),
  INDEX idx_te_evento (evento),
  INDEX idx_te_categoria (categoria),
  INDEX idx_te_created (created_at),

  FOREIGN KEY (sessao_id) REFERENCES tracking_sessoes(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================

SELECT 'Script executado com sucesso!' AS resultado;
SELECT CONCAT('Tabelas criadas: ', COUNT(*)) AS info FROM information_schema.tables WHERE table_schema = DATABASE();
