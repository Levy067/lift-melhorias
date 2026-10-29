const LIFT_LOGO_BASE64 = "data:image/png;base64,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";

// Data extracted from Lift Melhorias Trello board export
const TRELLO_LISTS = [
  { id: "6a76057cb591fb5b56a06e6b", name: "Brainstorm", color: "#F59E0B", isDone: false },
  { id: "6a76057cb591fb5b56a06e6c", name: "Aprovados", color: "#3B82F6", isDone: false },
  { id: "6a76057cb591fb5b56a06e68", name: "Em confecção", color: "#8B5CF6", isDone: false },
  { id: "6a76057cb591fb5b56a06e69", name: "Em implementação", color: "#0EA5E9", isDone: false },
  { id: "6a76057cb591fb5b56a06e6a", name: "Implementados", color: "#10B981", isDone: true },
  { id: "6a76057cb591fb5b56a06e67", name: "Descartados", color: "#EF4444", isDone: false }
];

const TRELLO_CARDS_2026 = [
  // --- IMPLEMENTADOS (45 melhorias concluídas em 2026) ---
  {
    id: "card_13",
    idShort: 13,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Estudio Reels Lift",
    desc: "Estruturação de espaço e equipamentos para gravação de Reels e conteúdo institucional da Lift.",
    tag: "Marketing",
    author: "Pedro Levi",
    date: "2026-10-27T13:48:08.706Z",
    week: 44
  },
  {
    id: "card_12",
    idShort: 12,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Quadro de metas: Atualização no filtro do quadro de metas",
    desc: "Melhoria e refinamento do filtro do quadro de metas para acompanhamento semanal da equipe.",
    tag: "Gestão",
    author: "Pedro Levi",
    date: "2026-10-13T14:39:30.153Z",
    week: 42
  },
  {
    id: "card_11",
    idShort: 11,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Analytics Radar",
    desc: "Painel de análise de dados e métricas do Radar.",
    tag: "TI / Automação",
    author: "Pedro Levi",
    date: "2026-10-02T17:05:58.410Z",
    week: 40
  },
  {
    id: "card_10",
    idShort: 10,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "CNPJ no atendimento",
    desc: "Identificação automática de CNPJ no fluxo de atendimento Digisac.",
    tag: "Atendimento",
    author: "Pedro Levi",
    date: "2026-09-25T14:29:19.010Z",
    week: 39
  },
  {
    id: "card_8",
    idShort: 8,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Repaginação do site da Lift",
    desc: "Novo layout, proposta visual moderna e navegação mais fluida para os clientes no site da Lift.",
    tag: "Marketing",
    author: "Pedro Levi",
    date: "2026-09-23T18:17:14.912Z",
    week: 39
  },
  {
    id: "card_7",
    idShort: 7,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Atividade de ITCD - SEFAZ-CE no G-Click",
    desc: "Padronização e cadastro da atividade de ITCD no G-Click para acompanhamento dos prazos estaduais.",
    tag: "Fiscal",
    author: "Pedro Levi",
    date: "2026-09-23T18:15:58.141Z",
    week: 39
  },
  {
    id: "card_6_news",
    idShort: 6,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Radar News",
    desc: "Canal de comunicação periódica com atualizações contábeis, fiscais e novidades internas.",
    tag: "Comunicação",
    author: "Pedro Levi",
    date: "2026-09-21T11:39:01.140Z",
    week: 38
  },
  {
    id: "card_5_ext",
    idShort: 5,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Meta Extractor",
    desc: "Extrator de dados e metas para automação de relatórios.",
    tag: "TI / Automação",
    author: "Pedro Levi",
    date: "2026-09-21T11:38:21.367Z",
    week: 38
  },
  {
    id: "card_4_tags",
    idShort: 4,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Tags Digisac",
    desc: "Organização e padronização de tags de atendimento no Digisac.",
    tag: "Atendimento",
    author: "Pedro Levi",
    date: "2026-09-18T16:46:09.307Z",
    week: 38
  },
  {
    id: "card_3_inv",
    idShort: 3,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Inventário Lift",
    desc: "Controle e catalogação de equipamentos, patrimônio e acessos da Lift.",
    tag: "Operação",
    author: "Pedro Levi",
    date: "2026-08-31T12:51:32.908Z",
    week: 35
  },
  {
    id: "card_2_conc",
    idShort: 2,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Automação da Conciliação de Crédito",
    desc: "A conciliação do cartão de crédito, realizada mensalmente, passou de um processo manual para um processo automatizado através do upload do PDF no Conta Azul com pré-lançamento automático.",
    tag: "Contábil",
    author: "Leandro Rodrigues",
    date: "2026-08-18T20:33:55.292Z",
    week: 34
  },
  {
    id: "card_1_pgdas",
    idShort: 1,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Robo Declara PGDAS",
    desc: "Robô automatizado para emissão e declaração do PGDAS das empresas do Simples Nacional.",
    tag: "Fiscal",
    author: "Leandro Rodrigues",
    date: "2026-08-07T16:50:55.664Z",
    week: 32
  },
  {
    id: "card_81",
    idShort: 81,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Robô - Fechamento automático de chamados inativos",
    desc: "Fechamento automático de chamados após período sem interação do cliente.",
    tag: "Atendimento",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_80",
    idShort: 80,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Extensão - Automação - RD",
    desc: "Extensão para integrar e automatizar ações no RD Station.",
    tag: "TI / Automação",
    author: "Lucas Balbino",
    date: "2026-08-07T16:19:08.000Z",
    week: 31
  },
  {
    id: "card_79",
    idShort: 79,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Automação - AVD avaliação",
    desc: "Fluxo automatizado do processo de avaliação de desempenho AVD 360 e PDI.",
    tag: "DP / RH",
    author: "Pedro Levi",
    date: "2026-07-13T11:30:37.329Z",
    week: 28
  },
  {
    id: "card_78",
    idShort: 78,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Atualização da obrigação de fechamento contábil",
    desc: "Checklist renovado e otimização da rotina de encerramento contábil.",
    tag: "Contábil",
    author: "Pedro Levi",
    date: "2026-07-10T14:20:00.000Z",
    week: 28
  },
  {
    id: "card_77",
    idShort: 77,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Sistema de gestão - Leandro",
    desc: "Painel de controle interno de produtividade e gestão da equipe.",
    tag: "Gestão",
    author: "Leandro Rodrigues",
    date: "2026-07-03T16:00:00.000Z",
    week: 27
  },
  {
    id: "card_76",
    idShort: 76,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Automação - DCTF Web Sem movimentação",
    desc: "Geração e transmissão automática de DCTFWeb sem movimento.",
    tag: "Fiscal",
    author: "Pedro Levi",
    date: "2026-06-25T11:15:00.000Z",
    week: 26
  },
  {
    id: "card_75",
    idShort: 75,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Automação - DET",
    desc: "Monitoramento e captura automática de notificações do Domicílio Eletrônico Trabalhista.",
    tag: "DP / RH",
    author: "Pedro Levi",
    date: "2026-06-18T10:30:00.000Z",
    week: 25
  },
  {
    id: "card_74",
    idShort: 74,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Passo a passo para realizar procuração no e-CAC",
    desc: "Manual prático com capturas de tela para orientar clientes na emissão de procuração eletrônica.",
    tag: "Operação",
    author: "Pedro Levi",
    date: "2026-06-12T15:40:00.000Z",
    week: 24
  },
  {
    id: "card_73",
    idShort: 73,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Agenda Lift",
    desc: "Calendário compartilhado de eventos, entregas tributárias e reuniões de equipe.",
    tag: "Operação",
    author: "Pedro Levi",
    date: "2026-06-05T09:00:00.000Z",
    week: 23
  },
  {
    id: "card_72",
    idShort: 72,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Alteração de síndico - processo atualizado;",
    desc: "Novo procedimento com documentação exigida e fluxo para alteração cadastral de condomínios.",
    tag: "Legalização",
    author: "Pedro Levi",
    date: "2026-05-28T14:00:00.000Z",
    week: 22
  },
  {
    id: "card_71",
    idShort: 71,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Benefícios - Potencial, automação de recibos da folha",
    desc: "Geração e envio automatizado de recibos de pagamento de benefícios para colaboradores.",
    tag: "DP / RH",
    author: "Pedro Levi",
    date: "2026-05-20T17:20:00.000Z",
    week: 21
  },
  {
    id: "card_70",
    idShort: 70,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Atualização de rotinas - DP",
    desc: "Rotinas de folhas sem informações e pró-labores fixos foram atualizadas e padronizadas.",
    tag: "DP / RH",
    author: "Pedro Levi",
    date: "2026-05-14T11:00:00.000Z",
    week: 20
  },
  {
    id: "card_69",
    idShort: 69,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Processo de Certidão de Sucateiro Detran",
    desc: "Procedimento estruturado para obtenção de certidão específica do Detran.",
    tag: "Legalização",
    author: "Pedro Levi",
    date: "2026-05-07T16:45:00.000Z",
    week: 19
  },
  {
    id: "card_67",
    idShort: 67,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Lift Talks",
    desc: "Encontros semanais/quinzenais para compartilhamento de conhecimento e boas práticas internas.",
    tag: "Gestão",
    author: "Pedro Levi",
    date: "2026-04-30T10:30:00.000Z",
    week: 18
  },
  {
    id: "card_66",
    idShort: 66,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Atualização de atividades da legalização - Abertura e Alteração",
    desc: "Revisão e detalhamento das etapas de abertura e alteração contratual na Junta Comercial.",
    tag: "Legalização",
    author: "Pedro Levi",
    date: "2026-04-22T13:10:00.000Z",
    week: 17
  },
  {
    id: "card_65",
    idShort: 65,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Processo Seletivo - Lift",
    desc: "Padronização de etapas de triagem, entrevistas e testes técnicos para novas contratações.",
    tag: "DP / RH",
    author: "Pedro Levi",
    date: "2026-04-15T15:00:00.000Z",
    week: 16
  },
  {
    id: "card_63",
    idShort: 63,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Modelos de contratos sociais Lift",
    desc: "Banco de modelos de contratos e cláusulas padrão para abertura de empresas.",
    tag: "Legalização",
    author: "Pedro Levi",
    date: "2026-04-08T11:40:00.000Z",
    week: 15
  },
  {
    id: "card_62",
    idShort: 62,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Carnê Leão - Planilha financeira",
    desc: "Planilha automatizada para cálculo e controle do carnê leão de pessoas físicas.",
    tag: "Contábil",
    author: "Pedro Levi",
    date: "2026-04-01T14:00:00.000Z",
    week: 14
  },
  {
    id: "card_59",
    idShort: 59,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "PDI's",
    desc: "Planos de Desenvolvimento Individual implementados para o time da Lift.",
    tag: "Gestão",
    author: "Lucas Balbino",
    date: "2026-03-25T16:30:00.000Z",
    week: 13
  },
  {
    id: "card_58",
    idShort: 58,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Rastreador DET",
    desc: "Fluxo no Power Automate para baixar notificações do DET em TXT e analisar com Gemini.",
    tag: "TI / Automação",
    author: "Pedro Levi",
    date: "2026-03-18T10:15:00.000Z",
    week: 12
  },
  {
    id: "card_57",
    idShort: 57,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Procedimento de criação de reuniões comerciais",
    desc: "Padrão de agendamento no Google Meet com transcrições ativadas no Gemini.",
    tag: "Comercial",
    author: "Pedro Levi",
    date: "2026-03-11T14:45:00.000Z",
    week: 11
  },
  {
    id: "card_55",
    idShort: 55,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Controle de Alvará de Funcionamento",
    desc: "Rotina no G-Click para monitoramento e renovação tempestiva de alvarás dos clientes.",
    tag: "Legalização",
    author: "Pedro Levi",
    date: "2026-03-04T11:20:00.000Z",
    week: 10
  },
  {
    id: "card_22",
    idShort: 22,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Tabela de preços",
    desc: "Atualização da tabela de honorários e precificação de serviços adicionais.",
    tag: "Comercial",
    author: "Pedro Levi",
    date: "2026-02-25T15:10:00.000Z",
    week: 9
  },
  {
    id: "card_19",
    idShort: 19,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Empresas desativadas aparecendo no gclick",
    desc: "Correção de cadastros e filtros no G-Click para ocultar empresas inativas das rotinas.",
    tag: "Operação",
    author: "Pedro Levi",
    date: "2026-02-18T10:00:00.000Z",
    week: 8
  },
  {
    id: "card_17",
    idShort: 17,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Contratação Zelador",
    desc: "Estruturação de escala e processo de conservação do ambiente físico.",
    tag: "Operação",
    author: "Pedro Levi",
    date: "2026-02-11T13:30:00.000Z",
    week: 7
  },
  {
    id: "card_16",
    idShort: 16,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Figman Plugin - Automação",
    desc: "Plugin do Figma para geração de criativos e peças de forma rápida.",
    tag: "Marketing",
    author: "Pedro Levi",
    date: "2026-02-04T16:20:00.000Z",
    week: 6
  },
  {
    id: "card_9",
    idShort: 9,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Script box - SDR",
    desc: "Projeto de scripts de mensagens padronizadas para prospecção SDR.",
    tag: "Comercial",
    author: "Lucas Balbino",
    date: "2026-01-28T14:15:00.000Z",
    week: 5
  },
  {
    id: "card_6_dirf",
    idShort: 6,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Nova DIRF",
    desc: "Adaptação dos processos fiscais à substituição da DIRF pela EFD-Reinf.",
    tag: "Fiscal",
    author: "Pedro Levi",
    date: "2026-01-21T11:00:00.000Z",
    week: 4
  },
  {
    id: "card_5_mun",
    idShort: 5,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Notificações de débitos municipais",
    desc: "Rotina periódica de verificação de CND e débitos em prefeituras.",
    tag: "Fiscal",
    author: "Pedro Levi",
    date: "2026-01-14T10:45:00.000Z",
    week: 3
  },
  {
    id: "card_4_fed",
    idShort: 4,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Notificações de débitos federais",
    desc: "Automatização de consulta de situação fiscal e CND na Receita Federal.",
    tag: "Fiscal",
    author: "Pedro Levi",
    date: "2026-01-08T09:30:00.000Z",
    week: 2
  },
  {
    id: "card_3_diag",
    idShort: 3,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Diagnóstico na transição",
    desc: "Checklist detalhado de onboarding e diagnóstico fiscal no recebimento de novos clientes.",
    tag: "Operação",
    author: "Pedro Levi",
    date: "2026-01-05T15:20:00.000Z",
    week: 1
  },
  {
    id: "card_2_intel",
    idShort: 2,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Inteligência Comercial",
    desc: "Gráfico e métricas de acompanhamento de meta e conversão do time comercial.",
    tag: "Comercial",
    author: "Pedro Levi",
    date: "2026-01-03T11:00:00.000Z",
    week: 1
  },
  {
    id: "card_1_dre",
    idShort: 1,
    idList: "6a76057cb591fb5b56a06e6a",
    name: "Processo DRE",
    desc: "Padronização e estruturação dos relatórios de DRE mensal para clientes estratégicos.",
    tag: "Contábil",
    author: "Pedro Levi",
    date: "2026-01-02T10:00:00.000Z",
    week: 1
  },

  // --- EM IMPLEMENTAÇÃO (2 cartões) ---
  {
    id: "card_61",
    idShort: 61,
    idList: "6a76057cb591fb5b56a06e69",
    name: "Feedback Contábil",
    desc: "Canal e formulário estruturado de feedback com os clientes do setor contábil.",
    tag: "Contábil",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_9_iscas",
    idShort: 9,
    idList: "6a76057cb591fb5b56a06e69",
    name: "Iscas Lift",
    desc: "Materiais ricos e planilhas gratuitas para atração de novos leads qualificados.",
    tag: "Comercial",
    author: "Pedro Levi",
    date: "2026-09-23T18:17:21.778Z",
    week: 39
  },

  // --- APROVADOS (5 cartões) ---
  {
    id: "card_60",
    idShort: 60,
    idList: "6a76057cb591fb5b56a06e6c",
    name: "Portal do cliente do Gclick",
    desc: "Implementação de área exclusiva do cliente via Gclick para solicitações e documentos.",
    tag: "Operação",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_11_contr",
    idShort: 11,
    idList: "6a76057cb591fb5b56a06e6c",
    name: "Criação De contratos",
    desc: "Automatização da minuta e assinatura digital de contratos de prestação de serviços.",
    tag: "Comercial",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_12_fin",
    idShort: 12,
    idList: "6a76057cb591fb5b56a06e6c",
    name: "Informações financeiras mais refinadas",
    desc: "Uma forma do cliente mandar informações pra contabilidade (planilha, software).",
    tag: "Contábil",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_18_perf",
    idShort: 18,
    idList: "6a76057cb591fb5b56a06e6c",
    name: "Revisão de Perfil de clientes - Cadastro de atividades parecidas",
    desc: "Agrupamento de clientes por segmento e perfil para padronizar rotinas fiscais.",
    tag: "Fiscal",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_64",
    idShort: 64,
    idList: "6a76057cb591fb5b56a06e6c",
    name: "Vídeo - Proposta",
    desc: "Vídeo institucional explicativo anexado às propostas comerciais enviadas aos clientes.",
    tag: "Comercial",
    author: "Lucas Balbino",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },

  // --- BRAINSTORM (seleção dos principais itens do quadro) ---
  {
    id: "card_15",
    idShort: 15,
    idList: "6a76057cb591fb5b56a06e6b",
    name: "Periodicidade de conclusão de algumas atividades do contábil",
    desc: "Algumas empresas tem o trabalho de fazer 1 ou 3 meses bem parecidos.",
    tag: "Contábil",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_68",
    idShort: 68,
    idList: "6a76057cb591fb5b56a06e6b",
    name: "Radar Maps PRO",
    desc: "Monitoramento geográfico de clientes e oportunidades de mercado.",
    tag: "TI / Automação",
    author: "Lucas Balbino",
    date: "2026-08-07T16:23:28.000Z",
    week: 32
  },
  {
    id: "card_20",
    idShort: 20,
    idList: "6a76057cb591fb5b56a06e6b",
    name: "Consultoria tributária",
    desc: "IA, base de dados, wiki para consulta rápida.",
    tag: "Fiscal",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_21",
    idShort: 21,
    idList: "6a76057cb591fb5b56a06e6b",
    name: "Leads recorrentes",
    desc: "Estratégia de retenção e reativação de oportunidades comerciais.",
    tag: "Comercial",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_23",
    idShort: 23,
    idList: "6a76057cb591fb5b56a06e6b",
    name: "Escrituração manual de NFs",
    desc: "Otimizar escrituração de municípios que não integram com o sistema.",
    tag: "Fiscal",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_24",
    idShort: 24,
    idList: "6a76057cb591fb5b56a06e6b",
    name: "Atendimento automatizado",
    desc: "Fluxos de resposta rápida e triagem inicial no WhatsApp.",
    tag: "Atendimento",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_25",
    idShort: 25,
    idList: "6a76057cb591fb5b56a06e6b",
    name: "Onboarding",
    desc: "Refinamento do passo a passo nos primeiros 30 dias do cliente na Lift.",
    tag: "Operação",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_26",
    idShort: 26,
    idList: "6a76057cb591fb5b56a06e6b",
    name: "Concentrar clientes que são cobrados, e automatizar a cobrança",
    desc: "Régua de cobrança automática por WhatsApp e e-mail.",
    tag: "Financeiro",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_27",
    idShort: 27,
    idList: "6a76057cb591fb5b56a06e6b",
    name: "Clareza do que está pendente do cliente conosco",
    desc: "Painel visual de pendências mútuas.",
    tag: "Operação",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_35",
    idShort: 35,
    idList: "6a76057cb591fb5b56a06e6b",
    name: "Notificar clientes do e-CNPJ e seus prazos",
    desc: "Avisos 30, 10, 5 e 1 dia antes da expiração do certificado digital.",
    tag: "Operação",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },

  // --- DESCARTADOS ---
  {
    id: "card_14_desc",
    idShort: 14,
    idList: "6a76057cb591fb5b56a06e67",
    name: "trabalho de conscientização do cliente",
    desc: "Iniciativa substituída por pílulas no Radar News.",
    tag: "Comunicação",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_8_desc",
    idShort: 8,
    idList: "6a76057cb591fb5b56a06e67",
    name: "Automação de escalas",
    desc: "Tratada via planilha integrada de serviço.",
    tag: "Operação",
    author: "Pedro Levi",
    date: "2026-08-07T16:19:08.000Z",
    week: 32
  },
  {
    id: "card_10_yt",
    idShort: 10,
    idList: "6a76057cb591fb5b56a06e67",
    name: "Youtube + Transcrição",
    desc: "Substituído por ferramentas nativas do Gemini.",
    tag: "TI / Automação",
    author: "Lucas Balbino",
    date: "2026-08-07T16:19:09.000Z",
    week: 32
  }
];
