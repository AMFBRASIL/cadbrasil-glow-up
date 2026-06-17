/*
SQLyog Community
MySQL - 10.11.10-MariaDB-log : Database - cadbrasilv2
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
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tipo` enum('urgent','warning','info','success') NOT NULL DEFAULT 'info',
  `titulo` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `referencia_tipo` varchar(50) DEFAULT NULL,
  `referencia_id` bigint(20) unsigned DEFAULT NULL,
  `lido` tinyint(1) NOT NULL DEFAULT 0,
  `ignorado` tinyint(1) NOT NULL DEFAULT 0,
  `usuario_id` bigint(20) unsigned DEFAULT NULL,
  `cliente_id` bigint(20) unsigned DEFAULT NULL,
  `acao_url` varchar(500) DEFAULT NULL COMMENT 'Link/rota para tratar o alerta',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `lido_em` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_alerta_user` (`usuario_id`,`lido`),
  KEY `idx_alerta_cliente` (`cliente_id`),
  KEY `idx_alerta_categoria` (`categoria`),
  CONSTRAINT `fk_alerta_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_alerta_user` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `analise_cronograma` */

DROP TABLE IF EXISTS `analise_cronograma`;

CREATE TABLE `analise_cronograma` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `analise_id` bigint(20) unsigned NOT NULL,
  `evento` varchar(255) NOT NULL,
  `data_evento` datetime DEFAULT NULL,
  `status` enum('concluido','proximo','futuro') NOT NULL DEFAULT 'futuro',
  PRIMARY KEY (`id`),
  KEY `idx_ac_an` (`analise_id`),
  CONSTRAINT `fk_ac_an` FOREIGN KEY (`analise_id`) REFERENCES `analises_edital` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `analise_documentos_exigidos` */

DROP TABLE IF EXISTS `analise_documentos_exigidos`;

CREATE TABLE `analise_documentos_exigidos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `analise_id` bigint(20) unsigned NOT NULL,
  `documento` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ade_an` (`analise_id`),
  CONSTRAINT `fk_ade_an` FOREIGN KEY (`analise_id`) REFERENCES `analises_edital` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `analise_pontos_atencao` */

DROP TABLE IF EXISTS `analise_pontos_atencao`;

CREATE TABLE `analise_pontos_atencao` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `analise_id` bigint(20) unsigned NOT NULL,
  `descricao` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_apa_an` (`analise_id`),
  CONSTRAINT `fk_apa_an` FOREIGN KEY (`analise_id`) REFERENCES `analises_edital` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `analise_requisitos_habilitacao` */

DROP TABLE IF EXISTS `analise_requisitos_habilitacao`;

CREATE TABLE `analise_requisitos_habilitacao` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `analise_id` bigint(20) unsigned NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `item` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_arh_an` (`analise_id`),
  CONSTRAINT `fk_arh_an` FOREIGN KEY (`analise_id`) REFERENCES `analises_edital` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `analises_edital` */

DROP TABLE IF EXISTS `analises_edital`;

CREATE TABLE `analises_edital` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `licitacao_id` bigint(20) unsigned DEFAULT NULL,
  `usuario_id` bigint(20) unsigned NOT NULL,
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
  `exclusiva_me_epp` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('pendente','processando','concluido','erro') NOT NULL DEFAULT 'pendente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_ae_lic` (`licitacao_id`),
  KEY `idx_ae_user` (`usuario_id`),
  CONSTRAINT `fk_ae_lic` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ae_user` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `assinaturas` */

DROP TABLE IF EXISTS `assinaturas`;

CREATE TABLE `assinaturas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `plano_id` bigint(20) unsigned NOT NULL,
  `status` enum('ativa','pendente','suspensa','cancelada','expirada') NOT NULL DEFAULT 'pendente',
  `data_inicio` date NOT NULL,
  `data_fim` date DEFAULT NULL,
  `data_proxima_cobranca` date DEFAULT NULL,
  `valor_atual` decimal(15,2) NOT NULL,
  `forma_pagamento` enum('boleto','pix','cartao','transferencia') DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `cancelada_em` datetime DEFAULT NULL,
  `cancelada_motivo` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_assin_cliente` (`cliente_id`),
  KEY `idx_assin_plano` (`plano_id`),
  KEY `idx_assin_status` (`status`),
  KEY `idx_assin_prox_cob` (`data_proxima_cobranca`),
  CONSTRAINT `fk_assin_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assin_plano` FOREIGN KEY (`plano_id`) REFERENCES `planos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `atas_registro_preco` */

DROP TABLE IF EXISTS `atas_registro_preco`;

CREATE TABLE `atas_registro_preco` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `licitacao_id` bigint(20) unsigned DEFAULT NULL,
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_arp_numero` (`numero_ata`),
  KEY `idx_arp_externo` (`id_externo`),
  KEY `idx_arp_lic` (`licitacao_id`),
  KEY `idx_arp_uasg` (`codigo_uasg`),
  KEY `idx_arp_vigencia` (`data_fim_vigencia`),
  CONSTRAINT `fk_arp_lic` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5206 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `auditoria_log` */

DROP TABLE IF EXISTS `auditoria_log`;

CREATE TABLE `auditoria_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned DEFAULT NULL,
  `cliente_id` bigint(20) unsigned DEFAULT NULL COMMENT 'Opcional, para escopo de cliente',
  `acao` varchar(80) NOT NULL COMMENT 'CREATE|UPDATE|DELETE|LOGIN|CUSTOM:nome',
  `descricao` varchar(500) DEFAULT NULL,
  `entidade` varchar(100) NOT NULL,
  `entidade_id` bigint(20) unsigned DEFAULT NULL,
  `dados_anteriores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_anteriores`)),
  `dados_novos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_novos`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_aud_usuario` (`usuario_id`,`created_at`),
  KEY `idx_aud_cliente` (`cliente_id`,`created_at`),
  KEY `idx_aud_entidade` (`entidade`,`entidade_id`),
  KEY `idx_aud_acao` (`acao`),
  KEY `idx_aud_created` (`created_at`),
  CONSTRAINT `fk_aud_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=863 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `automacao_execucoes` */

DROP TABLE IF EXISTS `automacao_execucoes`;

CREATE TABLE `automacao_execucoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `automacao_id` bigint(20) unsigned NOT NULL,
  `iniciado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `finalizado_em` datetime DEFAULT NULL,
  `status` enum('running','sucesso','erro','parcial') NOT NULL,
  `mensagem` text DEFAULT NULL,
  `detalhes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`detalhes`)),
  PRIMARY KEY (`id`),
  KEY `idx_ae_auto` (`automacao_id`,`iniciado_em`),
  CONSTRAINT `fk_aex_auto` FOREIGN KEY (`automacao_id`) REFERENCES `automacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `automacoes` */

DROP TABLE IF EXISTS `automacoes`;

CREATE TABLE `automacoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `descricao` varchar(500) DEFAULT NULL,
  `gatilho` varchar(80) NOT NULL COMMENT 'cron|evento|webhook|manual',
  `gatilho_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'cron expr, evento name, etc' CHECK (json_valid(`gatilho_config`)),
  `acoes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'lista ordenada de ações' CHECK (json_valid(`acoes`)),
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `escopo` enum('sistema','cliente','usuario') NOT NULL DEFAULT 'sistema',
  `cliente_id` bigint(20) unsigned DEFAULT NULL,
  `usuario_id` bigint(20) unsigned DEFAULT NULL,
  `ultima_exec_em` datetime DEFAULT NULL,
  `ultima_exec_status` enum('sucesso','erro','parcial') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_auto_ativo` (`ativo`),
  KEY `idx_auto_cliente` (`cliente_id`),
  KEY `fk_auto_user` (`usuario_id`),
  CONSTRAINT `fk_auto_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_auto_user` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `certidoes` */

DROP TABLE IF EXISTS `certidoes`;

CREATE TABLE `certidoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `sicaf_id` bigint(20) unsigned DEFAULT NULL,
  `tipo_certidao_id` bigint(20) unsigned NOT NULL,
  `numero` varchar(100) DEFAULT NULL,
  `nivel_sicaf` enum('I','II','III','IV','V','VI') DEFAULT NULL,
  `data_emissao` date DEFAULT NULL,
  `data_validade` date DEFAULT NULL,
  `status` enum('Válida','Vencendo','Vencida') NOT NULL DEFAULT 'Válida',
  `dias_restantes` int(11) NOT NULL DEFAULT 0,
  `auto_renovar` tinyint(1) NOT NULL DEFAULT 0,
  `arquivo_url` varchar(500) DEFAULT NULL,
  `arquivo_nome` varchar(255) DEFAULT NULL,
  `arquivo_tamanho` varchar(20) DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cert_cliente_tipo` (`cliente_id`,`tipo_certidao_id`),
  KEY `idx_cert_sicaf` (`sicaf_id`),
  KEY `idx_cert_validade` (`data_validade`),
  KEY `idx_cert_status` (`status`),
  KEY `fk_certidoes_tipo` (`tipo_certidao_id`),
  CONSTRAINT `fk_certidoes_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_certidoes_sicaf` FOREIGN KEY (`sicaf_id`) REFERENCES `sicaf_cadastros` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_certidoes_tipo` FOREIGN KEY (`tipo_certidao_id`) REFERENCES `tipo_certidoes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1215 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `cliente_contatos` */

