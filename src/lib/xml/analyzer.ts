import type {
  NFeItem,
  NFeParseada,
  AnaliseConfig,
  ProdutoAnalisado,
  AnaliseResumo,
  AnaliseXML,
  ClassificacaoLucratividade,
} from './types'
import {
  calcularCargaTributariaSimples,
  calcularPrecoVenda,
  calcularKPIs,
} from '@/lib/calculadora'
import type { CalculoSimplesInput } from '@/types/calculadora'

/**
 * Determina o tipo de ICMS a partir do CST/CSOSN do XML.
 */
function determinarTipoIcms(item: NFeItem): string {
  const imp = item.impostos
  // CSTs com ST: 10, 30, 70 ou CSOSN 201, 202
  if (imp.icmsCST === '10' || imp.icmsCST === '30' || imp.icmsCST === '70') {
    return 'substituicao_tributaria'
  }
  if (imp.csosn === '201' || imp.csosn === '202') {
    return 'substituicao_tributaria'
  }
  // CST 60: ST cobrado anteriormente (sem carga adicional)
  if (imp.icmsCST === '60' || imp.csosn === '500') {
    return 'isento'
  }
  // CST 40, 41: isento/não tributado
  if (imp.icmsCST === '40' || imp.icmsCST === '41') {
    return 'isento'
  }
  return 'normal'
}

/**
 * Calcula a carga tributária total de um item como percentual do valor.
 * Para itens com dados de impostos no XML, calcula direto.
 */
function calcularCargaDireta(item: NFeItem): number {
  const imp = item.impostos
  const valor = item.produto.valorTotal
  if (valor <= 0) return 0

  const totalImpostos = imp.icmsValor + imp.icmsStValor + imp.ipiValor + imp.pisValor + imp.cofinsValor
  return (totalImpostos / valor) * 100
}

/**
 * Analisa um produto individual da NF-e.
 */
export function analisarProduto(item: NFeItem, config: AnaliseConfig): ProdutoAnalisado {
  const custoCompra = item.produto.valorTotal

  // Calcula carga tributária usando a engine do Simples Nacional
  const tipoIcms = determinarTipoIcms(item)
  const simplesInput: CalculoSimplesInput = {
    rbt12: config.rbt12,
    anexo: config.anexo,
    tipoIcms,
    aliquotaIcms: item.impostos.icmsAliquota || 18, // fallback 18%
    mva: item.impostos.icmsStMva || 0,
    custoCompra,
  }

  let cargaTributariaPercentual: number
  let aliquotaEfetiva: number
  let icmsStForaDAS: boolean
  let icmsStValor: number

  try {
    const resultado = calcularCargaTributariaSimples(simplesInput)
    cargaTributariaPercentual = resultado.cargaTotalPercentual
    aliquotaEfetiva = resultado.aliquotaEfetiva
    icmsStForaDAS = resultado.icmsStForaDAS
    icmsStValor = resultado.icmsStValor
  } catch {
    // Se não conseguir calcular pelo Simples, calcula direto do XML
    cargaTributariaPercentual = calcularCargaDireta(item)
    aliquotaEfetiva = cargaTributariaPercentual
    icmsStForaDAS = false
    icmsStValor = item.impostos.icmsStValor
  }

  // Preço sugerido com a margem desejada
  let precoSugerido: number
  try {
    precoSugerido = calcularPrecoVenda(custoCompra, cargaTributariaPercentual, config.margemDesejada)
  } catch {
    // Margem + carga >= 100%, impossível
    precoSugerido = 0
  }

  // KPIs
  const impostoValor = custoCompra * (cargaTributariaPercentual / 100)
  const kpis = calcularKPIs({
    precoVenda: precoSugerido > 0 ? precoSugerido : custoCompra,
    custoTotal: custoCompra,
    impostoTotal: impostoValor,
  })

  // Classificação de lucratividade
  const classificacao = classificarLucratividade(kpis.margemPercentual)

  // Insight textual
  const insight = gerarInsight(item, kpis.margemPercentual, cargaTributariaPercentual, classificacao)

  return {
    item,
    cargaTributariaPercentual,
    aliquotaEfetiva,
    icmsStForaDAS,
    icmsStValor,
    precoSugerido,
    margemPercentual: kpis.margemPercentual,
    margemLiquida: kpis.margemLiquida,
    markup: kpis.markup,
    classificacao,
    insight,
  }
}

