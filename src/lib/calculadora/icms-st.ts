import type { CalculoICMSSTInput } from '@/types/calculadora'

/**
 * Calcula o ICMS-ST (Substituição Tributária).
 * Fórmula: (Base × (1 + MVA%) × Alíquota ICMS) - ICMS próprio
 *
 * @returns Valor do ICMS-ST em R$ (nunca negativo)
 */
export function calcularICMSST(input: CalculoICMSSTInput): number {
  const { baseCalculo, mva, aliquotaICMS, icmsProprio } = input

  const baseICMSST = baseCalculo * (1 + mva / 100)
  const icmsST = (baseICMSST * aliquotaICMS / 100) - icmsProprio

  // ICMS-ST nunca é negativo
  return Math.max(0, icmsST)
}

/**
 * Calcula a base de cálculo do ICMS-ST.
 */
export function calcularBaseICMSST(baseCalculo: number, mva: number): number {
  return baseCalculo * (1 + mva / 100)
}
