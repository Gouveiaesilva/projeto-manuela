// ============================================
// Enums matching Supabase database
// ============================================

export type RegimeTributario = 'simples_nacional' | 'lucro_real' | 'lucro_presumido'

export type AtividadeTipo = 'industria' | 'comercio_revenda' | 'comercio_encomenda'

export type AnexoSimples = 'anexo_i' | 'anexo_ii' | 'anexo_iii' | 'anexo_iv' | 'anexo_v'

export type TipoIcms = 'normal' | 'substituicao_tributaria' | 'isento' | 'reduzido'

export type OperacaoTipo = 'revenda' | 'industrializacao' | 'encomenda'

export type DocumentoCategoria = 'nota_fiscal' | 'planilha' | 'documento_tributario' | 'comprovante' | 'outro'

// ============================================
// Database row types
// ============================================

export interface Profile {
  id: string
  email: string
  nome: string
  telefone: string | null
  created_at: string
  updated_at: string
}

export interface Grupo {
  id: string
  user_id: string
  nome: string
  descricao: string | null
  created_at: string
  updated_at: string
}

export interface Cliente {
  id: string
  user_id: string
  grupo_id: string | null
  razao_social: string
  nome_fantasia: string | null
  cnpj: string
  regime: RegimeTributario
  atividade: AtividadeTipo
  anexo_simples: AnexoSimples | null
  faixa_faturamento: number | null
  rbt12: number | null
  telefone: string | null
  email: string | null
  observacoes: string | null
  created_at: string
  updated_at: string
}

export interface Produto {
  id: string
  cliente_id: string
  nome: string
  ncm_1: string
  ncm_2: string | null
  descricao: string | null
  custo_aquisicao: number
  tipo_icms: TipoIcms
  reducao_icms: number
  aliquota_icms: number
  mva_iva: number
  descricao_tipi: string | null
  aliquota_ipi: number
  margem_desejada: number
  created_at: string
  updated_at: string
}

export interface CustoFixo {
  id: string
  cliente_id: string
  descricao: string
  valor: number
  categoria: string
  created_at: string
  updated_at: string
}

export interface Calculo {
  id: string
  user_id: string
  cliente_id: string
  produto_id: string
  operacao: OperacaoTipo
  regime_calculo: RegimeTributario
  custo_compra: number
  custo_embalagem: number
  custo_mao_obra: number
  custo_operacional: number
  custo_frete: number
  custo_outros: number
  custo_total: number
  carga_tributaria_percentual: number
  aliquota_efetiva_simples: number | null
  icms_dentro_simples: number | null
  icms_st_fora_das: boolean
  icms_st_valor: number
  preco_sugerido: number
  imposto_valor: number
  margem_liquida: number
  margem_percentual: number
  markup: number
  margem_contribuicao: number
  ponto_equilibrio: number | null
  lucro_desejado: number | null
  notas: string | null
  created_at: string
  updated_at: string
}

export interface Cenario {
  id: string
  calculo_id: string
  nome: string
  preco_venda: number
  imposto: number
  receita_liquida: number
  custo: number
  margem_liquida: number
  margem_percentual: number
  created_at: string
}

export interface Documento {
  id: string
  user_id: string
  cliente_id: string
  produto_id: string | null
  nome: string
  categoria: DocumentoCategoria
  arquivo_url: string
  tamanho: number
  tipo_mime: string
  created_at: string
}

export interface Analise {
  id: string
  user_id: string
  chave_acesso: string
  numero_nfe: number
  serie: number
  data_emissao: string | null
  emit_cnpj: string
  emit_razao_social: string
  emit_nome_fantasia: string | null
  emit_uf: string | null
  emit_crt: number | null
  dest_cnpj: string | null
  dest_razao_social: string | null
  dest_uf: string | null
  valor_produtos: number
  valor_nf: number
  icms_total: number
  icms_st_total: number
  ipi_total: number
  pis_total: number
  cofins_total: number
  config_rbt12: number
  config_anexo: string
  config_margem: number
  total_produtos: number
  carga_media_percentual: number | null
  margem_media: number | null
  produtos_lucrativos: number
  produtos_deficitarios: number
  created_at: string
  updated_at: string
}

export interface AnaliseProduto {
  id: string
  analise_id: string
  numero_item: number
  codigo: string | null
  descricao: string
  ncm: string | null
  cfop: string | null
  unidade: string | null
  quantidade: number
  valor_unitario: number
  valor_total: number
  icms_cst: string | null
  icms_base: number
  icms_aliquota: number
  icms_valor: number
  icms_st_base: number
  icms_st_mva: number
  icms_st_valor: number
  ipi_valor: number
  pis_valor: number
  cofins_valor: number
  carga_tributaria_percentual: number | null
  aliquota_efetiva: number | null
  icms_st_fora_das: boolean
  icms_st_calculado: number
  preco_sugerido: number | null
  margem_percentual: number | null
  margem_liquida: number | null
  markup: number | null
  classificacao: string | null
  insight: string | null
  created_at: string
}
