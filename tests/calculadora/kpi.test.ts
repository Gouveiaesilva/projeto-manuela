import { describe, it, expect } from 'vitest'
import { calcularKPIs } from '@/lib/calculadora/kpi'

describe('calcularKPIs', () => {
  it('deve calcular todos os KPIs corretamente', () => {
    const resultado = calcularKPIs({
      precoVenda: 50,
      custoTotal: 25,
      impostoTotal: 5,
    })

    // Margem líquida = 50 - 5 - 25 = 20
    expect(resultado.margemLiquida).toBeCloseTo(20, 2)

    // Margem % = 20/50 × 100 = 40%
    expect(resultado.margemPercentual).toBeCloseTo(40, 2)

    // Markup = (50 - 25)/25 × 100 = 100%
    expect(resultado.markup).toBeCloseTo(100, 2)

    // Margem contribuição = 50 - 25 - 5 = 20
    expect(resultado.margemContribuicao).toBeCloseTo(20, 2)

    // Sem custos fixos = sem ponto de equilíbrio
    expect(resultado.pontoEquilibrio).toBeNull()

    expect(resultado.precoVenda).toBe(50)
    expect(resultado.impostoValor).toBe(5)
  })

  it('deve calcular ponto de equilíbrio com custos fixos', () => {
    const resultado = calcularKPIs({
      precoVenda: 50,
      custoTotal: 25,
      impostoTotal: 5,
      custosFixosMensais: 1000,
    })

    // Margem contribuição = 50 - 25 - 5 = 20
    // Ponto equilíbrio = 1000 / 20 = 50 unidades
    expect(resultado.pontoEquilibrio).toBe(50)
  })

  it('deve retornar ponto de equilíbrio null quando margem contribuição é zero', () => {
    const resultado = calcularKPIs({
      precoVenda: 30,
      custoTotal: 25,
      impostoTotal: 5,
      custosFixosMensais: 1000,
    })

    // Margem contribuição = 30 - 25 - 5 = 0
    expect(resultado.pontoEquilibrio).toBeNull()
  })

  it('deve retornar ponto de equilíbrio null quando margem contribuição é negativa', () => {
    const resultado = calcularKPIs({
      precoVenda: 28,
      custoTotal: 25,
      impostoTotal: 5,
      custosFixosMensais: 1000,
    })

    // Margem contribuição = 28 - 25 - 5 = -2 (negativa)
    expect(resultado.pontoEquilibrio).toBeNull()
  })

  it('deve arredondar ponto de equilíbrio para cima', () => {
    const resultado = calcularKPIs({
      precoVenda: 50,
      custoTotal: 25,
      impostoTotal: 5,
      custosFixosMensais: 1010,
    })

    // PE = 1010 / 20 = 50.5 → arredonda para 51
    expect(resultado.pontoEquilibrio).toBe(51)
  })

  it('deve lidar com preço zero', () => {
    const resultado = calcularKPIs({
      precoVenda: 0,
      custoTotal: 25,
      impostoTotal: 0,
    })

    expect(resultado.margemPercentual).toBe(0)
  })

  it('deve calcular lucro desejado como margem líquida', () => {
    const resultado = calcularKPIs({
      precoVenda: 100,
      custoTotal: 60,
      impostoTotal: 10,
    })

    expect(resultado.lucroDesejado).toBeCloseTo(30, 2)
    expect(resultado.lucroDesejado).toBe(resultado.margemLiquida)
  })
})