DROP TABLE IF EXISTS `cliente_contatos`;

CREATE TABLE `cliente_contatos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `nome` varchar(150) NOT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `principal` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_contatos_cliente` (`cliente_id`),
  CONSTRAINT `fk_contatos_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1825 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `cliente_notas_internas` */

DROP TABLE IF EXISTS `cliente_notas_internas`;

CREATE TABLE `cliente_notas_internas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `usuario_id` bigint(20) unsigned DEFAULT NULL,
  `texto` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_notas_cliente` (`cliente_id`,`created_at`),
  KEY `fk_notas_usuario` (`usuario_id`),
  CONSTRAINT `fk_notas_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `clientes` */

DROP TABLE IF EXISTS `clientes`;

CREATE TABLE `clientes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL COMMENT 'Dono do cliente (1:N)',
  `tipo_documento` enum('CPF','CNPJ') NOT NULL DEFAULT 'CNPJ',
  `documento` varchar(20) NOT NULL,
  `razao_social` varchar(255) NOT NULL,
  `nome_fantasia` varchar(255) DEFAULT NULL,
  `inscricao_estadual` varchar(30) DEFAULT NULL,
  `inscricao_municipal` varchar(30) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `complemento` varchar(100) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` char(2) DEFAULT NULL,
  `cep` varchar(10) DEFAULT NULL,
  `porte` enum('MEI','ME','EPP','Média','Grande') DEFAULT 'ME',
  `ramo_atividade` varchar(150) DEFAULT NULL,
  `cnae_principal` varchar(10) DEFAULT NULL,
  `responsavel_nome` varchar(150) DEFAULT NULL,
  `responsavel_cpf` varchar(14) DEFAULT NULL,
  `responsavel_email` varchar(255) DEFAULT NULL,
  `responsavel_telefone` varchar(20) DEFAULT NULL,
  `status` enum('Ativo','Pendente','Inativo','Suspenso') NOT NULL DEFAULT 'Ativo',
  `observacoes` text DEFAULT NULL,
  `protocolo_cadbrasil` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_clientes_documento` (`documento`),
  KEY `idx_clientes_razao` (`razao_social`),
  KEY `idx_clientes_status` (`status`),
  KEY `idx_clientes_usuario` (`usuario_id`),
  KEY `idx_clientes_estado` (`estado`),
  KEY `idx_clientes_deleted` (`deleted_at`),
  CONSTRAINT `fk_clientes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=191744 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `clientes_cnaes` */

DROP TABLE IF EXISTS `clientes_cnaes`;

