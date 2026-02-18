import type { KPIInput, KPIOutput } from '@/types/calculadora'

/**
 * Calcula os KPIs (Key Performance Indicators) de precificação.
 */
export function calcularKPIs(input: KPIInput): KPIOutput {
  const { precoVenda, custoTotal, impostoTotal, custosFixosMensais } = input

  const receitaLiquida = precoVenda - impostoTotal
  const margemLiquida = receitaLiquida - custoTotal
  const margemPercentual = precoVenda > 0 ? (margemLiquida / precoVenda) * 100 : 0
  const markup = custoTotal > 0 ? ((precoVenda - custoTotal) / custoTotal) * 100 : 0
  const margemContribuicao = precoVenda - custoTotal - impostoTotal

  const pontoEquilibrio =
    custosFixosMensais && custosFixosMensais > 0 && margemContribuicao > 0
      ? Math.ceil(custosFixosMensais / margemContribuicao)
      : null

  return {
    precoVenda,
    impostoValor: impostoTotal,
    margemLiquida,
    margemPercentual,
    markup,
    margemContribuicao,
    pontoEquilibrio,
    lucroDesejado: margemLiquida,
  }
}
