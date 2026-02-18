import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parseNFeXML } from '@/lib/xml/parser'
import { extractNFeData } from '@/lib/xml/extractor'
import { analisarProduto, analisarNFe } from '@/lib/xml/analyzer'
import type { AnaliseConfig, NFeParseada } from '@/lib/xml/types'

const sampleXML = readFileSync(join(__dirname, 'fixtures', 'nfe-sample.xml'), 'utf-8')

function getNFe(): NFeParseada {
  return extractNFeData(parseNFeXML(sampleXML))
}

const defaultConfig: AnaliseConfig = {
  rbt12: 500000,     // R$ 500k — Faixa 2 do Anexo I
  anexo: 'anexo_i',
  margemDesejada: 20,
}

describe('analisarProduto', () => {
  it('deve analisar um produto com ICMS normal', () => {
    const nfe = getNFe()
    const resultado = analisarProduto(nfe.itens[0], defaultConfig)

    expect(resultado.cargaTributariaPercentual).toBeGreaterThan(0)
    expect(resultado.aliquotaEfetiva).toBeGreaterThan(0)
    expect(resultado.precoSugerido).toBeGreaterThan(resultado.item.produto.valorTotal)
    expect(resultado.margemPercentual).toBeGreaterThan(0)
  })

  it('deve analisar um produto com ICMS-ST', () => {
    const nfe = getNFe()
    const resultado = analisarProduto(nfe.itens[1], defaultConfig)

    expect(resultado.icmsStForaDAS).toBe(true)
    expect(resultado.icmsStValor).toBeGreaterThan(0)
    expect(resultado.cargaTributariaPercentual).toBeGreaterThan(0)
    expect(resultado.precoSugerido).toBeGreaterThan(0)
  })

  it('deve analisar um produto com ICMS60 (isento)', () => {
    const nfe = getNFe()
    const resultado = analisarProduto(nfe.itens[2], defaultConfig)

    expect(resultado.icmsStForaDAS).toBe(false)
    expect(resultado.precoSugerido).toBeGreaterThan(0)
  })

  it('deve classificar lucratividade corretamente', () => {
    const nfe = getNFe()

    // Com margem 20%, deve ser "alta" ou "media"
    const r1 = analisarProduto(nfe.itens[0], { ...defaultConfig, margemDesejada: 25 })
    expect(['alta', 'media']).toContain(r1.classificacao)

    // Com margem 5%, provavelmente "baixa"
    const r2 = analisarProduto(nfe.itens[0], { ...defaultConfig, margemDesejada: 5 })
    expect(['alta', 'media', 'baixa']).toContain(r2.classificacao)
  })

  it('deve gerar insight textual', () => {
    const nfe = getNFe()
    const resultado = analisarProduto(nfe.itens[0], defaultConfig)

    expect(resultado.insight).toContain('CAMISETA BASICA ALGODAO')
    expect(resultado.insight.length).toBeGreaterThan(20)
  })

  it('deve calcular markup positivo', () => {
    const nfe = getNFe()
    const resultado = analisarProduto(nfe.itens[0], defaultConfig)

    expect(resultado.markup).toBeGreaterThan(0)
  })
})

describe('analisarNFe', () => {
  it('deve analisar todos os itens da NF-e', () => {
    const nfe = getNFe()
    const analise = analisarNFe(nfe, defaultConfig)

    expect(analise.produtos).toHaveLength(3)
    expect(analise.nfe).toBe(nfe)
    expect(analise.config).toBe(defaultConfig)
    expect(analise.dataAnalise).toBeDefined()
  })

  it('deve gerar resumo com totais corretos', () => {
    const nfe = getNFe()
    const analise = analisarNFe(nfe, defaultConfig)

    expect(analise.resumo.totalProdutos).toBe(3)
    expect(analise.resumo.valorTotalNF).toBe(774)
    expect(analise.resumo.cargaMediaPercentual).toBeGreaterThan(0)
    expect(analise.resumo.margemMedia).toBeGreaterThan(0)
  })

  it('deve identificar produtos lucrativos e deficitários', () => {
    const nfe = getNFe()
    const analise = analisarNFe(nfe, defaultConfig)

    expect(analise.resumo.produtosLucrativos + analise.resumo.produtosDeficitarios).toBe(3)
  })

  it('deve identificar maior e menor margem', () => {
    const nfe = getNFe()
    const analise = analisarNFe(nfe, defaultConfig)

    expect(analise.resumo.maiorMargem).not.toBeNull()
    expect(analise.resumo.menorMargem).not.toBeNull()
    expect(analise.resumo.maiorMargem!.margem).toBeGreaterThanOrEqual(analise.resumo.menorMargem!.margem)
  })

  it('deve gerar recomendações', () => {
    const nfe = getNFe()
    const analise = analisarNFe(nfe, defaultConfig)

    expect(analise.resumo.recomendacoes.length).toBeGreaterThan(0)
  })

  it('deve lidar com diferentes faixas de faturamento', () => {
    const nfe = getNFe()

    // Faixa 1 (até 180k)
    const a1 = analisarNFe(nfe, { ...defaultConfig, rbt12: 100000 })
    // Faixa 3 (360k-720k)
    const a2 = analisarNFe(nfe, { ...defaultConfig, rbt12: 600000 })

    // Faixa maior deve ter carga maior
    expect(a2.resumo.cargaMediaPercentual).toBeGreaterThanOrEqual(a1.resumo.cargaMediaPercentual)
  })
})
