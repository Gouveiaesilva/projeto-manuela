// ============================================
// Types para parsing e análise de NF-e XML
// ============================================

// --- Dados extraídos do XML ---

export interface NFeEmitente {
  cnpj: string
  razaoSocial: string
  nomeFantasia: string | null
  inscricaoEstadual: string | null
  uf: string
  municipio: string
  crt: number // 1=SN, 2=SN sublimite, 3=Lucro Real/Presumido
}

export interface NFeDestinatario {
  cnpj: string | null
  cpf: string | null
  razaoSocial: string
  uf: string
  municipio: string
}

export interface NFeImpostos {
  // ICMS
  icmsCST: string | null      // CST: 00, 10, 20, 30, 60, 70
  icmsOrigem: string | null    // 0=Nacional, 1=Estrangeira importação, 2=Estrangeira mercado interno
  icmsBase: number
  icmsAliquota: number
  icmsValor: number
  // ICMS-ST
  icmsStBase: number
  icmsStMva: number
  icmsStAliquota: number
  icmsStValor: number
  // Simples Nacional
  csosn: string | null         // CSOSN: 101, 102, 201, 202, 500, 900
  icmsSnCredito: number        // percentual crédito SN
  icmsSnCreditoValor: number
  // IPI
  ipiCST: string | null
  ipiBase: number
  ipiAliquota: number
  ipiValor: number
  // PIS
  pisCST: string | null
  pisBase: number
  pisAliquota: number
  pisValor: number
  // COFINS
  cofinsCST: string | null
  cofinsBase: number
  cofinsAliquota: number
  cofinsValor: number
}

export interface NFeProduto {
  numero: number              // nItem
  codigo: string              // cProd
  ean: string | null          // cEAN
  descricao: string           // xProd
  ncm: string                 // NCM
  cfop: string
  unidade: string             // uCom
  quantidade: number          // qCom
  valorUnitario: number       // vUnCom
  valorTotal: number          // vProd
  valorDesconto: number       // vDesc
  valorFrete: number          // vFrete
  valorSeguro: number         // vSeg
  valorOutros: number         // vOutro
}

export interface NFeItem {
  produto: NFeProduto
  impostos: NFeImpostos
}

export interface NFeTotais {
  valorProdutos: number       // vProd
  valorNF: number             // vNF
  valorDesconto: number       // vDesc
  valorFrete: number          // vFrete
  valorSeguro: number         // vSeg
  valorOutros: number         // vOutro
  icmsBase: number            // vBC
  icmsValor: number           // vICMS
  icmsStBase: number          // vBCST
  icmsStValor: number         // vST
  ipiValor: number            // vIPI
  pisValor: number            // vPIS
  cofinsValor: number         // vCOFINS
}

export interface NFeParseada {
  chaveAcesso: string
  numero: number
  serie: number
  dataEmissao: string
  emitente: NFeEmitente
  destinatario: NFeDestinatario
  itens: NFeItem[]
  totais: NFeTotais
}

// --- Config para análise ---

export interface AnaliseConfig {
  rbt12: number               // receita bruta últimos 12 meses
  anexo: string               // 'anexo_i' | 'anexo_ii' | etc.
  margemDesejada: number      // percentual desejado de margem
}

// --- Resultado da análise ---

export type ClassificacaoLucratividade = 'alta' | 'media' | 'baixa' | 'negativa'

export interface ProdutoAnalisado {
  item: NFeItem
  // Carga tributária calculada
  cargaTributariaPercentual: number
  aliquotaEfetiva: number
  icmsStForaDAS: boolean
  icmsStValor: number
  // Precificação
  precoSugerido: number
  margemPercentual: number
  margemLiquida: number
  markup: number
  // Classificação
  classificacao: ClassificacaoLucratividade
  insight: string
}

export interface AnaliseResumo {
  totalProdutos: number
  valorTotalNF: number
  cargaMediaPercentual: number
  margemMedia: number
  produtosLucrativos: number
  produtosDeficitarios: number
  maiorMargem: { descricao: string; margem: number } | null
  menorMargem: { descricao: string; margem: number } | null
  recomendacoes: string[]
}

export interface AnaliseXML {
  nfe: NFeParseada
  config: AnaliseConfig
  produtos: ProdutoAnalisado[]
  resumo: AnaliseResumo
  dataAnalise: string
}
