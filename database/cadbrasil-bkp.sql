/*
SQLyog Community
MySQL - 10.11.10-MariaDB-log : Database - cadbrasilsys
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `alertas` */

DROP TABLE IF EXISTS `alertas`;

CREATE TABLE `alertas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` enum('urgent','warning','info','success') NOT NULL DEFAULT 'info',
  `titulo` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL COMMENT 'Licitação, Certidão, SICAF, Oportunidade, etc.',
  `referencia_tipo` varchar(50) DEFAULT NULL COMMENT 'licitacao, certidao, sicaf, proposta, etc.',
  `referencia_id` int(11) DEFAULT NULL,
  `lido` tinyint(1) DEFAULT 0,
  `usuario_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `alertas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `analise_cronograma` */

DROP TABLE IF EXISTS `analise_cronograma`;

CREATE TABLE `analise_cronograma` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `analise_id` int(11) NOT NULL,
  `evento` varchar(255) NOT NULL,
  `data_evento` datetime DEFAULT NULL,
  `status` enum('concluido','proximo','futuro') DEFAULT 'futuro',
  PRIMARY KEY (`id`),
  KEY `analise_id` (`analise_id`),
  CONSTRAINT `analise_cronograma_ibfk_1` FOREIGN KEY (`analise_id`) REFERENCES `analises_edital` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `analise_documentos_exigidos` */

DROP TABLE IF EXISTS `analise_documentos_exigidos`;

CREATE TABLE `analise_documentos_exigidos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `analise_id` int(11) NOT NULL,
  `documento` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `analise_id` (`analise_id`),
  CONSTRAINT `analise_documentos_exigidos_ibfk_1` FOREIGN KEY (`analise_id`) REFERENCES `analises_edital` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `analise_pontos_atencao` */

DROP TABLE IF EXISTS `analise_pontos_atencao`;

CREATE TABLE `analise_pontos_atencao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `analise_id` int(11) NOT NULL,
  `descricao` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `analise_id` (`analise_id`),
  CONSTRAINT `analise_pontos_atencao_ibfk_1` FOREIGN KEY (`analise_id`) REFERENCES `analises_edital` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `analise_requisitos_habilitacao` */

DROP TABLE IF EXISTS `analise_requisitos_habilitacao`;

CREATE TABLE `analise_requisitos_habilitacao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `analise_id` int(11) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `item` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `analise_id` (`analise_id`),
  CONSTRAINT `analise_requisitos_habilitacao_ibfk_1` FOREIGN KEY (`analise_id`) REFERENCES `analises_edital` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `analises_edital` */

DROP TABLE IF EXISTS `analises_edital`;

CREATE TABLE `analises_edital` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `licitacao_id` int(10) unsigned DEFAULT NULL,
  `usuario_id` int(11) NOT NULL,
  `arquivo_nome` varchar(255) DEFAULT NULL,
  `arquivo_url` varchar(500) DEFAULT NULL,
  `orgao` varchar(255) DEFAULT NULL,
  `uasg` varchar(50) DEFAULT NULL,
  `modalidade` varchar(100) DEFAULT NULL,
  `numero` varchar(50) DEFAULT NULL,
  `objeto` text DEFAULT NULL,
  `valor_estimado` decimal(15,2) DEFAULT NULL,
  `data_sessao` datetime DEFAULT NULL,
  `localidade` varchar(100) DEFAULT NULL,
  `criterio_julgamento` varchar(100) DEFAULT NULL,
  `tipo_licitacao` varchar(100) DEFAULT NULL,
  `exclusiva_me_epp` tinyint(1) DEFAULT 0,
  `status` enum('pendente','processando','concluido','erro') DEFAULT 'pendente',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `licitacao_id` (`licitacao_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `analises_edital_ibfk_1` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `analises_edital_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `atas_registro_preco` */

DROP TABLE IF EXISTS `atas_registro_preco`;

CREATE TABLE `atas_registro_preco` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `licitacao_id` int(10) unsigned DEFAULT NULL,
  `numero_ata` varchar(100) DEFAULT NULL,
  `id_externo` varchar(200) DEFAULT NULL,
  `origem` varchar(50) NOT NULL DEFAULT 'compras_gov',
  `codigo_orgao` varchar(50) DEFAULT NULL,
  `nome_orgao` varchar(500) DEFAULT NULL,
  `codigo_uasg` varchar(20) DEFAULT NULL,
  `numero_processo` varchar(100) DEFAULT NULL,
  `objeto` text DEFAULT NULL,
  `data_assinatura` datetime DEFAULT NULL,
  `data_publicacao` datetime DEFAULT NULL,
  `data_inicio_vigencia` datetime DEFAULT NULL,
  `data_fim_vigencia` datetime DEFAULT NULL,
  `situacao` varchar(100) DEFAULT NULL,
  `dados_originais` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_originais`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_arp_numero` (`numero_ata`),
  KEY `idx_arp_externo` (`id_externo`),
  KEY `idx_arp_origem` (`origem`),
  KEY `idx_arp_lic` (`licitacao_id`),
  KEY `idx_arp_uasg` (`codigo_uasg`),
  KEY `idx_arp_situacao` (`situacao`),
  KEY `idx_arp_vigencia` (`data_fim_vigencia`),
  CONSTRAINT `fk_arp_lic` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `audit_log` */

DROP TABLE IF EXISTS `audit_log`;

CREATE TABLE `audit_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) DEFAULT NULL,
  `acao` varchar(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE, LOGIN, etc.',
  `entidade` varchar(100) NOT NULL COMMENT 'clientes, licitacoes, certidoes, etc.',
  `entidade_id` int(11) DEFAULT NULL,
  `dados_anteriores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_anteriores`)),
  `dados_novos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_novos`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `audit_log_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `certidoes` */

DROP TABLE IF EXISTS `certidoes`;

CREATE TABLE `certidoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) NOT NULL,
  `sicaf_id` int(11) DEFAULT NULL,
  `tipo_certidao_id` int(11) NOT NULL COMMENT 'FK para tipo_certidoes',
  `numero` varchar(100) DEFAULT NULL,
  `nivel_sicaf` enum('I','II','III','IV','V','VI') DEFAULT NULL,
  `data_emissao` date DEFAULT NULL,
  `data_validade` date DEFAULT NULL,
  `status` enum('Válida','Vencendo','Vencida') NOT NULL DEFAULT 'Válida',
  `dias_restantes` int(11) DEFAULT 0,
  `auto_renovar` tinyint(1) DEFAULT 0,
  `arquivo_url` varchar(500) DEFAULT NULL,
  `arquivo_nome` varchar(255) DEFAULT NULL,
  `arquivo_tamanho` varchar(20) DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `sicaf_id` (`sicaf_id`),
  KEY `tipo_certidao_id` (`tipo_certidao_id`),
  KEY `idx_certidoes_cliente_tipo` (`cliente_id`,`tipo_certidao_id`),
  CONSTRAINT `certidoes_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `certidoes_ibfk_2` FOREIGN KEY (`sicaf_id`) REFERENCES `sicaf_cadastros` (`id`) ON DELETE SET NULL,
  CONSTRAINT `certidoes_ibfk_3` FOREIGN KEY (`tipo_certidao_id`) REFERENCES `tipo_certidoes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=347 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `cliente_contatos` */

