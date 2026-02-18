import { describe, it, expect } from 'vitest'
import { calcularICMSST, calcularBaseICMSST } from '@/lib/calculadora/icms-st'

describe('calcularICMSST', () => {
  it('deve calcular ICMS-ST corretamente com valores padrão', () => {
    // Base R$100, MVA 40%, ICMS 18%, ICMS próprio R$12
    // Base ST = 100 × 1.40 = 140
    // ICMS ST bruto = 140 × 18% = 25.20
    // ST = 25.20 - 12 = 13.20
    const resultado = calcularICMSST({
      baseCalculo: 100,
      mva: 40,
      aliquotaICMS: 18,
      icmsProprio: 12,
    })

    expect(resultado).toBeCloseTo(13.20, 2)
  })

  it('deve retornar zero quando ICMS-ST seria negativo', () => {
    // ICMS próprio maior que o ST calculado
    const resultado = calcularICMSST({
      baseCalculo: 100,
      mva: 10,
      aliquotaICMS: 5,
      icmsProprio: 50,
    })

    expect(resultado).toBe(0)
  })

  it('deve calcular com MVA zero', () => {
    // Sem MVA: Base ST = Base
    // ST = 100 × 18% - 12 = 18 - 12 = 6
    const resultado = calcularICMSST({
      baseCalculo: 100,
      mva: 0,
      aliquotaICMS: 18,
      icmsProprio: 12,
    })

    expect(resultado).toBeCloseTo(6, 2)
  })

  it('deve calcular com ICMS próprio zero', () => {
    // Base ST = 100 × 1.40 = 140
    // ST = 140 × 18% - 0 = 25.20
    const resultado = calcularICMSST({
      baseCalculo: 100,
      mva: 40,
      aliquotaICMS: 18,
      icmsProprio: 0,
    })

    expect(resultado).toBeCloseTo(25.20, 2)
  })

  it('deve calcular com valores reais maiores', () => {
    // Produto com custo R$500, MVA 53%, ICMS 18%, ICMS próprio R$24
    const resultado = calcularICMSST({
      baseCalculo: 500,
      mva: 53,
      aliquotaICMS: 18,
      icmsProprio: 24,
    })

    // Base ST = 500 × 1.53 = 765
    // ICMS ST = 765 × 0.18 = 137.70
    // ST = 137.70 - 24 = 113.70
    expect(resultado).toBeCloseTo(113.70, 2)
  })
})

describe('calcularBaseICMSST', () => {
  it('deve calcular base com MVA', () => {
    expect(calcularBaseICMSST(100, 40)).toBeCloseTo(140, 2)
  })

  it('deve retornar base original com MVA zero', () => {
    expect(calcularBaseICMSST(100, 0)).toBeCloseTo(100, 2)
  })
})
