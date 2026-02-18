export interface DistribuicaoTributos {
  irpj: number   // %
  csll: number   // %
  cofins: number // %
  pis: number    // %
  cpp: number    // %
  icms: number   // %
}

export interface FaixaSimplesNacional {
  faixa: number           // 1-6
  rbt12Min: number        // R$ mínimo da faixa
  rbt12Max: number        // R$ máximo da faixa
  aliquotaNominal: number // % alíquota nominal
  parcelaDeduzir: number  // R$ parcela a deduzir
  distribuicao: DistribuicaoTributos
}

export interface TabelaAnexo {
  nome: string
  descricao: string
  faixas: FaixaSimplesNacional[]
}