DROP TABLE IF EXISTS `cliente_contatos`;

CREATE TABLE `cliente_contatos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `principal` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `cliente_contatos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `clientes` */

DROP TABLE IF EXISTS `clientes`;

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL COMMENT '1 Usuário pode ter N Clientes',
  `tipo_documento` enum('CPF','CNPJ') NOT NULL DEFAULT 'CNPJ',
  `documento` varchar(20) NOT NULL COMMENT 'CPF ou CNPJ do cliente',
  `razao_social` varchar(255) NOT NULL,
  `nome_fantasia` varchar(255) DEFAULT NULL,
  `inscricao_estadual` varchar(30) DEFAULT NULL,
  `inscricao_municipal` varchar(30) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` char(2) DEFAULT NULL,
  `cep` varchar(10) DEFAULT NULL,
  `porte` enum('MEI','ME','EPP','Média','Grande') DEFAULT 'ME',
  `ramo_atividade` varchar(150) DEFAULT NULL,
  `responsavel_nome` varchar(150) DEFAULT NULL,
  `responsavel_cpf` varchar(14) DEFAULT NULL,
  `responsavel_email` varchar(255) DEFAULT NULL,
  `responsavel_telefone` varchar(20) DEFAULT NULL,
  `status` enum('Ativo','Pendente','Inativo') NOT NULL DEFAULT 'Ativo',
  `observacoes` text DEFAULT NULL,
  `protocoloCadbrasil` varchar(30) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `documento` (`documento`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=190227 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `coleta_logs` */

DROP TABLE IF EXISTS `coleta_logs`;

CREATE TABLE `coleta_logs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fonte` varchar(50) NOT NULL COMMENT 'compras_gov | pncp',
  `modulo` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL COMMENT 'iniciado | sucesso | erro | parcial',
  `registros_coletados` int(11) DEFAULT 0,
  `registros_novos` int(11) DEFAULT 0,
  `registros_atualizados` int(11) DEFAULT 0,
  `registros_erro` int(11) DEFAULT 0,
  `paginas_processadas` int(11) DEFAULT 0,
  `parametros` text DEFAULT NULL,
  `erro_mensagem` text DEFAULT NULL,
  `erro_stack` text DEFAULT NULL,
  `data_referencia_inicio` datetime DEFAULT NULL,
  `data_referencia_fim` datetime DEFAULT NULL,
  `iniciado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `finalizado_em` datetime DEFAULT NULL,
  `duracao_ms` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_cl_fonte` (`fonte`),
  KEY `idx_cl_modulo` (`modulo`),
  KEY `idx_cl_status` (`status`),
  KEY `idx_cl_inicio` (`iniciado_em`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `compras_pacotes_ia` */

DROP TABLE IF EXISTS `compras_pacotes_ia`;

CREATE TABLE `compras_pacotes_ia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `pacote_id` int(11) NOT NULL,
  `quantidade_creditos` int(11) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `status` enum('pendente','pago','cancelado') DEFAULT 'pendente',
  `pagamento_id` int(11) DEFAULT NULL COMMENT 'FK para pagamentos_gerencianet',
  `data_pagamento` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `pacote_id` (`pacote_id`),
  KEY `idx_cpi_usuario` (`usuario_id`),
  CONSTRAINT `compras_pacotes_ia_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `compras_pacotes_ia_ibfk_2` FOREIGN KEY (`pacote_id`) REFERENCES `pacotes_leitura_ia` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `concorrentes` */

DROP TABLE IF EXISTS `concorrentes`;

CREATE TABLE `concorrentes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `cnpj` varchar(20) DEFAULT NULL,
  `vitorias` int(11) DEFAULT 0,
  `participacoes` int(11) DEFAULT 0,
  `taxa_vitoria` decimal(5,2) DEFAULT 0.00,
  `valor_total` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `configuracoes_notificacao` */

DROP TABLE IF EXISTS `configuracoes_notificacao`;

CREATE TABLE `configuracoes_notificacao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `email_ativo` tinyint(1) DEFAULT 1,
  `push_ativo` tinyint(1) DEFAULT 1,
  `auto_renovar` tinyint(1) DEFAULT 0,
  `resumo_diario` tinyint(1) DEFAULT 1,
  `dias_antecedencia` int(11) DEFAULT 7,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `configuracoes_notificacao_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `configuracoes_sistema` */

DROP TABLE IF EXISTS `configuracoes_sistema`;

