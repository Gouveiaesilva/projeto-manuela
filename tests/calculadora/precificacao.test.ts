import { describe, it, expect } from 'vitest'
import { calcularPrecoVenda } from '@/lib/calculadora/precificacao'

describe('calcularPrecoVenda', () => {
  it('deve calcular preço de venda corretamente', () => {
    // Custo R$25, carga tributária 10%, margem 20%
    // Preço = 25 / (1 - 0.10 - 0.20) = 25 / 0.70 = 35.7142...
    const preco = calcularPrecoVenda(25, 10, 20)
    expect(preco).toBeCloseTo(35.71, 1)
  })

  it('deve calcular com carga tributária de 4% e margem de 30%', () => {
    // Custo R$100, carga 4%, margem 30%
    // Preço = 100 / (1 - 0.04 - 0.30) = 100 / 0.66 = 151.5151...
    const preco = calcularPrecoVenda(100, 4, 30)
    expect(preco).toBeCloseTo(151.52, 1)
  })

  it('deve funcionar com margem zero', () => {
    // Custo R$100, carga 10%, margem 0%
    // Preço = 100 / (1 - 0.10) = 100 / 0.90 = 111.11
    const preco = calcularPrecoVenda(100, 10, 0)
    expect(preco).toBeCloseTo(111.11, 1)
  })

  it('deve funcionar com carga tributária zero', () => {
    // Custo R$100, carga 0%, margem 30%
    // Preço = 100 / (1 - 0.30) = 100 / 0.70 = 142.86
    const preco = calcularPrecoVenda(100, 0, 30)
    expect(preco).toBeCloseTo(142.86, 1)
  })

  it('deve lançar erro quando margem + carga = 100%', () => {
    expect(() => calcularPrecoVenda(100, 50, 50)).toThrow()
  })

  it('deve lançar erro quando margem + carga > 100%', () => {
    expect(() => calcularPrecoVenda(100, 60, 50)).toThrow()
  })

  it('deve lançar erro quando custo é zero', () => {
    expect(() => calcularPrecoVenda(0, 10, 20)).toThrow()
  })

  it('deve lançar erro quando custo é negativo', () => {
    expect(() => calcularPrecoVenda(-100, 10, 20)).toThrow()
  })

  it('preço deve ser sempre maior que o custo', () => {
    const custo = 50
    const preco = calcularPrecoVenda(custo, 5, 15)
    expect(preco).toBeGreaterThan(custo)
  })
})
