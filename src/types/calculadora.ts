// ============================================
// Types para o engine de cálculo
// ============================================

export interface CustoComposicao {
  custoCompra: number
  custoEmbalagem: number
  custoMaoObra: number
  custoOperacional: number
  custoFrete: number
  custoOutros: number
}

export interface KPIInput {
  precoVenda: number
  custoTotal: number
  impostoTotal: number
  custosFixosMensais?: number
}

export interface KPIOutput {
  precoVenda: number
  impostoValor: number
  margemLiquida: number
  margemPercentual: number
  markup: number
  margemContribuicao: number
  pontoEquilibrio: number | null
  lucroDesejado: number
}

export interface SimulacaoConfig {
  precoMinimo: number
  precoMaximo: number
  incremento: number
  custoTotal: number
  cargaTributaria: number // percentual (ex: 12.5 para 12.5%)
}

export interface CenarioSimulacao {
  precoVenda: number
  imposto: number
  receitaLiquida: number
  custo: number
  margemLiquida: number
  margemPercentual: number
}

export interface CalculoSimplesInput {
  rbt12: number
  anexo: string // 'anexo_i' | 'anexo_ii' | etc.
  tipoIcms: string // 'normal' | 'substituicao_tributaria' | etc.
  aliquotaIcms: number
  mva: number
  custoCompra: number
}

export interface CalculoSimplesOutput {
  cargaTotalPercentual: number
  icmsStForaDAS: boolean
  icmsStValor: number
  aliquotaEfetiva: number
  icmsDentroSimples: number
  aliquotaSemIcms: number
  detalhamento: {
    irpj: number
    csll: number
    cofins: number
    pis: number
    cpp: number
    icms: number
  }
}

export interface CalculoICMSSTInput {
  baseCalculo: number
  mva: number
  aliquotaICMS: number
  icmsProprio: number
}