CREATE TABLE `configuracoes_sistema` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chave` varchar(100) NOT NULL,
  `valor` text DEFAULT NULL,
  `categoria` enum('empresa','licitacoes','integracoes','seguranca','email','notificacoes','aparencia','backup') DEFAULT 'empresa',
  `descricao` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `chave` (`chave`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `contratos` */

DROP TABLE IF EXISTS `contratos`;

CREATE TABLE `contratos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `licitacao_id` int(10) unsigned DEFAULT NULL,
  `fornecedor_id` int(10) unsigned DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL COMMENT 'Usuário que cadastrou o contrato',
  `numero_contrato` varchar(100) DEFAULT NULL,
  `id_externo` varchar(200) DEFAULT NULL,
  `origem` varchar(50) NOT NULL DEFAULT 'compras_gov',
  `codigo_orgao` varchar(50) DEFAULT NULL,
  `nome_orgao` varchar(500) DEFAULT NULL,
  `codigo_uasg` varchar(20) DEFAULT NULL,
  `cnpj_orgao` varchar(20) DEFAULT NULL,
  `objeto` text DEFAULT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `modalidade_licitacao` varchar(100) DEFAULT NULL,
  `numero_processo` varchar(100) DEFAULT NULL,
  `data_assinatura` datetime DEFAULT NULL,
  `data_publicacao` datetime DEFAULT NULL,
  `data_inicio_vigencia` datetime DEFAULT NULL,
  `data_fim_vigencia` datetime DEFAULT NULL,
  `prazo_execucao` int(11) DEFAULT NULL COMMENT 'Prazo de execução em meses',
  `valor_inicial` decimal(18,2) DEFAULT NULL,
  `valor_global` decimal(18,2) DEFAULT NULL,
  `valor_acumulado` decimal(18,2) DEFAULT NULL,
  `situacao` varchar(100) DEFAULT NULL,
  `cnpj_contratado` varchar(20) DEFAULT NULL,
  `nome_contratado` varchar(500) DEFAULT NULL,
  `dados_originais` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_originais`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_cont_numero` (`numero_contrato`),
  KEY `idx_cont_externo` (`id_externo`),
  KEY `idx_cont_origem` (`origem`),
  KEY `idx_cont_lic` (`licitacao_id`),
  KEY `idx_cont_forn` (`fornecedor_id`),
  KEY `idx_cont_uasg` (`codigo_uasg`),
  KEY `idx_cont_situacao` (`situacao`),
  KEY `idx_cont_assinatura` (`data_assinatura`),
  KEY `idx_cont_vigencia` (`data_fim_vigencia`),
  FULLTEXT KEY `ft_contratos_objeto` (`objeto`),
  CONSTRAINT `fk_contratos_forn` FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_contratos_lic` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `contratos_digitais` */

DROP TABLE IF EXISTS `contratos_digitais`;

CREATE TABLE `contratos_digitais` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) NOT NULL,
  `plano` varchar(100) NOT NULL DEFAULT 'Licença + Manutenção' COMMENT 'Tipo de plano contratado',
  `data_inicio` date NOT NULL,
  `data_vencimento` date NOT NULL,
  `status` enum('Pendente Assinatura','Assinado','Expirado','Cancelado') NOT NULL DEFAULT 'Pendente Assinatura',
  `assinado_em` datetime DEFAULT NULL,
  `assinado_por` varchar(200) DEFAULT NULL COMMENT 'Nome completo do assinante',
  `ip_assinatura` varchar(50) DEFAULT NULL COMMENT 'IP no momento da assinatura',
  `observacoes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_cd_status` (`status`),
  KEY `idx_cd_cliente` (`cliente_id`),
  KEY `idx_cd_vencimento` (`data_vencimento`),
  CONSTRAINT `contratos_digitais_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=307 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `documentos` */

DROP TABLE IF EXISTS `documentos`;

CREATE TABLE `documentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `pasta` varchar(100) DEFAULT NULL COMMENT 'Contratos Sociais, Certidões, Propostas, Editais, Atestados, Balanços',
  `tipo_arquivo` enum('PDF','Excel','Word','Imagem','Outro') DEFAULT 'PDF',
  `tamanho` varchar(20) DEFAULT NULL,
  `nivel_sicaf` enum('I','II','III','IV','V','VI') DEFAULT NULL,
  `data_validade` date DEFAULT NULL,
  `status` enum('valid','expiring','expired') DEFAULT 'valid',
  `arquivo_url` varchar(500) DEFAULT NULL,
  `data_upload` date DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `documentos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `documentos_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `fornecedores` */

DROP TABLE IF EXISTS `fornecedores`;

CREATE TABLE `fornecedores` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cnpj_cpf` varchar(20) DEFAULT NULL,
  `tipo_documento` varchar(10) DEFAULT NULL COMMENT 'cnpj | cpf',
  `razao_social` varchar(500) DEFAULT NULL,
  `nome_fantasia` varchar(500) DEFAULT NULL,
  `porte` varchar(50) DEFAULT NULL COMMENT 'me, epp, medio, grande',
  `uf` varchar(2) DEFAULT NULL,
  `municipio` varchar(200) DEFAULT NULL,
  `telefone` varchar(50) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `origem` varchar(50) NOT NULL DEFAULT 'compras_gov',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fornecedores` (`cnpj_cpf`,`origem`),
  KEY `idx_forn_razao` (`razao_social`(100)),
  KEY `idx_forn_uf` (`uf`),
  KEY `idx_forn_porte` (`porte`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `fornecedores_licitacao` */

DROP TABLE IF EXISTS `fornecedores_licitacao`;

CREATE TABLE `fornecedores_licitacao` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `licitacao_id` int(10) unsigned NOT NULL,
  `fornecedor_id` int(10) unsigned NOT NULL,
  `item_id` int(10) unsigned DEFAULT NULL,
  `situacao` varchar(100) DEFAULT NULL,
  `vencedor` tinyint(1) DEFAULT 0,
  `valor_proposta` decimal(18,2) DEFAULT NULL,
  `valor_negociado` decimal(18,2) DEFAULT NULL,
  `percentual_desconto` decimal(8,4) DEFAULT NULL,
  `posicao_classificacao` int(11) DEFAULT NULL,
  `motivo_desclassificacao` text DEFAULT NULL,
  `dados_originais` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_originais`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_fl_lic` (`licitacao_id`),
  KEY `idx_fl_forn` (`fornecedor_id`),
  KEY `idx_fl_item` (`item_id`),
  KEY `idx_fl_vencedor` (`vencedor`),
  CONSTRAINT `fk_fl_fornecedor` FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fl_item` FOREIGN KEY (`item_id`) REFERENCES `itens_licitacao` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_fl_licitacao` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `historico_acoes` */

DROP TABLE IF EXISTS `historico_acoes`;

CREATE TABLE `historico_acoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `acao` varchar(500) NOT NULL,
  `entidade` varchar(100) DEFAULT NULL,
  `entidade_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_historico_cliente` (`cliente_id`),
  KEY `idx_historico_usuario` (`usuario_id`),
  KEY `idx_historico_entidade` (`entidade`,`entidade_id`),
  KEY `idx_historico_created` (`created_at`),
  CONSTRAINT `fk_historico_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_historico_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=167 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `itens_licitacao` */

DROP TABLE IF EXISTS `itens_licitacao`;

CREATE TABLE `itens_licitacao` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `licitacao_id` int(10) unsigned NOT NULL,
  `numero_item` int(11) DEFAULT NULL,
  `tipo_item` varchar(50) DEFAULT NULL COMMENT 'material | servico',
  `codigo_item` varchar(50) DEFAULT NULL,
  `catmat_catser` varchar(50) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `unidade_medida` varchar(50) DEFAULT NULL,
  `quantidade` decimal(18,4) DEFAULT NULL,
  `valor_unitario_estimado` decimal(18,4) DEFAULT NULL,
  `valor_total_estimado` decimal(18,2) DEFAULT NULL,
  `valor_unitario_homologado` decimal(18,4) DEFAULT NULL,
  `valor_total_homologado` decimal(18,2) DEFAULT NULL,
  `situacao` varchar(100) DEFAULT NULL,
  `criterio_julgamento` varchar(200) DEFAULT NULL,
  `beneficio_me_epp` tinyint(1) DEFAULT 0,
  `dados_originais` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_originais`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_itens_lic` (`licitacao_id`),
  KEY `idx_itens_catmat` (`catmat_catser`),
  KEY `idx_itens_num` (`numero_item`),
  KEY `idx_itens_situacao` (`situacao`),
  FULLTEXT KEY `ft_itens_descricao` (`descricao`),
  CONSTRAINT `fk_itens_licitacao` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `leituras_edital_ia` */

DROP TABLE IF EXISTS `leituras_edital_ia`;

CREATE TABLE `leituras_edital_ia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `nome_arquivo` varchar(255) NOT NULL,
  `tamanho_arquivo` int(11) DEFAULT 0,
  `caminho_arquivo` varchar(500) DEFAULT NULL,
  `resultado` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Resultado completo da análise IA' CHECK (json_valid(`resultado`)),
  `texto_extraido` longtext DEFAULT NULL COMMENT 'Texto extraído do PDF/DOC',
  `status` enum('processando','concluido','erro') DEFAULT 'processando',
  `erro_mensagem` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_lea_usuario` (`usuario_id`),
  KEY `idx_lea_status` (`status`),
  CONSTRAINT `leituras_edital_ia_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `licitacoes` */

