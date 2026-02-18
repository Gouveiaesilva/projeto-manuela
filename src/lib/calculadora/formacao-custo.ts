import type { CustoComposicao } from '@/types/calculadora'

/**
 * Calcula o custo total a partir da composição de custos.
 */
export function calcularCustoTotal(custos: CustoComposicao): number {
  return (
    custos.custoCompra +
    custos.custoEmbalagem +
    custos.custoMaoObra +
    custos.custoOperacional +
    custos.custoFrete +
    custos.custoOutros
  )
}

/**
 * Retorna uma composição de custos zerada.
 */
export function custoComposicaoVazio(): CustoComposicao {
  return {
    custoCompra: 0,
    custoEmbalagem: 0,
    custoMaoObra: 0,
    custoOperacional: 0,
    custoFrete: 0,
    custoOutros: 0,
  }
}