CREATE TABLE `clientes_cnaes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `cnae_codigo` varchar(10) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `tipo` enum('principal','secundario') NOT NULL DEFAULT 'secundario',
  `ordem` smallint(5) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_clientes_cnaes_cliente` (`cliente_id`),
  CONSTRAINT `fk_clientes_cnaes_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `clientes_certificado_digital` */

DROP TABLE IF EXISTS `clientes_certificado_digital`;

CREATE TABLE `clientes_certificado_digital` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) NOT NULL,
  `arquivo_path` varchar(500) DEFAULT NULL,
  `arquivo_nome` varchar(255) NOT NULL,
  `arquivo_pfx_armazenado` mediumtext DEFAULT NULL,
  `senha_criptografada` text NOT NULL,
  `titular_nome` varchar(255) DEFAULT NULL,
  `titular_documento` varchar(20) DEFAULT NULL,
  `emissor` varchar(255) DEFAULT NULL,
  `valido_de` date DEFAULT NULL,
  `valido_ate` date DEFAULT NULL,
  `serial_number` varchar(120) DEFAULT NULL,
  `validado_em` datetime DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'valido',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cliente_certificado` (`cliente_id`),
  KEY `idx_cert_cliente` (`cliente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Table structure for table `clientes_certificados_digitais` */

DROP TABLE IF EXISTS `clientes_certificados_digitais`;

CREATE TABLE `clientes_certificados_digitais` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `arquivo_path` varchar(500) NOT NULL,
  `arquivo_nome` varchar(255) NOT NULL,
  `arquivo_pfx_armazenado` mediumtext DEFAULT NULL COMMENT 'PFX base64 AES-256-GCM',
  `senha_criptografada` text NOT NULL,
  `titular_nome` varchar(255) DEFAULT NULL,
  `titular_documento` varchar(20) DEFAULT NULL,
  `emissor` varchar(255) DEFAULT NULL,
  `valido_de` date DEFAULT NULL,
  `valido_ate` date DEFAULT NULL,
  `serial_number` varchar(120) DEFAULT NULL,
  `validado_em` datetime DEFAULT NULL,
  `status` enum('valido','expirado','revogado','invalido') NOT NULL DEFAULT 'valido',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cert_cliente` (`cliente_id`),
  KEY `idx_cert_validade` (`valido_ate`),
  CONSTRAINT `fk_cert_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `coleta_logs` */

DROP TABLE IF EXISTS `coleta_logs`;

CREATE TABLE `coleta_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `fonte` varchar(50) NOT NULL,
  `modulo` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL,
  `registros_coletados` int(11) NOT NULL DEFAULT 0,
  `registros_novos` int(11) NOT NULL DEFAULT 0,
  `registros_atualizados` int(11) NOT NULL DEFAULT 0,
  `registros_erro` int(11) NOT NULL DEFAULT 0,
  `paginas_processadas` int(11) NOT NULL DEFAULT 0,
  `parametros` text DEFAULT NULL,
  `erro_mensagem` text DEFAULT NULL,
  `erro_stack` text DEFAULT NULL,
  `data_referencia_inicio` datetime DEFAULT NULL,
  `data_referencia_fim` datetime DEFAULT NULL,
  `iniciado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `finalizado_em` datetime DEFAULT NULL,
  `duracao_ms` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_cl_fonte` (`fonte`),
  KEY `idx_cl_modulo` (`modulo`),
  KEY `idx_cl_status` (`status`),
  KEY `idx_cl_inicio` (`iniciado_em`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `compras_pacotes_ia` */

DROP TABLE IF EXISTS `compras_pacotes_ia`;

CREATE TABLE `compras_pacotes_ia` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `pacote_id` bigint(20) unsigned NOT NULL,
  `quantidade_creditos` int(11) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `status` enum('pendente','pago','cancelado') NOT NULL DEFAULT 'pendente',
  `pagamento_id` bigint(20) unsigned DEFAULT NULL,
  `data_pagamento` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_cpi_user` (`usuario_id`),
  KEY `idx_cpi_pac` (`pacote_id`),
  KEY `fk_cpi_pgto` (`pagamento_id`),
  CONSTRAINT `fk_cpi_pac` FOREIGN KEY (`pacote_id`) REFERENCES `pacotes_leitura_ia` (`id`),
  CONSTRAINT `fk_cpi_pgto` FOREIGN KEY (`pagamento_id`) REFERENCES `pagamentos` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cpi_user` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `concorrentes` */

DROP TABLE IF EXISTS `concorrentes`;

CREATE TABLE `concorrentes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `cnpj` varchar(20) DEFAULT NULL,
  `vitorias` int(11) NOT NULL DEFAULT 0,
  `participacoes` int(11) NOT NULL DEFAULT 0,
  `taxa_vitoria` decimal(5,2) NOT NULL DEFAULT 0.00,
  `valor_total` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_concor_cnpj` (`cnpj`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `configuracoes_sistema` */

DROP TABLE IF EXISTS `configuracoes_sistema`;

CREATE TABLE `configuracoes_sistema` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `chave` varchar(100) NOT NULL,
  `valor` text DEFAULT NULL,
  `categoria` enum('empresa','licitacoes','integracoes','seguranca','email','notificacoes','aparencia','backup','ia','pagamentos','armazenamento') NOT NULL DEFAULT 'empresa',
  `descricao` varchar(255) DEFAULT NULL,
  `tipo_valor` enum('string','number','boolean','json','secret') NOT NULL DEFAULT 'string',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cfg_chave` (`chave`),
  KEY `idx_cfg_cat` (`categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `contratos` */

DROP TABLE IF EXISTS `contratos`;

CREATE TABLE `contratos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `licitacao_id` bigint(20) unsigned DEFAULT NULL,
  `fornecedor_id` bigint(20) unsigned DEFAULT NULL,
  `usuario_id` bigint(20) unsigned DEFAULT NULL,
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
  `prazo_execucao` int(11) DEFAULT NULL,
  `valor_inicial` decimal(18,2) DEFAULT NULL,
  `valor_global` decimal(18,2) DEFAULT NULL,
  `valor_acumulado` decimal(18,2) DEFAULT NULL,
  `situacao` varchar(100) DEFAULT NULL,
  `cnpj_contratado` varchar(20) DEFAULT NULL,
  `nome_contratado` varchar(500) DEFAULT NULL,
  `dados_originais` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_originais`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_cont_numero` (`numero_contrato`),
  KEY `idx_cont_externo` (`id_externo`),
  KEY `idx_cont_lic` (`licitacao_id`),
  KEY `idx_cont_forn` (`fornecedor_id`),
  KEY `idx_cont_uasg` (`codigo_uasg`),
  KEY `idx_cont_vigencia` (`data_fim_vigencia`),
  FULLTEXT KEY `ft_contratos_objeto` (`objeto`),
  CONSTRAINT `fk_cont_forn` FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cont_lic` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=106101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `contratos_digitais` */

DROP TABLE IF EXISTS `contratos_digitais`;

CREATE TABLE `contratos_digitais` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `plano` varchar(100) NOT NULL DEFAULT 'Licença + Manutenção',
  `data_inicio` date NOT NULL,
  `data_vencimento` date NOT NULL,
  `status` enum('Pendente Assinatura','Assinado','Expirado','Cancelado') NOT NULL DEFAULT 'Pendente Assinatura',
  `assinado_em` datetime DEFAULT NULL,
  `assinado_por` varchar(200) DEFAULT NULL,
  `ip_assinatura` varchar(45) DEFAULT NULL,
  `hash_documento` varchar(128) DEFAULT NULL COMMENT 'SHA-256 do contrato assinado',
  `observacoes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cd_cliente` (`cliente_id`),
  KEY `idx_cd_status` (`status`),
  KEY `idx_cd_vencimento` (`data_vencimento`),
  CONSTRAINT `fk_cd_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1824 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `documentos` */

DROP TABLE IF EXISTS `documentos`;

CREATE TABLE `documentos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned DEFAULT NULL,
  `pasta_id` bigint(20) unsigned DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `pasta` varchar(100) DEFAULT NULL COMMENT 'mantido por compatibilidade textual',
  `tipo_arquivo` enum('PDF','Excel','Word','Imagem','Outro') NOT NULL DEFAULT 'PDF',
  `tamanho` varchar(20) DEFAULT NULL,
  `nivel_sicaf` enum('I','II','III','IV','V','VI') DEFAULT NULL,
  `data_validade` date DEFAULT NULL,
  `status` enum('valid','expiring','expired') NOT NULL DEFAULT 'valid',
  `arquivo_url` varchar(500) DEFAULT NULL,
  `data_upload` date DEFAULT NULL,
  `uploaded_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_doc_cliente` (`cliente_id`),
  KEY `idx_doc_pasta` (`pasta_id`),
  KEY `idx_doc_status` (`status`),
  KEY `fk_doc_user` (`uploaded_by`),
  CONSTRAINT `fk_doc_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_doc_pasta` FOREIGN KEY (`pasta_id`) REFERENCES `pastas_documentos` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_doc_user` FOREIGN KEY (`uploaded_by`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `fornecedores` */

DROP TABLE IF EXISTS `fornecedores`;

CREATE TABLE `fornecedores` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cnpj_cpf` varchar(20) DEFAULT NULL,
  `tipo_documento` varchar(10) DEFAULT NULL,
  `razao_social` varchar(500) DEFAULT NULL,
  `nome_fantasia` varchar(500) DEFAULT NULL,
  `porte` varchar(50) DEFAULT NULL,
  `uf` varchar(2) DEFAULT NULL,
  `municipio` varchar(200) DEFAULT NULL,
  `telefone` varchar(50) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `origem` varchar(50) NOT NULL DEFAULT 'compras_gov',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fornecedores` (`cnpj_cpf`,`origem`),
  KEY `idx_forn_razao` (`razao_social`(100)),
  KEY `idx_forn_uf` (`uf`),
  KEY `idx_forn_porte` (`porte`)
) ENGINE=InnoDB AUTO_INCREMENT=41332 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `fornecedores_licitacao` */

DROP TABLE IF EXISTS `fornecedores_licitacao`;

CREATE TABLE `fornecedores_licitacao` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `licitacao_id` bigint(20) unsigned NOT NULL,
  `fornecedor_id` bigint(20) unsigned NOT NULL,
  `item_id` bigint(20) unsigned DEFAULT NULL,
  `situacao` varchar(100) DEFAULT NULL,
  `vencedor` tinyint(1) NOT NULL DEFAULT 0,
  `valor_proposta` decimal(18,2) DEFAULT NULL,
  `valor_negociado` decimal(18,2) DEFAULT NULL,
  `percentual_desconto` decimal(8,4) DEFAULT NULL,
  `posicao_classificacao` int(11) DEFAULT NULL,
  `motivo_desclassificacao` text DEFAULT NULL,
  `dados_originais` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_originais`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_fl_lic` (`licitacao_id`),
  KEY `idx_fl_forn` (`fornecedor_id`),
  KEY `idx_fl_item` (`item_id`),
  KEY `idx_fl_vencedor` (`vencedor`),
  CONSTRAINT `fk_fl_forn` FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fl_item` FOREIGN KEY (`item_id`) REFERENCES `itens_licitacao` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_fl_lic` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `funil_estagios` */

DROP TABLE IF EXISTS `funil_estagios`;

CREATE TABLE `funil_estagios` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cor` varchar(20) DEFAULT NULL,
  `ordem` int(11) NOT NULL DEFAULT 0,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `tipo` enum('lead','venda','pos_venda') NOT NULL DEFAULT 'lead',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `funil_oportunidades` */

DROP TABLE IF EXISTS `funil_oportunidades`;

CREATE TABLE `funil_oportunidades` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned DEFAULT NULL,
  `lead_nome` varchar(150) DEFAULT NULL,
  `lead_email` varchar(255) DEFAULT NULL,
  `lead_telefone` varchar(20) DEFAULT NULL,
  `lead_empresa` varchar(255) DEFAULT NULL,
  `estagio_id` bigint(20) unsigned NOT NULL,
  `valor_estimado` decimal(15,2) DEFAULT NULL,
  `probabilidade` tinyint(3) unsigned DEFAULT NULL COMMENT '0-100',
  `responsavel_id` bigint(20) unsigned DEFAULT NULL,
  `origem` varchar(80) DEFAULT NULL COMMENT 'google_ads, organic, indicacao, etc',
  `tracking_sessao_id` bigint(20) unsigned DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `data_fechamento_prevista` date DEFAULT NULL,
  `data_fechamento_real` date DEFAULT NULL,
  `motivo_perda` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_fo_cliente` (`cliente_id`),
  KEY `idx_fo_estagio` (`estagio_id`),
  KEY `idx_fo_resp` (`responsavel_id`),
  CONSTRAINT `fk_fo_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_fo_estagio` FOREIGN KEY (`estagio_id`) REFERENCES `funil_estagios` (`id`),
  CONSTRAINT `fk_fo_resp` FOREIGN KEY (`responsavel_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `google_ads_campanhas` */

DROP TABLE IF EXISTS `google_ads_campanhas`;

CREATE TABLE `google_ads_campanhas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` varchar(50) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `status` enum('ativa','pausada','removida') NOT NULL DEFAULT 'ativa',
  `tipo` varchar(50) DEFAULT NULL,
  `orcamento_diario` decimal(12,2) DEFAULT NULL,
  `inicio` date DEFAULT NULL,
  `fim` date DEFAULT NULL,
  `metricas_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'snapshot de impressões, cliques, custo, CTR, CPC, etc' CHECK (json_valid(`metricas_json`)),
  `sincronizado_em` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ga_camp` (`campaign_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `google_ads_conversoes` */

DROP TABLE IF EXISTS `google_ads_conversoes`;

CREATE TABLE `google_ads_conversoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `gclid` varchar(255) DEFAULT NULL,
  `email_address` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `conversion_action` varchar(120) DEFAULT NULL,
  `conversion_value` decimal(12,2) DEFAULT NULL,
  `conversion_currency` char(3) DEFAULT 'BRL',
  `conversion_date_time` datetime NOT NULL,
  `enviado_em` datetime DEFAULT NULL,
  `status` enum('pendente','enviado','falhou') NOT NULL DEFAULT 'pendente',
  `response_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`response_payload`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_gac_gclid` (`gclid`),
  KEY `idx_gac_email` (`email_address`),
  KEY `idx_gac_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=413 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `ia_conversas` */

DROP TABLE IF EXISTS `ia_conversas`;

CREATE TABLE `ia_conversas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `cliente_id` bigint(20) unsigned DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `contexto` enum('admin','cliente','suporte','sicaf','edital') NOT NULL DEFAULT 'cliente',
  `modelo` varchar(50) DEFAULT NULL COMMENT 'gpt-4o, gemini-2.5-flash, etc',
  `tokens_in` int(11) NOT NULL DEFAULT 0,
  `tokens_out` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_iac_user` (`usuario_id`,`created_at`),
  KEY `idx_iac_cliente` (`cliente_id`),
  CONSTRAINT `fk_iac_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_iac_user` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `ia_mensagens` */

DROP TABLE IF EXISTS `ia_mensagens`;

CREATE TABLE `ia_mensagens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `conversa_id` bigint(20) unsigned NOT NULL,
  `role` enum('system','user','assistant','tool') NOT NULL,
  `conteudo` longtext NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `tokens` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_iam_conv` (`conversa_id`,`created_at`),
  CONSTRAINT `fk_iam_conv` FOREIGN KEY (`conversa_id`) REFERENCES `ia_conversas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `itens_licitacao` */

DROP TABLE IF EXISTS `itens_licitacao`;

CREATE TABLE `itens_licitacao` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `licitacao_id` bigint(20) unsigned NOT NULL,
  `numero_item` int(11) DEFAULT NULL,
  `tipo_item` varchar(50) DEFAULT NULL,
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
  `beneficio_me_epp` tinyint(1) NOT NULL DEFAULT 0,
  `dados_originais` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_originais`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_itens_lic` (`licitacao_id`),
  KEY `idx_itens_catmat` (`catmat_catser`),
  KEY `idx_itens_num` (`numero_item`),
  FULLTEXT KEY `ft_itens_descricao` (`descricao`),
  CONSTRAINT `fk_itens_lic` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `leituras_edital_ia` */

DROP TABLE IF EXISTS `leituras_edital_ia`;

CREATE TABLE `leituras_edital_ia` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `nome_arquivo` varchar(255) NOT NULL,
  `tamanho_arquivo` int(11) NOT NULL DEFAULT 0,
  `caminho_arquivo` varchar(500) DEFAULT NULL,
  `resultado` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`resultado`)),
  `texto_extraido` longtext DEFAULT NULL,
  `status` enum('processando','concluido','erro') NOT NULL DEFAULT 'processando',
  `erro_mensagem` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_lea_user` (`usuario_id`,`status`),
  CONSTRAINT `fk_lea_user` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `licitacoes` */

DROP TABLE IF EXISTS `licitacoes`;

CREATE TABLE `licitacoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `numero_processo` varchar(100) NOT NULL,
  `numero_controle_pncp` varchar(100) DEFAULT NULL,
  `id_externo` varchar(200) DEFAULT NULL,
  `origem` varchar(50) NOT NULL,
  `lei` varchar(20) DEFAULT NULL,
  `modalidade` varchar(100) DEFAULT NULL,
  `modo_disputa` varchar(100) DEFAULT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `criterio_julgamento` varchar(200) DEFAULT NULL,
  `amparo_legal` text DEFAULT NULL,
  `orgao_id` bigint(20) unsigned DEFAULT NULL,
  `uasg_id` bigint(20) unsigned DEFAULT NULL,
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
  `srp` tinyint(1) NOT NULL DEFAULT 0,
  `link_edital` varchar(1000) DEFAULT NULL,
  `link_portal` varchar(1000) DEFAULT NULL,
  `dados_originais` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_originais`)),
  `coletado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_fonte_em` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_lic_processo` (`numero_processo`),
  KEY `idx_lic_pncp` (`numero_controle_pncp`),
  KEY `idx_lic_externo` (`id_externo`),
  KEY `idx_lic_origem` (`origem`),
  KEY `idx_lic_modalidade` (`modalidade`),
  KEY `idx_lic_orgao` (`orgao_id`),
  KEY `idx_lic_uasg_id` (`uasg_id`),
  KEY `idx_lic_uasg` (`codigo_uasg`),
  KEY `idx_lic_uf` (`uf`),
  KEY `idx_lic_status` (`status`),
  KEY `idx_lic_pub` (`data_publicacao`),
  KEY `idx_lic_abertura` (`data_abertura`),
  KEY `idx_lic_srp` (`srp`),
  KEY `idx_lic_origem_ext` (`origem`,`id_externo`),
  FULLTEXT KEY `ft_licitacoes_objeto` (`objeto`,`objeto_resumido`),
  CONSTRAINT `fk_lic_orgao` FOREIGN KEY (`orgao_id`) REFERENCES `orgaos` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_lic_uasg` FOREIGN KEY (`uasg_id`) REFERENCES `uasgs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=45699 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `licitacoes_mira` */

DROP TABLE IF EXISTS `licitacoes_mira`;

CREATE TABLE `licitacoes_mira` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `licitacao_id` bigint(20) unsigned NOT NULL,
  `cliente_id` bigint(20) unsigned DEFAULT NULL,
  `pipeline_status` varchar(32) NOT NULL DEFAULT 'na_mira',
  `notas` text DEFAULT NULL,
  `alertas_ativos` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mira_user_lic` (`usuario_id`,`licitacao_id`),
  KEY `idx_mira_user` (`usuario_id`),
  KEY `idx_mira_lic` (`licitacao_id`),
  KEY `fk_mira_cliente` (`cliente_id`),
  CONSTRAINT `fk_mira_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_mira_lic` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mira_user` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=293 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `licitacoes_radar_regras` */

DROP TABLE IF EXISTS `licitacoes_radar_regras`;

CREATE TABLE `licitacoes_radar_regras` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `nome` varchar(120) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `palavras_chave` text DEFAULT NULL,
  `ufs` text DEFAULT NULL,
  `modalidades` text DEFAULT NULL,
  `valor_min` decimal(18,2) DEFAULT NULL,
  `valor_max` decimal(18,2) DEFAULT NULL,
  `esfera` varchar(40) DEFAULT NULL,
  `srp_filter` varchar(8) DEFAULT 'all',
  `auto_mira` tinyint(1) NOT NULL DEFAULT 0,
  `ultima_execucao_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_radar_user` (`usuario_id`),
  KEY `idx_radar_ativo` (`ativo`),
  CONSTRAINT `fk_radar_user` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `licitacoes_resumo_ia` */

DROP TABLE IF EXISTS `licitacoes_resumo_ia`;

CREATE TABLE `licitacoes_resumo_ia` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `licitacao_id` bigint(20) unsigned NOT NULL,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `resumo_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`resumo_json`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_resumo_lic_user` (`licitacao_id`,`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `login_logs` */

DROP TABLE IF EXISTS `login_logs`;

CREATE TABLE `login_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `sucesso` tinyint(1) NOT NULL DEFAULT 1,
  `motivo_falha` varchar(120) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `dispositivo` varchar(100) DEFAULT NULL,
  `navegador` varchar(100) DEFAULT NULL,
  `plataforma` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_loginlogs_usuario` (`usuario_id`,`created_at`),
  KEY `idx_loginlogs_sucesso` (`sucesso`)
) ENGINE=InnoDB AUTO_INCREMENT=1770 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `manutencao_boletos` */

DROP TABLE IF EXISTS `manutencao_boletos`;

CREATE TABLE `manutencao_boletos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `manutencao_id` bigint(20) unsigned NOT NULL,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `numero_boleto` varchar(100) DEFAULT NULL,
  `valor` decimal(15,2) NOT NULL,
  `mes_referencia` tinyint(4) NOT NULL,
  `ano_referencia` smallint(6) NOT NULL,
  `data_vencimento` date NOT NULL,
  `data_pagamento` date DEFAULT NULL,
  `status` enum('Pendente','Pago','Atrasado','Cancelado') NOT NULL DEFAULT 'Pendente',
  `forma_pagamento` enum('Boleto','PIX') NOT NULL DEFAULT 'Boleto',
  `codigo_barras` varchar(100) DEFAULT NULL,
  `chave_pix` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_mb_manut` (`manutencao_id`),
  KEY `idx_mb_cliente` (`cliente_id`),
  KEY `idx_mb_venc` (`data_vencimento`),
  KEY `idx_mb_status` (`status`),
  CONSTRAINT `fk_mb_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mb_manut` FOREIGN KEY (`manutencao_id`) REFERENCES `manutencoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2949 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `manutencao_renovacoes` */

DROP TABLE IF EXISTS `manutencao_renovacoes`;

CREATE TABLE `manutencao_renovacoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `manutencao_id` bigint(20) unsigned NOT NULL,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `data_renovacao` datetime NOT NULL,
  `data_inicio_novo` date NOT NULL,
  `data_fim_novo` date NOT NULL,
  `valor_novo` decimal(15,2) NOT NULL,
  `status` enum('Concluída','Pendente','Cancelada') NOT NULL DEFAULT 'Concluída',
  `renovado_por` bigint(20) unsigned DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_mr_manut` (`manutencao_id`),
  KEY `idx_mr_cliente` (`cliente_id`),
  KEY `fk_mr_user` (`renovado_por`),
  CONSTRAINT `fk_mr_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mr_manut` FOREIGN KEY (`manutencao_id`) REFERENCES `manutencoes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mr_user` FOREIGN KEY (`renovado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `manutencao_uso_log` */

DROP TABLE IF EXISTS `manutencao_uso_log`;

CREATE TABLE `manutencao_uso_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `sicaf_id` bigint(20) unsigned DEFAULT NULL,
  `usuario_id` bigint(20) unsigned DEFAULT NULL,
  `tipo` varchar(50) NOT NULL DEFAULT 'situacao_fornecedor',
  `origem` varchar(50) NOT NULL DEFAULT 'assistente',
  `plano_status` varchar(20) NOT NULL DEFAULT 'ativo',
  `certidoes_processadas` int(11) NOT NULL DEFAULT 0,
  `niveis_afetados` varchar(120) DEFAULT NULL,
  `cobravel` tinyint(1) NOT NULL DEFAULT 0,
  `valor_cobranca` decimal(10,2) DEFAULT NULL,
  `observacao` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_mul_cliente` (`cliente_id`,`created_at`),
  KEY `idx_mul_cobravel` (`cobravel`),
  CONSTRAINT `fk_mul_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=180 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `manutencoes` */

DROP TABLE IF EXISTS `manutencoes`;

CREATE TABLE `manutencoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `tipo` enum('Preventiva','Corretiva') NOT NULL DEFAULT 'Preventiva',
  `plano` varchar(100) DEFAULT NULL,
  `valor` decimal(15,2) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'Ativo',
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  `dias_restantes` int(11) NOT NULL DEFAULT 0,
  `observacoes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_manut_cliente` (`cliente_id`),
  KEY `idx_manut_status` (`status`),
  CONSTRAINT `fk_manut_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=847 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `menus` */

DROP TABLE IF EXISTS `menus`;

CREATE TABLE `menus` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `categoria` varchar(50) NOT NULL,
  `icone` varchar(50) DEFAULT NULL,
  `rota` varchar(100) NOT NULL,
  `ordem` int(11) NOT NULL DEFAULT 0,
  `menu_pai_id` bigint(20) unsigned DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `requer_autenticacao` tinyint(1) NOT NULL DEFAULT 1,
  `tipo_usuario` enum('admin','cliente','ambos') NOT NULL DEFAULT 'ambos',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_menus_rota` (`rota`),
  KEY `idx_menus_pai` (`menu_pai_id`),
  CONSTRAINT `fk_menus_pai` FOREIGN KEY (`menu_pai_id`) REFERENCES `menus` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `nfse_servicos` */

DROP TABLE IF EXISTS `nfse_servicos`;

CREATE TABLE `nfse_servicos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `taxa_sicaf_id` bigint(20) unsigned DEFAULT NULL,
  `pagamento_id` bigint(20) unsigned DEFAULT NULL,
  `usuario_id` bigint(20) unsigned DEFAULT NULL,
  `municipio` varchar(120) NOT NULL DEFAULT 'Sao Paulo',
  `uf` char(2) NOT NULL DEFAULT 'SP',
  `competencia` char(7) DEFAULT NULL,
  `data_emissao` date DEFAULT NULL,
  `codigo_servico` varchar(20) DEFAULT NULL,
  `descricao_servico` text DEFAULT NULL,
  `aliquota` decimal(8,4) NOT NULL DEFAULT 0.0000,
  `valor_servico` decimal(15,2) NOT NULL DEFAULT 0.00,
  `valor_deducoes` decimal(15,2) NOT NULL DEFAULT 0.00,
  `valor_pis` decimal(15,2) NOT NULL DEFAULT 0.00,
  `valor_cofins` decimal(15,2) NOT NULL DEFAULT 0.00,
  `valor_inss` decimal(15,2) NOT NULL DEFAULT 0.00,
  `valor_ir` decimal(15,2) NOT NULL DEFAULT 0.00,
  `valor_csll` decimal(15,2) NOT NULL DEFAULT 0.00,
  `valor_iss` decimal(15,2) NOT NULL DEFAULT 0.00,
  `valor_liquido` decimal(15,2) NOT NULL DEFAULT 0.00,
  `tomador_razao_social` varchar(255) DEFAULT NULL,
  `tomador_documento` varchar(20) DEFAULT NULL,
  `tomador_email` varchar(255) DEFAULT NULL,
  `tomador_telefone` varchar(40) DEFAULT NULL,
  `tomador_endereco` varchar(255) DEFAULT NULL,
  `tomador_cidade` varchar(120) DEFAULT NULL,
  `tomador_uf` char(2) DEFAULT NULL,
  `tomador_cep` varchar(16) DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `status` varchar(40) NOT NULL DEFAULT 'pendente_envio',
  `numero_rps` varchar(80) DEFAULT NULL,
  `numero_nfse` varchar(80) DEFAULT NULL,
  `codigo_verificacao` varchar(120) DEFAULT NULL,
  `protocolo` varchar(120) DEFAULT NULL,
  `link_nfse` varchar(500) DEFAULT NULL,
  `request_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`request_payload`)),
  `response_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`response_payload`)),
  `erro` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_nfse_cliente` (`cliente_id`),
  KEY `idx_nfse_taxa` (`taxa_sicaf_id`),
  KEY `idx_nfse_pagamento` (`pagamento_id`),
  KEY `idx_nfse_status` (`status`),
  CONSTRAINT `fk_nfse_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_nfse_pgto` FOREIGN KEY (`pagamento_id`) REFERENCES `pagamentos` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_nfse_taxa` FOREIGN KEY (`taxa_sicaf_id`) REFERENCES `taxas_sicaf` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `notificacoes` */

DROP TABLE IF EXISTS `notificacoes`;

CREATE TABLE `notificacoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned DEFAULT NULL,
  `cliente_id` bigint(20) unsigned DEFAULT NULL,
  `canal` enum('email','sms','whatsapp','push','in_app') NOT NULL,
  `tipo` varchar(60) NOT NULL COMMENT 'certidao_vencendo, pagamento_aprovado, etc',
  `referencia_tipo` varchar(50) DEFAULT NULL,
  `referencia_id` bigint(20) unsigned DEFAULT NULL,
  `destino` varchar(255) DEFAULT NULL COMMENT 'email/telefone destinatário',
  `assunto` varchar(255) DEFAULT NULL,
  `mensagem` text DEFAULT NULL,
  `template_id` bigint(20) unsigned DEFAULT NULL,
  `status` enum('pendente','enviado','entregue','lido','falhou','cancelado') NOT NULL DEFAULT 'pendente',
  `enviado_em` datetime DEFAULT NULL,
  `lido_em` datetime DEFAULT NULL,
  `erro` text DEFAULT NULL,
  `provider_id` varchar(120) DEFAULT NULL,
  `tentativas` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_notif_user` (`usuario_id`,`created_at`),
  KEY `idx_notif_cliente` (`cliente_id`),
  KEY `idx_notif_canal_status` (`canal`,`status`),
  KEY `idx_notif_tipo` (`tipo`),
  KEY `idx_notif_ref` (`referencia_tipo`,`referencia_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1011 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `notificacoes_preferencias` */

DROP TABLE IF EXISTS `notificacoes_preferencias`;

CREATE TABLE `notificacoes_preferencias` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `email_ativo` tinyint(1) NOT NULL DEFAULT 1,
  `push_ativo` tinyint(1) NOT NULL DEFAULT 1,
  `whatsapp_ativo` tinyint(1) NOT NULL DEFAULT 0,
  `sms_ativo` tinyint(1) NOT NULL DEFAULT 0,
  `auto_renovar` tinyint(1) NOT NULL DEFAULT 0,
  `resumo_diario` tinyint(1) NOT NULL DEFAULT 1,
  `dias_antecedencia` int(11) NOT NULL DEFAULT 7,
  `eventos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'on/off por evento' CHECK (json_valid(`eventos`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pref_user` (`usuario_id`),
  CONSTRAINT `fk_pref_user` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `orgaos` */

DROP TABLE IF EXISTS `orgaos`;

CREATE TABLE `orgaos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL,
  `nome` varchar(500) NOT NULL,
  `sigla` varchar(50) DEFAULT NULL,
  `esfera` varchar(20) DEFAULT NULL,
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
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_orgaos_cod_origem` (`codigo`,`origem`),
  KEY `idx_orgaos_nome` (`nome`(100)),
  KEY `idx_orgaos_cnpj` (`cnpj`),
  KEY `idx_orgaos_uf` (`uf`),
  KEY `idx_orgaos_esfera` (`esfera`),
  FULLTEXT KEY `ft_orgaos_nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=18307 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `pacotes_leitura_ia` */

DROP TABLE IF EXISTS `pacotes_leitura_ia`;

CREATE TABLE `pacotes_leitura_ia` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `quantidade_leituras` int(11) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `recursos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`recursos`)),
  `destaque` tinyint(1) NOT NULL DEFAULT 0,
  `economia` varchar(50) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `pagamento_comprovantes` */

DROP TABLE IF EXISTS `pagamento_comprovantes`;

CREATE TABLE `pagamento_comprovantes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `taxa_sicaf_id` bigint(20) unsigned DEFAULT NULL,
  `pagamento_id` bigint(20) unsigned DEFAULT NULL,
  `forma_pagamento` enum('pix','boleto','transferencia','outro') NOT NULL DEFAULT 'pix',
  `valor` decimal(15,2) DEFAULT NULL,
  `arquivo_url` varchar(1024) NOT NULL,
  `arquivo_nome` varchar(255) DEFAULT NULL,
  `arquivo_tipo` varchar(80) DEFAULT NULL,
  `arquivo_tamanho_bytes` bigint(20) unsigned DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `autorizado_por` bigint(20) unsigned DEFAULT NULL,
  `autorizado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_pcomp_cliente` (`cliente_id`),
  KEY `idx_pcomp_taxa` (`taxa_sicaf_id`),
  KEY `idx_pcomp_pagamento` (`pagamento_id`),
  KEY `idx_pcomp_autorizado_em` (`autorizado_em`),
  KEY `fk_pcomp_usuario` (`autorizado_por`),
  CONSTRAINT `fk_pcomp_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pcomp_pagamento` FOREIGN KEY (`pagamento_id`) REFERENCES `pagamentos` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pcomp_taxa` FOREIGN KEY (`taxa_sicaf_id`) REFERENCES `taxas_sicaf` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pcomp_usuario` FOREIGN KEY (`autorizado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `pagamentos` */

DROP TABLE IF EXISTS `pagamentos`;

CREATE TABLE `pagamentos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned DEFAULT NULL,
  `origem` varchar(30) NOT NULL DEFAULT 'sicaf' COMMENT 'sicaf | manutencao | assinatura | avulso',
  `origem_id` bigint(20) unsigned NOT NULL,
  `provider` varchar(30) NOT NULL DEFAULT 'gerencianet' COMMENT 'gerencianet | asaas | stripe | pix_manual',
  `tipo` enum('boleto','pix','cartao','transferencia') NOT NULL,
  `valor` decimal(15,2) NOT NULL,
  `valor_centavos` int(11) NOT NULL,
  `descricao` varchar(500) DEFAULT NULL,
  `protocolo` varchar(100) DEFAULT NULL,
  `data_vencimento` date DEFAULT NULL,
  `data_pagamento` datetime DEFAULT NULL,
  `status` enum('aguardando','gerado','pago','cancelado','expirado','erro','estornado') NOT NULL DEFAULT 'aguardando',
  `provider_charge_id` varchar(120) DEFAULT NULL,
  `provider_txid` varchar(120) DEFAULT NULL,
  `provider_loc_id` varchar(120) DEFAULT NULL,
  `provider_e2eid` varchar(120) DEFAULT NULL,
  `barcode` varchar(100) DEFAULT NULL,
  `link_boleto` varchar(500) DEFAULT NULL,
  `link_pdf` varchar(500) DEFAULT NULL,
  `qrcode_text` text DEFAULT NULL,
  `qrcode_image` mediumtext DEFAULT NULL,
  `provider_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`provider_response`)),
  `provider_error` text DEFAULT NULL,
  `cliente_nome` varchar(255) DEFAULT NULL,
  `cliente_documento` varchar(20) DEFAULT NULL,
  `cliente_email` varchar(255) DEFAULT NULL,
  `gerado_por` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pgto_cliente` (`cliente_id`),
  KEY `idx_pgto_origem` (`origem`,`origem_id`),
  KEY `idx_pgto_status` (`status`),
  KEY `idx_pgto_provider` (`provider`),
  KEY `idx_pgto_charge` (`provider_charge_id`),
  KEY `idx_pgto_txid` (`provider_txid`),
  KEY `idx_pgto_created` (`created_at`),
  KEY `fk_pgto_user` (`gerado_por`),
  CONSTRAINT `fk_pgto_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pgto_user` FOREIGN KEY (`gerado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=1059 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `pastas_documentos` */

DROP TABLE IF EXISTS `pastas_documentos`;

CREATE TABLE `pastas_documentos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cor` varchar(50) DEFAULT 'text-blue-500',
  `icone` varchar(50) DEFAULT NULL,
  `ordem` int(11) NOT NULL DEFAULT 0,
  `quantidade` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pasta_nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `perfis_acesso` */

DROP TABLE IF EXISTS `perfis_acesso`;

CREATE TABLE `perfis_acesso` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `tipo` enum('admin','gestor','analista','visualizador','cliente','colaborador') NOT NULL DEFAULT 'visualizador',
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_perfis_nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `permissoes_pagina` */

DROP TABLE IF EXISTS `permissoes_pagina`;

CREATE TABLE `permissoes_pagina` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `perfil_id` bigint(20) unsigned NOT NULL,
  `pagina_id` varchar(50) NOT NULL,
  `pagina_nome` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `permitido` tinyint(1) NOT NULL DEFAULT 0,
  `escopo` enum('read','write','delete','admin') NOT NULL DEFAULT 'read',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_perfil_pagina` (`perfil_id`,`pagina_id`),
  CONSTRAINT `fk_perm_perfil` FOREIGN KEY (`perfil_id`) REFERENCES `perfis_acesso` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `planos` */

DROP TABLE IF EXISTS `planos`;

CREATE TABLE `planos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL,
  `nome` varchar(120) NOT NULL,
  `descricao` varchar(500) DEFAULT NULL,
  `tipo` enum('mensal','anual','vitalicio','sob_demanda') NOT NULL DEFAULT 'mensal',
  `preco` decimal(15,2) NOT NULL DEFAULT 0.00,
  `recursos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'lista de features incluídas' CHECK (json_valid(`recursos`)),
  `limite_clientes` int(11) DEFAULT NULL COMMENT 'NULL = ilimitado',
  `limite_sicaf` int(11) DEFAULT NULL,
  `limite_ia_creditos` int(11) DEFAULT NULL,
  `destaque` tinyint(1) NOT NULL DEFAULT 0,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `ordem` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_planos_codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `processos_execucoes` */

DROP TABLE IF EXISTS `processos_execucoes`;

CREATE TABLE `processos_execucoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `processo_id` varchar(64) NOT NULL,
  `trigger_type` enum('cron','manual','webhook') NOT NULL DEFAULT 'cron',
  `schedule_slot` varchar(32) DEFAULT NULL,
  `status` enum('running','success','error') NOT NULL,
  `started_at` datetime NOT NULL,
  `finished_at` datetime DEFAULT NULL,
  `message` text DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_pex_proc` (`processo_id`,`started_at`),
  KEY `idx_pex_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `propostas` */

DROP TABLE IF EXISTS `propostas`;

CREATE TABLE `propostas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `licitacao_id` bigint(20) unsigned NOT NULL,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `numero_proposta` varchar(50) DEFAULT NULL,
  `tipo` enum('Comercial','Técnica','Técnica e Preço') NOT NULL DEFAULT 'Comercial',
  `valor` decimal(15,2) DEFAULT NULL,
  `prazo_entrega` varchar(100) DEFAULT NULL,
  `status` enum('Em elaboração','Aguardando revisão','Enviada','Vencedora','Perdedora','Cancelada') NOT NULL DEFAULT 'Em elaboração',
  `progresso` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `observacoes` text DEFAULT NULL,
  `anexos_url` text DEFAULT NULL,
  `criado_por` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_prop_lic` (`licitacao_id`),
  KEY `idx_prop_cliente` (`cliente_id`),
  KEY `idx_prop_status` (`status`),
  KEY `idx_prop_criador` (`criado_por`),
  CONSTRAINT `fk_prop_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_prop_criador` FOREIGN KEY (`criado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_prop_lic` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `relatorios_salvos` */

DROP TABLE IF EXISTS `relatorios_salvos`;

CREATE TABLE `relatorios_salvos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `tipo` varchar(80) NOT NULL COMMENT 'clientes, financeiro, sicaf, etc',
  `nome` varchar(150) NOT NULL,
  `filtros` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`filtros`)),
  `colunas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`colunas`)),
  `agendamento` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'recorrência, destinatários' CHECK (json_valid(`agendamento`)),
  `compartilhado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_rs_user` (`usuario_id`),
  KEY `idx_rs_tipo` (`tipo`),
  CONSTRAINT `fk_rs_user` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `resultados_licitacao` */

DROP TABLE IF EXISTS `resultados_licitacao`;

CREATE TABLE `resultados_licitacao` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `licitacao_id` bigint(20) unsigned NOT NULL,
  `resultado` enum('Vencedor','2º Lugar','3º Lugar','Desclassificado','Não participou') NOT NULL,
  `posicao` int(11) DEFAULT NULL,
  `total_concorrentes` int(11) DEFAULT NULL,
  `valor_proposto` decimal(15,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_res_lic` (`licitacao_id`),
  CONSTRAINT `fk_res_lic` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `revisoes_agendadas` */

DROP TABLE IF EXISTS `revisoes_agendadas`;

CREATE TABLE `revisoes_agendadas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `data_alvo` date NOT NULL,
  `meses_lembrete` tinyint(3) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_revisoes_usuario_data` (`usuario_id`,`data_alvo`),
  KEY `idx_revisoes_cliente` (`cliente_id`),
  CONSTRAINT `fk_revisoes_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_revisoes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `sicaf_analises` */

DROP TABLE IF EXISTS `sicaf_analises`;

CREATE TABLE `sicaf_analises` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `usuario_id` bigint(20) unsigned DEFAULT NULL,
  `arquivo_nome` varchar(255) DEFAULT NULL,
  `status_geral` varchar(40) DEFAULT NULL,
  `resumo` text DEFAULT NULL,
  `total_pendencias` int(11) NOT NULL DEFAULT 0,
  `analise_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`analise_json`)),
  `niveis_resumo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`niveis_resumo`)),
  `certidoes_inseridas` int(11) NOT NULL DEFAULT 0,
  `certidoes_atualizadas` int(11) NOT NULL DEFAULT 0,
  `cadastro_atualizado` tinyint(1) NOT NULL DEFAULT 0,
  `aviso` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sa_cliente` (`cliente_id`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `sicaf_cadastros` */

DROP TABLE IF EXISTS `sicaf_cadastros`;

CREATE TABLE `sicaf_cadastros` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `status` enum('Ativo','Pendente','Suspenso','Cancelado') NOT NULL DEFAULT 'Ativo',
  `data_ultima_atualizacao` date DEFAULT NULL,
  `data_validade` date DEFAULT NULL,
  `completude` decimal(5,2) NOT NULL DEFAULT 0.00,
  `credenciamento_anual` tinyint(1) NOT NULL DEFAULT 0,
  `manutencao_ativa` tinyint(1) NOT NULL DEFAULT 0,
  `dias_validade` int(11) NOT NULL DEFAULT 0,
  `observacoes` text DEFAULT NULL,
  `atualizacoes_usadas` int(11) NOT NULL DEFAULT 0,
  `atualizacoes_reset_em` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sicaf_cliente` (`cliente_id`),
  KEY `idx_sicaf_status` (`status`),
  KEY `idx_sicaf_validade` (`data_validade`),
  CONSTRAINT `fk_sicaf_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=191743 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `sicaf_niveis` */

DROP TABLE IF EXISTS `sicaf_niveis`;

CREATE TABLE `sicaf_niveis` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sicaf_id` bigint(20) unsigned NOT NULL,
  `nivel` enum('I','II','III','IV','V','VI') NOT NULL,
  `habilitado` tinyint(1) NOT NULL DEFAULT 1,
  `status` varchar(30) DEFAULT NULL,
  `observacao` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sicaf_nivel` (`sicaf_id`,`nivel`),
  CONSTRAINT `fk_sn_sicaf` FOREIGN KEY (`sicaf_id`) REFERENCES `sicaf_cadastros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2556 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `sicaf_renovacoes` */

DROP TABLE IF EXISTS `sicaf_renovacoes`;

CREATE TABLE `sicaf_renovacoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sicaf_id` bigint(20) unsigned NOT NULL,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `ano_referencia` int(11) NOT NULL,
  `data_renovacao` datetime NOT NULL,
  `taxa_id` bigint(20) unsigned DEFAULT NULL,
  `status` enum('Concluída','Pendente','Cancelada') NOT NULL DEFAULT 'Concluída',
  `renovado_por` bigint(20) unsigned DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sr_sicaf` (`sicaf_id`),
  KEY `idx_sr_cliente` (`cliente_id`),
  KEY `idx_sr_ano` (`ano_referencia`),
  KEY `fk_sr_user` (`renovado_por`),
  CONSTRAINT `fk_sr_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sr_sicaf` FOREIGN KEY (`sicaf_id`) REFERENCES `sicaf_cadastros` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sr_user` FOREIGN KEY (`renovado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6069 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `taxas_sicaf` */

DROP TABLE IF EXISTS `taxas_sicaf`;

CREATE TABLE `taxas_sicaf` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sicaf_id` bigint(20) unsigned NOT NULL,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `descricao` varchar(255) DEFAULT 'Taxa de Renovação SICAF Anual',
  `valor` decimal(15,2) NOT NULL DEFAULT 35.16,
  `ano_referencia` int(11) NOT NULL,
  `forma_pagamento` enum('Boleto','PIX') DEFAULT NULL,
  `status` enum('Pendente','Pago','Aprovado','Cancelado') NOT NULL DEFAULT 'Pendente',
  `codigo_barras` varchar(100) DEFAULT NULL,
  `chave_pix` varchar(255) DEFAULT NULL,
  `data_pagamento` datetime DEFAULT NULL,
  `aprovado_por` bigint(20) unsigned DEFAULT NULL,
  `data_aprovacao` datetime DEFAULT NULL,
  `observacao_aprovacao` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_ts_sicaf` (`sicaf_id`),
  KEY `idx_ts_cliente` (`cliente_id`),
  KEY `idx_ts_ano` (`ano_referencia`),
  KEY `idx_ts_status` (`status`),
  KEY `fk_ts_aprovador` (`aprovado_por`),
  CONSTRAINT `fk_ts_aprovador` FOREIGN KEY (`aprovado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ts_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ts_sicaf` FOREIGN KEY (`sicaf_id`) REFERENCES `sicaf_cadastros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=455 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `templates_email` */

DROP TABLE IF EXISTS `templates_email`;

CREATE TABLE `templates_email` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(80) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `assunto` varchar(255) DEFAULT NULL,
  `corpo_html` mediumtext DEFAULT NULL,
  `corpo_texto` mediumtext DEFAULT NULL,
  `variaveis_disponiveis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variaveis_disponiveis`)),
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tpl_codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `ticket_anexos` */

DROP TABLE IF EXISTS `ticket_anexos`;

CREATE TABLE `ticket_anexos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint(20) unsigned NOT NULL,
  `mensagem_id` bigint(20) unsigned DEFAULT NULL,
  `nome_original` varchar(500) NOT NULL,
  `url` varchar(1000) NOT NULL,
  `tamanho` int(11) NOT NULL DEFAULT 0,
  `mimetype` varchar(100) DEFAULT NULL,
  `enviado_por` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_ta_ticket` (`ticket_id`),
  KEY `idx_ta_msg` (`mensagem_id`),
  KEY `idx_ta_user` (`enviado_por`),
  CONSTRAINT `fk_ta_msg` FOREIGN KEY (`mensagem_id`) REFERENCES `ticket_mensagens` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ta_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ta_user` FOREIGN KEY (`enviado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=267 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `ticket_mensagens` */

DROP TABLE IF EXISTS `ticket_mensagens`;

CREATE TABLE `ticket_mensagens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint(20) unsigned NOT NULL,
  `remetente_tipo` enum('client','support','system','ia') NOT NULL,
  `remetente_nome` varchar(150) NOT NULL,
  `remetente_id` bigint(20) unsigned DEFAULT NULL,
  `mensagem` text NOT NULL,
  `interna` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 = nota interna, não visível ao cliente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_tm_ticket` (`ticket_id`,`created_at`),
  KEY `idx_tm_rem` (`remetente_id`),
  CONSTRAINT `fk_tm_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tm_user` FOREIGN KEY (`remetente_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=372 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tickets` */

DROP TABLE IF EXISTS `tickets`;

CREATE TABLE `tickets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `status` enum('aberto','em_andamento','aguardando_cliente','resolvido','fechado') NOT NULL DEFAULT 'aberto',
  `prioridade` enum('alta','media','baixa','urgente') NOT NULL DEFAULT 'media',
  `categoria` enum('suporte','bug','melhoria','financeiro','sicaf','outro') NOT NULL DEFAULT 'suporte',
  `cliente_id` bigint(20) unsigned DEFAULT NULL,
  `criado_por` bigint(20) unsigned NOT NULL,
  `atribuido_a` bigint(20) unsigned DEFAULT NULL,
  `sla_prazo` datetime DEFAULT NULL,
  `sla_minutos_restantes` int(11) NOT NULL DEFAULT 0,
  `fechado_em` datetime DEFAULT NULL,
  `satisfacao_nota` tinyint(3) unsigned DEFAULT NULL COMMENT '1-5',
  `satisfacao_comentario` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tickets_codigo` (`codigo`),
  KEY `idx_tk_cliente` (`cliente_id`),
  KEY `idx_tk_criador` (`criado_por`),
  KEY `idx_tk_atrib` (`atribuido_a`),
  KEY `idx_tk_status` (`status`),
  KEY `idx_tk_prio` (`prioridade`),
  CONSTRAINT `fk_tk_atrib` FOREIGN KEY (`atribuido_a`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tk_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tk_criador` FOREIGN KEY (`criado_por`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=183 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tipo_certidoes` */

DROP TABLE IF EXISTS `tipo_certidoes`;

CREATE TABLE `tipo_certidoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `descricao` text DEFAULT NULL,
  `nivel_sicaf` enum('I','II','III','IV','V','VI') DEFAULT NULL,
  `orgao_emissor` varchar(150) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `requer_codigo` tinyint(1) NOT NULL DEFAULT 0,
  `requer_validade` tinyint(1) NOT NULL DEFAULT 1,
  `upload_manual` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tc_codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tracking_eventos` */

DROP TABLE IF EXISTS `tracking_eventos`;

CREATE TABLE `tracking_eventos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sessao_id` bigint(20) unsigned NOT NULL,
  `cliente_id` bigint(20) unsigned DEFAULT NULL,
  `evento` varchar(100) NOT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `acao` varchar(255) DEFAULT NULL,
  `rotulo` varchar(255) DEFAULT NULL,
  `valor` decimal(12,2) DEFAULT NULL,
  `pagina_url` varchar(1000) DEFAULT NULL,
  `pagina_titulo` varchar(255) DEFAULT NULL,
  `componente` varchar(255) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_te_sessao` (`sessao_id`),
  KEY `idx_te_cliente` (`cliente_id`),
  KEY `idx_te_evento` (`evento`),
  KEY `idx_te_created` (`created_at`),
  CONSTRAINT `fk_te_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_te_sessao` FOREIGN KEY (`sessao_id`) REFERENCES `tracking_sessoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tracking_sessoes` */

DROP TABLE IF EXISTS `tracking_sessoes`;

CREATE TABLE `tracking_sessoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` varchar(100) NOT NULL,
  `cliente_id` bigint(20) unsigned DEFAULT NULL,
  `usuario_id` bigint(20) unsigned DEFAULT NULL,
  `utm_source` varchar(255) DEFAULT NULL,
  `utm_medium` varchar(255) DEFAULT NULL,
  `utm_campaign` varchar(255) DEFAULT NULL,
  `utm_term` varchar(255) DEFAULT NULL,
  `utm_content` varchar(255) DEFAULT NULL,
  `gclid` varchar(255) DEFAULT NULL,
  `gbraid` varchar(255) DEFAULT NULL,
  `wbraid` varchar(255) DEFAULT NULL,
  `gad_source` varchar(50) DEFAULT NULL,
  `gad_campaignid` varchar(100) DEFAULT NULL,
  `fbclid` varchar(255) DEFAULT NULL,
  `msclkid` varchar(255) DEFAULT NULL,
  `landing_page` varchar(1000) DEFAULT NULL,
  `referrer` varchar(1000) DEFAULT NULL,
  `exit_page` varchar(1000) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `device_type` enum('desktop','mobile','tablet','unknown') NOT NULL DEFAULT 'unknown',
  `browser` varchar(100) DEFAULT NULL,
  `browser_version` varchar(50) DEFAULT NULL,
  `os` varchar(100) DEFAULT NULL,
  `os_version` varchar(50) DEFAULT NULL,
  `screen_resolution` varchar(20) DEFAULT NULL,
  `viewport_size` varchar(20) DEFAULT NULL,
  `language` varchar(10) DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `geo_country` varchar(100) DEFAULT NULL,
  `geo_state` varchar(100) DEFAULT NULL,
  `geo_city` varchar(100) DEFAULT NULL,
  `pages_viewed` int(11) NOT NULL DEFAULT 0,
  `session_duration` int(11) NOT NULL DEFAULT 0,
  `bounce` tinyint(1) NOT NULL DEFAULT 0,
  `scroll_depth_max` int(11) NOT NULL DEFAULT 0,
  `converted` tinyint(1) NOT NULL DEFAULT 0,
  `conversion_type` varchar(100) DEFAULT NULL,
  `conversion_value` decimal(12,2) DEFAULT NULL,
  `conversion_at` datetime DEFAULT NULL,
  `funnel_step` varchar(100) DEFAULT NULL,
  `first_visit_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_activity_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ts_session` (`session_id`),
  KEY `idx_ts_cliente` (`cliente_id`),
  KEY `idx_ts_user` (`usuario_id`),
  KEY `idx_ts_gclid` (`gclid`),
  KEY `idx_ts_utm_source` (`utm_source`),
  KEY `idx_ts_utm_camp` (`utm_campaign`),
  KEY `idx_ts_converted` (`converted`),
  KEY `idx_ts_created` (`created_at`),
  CONSTRAINT `fk_trk_sess_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_trk_sess_user` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=1790 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `uasgs` */

DROP TABLE IF EXISTS `uasgs`;

CREATE TABLE `uasgs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `codigo_uasg` varchar(20) NOT NULL,
  `nome` varchar(500) NOT NULL,
  `nome_resumido` varchar(200) DEFAULT NULL,
  `orgao_id` bigint(20) unsigned DEFAULT NULL,
  `cnpj` varchar(20) DEFAULT NULL,
  `uf` varchar(2) DEFAULT NULL,
  `municipio` varchar(200) DEFAULT NULL,
  `cep` varchar(10) DEFAULT NULL,
  `endereco` text DEFAULT NULL,
  `telefone` varchar(50) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `origem` varchar(50) NOT NULL DEFAULT 'compras_gov',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_uasgs_codigo` (`codigo_uasg`),
  KEY `idx_uasgs_nome` (`nome`(100)),
  KEY `idx_uasgs_uf` (`uf`),
  KEY `idx_uasgs_orgao` (`orgao_id`),
  CONSTRAINT `fk_uasgs_orgao` FOREIGN KEY (`orgao_id`) REFERENCES `orgaos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21855 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `usuario_clientes` */

DROP TABLE IF EXISTS `usuario_clientes`;

CREATE TABLE `usuario_clientes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `cliente_id` bigint(20) unsigned NOT NULL,
  `papel` enum('proprietario','colaborador','leitura') NOT NULL DEFAULT 'colaborador',
  `criado_por` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuario_cliente` (`usuario_id`,`cliente_id`),
  KEY `idx_uc_cliente` (`cliente_id`),
  KEY `idx_uc_criador` (`criado_por`),
  CONSTRAINT `fk_uc_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_uc_criador` FOREIGN KEY (`criado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_uc_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `usuario_creditos_ia` */

DROP TABLE IF EXISTS `usuario_creditos_ia`;

CREATE TABLE `usuario_creditos_ia` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `creditos_totais` int(11) NOT NULL DEFAULT 3,
  `creditos_utilizados` int(11) NOT NULL DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_uci_user` (`usuario_id`),
  CONSTRAINT `fk_uci_user` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=299 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `usuarios` */

DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verificado_em` datetime DEFAULT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `avatar_iniciais` varchar(5) DEFAULT NULL,
  `avatar_url` varchar(1024) DEFAULT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `perfil_id` bigint(20) unsigned NOT NULL,
  `tipo_usuario` enum('admin','colaborador','cliente') NOT NULL DEFAULT 'cliente',
  `status` enum('Ativo','Inativo','Bloqueado') NOT NULL DEFAULT 'Ativo',
  `mfa_ativo` tinyint(1) NOT NULL DEFAULT 0,
  `mfa_secret` varchar(255) DEFAULT NULL,
  `ultimo_login` datetime DEFAULT NULL,
  `ultimo_login_ip` varchar(45) DEFAULT NULL,
  `boas_vindas_visto_em` datetime DEFAULT NULL,
  `token_recuperacao` varchar(255) DEFAULT NULL,
  `token_recuperacao_expira` datetime DEFAULT NULL,
  `preferencias` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Tema, locale, etc' CHECK (json_valid(`preferencias`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_email` (`email`),
  KEY `idx_usuarios_perfil` (`perfil_id`),
  KEY `idx_usuarios_tipo` (`tipo_usuario`),
  KEY `idx_usuarios_status` (`status`),
  KEY `idx_usuarios_deleted` (`deleted_at`),
  CONSTRAINT `fk_usuarios_perfil` FOREIGN KEY (`perfil_id`) REFERENCES `perfis_acesso` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=279237 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `workflow_aprovacao` */

DROP TABLE IF EXISTS `workflow_aprovacao`;

CREATE TABLE `workflow_aprovacao` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `proposta_id` bigint(20) unsigned NOT NULL,
  `etapa` enum('analise','gestor','diretor','aprovada','rejeitada') NOT NULL DEFAULT 'analise',
  `prazo` date DEFAULT NULL,
  `observacao` text DEFAULT NULL,
  `aprovado_por` bigint(20) unsigned DEFAULT NULL,
  `data_aprovacao` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_wf_prop` (`proposta_id`),
  KEY `idx_wf_aprov` (`aprovado_por`),
  CONSTRAINT `fk_wf_aprov` FOREIGN KEY (`aprovado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_wf_prop` FOREIGN KEY (`proposta_id`) REFERENCES `propostas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `vw_google_ads_conversoes` */

DROP TABLE IF EXISTS `vw_google_ads_conversoes`;

/*!50001 DROP VIEW IF EXISTS `vw_google_ads_conversoes` */;
/*!50001 DROP TABLE IF EXISTS `vw_google_ads_conversoes` */;

/*!50001 CREATE TABLE  `vw_google_ads_conversoes`(
 `gclid` varchar(255) ,
 `email_address` varchar(255) ,
 `phone_number` longtext ,
 `conversion_date_time` varchar(24) 
)*/;

/*View structure for view vw_google_ads_conversoes */

/*!50001 DROP TABLE IF EXISTS `vw_google_ads_conversoes` */;
/*!50001 DROP VIEW IF EXISTS `vw_google_ads_conversoes` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`cadbrasilv2`@`%` SQL SECURITY DEFINER VIEW `vw_google_ads_conversoes` AS select cast(`google_ads_conversoes`.`gclid` as char(255) charset utf8mb4) AS `gclid`,lcase(trim(`google_ads_conversoes`.`email_address`)) AS `email_address`,concat('+',regexp_replace(`google_ads_conversoes`.`phone_number`,'[^0-9]','')) AS `phone_number`,date_format(`google_ads_conversoes`.`conversion_date_time`,'%Y-%m-%d %H:%i:%s') AS `conversion_date_time` from `google_ads_conversoes` */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