DROP TABLE IF EXISTS `licitacoes`;

CREATE TABLE `licitacoes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_processo` varchar(100) NOT NULL,
  `numero_controle_pncp` varchar(100) DEFAULT NULL,
  `id_externo` varchar(200) DEFAULT NULL COMMENT 'ID original na fonte',
  `origem` varchar(50) NOT NULL COMMENT 'compras_gov | pncp',
  `lei` varchar(20) DEFAULT NULL COMMENT '8666 | 14133',
  `modalidade` varchar(100) DEFAULT NULL,
  `modo_disputa` varchar(100) DEFAULT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `criterio_julgamento` varchar(200) DEFAULT NULL,
  `amparo_legal` varchar(200) DEFAULT NULL,
  `orgao_id` int(10) unsigned DEFAULT NULL,
  `uasg_id` int(10) unsigned DEFAULT NULL,
  `codigo_orgao` varchar(50) DEFAULT NULL,
  `nome_orgao` varchar(500) DEFAULT NULL,
  `codigo_uasg` varchar(20) DEFAULT NULL,
  `nome_uasg` varchar(500) DEFAULT NULL,
  `uf` varchar(2) DEFAULT NULL,
  `municipio` varchar(200) DEFAULT NULL,
  `esfera` varchar(20) DEFAULT NULL,
  `objeto` text DEFAULT NULL,
  `objeto_resumido` text DEFAULT NULL,
  `informacoes_complementares` text DEFAULT NULL,
  `data_publicacao` datetime DEFAULT NULL,
  `data_abertura` datetime DEFAULT NULL,
  `data_encerramento` datetime DEFAULT NULL,
  `data_resultado` datetime DEFAULT NULL,
  `data_homologacao` datetime DEFAULT NULL,
  `valor_estimado` decimal(18,2) DEFAULT NULL,
  `valor_homologado` decimal(18,2) DEFAULT NULL,
  `valor_total_itens` decimal(18,2) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `situacao` varchar(200) DEFAULT NULL,
  `srp` tinyint(1) DEFAULT 0 COMMENT 'Sistema de Registro de Preços',
  `link_edital` varchar(1000) DEFAULT NULL,
  `link_portal` varchar(1000) DEFAULT NULL,
  `dados_originais` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON bruto da fonte' CHECK (json_valid(`dados_originais`)),
  `coletado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_fonte_em` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_lic_processo` (`numero_processo`),
  KEY `idx_lic_pncp` (`numero_controle_pncp`),
  KEY `idx_lic_externo` (`id_externo`),
  KEY `idx_lic_origem` (`origem`),
  KEY `idx_lic_lei` (`lei`),
  KEY `idx_lic_modalidade` (`modalidade`),
  KEY `idx_lic_orgao` (`orgao_id`),
  KEY `idx_lic_uasg_id` (`uasg_id`),
  KEY `idx_lic_uasg` (`codigo_uasg`),
  KEY `idx_lic_orgao_cod` (`codigo_orgao`),
  KEY `idx_lic_uf` (`uf`),
  KEY `idx_lic_esfera` (`esfera`),
  KEY `idx_lic_status` (`status`),
  KEY `idx_lic_pub` (`data_publicacao`),
  KEY `idx_lic_abertura` (`data_abertura`),
  KEY `idx_lic_srp` (`srp`),
  KEY `idx_lic_origem_ext` (`origem`,`id_externo`),
  KEY `idx_lic_uasg_proc` (`codigo_uasg`,`numero_processo`),
  FULLTEXT KEY `ft_licitacoes_objeto` (`objeto`,`objeto_resumido`),
  CONSTRAINT `fk_licitacoes_orgao` FOREIGN KEY (`orgao_id`) REFERENCES `orgaos` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_licitacoes_uasg` FOREIGN KEY (`uasg_id`) REFERENCES `uasgs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `manutencao_boletos` */

DROP TABLE IF EXISTS `manutencao_boletos`;

CREATE TABLE `manutencao_boletos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `manutencao_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL COMMENT 'Desnormalizado para busca rápida',
  `numero_boleto` varchar(100) DEFAULT NULL,
  `valor` decimal(15,2) NOT NULL,
  `mes_referencia` int(11) NOT NULL COMMENT 'Mês de 1 a 12',
  `ano_referencia` int(11) NOT NULL,
  `data_vencimento` date NOT NULL,
  `data_pagamento` date DEFAULT NULL,
  `status` enum('Pendente','Pago','Atrasado','Cancelado') DEFAULT 'Pendente',
  `forma_pagamento` enum('Boleto','PIX') DEFAULT 'Boleto',
  `codigo_barras` varchar(100) DEFAULT NULL,
  `chave_pix` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `manutencao_id` (`manutencao_id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `manutencao_boletos_ibfk_1` FOREIGN KEY (`manutencao_id`) REFERENCES `manutencoes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `manutencao_boletos_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2778 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `manutencao_renovacoes` */

DROP TABLE IF EXISTS `manutencao_renovacoes`;

