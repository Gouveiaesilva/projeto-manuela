import { describe, it, expect } from 'vitest'
import { gerarSimulacao, encontrarPontoEquilibrio } from '@/lib/calculadora/simulacao'

describe('gerarSimulacao', () => {
  it('deve gerar o número correto de cenários', () => {
    const cenarios = gerarSimulacao({
      precoMinimo: 30,
      precoMaximo: 50,
      incremento: 5,
      custoTotal: 25,
      cargaTributaria: 10,
    })

    // 30, 35, 40, 45, 50 = 5 cenários
    expect(cenarios).toHaveLength(5)
  })

  it('deve ter primeiro cenário com preço mínimo', () => {
    const cenarios = gerarSimulacao({
      precoMinimo: 30,
      precoMaximo: 50,
      incremento: 5,
      custoTotal: 25,
      cargaTributaria: 10,
    })

    expect(cenarios[0].precoVenda).toBe(30)
  })

  it('deve ter último cenário com preço máximo', () => {
    const cenarios = gerarSimulacao({
      precoMinimo: 30,
      precoMaximo: 50,
      incremento: 5,
      custoTotal: 25,
      cargaTributaria: 10,
    })

    expect(cenarios[cenarios.length - 1].precoVenda).toBe(50)
  })

  it('deve calcular imposto corretamente', () => {
    const cenarios = gerarSimulacao({
      precoMinimo: 100,
      precoMaximo: 100,
      incremento: 1,
      custoTotal: 60,
      cargaTributaria: 10,
    })

    // Imposto = 100 × 10% = 10
    expect(cenarios[0].imposto).toBeCloseTo(10, 2)
  })

  it('deve calcular receita líquida corretamente', () => {
    const cenarios = gerarSimulacao({
      precoMinimo: 100,
      precoMaximo: 100,
      incremento: 1,
      custoTotal: 60,
      cargaTributaria: 10,
    })

    // Receita líquida = 100 - 10 = 90
    expect(cenarios[0].receitaLiquida).toBeCloseTo(90, 2)
  })

  it('deve calcular margem líquida corretamente', () => {
    const cenarios = gerarSimulacao({
      precoMinimo: 100,
      precoMaximo: 100,
      incremento: 1,
      custoTotal: 60,
      cargaTributaria: 10,
    })

    // Margem = 90 - 60 = 30
    expect(cenarios[0].margemLiquida).toBeCloseTo(30, 2)
  })

  it('deve ter cenários com margem crescente conforme preço sobe', () => {
    const cenarios = gerarSimulacao({
      precoMinimo: 30,
      precoMaximo: 50,
      incremento: 5,
      custoTotal: 25,
      cargaTributaria: 10,
    })

    for (let i = 1; i < cenarios.length; i++) {
      expect(cenarios[i].margemLiquida).toBeGreaterThan(cenarios[i - 1].margemLiquida)
    }
  })

  it('deve ter cenários com margem negativa quando preço é muito baixo', () => {
    const cenarios = gerarSimulacao({
      precoMinimo: 10,
      precoMaximo: 10,
      incremento: 1,
      custoTotal: 25,
      cargaTributaria: 10,
    })

    // Margem = (10 - 1) - 25 = -16
    expect(cenarios[0].margemLiquida).toBeLessThan(0)
  })

  it('deve lançar erro com incremento zero', () => {
    expect(() =>
      gerarSimulacao({
        precoMinimo: 30,
        precoMaximo: 50,
        incremento: 0,
        custoTotal: 25,
        cargaTributaria: 10,
      })
    ).toThrow()
  })

  it('deve lançar erro quando mínimo > máximo', () => {
    expect(() =>
      gerarSimulacao({
        precoMinimo: 50,
        precoMaximo: 30,
        incremento: 5,
        custoTotal: 25,
        cargaTributaria: 10,
      })
    ).toThrow()
  })

  it('deve gerar um cenário quando mínimo = máximo', () => {
    const cenarios = gerarSimulacao({
      precoMinimo: 50,
      precoMaximo: 50,
      incremento: 1,
      custoTotal: 25,
      cargaTributaria: 10,
    })
    expect(cenarios).toHaveLength(1)
    expect(cenarios[0].precoVenda).toBe(50)
  })
})

describe('encontrarPontoEquilibrio', () => {
  it('deve encontrar cenário mais próximo de margem zero', () => {
    const cenarios = gerarSimulacao({
      precoMinimo: 20,
      precoMaximo: 40,
      incremento: 1,
      custoTotal: 25,
      cargaTributaria: 10,
    })

    const pe = encontrarPontoEquilibrio(cenarios)
    expect(pe).not.toBeNull()
    // O ponto de equilíbrio deve ter margem próxima de zero
    expect(Math.abs(pe!.margemLiquida)).toBeLessThan(2)
  })

  it('deve retornar null para lista vazia', () => {
    expect(encontrarPontoEquilibrio([])).toBeNull()
  })
})
