/**
 * Calcula o preço de venda sugerido.
 * Fórmula: Custo / (1 - CargaTributária% - Margem%)
 *
 * @param custoTotal - Custo total do produto em R$
 * @param cargaTributaria - Carga tributária em percentual (ex: 12.5 para 12.5%)
 * @param margemDesejada - Margem desejada em percentual (ex: 20 para 20%)
 * @returns Preço de venda sugerido em R$
 * @throws Error se margem + carga >= 100%
 */
export function calcularPrecoVenda(
  custoTotal: number,
  cargaTributaria: number,
  margemDesejada: number
): number {
  const somaPercentuais = cargaTributaria + margemDesejada

  if (somaPercentuais >= 100) {
    throw new Error(
      `Margem (${margemDesejada}%) + Carga Tributária (${cargaTributaria}%) = ${somaPercentuais}%. ` +
      'A soma não pode ser igual ou superior a 100%.'
    )
  }

  if (custoTotal <= 0) {
    throw new Error('Custo total deve ser maior que zero.')
  }

  const divisor = 1 - somaPercentuais / 100
  return custoTotal / divisor
}