CREATE TABLE `manutencao_renovacoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `manutencao_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `data_renovacao` datetime NOT NULL,
  `data_inicio_novo` date NOT NULL,
  `data_fim_novo` date NOT NULL,
  `valor_novo` decimal(15,2) NOT NULL,
  `status` enum('Concluída','Pendente','Cancelada') NOT NULL DEFAULT 'Concluída',
  `renovado_por` int(11) DEFAULT NULL COMMENT 'Usuário que executou a renovação',
  `observacoes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `manutencao_id` (`manutencao_id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `renovado_por` (`renovado_por`),
  CONSTRAINT `manutencao_renovacoes_ibfk_1` FOREIGN KEY (`manutencao_id`) REFERENCES `manutencoes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `manutencao_renovacoes_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `manutencao_renovacoes_ibfk_3` FOREIGN KEY (`renovado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `manutencoes` */

DROP TABLE IF EXISTS `manutencoes`;

CREATE TABLE `manutencoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `tipo` enum('Preventiva','Corretiva') NOT NULL DEFAULT 'Preventiva',
  `plano` varchar(100) DEFAULT NULL COMMENT 'Manutenção CADBRASIL, etc.',
  `valor` decimal(15,2) DEFAULT NULL,
  `status` enum('Ativo','A Vencer','Vencido','Cancelado') NOT NULL DEFAULT 'Ativo',
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  `dias_restantes` int(11) DEFAULT 0,
  `observacoes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cliente_manutencao` (`cliente_id`) COMMENT '1 Cliente pode ter apenas 1 Manutenção ativa',
  CONSTRAINT `manutencoes_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=830 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `menus` */

DROP TABLE IF EXISTS `menus`;

CREATE TABLE `menus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `categoria` varchar(50) NOT NULL COMMENT 'Licitações, Propostas, Documentos, Admin, Suporte, Usuários & Acesso, Sistema, Contratos',
  `icone` varchar(50) DEFAULT NULL COMMENT 'Nome do ícone lucide-react',
  `rota` varchar(100) NOT NULL,
  `ordem` int(11) DEFAULT 0,
  `menu_pai_id` int(11) DEFAULT NULL COMMENT 'Para submenu',
  `ativo` tinyint(1) DEFAULT 1,
  `requer_autenticacao` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `rota` (`rota`),
  KEY `menu_pai_id` (`menu_pai_id`),
  CONSTRAINT `menus_ibfk_1` FOREIGN KEY (`menu_pai_id`) REFERENCES `menus` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `notificacoes_certidoes` */

DROP TABLE IF EXISTS `notificacoes_certidoes`;

CREATE TABLE `notificacoes_certidoes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `certidao_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `tipo` varchar(30) NOT NULL COMMENT 'vencendo, vencida',
  `email_destino` varchar(255) DEFAULT NULL,
  `status` varchar(30) DEFAULT 'enviado',
  `erro` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_notif_cert_tipo` (`certidao_id`,`tipo`,`created_at`),
  KEY `idx_notif_cliente` (`cliente_id`)
) ENGINE=InnoDB AUTO_INCREMENT=207 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Table structure for table `orgaos` */

DROP TABLE IF EXISTS `orgaos`;

CREATE TABLE `orgaos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL,
  `nome` varchar(500) NOT NULL,
  `sigla` varchar(50) DEFAULT NULL,
  `esfera` varchar(20) DEFAULT NULL COMMENT 'federal, estadual, municipal',
  `uf` varchar(2) DEFAULT NULL,
  `municipio` varchar(200) DEFAULT NULL,
  `cnpj` varchar(20) DEFAULT NULL,
  `poder` varchar(50) DEFAULT NULL,
  `tipo_administracao` varchar(100) DEFAULT NULL,
  `endereco` text DEFAULT NULL,
  `telefone` varchar(50) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `site` varchar(500) DEFAULT NULL,
  `origem` varchar(50) NOT NULL DEFAULT 'compras_gov',
  `ativo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_orgaos_codigo_origem` (`codigo`,`origem`),
  KEY `idx_orgaos_nome` (`nome`(100)),
  KEY `idx_orgaos_cnpj` (`cnpj`),
  KEY `idx_orgaos_uf` (`uf`),
  KEY `idx_orgaos_esfera` (`esfera`),
  FULLTEXT KEY `ft_orgaos_nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `pacotes_leitura_ia` */

DROP TABLE IF EXISTS `pacotes_leitura_ia`;

CREATE TABLE `pacotes_leitura_ia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `quantidade_leituras` int(11) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `recursos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Lista de recursos incluídos no pacote' CHECK (json_valid(`recursos`)),
  `destaque` tinyint(1) DEFAULT 0 COMMENT 'Pacote em destaque (mais popular)',
  `economia` varchar(50) DEFAULT NULL COMMENT 'Ex: 20% de economia',
  `ativo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `pagamentos_gerencianet` */

DROP TABLE IF EXISTS `pagamentos_gerencianet`;

CREATE TABLE `pagamentos_gerencianet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) DEFAULT NULL,
  `origem` varchar(30) NOT NULL DEFAULT 'sicaf',
  `origem_id` int(11) NOT NULL COMMENT 'ID da tabela de origem (taxas_sicaf.id ou manutencao_boletos.id)',
  `tipo` enum('boleto','pix') NOT NULL,
  `valor` decimal(15,2) NOT NULL COMMENT 'Valor em reais',
  `valor_centavos` int(11) NOT NULL COMMENT 'Valor em centavos (enviado à API)',
  `descricao` varchar(500) DEFAULT NULL COMMENT 'Descrição do pagamento',
  `protocolo` varchar(100) DEFAULT NULL COMMENT 'Protocolo/referência interna',
  `data_vencimento` date DEFAULT NULL COMMENT 'Vencimento do boleto',
  `data_pagamento` datetime DEFAULT NULL COMMENT 'Data/hora do pagamento confirmado',
  `status` enum('aguardando','gerado','pago','cancelado','expirado','erro') NOT NULL DEFAULT 'aguardando',
  `gn_charge_id` int(11) DEFAULT NULL COMMENT 'charge_id retornado pela API (boleto)',
  `gn_barcode` varchar(100) DEFAULT NULL COMMENT 'Código de barras do boleto',
  `gn_link` varchar(500) DEFAULT NULL COMMENT 'Link do boleto para download/impressão',
  `gn_pdf` varchar(500) DEFAULT NULL COMMENT 'Link do PDF do boleto',
  `gn_txid` varchar(100) DEFAULT NULL COMMENT 'txid da cobrança PIX',
  `gn_loc_id` int(11) DEFAULT NULL COMMENT 'loc.id para QR Code',
  `gn_qrcode_text` text DEFAULT NULL COMMENT 'Código copia-e-cola do PIX',
  `gn_qrcode_image` text DEFAULT NULL COMMENT 'QR Code em base64 (imagem)',
  `gn_e2eid` varchar(100) DEFAULT NULL COMMENT 'endToEndId do pagamento confirmado',
  `gn_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Resposta completa da API Gerencianet (JSON)' CHECK (json_valid(`gn_response`)),
  `gn_error` text DEFAULT NULL COMMENT 'Mensagem de erro caso tenha falhado',
  `cliente_nome` varchar(255) DEFAULT NULL,
  `cliente_documento` varchar(20) DEFAULT NULL COMMENT 'CPF ou CNPJ do cliente',
  `cliente_email` varchar(255) DEFAULT NULL,
  `gerado_por` int(11) DEFAULT NULL COMMENT 'Usuário que solicitou a geração',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_pgto_cliente` (`cliente_id`),
  KEY `idx_pgto_origem` (`origem`,`origem_id`),
  KEY `idx_pgto_status` (`status`),
  KEY `idx_pgto_tipo` (`tipo`),
  KEY `idx_pgto_gn_charge` (`gn_charge_id`),
  KEY `idx_pgto_gn_txid` (`gn_txid`),
  KEY `idx_pgto_created` (`created_at`),
  KEY `gerado_por` (`gerado_por`),
  CONSTRAINT `pagamentos_gerencianet_ibfk_2` FOREIGN KEY (`gerado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `pastas_documentos` */

DROP TABLE IF EXISTS `pastas_documentos`;

CREATE TABLE `pastas_documentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cor` varchar(50) DEFAULT 'text-blue-500',
  `quantidade` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `perfis_acesso` */

DROP TABLE IF EXISTS `perfis_acesso`;

CREATE TABLE `perfis_acesso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `tipo` enum('admin','gestor','analista','visualizador','cliente') NOT NULL DEFAULT 'visualizador',
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `permissoes_pagina` */

DROP TABLE IF EXISTS `permissoes_pagina`;

CREATE TABLE `permissoes_pagina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `perfil_id` int(11) NOT NULL,
  `pagina_id` varchar(50) NOT NULL,
  `pagina_nome` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `permitido` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_perfil_pagina` (`perfil_id`,`pagina_id`),
  CONSTRAINT `permissoes_pagina_ibfk_1` FOREIGN KEY (`perfil_id`) REFERENCES `perfis_acesso` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `propostas` */

DROP TABLE IF EXISTS `propostas`;

CREATE TABLE `propostas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `licitacao_id` int(10) unsigned NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `numero_proposta` varchar(50) DEFAULT NULL,
  `tipo` enum('Comercial','Técnica','Técnica e Preço') DEFAULT 'Comercial',
  `valor` decimal(15,2) DEFAULT NULL,
  `prazo_entrega` varchar(100) DEFAULT NULL,
  `status` enum('Em elaboração','Aguardando revisão','Enviada','Vencedora','Perdedora') NOT NULL DEFAULT 'Em elaboração',
  `progresso` int(11) DEFAULT 0 COMMENT 'Percentual de conclusão 0-100',
  `observacoes` text DEFAULT NULL,
  `anexos_url` text DEFAULT NULL,
  `criado_por` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `licitacao_id` (`licitacao_id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `criado_por` (`criado_por`),
  CONSTRAINT `propostas_ibfk_1` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `propostas_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `propostas_ibfk_3` FOREIGN KEY (`criado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `resultados_licitacao` */

DROP TABLE IF EXISTS `resultados_licitacao`;

CREATE TABLE `resultados_licitacao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `licitacao_id` int(10) unsigned NOT NULL,
  `resultado` enum('Vencedor','2º Lugar','3º Lugar','Desclassificado','Não participou') NOT NULL,
  `posicao` int(11) DEFAULT NULL,
  `total_concorrentes` int(11) DEFAULT NULL,
  `valor_proposto` decimal(15,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `licitacao_id` (`licitacao_id`),
  CONSTRAINT `resultados_licitacao_ibfk_1` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `sicaf_cadastros` */

DROP TABLE IF EXISTS `sicaf_cadastros`;

CREATE TABLE `sicaf_cadastros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) NOT NULL,
  `status` varchar(20) DEFAULT 'Ativo',
  `data_ultima_atualizacao` date DEFAULT NULL,
  `data_validade` date DEFAULT NULL,
  `completude` decimal(5,2) DEFAULT 0.00,
  `credenciamento_anual` tinyint(1) DEFAULT 0,
  `manutencao_ativa` tinyint(1) DEFAULT 0,
  `dias_validade` int(11) DEFAULT 0,
  `observacoes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `atualizacoes_usadas` int(11) DEFAULT 0 COMMENT 'Qtd de atualizações de certidões realizadas no período anual',
  `atualizacoes_reset_em` date DEFAULT NULL COMMENT 'Data em que o contador foi resetado (pagamento SICAF anual)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cliente_sicaf` (`cliente_id`) COMMENT '1 Cliente pode ter apenas 1 SICAF ativo',
  CONSTRAINT `sicaf_cadastros_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=190227 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `sicaf_niveis` */

DROP TABLE IF EXISTS `sicaf_niveis`;

CREATE TABLE `sicaf_niveis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sicaf_id` int(11) NOT NULL,
  `nivel` enum('I','II','III','IV','V','VI') NOT NULL,
  `habilitado` tinyint(1) DEFAULT 1,
  `status` varchar(30) DEFAULT NULL,
  `observacao` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sicaf_nivel` (`sicaf_id`,`nivel`),
  CONSTRAINT `sicaf_niveis_ibfk_1` FOREIGN KEY (`sicaf_id`) REFERENCES `sicaf_cadastros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=410 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `sicaf_renovacoes` */

DROP TABLE IF EXISTS `sicaf_renovacoes`;

CREATE TABLE `sicaf_renovacoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sicaf_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `ano_referencia` int(11) NOT NULL,
  `data_renovacao` datetime NOT NULL,
  `taxa_id` int(11) DEFAULT NULL COMMENT 'Referência à taxa paga para esta renovação',
  `status` enum('Concluída','Pendente','Cancelada') NOT NULL DEFAULT 'Concluída',
  `renovado_por` int(11) DEFAULT NULL COMMENT 'Usuário que executou a renovação',
  `observacoes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `sicaf_id` (`sicaf_id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `renovado_por` (`renovado_por`),
  CONSTRAINT `sicaf_renovacoes_ibfk_1` FOREIGN KEY (`sicaf_id`) REFERENCES `sicaf_cadastros` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sicaf_renovacoes_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sicaf_renovacoes_ibfk_3` FOREIGN KEY (`renovado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5865 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `taxas_sicaf` */

DROP TABLE IF EXISTS `taxas_sicaf`;

CREATE TABLE `taxas_sicaf` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sicaf_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `descricao` varchar(255) DEFAULT 'Taxa de Renovação SICAF Anual',
  `valor` decimal(15,2) NOT NULL DEFAULT 35.16,
  `ano_referencia` int(11) NOT NULL,
  `forma_pagamento` enum('Boleto','PIX') DEFAULT NULL,
  `status` enum('Pendente','Pago','Aprovado','Cancelado') DEFAULT 'Pendente',
  `codigo_barras` varchar(100) DEFAULT NULL,
  `chave_pix` varchar(255) DEFAULT NULL,
  `data_pagamento` datetime DEFAULT NULL,
  `aprovado_por` int(11) DEFAULT NULL COMMENT 'ID do usuário que aprovou manualmente',
  `data_aprovacao` datetime DEFAULT NULL COMMENT 'Data/hora da aprovação manual',
  `observacao_aprovacao` varchar(500) DEFAULT NULL COMMENT 'Justificativa da aprovação',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `sicaf_id` (`sicaf_id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `aprovado_por` (`aprovado_por`),
  CONSTRAINT `taxas_sicaf_ibfk_1` FOREIGN KEY (`sicaf_id`) REFERENCES `sicaf_cadastros` (`id`) ON DELETE CASCADE,
  CONSTRAINT `taxas_sicaf_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `taxas_sicaf_ibfk_3` FOREIGN KEY (`aprovado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `templates_email` */

DROP TABLE IF EXISTS `templates_email`;

CREATE TABLE `templates_email` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `assunto` varchar(255) DEFAULT NULL,
  `corpo_html` text DEFAULT NULL,
  `variaveis_disponiveis` text DEFAULT NULL COMMENT 'JSON com variáveis dinâmicas',
  `ativo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `ticket_anexos` */

DROP TABLE IF EXISTS `ticket_anexos`;

CREATE TABLE `ticket_anexos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  `mensagem_id` int(11) DEFAULT NULL,
  `nome_original` varchar(500) NOT NULL,
  `url` varchar(1000) NOT NULL,
  `tamanho` int(11) DEFAULT 0,
  `mimetype` varchar(100) DEFAULT NULL,
  `enviado_por` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `mensagem_id` (`mensagem_id`),
  KEY `enviado_por` (`enviado_por`),
  CONSTRAINT `ticket_anexos_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ticket_anexos_ibfk_2` FOREIGN KEY (`mensagem_id`) REFERENCES `ticket_mensagens` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ticket_anexos_ibfk_3` FOREIGN KEY (`enviado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `ticket_mensagens` */

DROP TABLE IF EXISTS `ticket_mensagens`;

CREATE TABLE `ticket_mensagens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  `remetente_tipo` enum('client','support') NOT NULL,
  `remetente_nome` varchar(150) NOT NULL,
  `remetente_id` int(11) DEFAULT NULL,
  `mensagem` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `remetente_id` (`remetente_id`),
  CONSTRAINT `ticket_mensagens_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ticket_mensagens_ibfk_2` FOREIGN KEY (`remetente_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tickets` */

DROP TABLE IF EXISTS `tickets`;

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `status` enum('aberto','em_andamento','resolvido','fechado') NOT NULL DEFAULT 'aberto',
  `prioridade` enum('alta','media','baixa') NOT NULL DEFAULT 'media',
  `categoria` enum('suporte','bug','melhoria') NOT NULL DEFAULT 'suporte',
  `cliente_id` int(11) DEFAULT NULL,
  `criado_por` int(11) NOT NULL,
  `atribuido_a` int(11) DEFAULT NULL,
  `sla_prazo` datetime DEFAULT NULL,
  `sla_minutos_restantes` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `cliente_id` (`cliente_id`),
  KEY `criado_por` (`criado_por`),
  KEY `atribuido_a` (`atribuido_a`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`criado_por`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`atribuido_a`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tipo_certidoes` */

DROP TABLE IF EXISTS `tipo_certidoes`;

CREATE TABLE `tipo_certidoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL COMMENT 'Código interno para mapeamento (cnd_federal, crf_fgts, etc.)',
  `nome` varchar(150) NOT NULL COMMENT 'Nome completo/exibição da certidão',
  `descricao` text DEFAULT NULL COMMENT 'Descrição detalhada do tipo de certidão',
  `nivel_sicaf` enum('I','II','III','IV','V','VI') DEFAULT NULL COMMENT 'Nível SICAF associado (se aplicável)',
  `orgao_emissor` varchar(150) DEFAULT NULL COMMENT 'Órgão emissor padrão',
  `ativo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tracking_eventos` */

DROP TABLE IF EXISTS `tracking_eventos`;

CREATE TABLE `tracking_eventos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sessao_id` int(11) NOT NULL COMMENT 'FK para tracking_sessoes',
  `cliente_id` int(11) DEFAULT NULL,
  `evento` varchar(100) NOT NULL COMMENT 'page_view, click, form_submit, signup, payment, scroll, etc',
  `categoria` varchar(100) DEFAULT NULL COMMENT 'navigation, engagement, conversion, interaction',
  `acao` varchar(255) DEFAULT NULL COMMENT 'Ação específica (click_cta, submit_form, open_modal, etc)',
  `rotulo` varchar(255) DEFAULT NULL COMMENT 'Label descritivo (nome do botão, seção, etc)',
  `valor` decimal(12,2) DEFAULT NULL COMMENT 'Valor numérico associado (R$, %, etc)',
  `pagina_url` varchar(1000) DEFAULT NULL COMMENT 'URL onde o evento aconteceu',
  `pagina_titulo` varchar(255) DEFAULT NULL COMMENT 'Título da página',
  `componente` varchar(255) DEFAULT NULL COMMENT 'Componente/seção onde ocorreu (hero, pricing, footer, etc)',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Dados adicionais do evento em JSON' CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_te_sessao` (`sessao_id`),
  KEY `idx_te_cliente` (`cliente_id`),
  KEY `idx_te_evento` (`evento`),
  KEY `idx_te_categoria` (`categoria`),
  KEY `idx_te_created` (`created_at`),
  CONSTRAINT `tracking_eventos_ibfk_1` FOREIGN KEY (`sessao_id`) REFERENCES `tracking_sessoes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tracking_eventos_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tracking_sessoes` */

DROP TABLE IF EXISTS `tracking_sessoes`;

CREATE TABLE `tracking_sessoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` varchar(100) NOT NULL COMMENT 'ID único da sessão (UUID gerado no frontend)',
  `cliente_id` int(11) DEFAULT NULL COMMENT 'Vinculado ao cliente após conversão/cadastro',
  `usuario_id` int(11) DEFAULT NULL COMMENT 'Vinculado ao usuário após login',
  `utm_source` varchar(255) DEFAULT NULL COMMENT 'Origem do tráfego (google, facebook, bing, etc)',
  `utm_medium` varchar(255) DEFAULT NULL COMMENT 'Meio (cpc, organic, email, referral, etc)',
  `utm_campaign` varchar(255) DEFAULT NULL COMMENT 'Nome da campanha',
  `utm_term` varchar(255) DEFAULT NULL COMMENT 'Termo de busca / palavra-chave',
  `utm_content` varchar(255) DEFAULT NULL COMMENT 'Variação de anúncio / A/B test',
  `gclid` varchar(255) DEFAULT NULL COMMENT 'Google Click Identifier',
  `gbraid` varchar(255) DEFAULT NULL COMMENT 'Google Ads app campaign attribution (iOS)',
  `wbraid` varchar(255) DEFAULT NULL COMMENT 'Google Ads web-to-app attribution',
  `gad_source` varchar(50) DEFAULT NULL COMMENT 'Google Ads source type (1=Search, 2=Display, etc)',
  `gad_campaignid` varchar(100) DEFAULT NULL,
  `fbclid` varchar(255) DEFAULT NULL COMMENT 'Facebook Click Identifier',
  `msclkid` varchar(255) DEFAULT NULL COMMENT 'Microsoft Click Identifier',
  `landing_page` varchar(1000) DEFAULT NULL COMMENT 'URL da página de entrada',
  `referrer` varchar(1000) DEFAULT NULL COMMENT 'URL de origem (HTTP Referer)',
  `exit_page` varchar(1000) DEFAULT NULL COMMENT 'Última página visitada antes de sair',
  `user_agent` text DEFAULT NULL COMMENT 'User-Agent completo do navegador',
  `device_type` enum('desktop','mobile','tablet','unknown') DEFAULT 'unknown',
  `browser` varchar(100) DEFAULT NULL COMMENT 'Chrome, Firefox, Safari, Edge, etc',
  `browser_version` varchar(50) DEFAULT NULL,
  `os` varchar(100) DEFAULT NULL COMMENT 'Windows, macOS, iOS, Android, Linux',
  `os_version` varchar(50) DEFAULT NULL,
  `screen_resolution` varchar(20) DEFAULT NULL COMMENT '1920x1080, 375x812, etc',
  `viewport_size` varchar(20) DEFAULT NULL COMMENT 'Tamanho visível do navegador',
  `language` varchar(10) DEFAULT NULL COMMENT 'Idioma do navegador (pt-BR, en-US)',
  `ip_address` varchar(50) DEFAULT NULL,
  `geo_country` varchar(100) DEFAULT NULL,
  `geo_state` varchar(100) DEFAULT NULL,
  `geo_city` varchar(100) DEFAULT NULL,
  `pages_viewed` int(11) DEFAULT 0 COMMENT 'Total de páginas visitadas na sessão',
  `session_duration` int(11) DEFAULT 0 COMMENT 'Duração da sessão em segundos',
  `bounce` tinyint(1) DEFAULT 0 COMMENT 'Sessão de bounce (só 1 página)',
  `scroll_depth_max` int(11) DEFAULT 0 COMMENT 'Máx scroll depth (%) na landing page',
  `converted` tinyint(1) DEFAULT 0 COMMENT 'Se converteu (cadastro, pagamento, etc)',
  `conversion_type` varchar(100) DEFAULT NULL COMMENT 'signup, payment, lead, contact, etc',
  `conversion_value` decimal(12,2) DEFAULT NULL COMMENT 'Valor monetário da conversão (R$)',
  `conversion_at` datetime DEFAULT NULL COMMENT 'Momento exato da conversão',
  `funnel_step` varchar(100) DEFAULT NULL COMMENT 'Último step: visit, lead, signup, payment',
  `first_visit_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Primeira interação',
  `last_activity_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Última atividade',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_ts_session` (`session_id`),
  KEY `idx_ts_cliente` (`cliente_id`),
  KEY `idx_ts_usuario` (`usuario_id`),
  KEY `idx_ts_gclid` (`gclid`),
  KEY `idx_ts_utm_source` (`utm_source`),
  KEY `idx_ts_utm_campaign` (`utm_campaign`),
  KEY `idx_ts_converted` (`converted`),
  KEY `idx_ts_created` (`created_at`),
  KEY `idx_ts_funnel` (`funnel_step`),
  KEY `idx_ts_device` (`device_type`),
  CONSTRAINT `tracking_sessoes_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tracking_sessoes_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=295 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `uasgs` */

DROP TABLE IF EXISTS `uasgs`;

CREATE TABLE `uasgs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `codigo_uasg` varchar(20) NOT NULL,
  `nome` varchar(500) NOT NULL,
  `nome_resumido` varchar(200) DEFAULT NULL,
  `orgao_id` int(10) unsigned DEFAULT NULL,
  `cnpj` varchar(20) DEFAULT NULL,
  `uf` varchar(2) DEFAULT NULL,
  `municipio` varchar(200) DEFAULT NULL,
  `cep` varchar(10) DEFAULT NULL,
  `endereco` text DEFAULT NULL,
  `telefone` varchar(50) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `origem` varchar(50) NOT NULL DEFAULT 'compras_gov',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_uasgs_codigo` (`codigo_uasg`),
  KEY `idx_uasgs_nome` (`nome`(100)),
  KEY `idx_uasgs_uf` (`uf`),
  KEY `idx_uasgs_orgao` (`orgao_id`),
  CONSTRAINT `fk_uasgs_orgao` FOREIGN KEY (`orgao_id`) REFERENCES `orgaos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `usuario_creditos_ia` */

DROP TABLE IF EXISTS `usuario_creditos_ia`;

CREATE TABLE `usuario_creditos_ia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `creditos_totais` int(11) DEFAULT 3,
  `creditos_utilizados` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_uci_usuario` (`usuario_id`),
  CONSTRAINT `usuario_creditos_ia_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `usuarios` */

DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `avatar_iniciais` varchar(5) DEFAULT NULL,
  `avatar_url` varchar(1024) DEFAULT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `perfil_id` int(11) NOT NULL DEFAULT 5,
  `status` enum('Ativo','Inativo') NOT NULL DEFAULT 'Ativo',
  `ultimo_login` datetime DEFAULT NULL,
  `boas_vindas_visto_em` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `token_recuperacao` varchar(255) DEFAULT NULL,
  `token_recuperacao_expira` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `perfil_id` (`perfil_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`perfil_id`) REFERENCES `perfis_acesso` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=277724 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `workflow_aprovacao` */

DROP TABLE IF EXISTS `workflow_aprovacao`;

CREATE TABLE `workflow_aprovacao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `proposta_id` int(11) NOT NULL,
  `etapa` enum('analise','gestor','diretor','aprovada','rejeitada') NOT NULL DEFAULT 'analise',
  `prazo` date DEFAULT NULL,
  `observacao` text DEFAULT NULL,
  `aprovado_por` int(11) DEFAULT NULL,
  `data_aprovacao` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `proposta_id` (`proposta_id`),
  KEY `aprovado_por` (`aprovado_por`),
  CONSTRAINT `workflow_aprovacao_ibfk_1` FOREIGN KEY (`proposta_id`) REFERENCES `propostas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `workflow_aprovacao_ibfk_2` FOREIGN KEY (`aprovado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
