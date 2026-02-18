import type { SimulacaoConfig, CenarioSimulacao } from '@/types/calculadora'

/**
 * Gera uma lista de cenários de simulação variando o preço de venda.
 */
export function gerarSimulacao(config: SimulacaoConfig): CenarioSimulacao[] {
  const { precoMinimo, precoMaximo, incremento, custoTotal, cargaTributaria } = config

  if (incremento <= 0) {
    throw new Error('Incremento deve ser maior que zero.')
  }

  if (precoMinimo > precoMaximo) {
    throw new Error('Preço mínimo deve ser menor ou igual ao preço máximo.')
  }

  const cenarios: CenarioSimulacao[] = []

  for (let preco = precoMinimo; preco <= precoMaximo; preco += incremento) {
    const precoArredondado = Math.round(preco * 100) / 100
    const imposto = precoArredondado * (cargaTributaria / 100)
    const receitaLiquida = precoArredondado - imposto
    const margemLiquida = receitaLiquida - custoTotal
    const margemPercentual = precoArredondado > 0
      ? (margemLiquida / precoArredondado) * 100
      : 0

    cenarios.push({
      precoVenda: precoArredondado,
      imposto: Math.round(imposto * 100) / 100,
      receitaLiquida: Math.round(receitaLiquida * 100) / 100,
      custo: custoTotal,
      margemLiquida: Math.round(margemLiquida * 100) / 100,
      margemPercentual: Math.round(margemPercentual * 100) / 100,
    })
  }

  return cenarios
}

/**
 * Encontra o cenário mais próximo do ponto de equilíbrio (margem = 0).
 */
export function encontrarPontoEquilibrio(cenarios: CenarioSimulacao[]): CenarioSimulacao | null {
  if (cenarios.length === 0) return null

  let menorDiferenca = Infinity
  let cenarioEquilibrio: CenarioSimulacao | null = null

  for (const cenario of cenarios) {
    const diferenca = Math.abs(cenario.margemLiquida)
    if (diferenca < menorDiferenca) {
      menorDiferenca = diferenca
      cenarioEquilibrio = cenario
    }
  }

  return cenarioEquilibrio
}
