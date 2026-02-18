import { describe, it, expect } from 'vitest'
import { encontrarFaixa, calcularAliquotaEfetiva, calcularCargaTributariaSimples } from '@/lib/calculadora/simples-nacional'
import { ANEXO_I, ANEXO_II } from '@/lib/tabelas/simples-nacional'

describe('encontrarFaixa', () => {
  it('deve encontrar faixa 1 para RBT12 até R$180.000', () => {
    const faixa = encontrarFaixa(100000, ANEXO_I)
    expect(faixa.faixa).toBe(1)
    expect(faixa.aliquotaNominal).toBe(4.00)
  })

  it('deve encontrar faixa 2 para RBT12 entre R$180.000,01 e R$360.000', () => {
    const faixa = encontrarFaixa(250000, ANEXO_I)
    expect(faixa.faixa).toBe(2)
    expect(faixa.aliquotaNominal).toBe(7.30)
  })

  it('deve encontrar faixa 6 para RBT12 acima de R$3.600.000', () => {
    const faixa = encontrarFaixa(4000000, ANEXO_I)
    expect(faixa.faixa).toBe(6)
    expect(faixa.aliquotaNominal).toBe(19.00)
  })

  it('deve funcionar no limite exato entre faixas', () => {
    const faixa = encontrarFaixa(180000, ANEXO_I)
    expect(faixa.faixa).toBe(1)
  })

  it('deve lançar erro para RBT12 acima do limite', () => {
    expect(() => encontrarFaixa(5000000, ANEXO_I)).toThrow()
  })
})

describe('calcularAliquotaEfetiva', () => {
  it('deve retornar 4.00% para faixa 1 (sem parcela a deduzir)', () => {
    const resultado = calcularAliquotaEfetiva(100000, ANEXO_I)
    expect(resultado.aliquotaEfetiva).toBeCloseTo(4.00, 2)
  })

  it('deve calcular ICMS dentro do Simples para faixa 1', () => {
    const resultado = calcularAliquotaEfetiva(100000, ANEXO_I)
    // 4.00% × 34% = 1.36%
    expect(resultado.icmsDentroSimples).toBeCloseTo(1.36, 2)
  })

  it('deve calcular alíquota efetiva para faixa 2', () => {
    // (250000 × 7.30% - 5940) / 250000 = (18250 - 5940) / 250000 = 12310 / 250000 = 4.924%
    const resultado = calcularAliquotaEfetiva(250000, ANEXO_I)
    expect(resultado.aliquotaEfetiva).toBeCloseTo(4.924, 2)
  })

  it('deve retornar ICMS = 0% para faixa 6 do Anexo I', () => {
    const resultado = calcularAliquotaEfetiva(4000000, ANEXO_I)
    expect(resultado.icmsDentroSimples).toBeCloseTo(0, 2)
    // Faixa 6: ICMS = 0% na distribuição
    expect(resultado.faixa.distribuicao.icms).toBe(0)
  })

  it('deve calcular alíquota do Anexo II (Indústria)', () => {
    const resultado = calcularAliquotaEfetiva(100000, ANEXO_II)
    expect(resultado.aliquotaEfetiva).toBeCloseTo(4.50, 2)
  })

  it('deve calcular aliquotaSemIcms corretamente', () => {
    const resultado = calcularAliquotaEfetiva(100000, ANEXO_I)
    // aliquotaSemIcms = 4.00% - 1.36% = 2.64%
    expect(resultado.aliquotaSemIcms).toBeCloseTo(2.64, 2)
  })
})

describe('calcularCargaTributariaSimples', () => {
  it('deve calcular carga total para Simples Nacional sem ST', () => {
    const resultado = calcularCargaTributariaSimples({
      rbt12: 100000,
      anexo: 'anexo_i',
      tipoIcms: 'normal',
      aliquotaIcms: 18,
      mva: 0,
      custoCompra: 100,
    })

    expect(resultado.aliquotaEfetiva).toBeCloseTo(4.00, 2)
    expect(resultado.icmsStForaDAS).toBe(false)
    expect(resultado.icmsStValor).toBe(0)
    expect(resultado.cargaTotalPercentual).toBeCloseTo(4.00, 2)
  })

  it('deve calcular carga total com ICMS-ST fora do DAS', () => {
    const resultado = calcularCargaTributariaSimples({
      rbt12: 100000,
      anexo: 'anexo_i',
      tipoIcms: 'substituicao_tributaria',
      aliquotaIcms: 18,
      mva: 40,
      custoCompra: 100,
    })

    expect(resultado.icmsStForaDAS).toBe(true)
    expect(resultado.icmsStValor).toBeGreaterThan(0)
    // Carga = alíquota sem ICMS + ICMS-ST como percentual
    expect(resultado.cargaTotalPercentual).toBeGreaterThan(resultado.aliquotaSemIcms)
  })

  it('deve retornar detalhamento dos tributos', () => {
    const resultado = calcularCargaTributariaSimples({
      rbt12: 100000,
      anexo: 'anexo_i',
      tipoIcms: 'normal',
      aliquotaIcms: 18,
      mva: 0,
      custoCompra: 100,
    })

    // Todos os tributos devem estar presentes
    expect(resultado.detalhamento.irpj).toBeGreaterThan(0)
    expect(resultado.detalhamento.csll).toBeGreaterThan(0)
    expect(resultado.detalhamento.cofins).toBeGreaterThan(0)
    expect(resultado.detalhamento.pis).toBeGreaterThan(0)
    expect(resultado.detalhamento.cpp).toBeGreaterThan(0)
    expect(resultado.detalhamento.icms).toBeGreaterThan(0)

    // Soma da distribuição deve aproximar da alíquota efetiva
    const soma = Object.values(resultado.detalhamento).reduce((a, b) => a + b, 0)
    expect(soma).toBeCloseTo(resultado.aliquotaEfetiva, 1)
  })

  it('deve lançar erro para anexo inexistente', () => {
    expect(() =>
      calcularCargaTributariaSimples({
        rbt12: 100000,
        anexo: 'anexo_inexistente',
        tipoIcms: 'normal',
        aliquotaIcms: 18,
        mva: 0,
        custoCompra: 100,
      })
    ).toThrow()
  })
})