/**
 * Analisa todos os itens de uma NF-e parseada.
 */
export function analisarNFe(nfe: NFeParseada, config: AnaliseConfig): AnaliseXML {
  const produtos = nfe.itens.map(item => analisarProduto(item, config))

  const resumo = gerarResumo(nfe, produtos)

  return {
    nfe,
    config,
    produtos,
    resumo,
    dataAnalise: new Date().toISOString(),
  }
}

function classificarLucratividade(margemPercentual: number): ClassificacaoLucratividade {
  if (margemPercentual >= 20) return 'alta'
  if (margemPercentual >= 10) return 'media'
  if (margemPercentual >= 0) return 'baixa'
  return 'negativa'
}

function gerarInsight(
  item: NFeItem,
  margem: number,
  carga: number,
  classificacao: ClassificacaoLucratividade
): string {
  const nome = item.produto.descricao
  switch (classificacao) {
    case 'alta':
      return `${nome}: margem saudável de ${margem.toFixed(1)}%. Carga tributária de ${carga.toFixed(1)}%.`
    case 'media':
      return `${nome}: margem aceitável de ${margem.toFixed(1)}%. Considere otimizar custos para aumentar rentabilidade.`
    case 'baixa':
      return `${nome}: margem baixa de ${margem.toFixed(1)}%. Revise o preço de venda ou negocie melhores condições com fornecedores.`
    case 'negativa':
      return `${nome}: ATENÇÃO - margem negativa de ${margem.toFixed(1)}%. Este produto está gerando prejuízo. Ação imediata necessária.`
  }
}

function gerarResumo(nfe: NFeParseada, produtos: ProdutoAnalisado[]): AnaliseResumo {
  const totalProdutos = produtos.length
  const valorTotalNF = nfe.totais.valorNF

  const cargaMediaPercentual = totalProdutos > 0
    ? produtos.reduce((sum, p) => sum + p.cargaTributariaPercentual, 0) / totalProdutos
    : 0

  const margemMedia = totalProdutos > 0
    ? produtos.reduce((sum, p) => sum + p.margemPercentual, 0) / totalProdutos
    : 0

  const produtosLucrativos = produtos.filter(p => p.margemPercentual > 0).length
  const produtosDeficitarios = produtos.filter(p => p.margemPercentual <= 0).length

  // Maior e menor margem
  const sorted = [...produtos].sort((a, b) => b.margemPercentual - a.margemPercentual)
  const maiorMargem = sorted.length > 0
    ? { descricao: sorted[0].item.produto.descricao, margem: sorted[0].margemPercentual }
    : null
  const menorMargem = sorted.length > 0
    ? { descricao: sorted[sorted.length - 1].item.produto.descricao, margem: sorted[sorted.length - 1].margemPercentual }
    : null

  // Recomendações
  const recomendacoes: string[] = []
  if (produtosDeficitarios > 0) {
    recomendacoes.push(`${produtosDeficitarios} produto(s) com margem negativa precisam de revisão de preço urgente.`)
  }
  const produtosBaixa = produtos.filter(p => p.classificacao === 'baixa').length
  if (produtosBaixa > 0) {
    recomendacoes.push(`${produtosBaixa} produto(s) com margem baixa (<10%). Considere renegociar custos.`)
  }
  const comST = produtos.filter(p => p.icmsStForaDAS).length
  if (comST > 0) {
    recomendacoes.push(`${comST} produto(s) com ICMS-ST fora do DAS. Certifique-se de incluir esse custo na precificação.`)
  }
  if (recomendacoes.length === 0) {
    recomendacoes.push('Todos os produtos apresentam margens saudáveis. Continue monitorando periodicamente.')
  }

  return {
    totalProdutos,
    valorTotalNF,
    cargaMediaPercentual,
    margemMedia,
    produtosLucrativos,
    produtosDeficitarios,
    maiorMargem,
    menorMargem,
    recomendacoes,
  }
}
