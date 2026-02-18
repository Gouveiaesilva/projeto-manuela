import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parseNFeXML } from '@/lib/xml/parser'
import { extractNFeData } from '@/lib/xml/extractor'

const sampleXML = readFileSync(join(__dirname, 'fixtures', 'nfe-sample.xml'), 'utf-8')

function getSampleNFe() {
  const raw = parseNFeXML(sampleXML)
  return extractNFeData(raw)
}

describe('extractNFeData', () => {
  describe('dados gerais', () => {
    it('deve extrair chave de acesso', () => {
      const nfe = getSampleNFe()
      expect(nfe.chaveAcesso).toBe('35210612345678000195550010000001001000001000')
    })

    it('deve extrair número e série', () => {
      const nfe = getSampleNFe()
      expect(nfe.numero).toBe(100)
      expect(nfe.serie).toBe(1)
    })

    it('deve extrair data de emissão', () => {
      const nfe = getSampleNFe()
      expect(nfe.dataEmissao).toContain('2024-06-15')
    })
  })

  describe('emitente', () => {
    it('deve extrair dados do emitente', () => {
      const nfe = getSampleNFe()
      expect(nfe.emitente.cnpj).toBe('12345678000195')
      expect(nfe.emitente.razaoSocial).toBe('EMPRESA TESTE LTDA')
      expect(nfe.emitente.nomeFantasia).toBe('TESTE COMERCIO')
      expect(nfe.emitente.uf).toBe('SP')
      expect(nfe.emitente.municipio).toBe('SAO PAULO')
      expect(nfe.emitente.crt).toBe(1) // Simples Nacional
    })

    it('deve extrair inscrição estadual', () => {
      const nfe = getSampleNFe()
      expect(nfe.emitente.inscricaoEstadual).toBe('123456789012')
    })
  })

  describe('destinatário', () => {
    it('deve extrair dados do destinatário', () => {
      const nfe = getSampleNFe()
      expect(nfe.destinatario.cnpj).toBe('98765432000110')
      expect(nfe.destinatario.razaoSocial).toBe('CLIENTE EXEMPLO LTDA')
      expect(nfe.destinatario.uf).toBe('RN')
      expect(nfe.destinatario.municipio).toBe('NATAL')
    })
  })

  describe('itens', () => {
    it('deve extrair 3 itens', () => {
      const nfe = getSampleNFe()
      expect(nfe.itens).toHaveLength(3)
    })

    // Item 1: ICMS00
    it('deve extrair item 1 (ICMS00) com dados do produto', () => {
      const nfe = getSampleNFe()
      const item1 = nfe.itens[0]
      expect(item1.produto.numero).toBe(1)
      expect(item1.produto.descricao).toBe('CAMISETA BASICA ALGODAO')
      expect(item1.produto.ncm).toBe('61091000')
      expect(item1.produto.quantidade).toBe(10)
      expect(item1.produto.valorUnitario).toBe(45)
      expect(item1.produto.valorTotal).toBe(450)
    })

    it('deve extrair impostos ICMS00 do item 1', () => {
      const nfe = getSampleNFe()
      const imp = nfe.itens[0].impostos
      expect(imp.icmsCST).toBe('00')
      expect(imp.icmsBase).toBe(450)
      expect(imp.icmsAliquota).toBe(18)
      expect(imp.icmsValor).toBe(81)
      expect(imp.icmsStValor).toBe(0) // sem ST
    })

    it('deve extrair IPI tributado do item 1', () => {
      const nfe = getSampleNFe()
      const imp = nfe.itens[0].impostos
      expect(imp.ipiCST).toBe('50')
      expect(imp.ipiBase).toBe(450)
      expect(imp.ipiAliquota).toBe(5)
      expect(imp.ipiValor).toBe(22.5)
    })

    it('deve extrair PIS e COFINS do item 1', () => {
      const nfe = getSampleNFe()
      const imp = nfe.itens[0].impostos
      expect(imp.pisCST).toBe('01')
      expect(imp.pisAliquota).toBe(1.65)
      expect(imp.cofinsCST).toBe('01')
      expect(imp.cofinsAliquota).toBe(7.6)
    })

    // Item 2: ICMS10 (com ST)
    it('deve extrair item 2 (ICMS10 com ST)', () => {
      const nfe = getSampleNFe()
      const item2 = nfe.itens[1]
      expect(item2.produto.descricao).toBe('REFRIGERANTE COLA 2L')
      expect(item2.produto.ncm).toBe('22021000')
      expect(item2.produto.quantidade).toBe(24)
    })

    it('deve extrair ICMS-ST do item 2', () => {
      const nfe = getSampleNFe()
      const imp = nfe.itens[1].impostos
      expect(imp.icmsCST).toBe('10')
      expect(imp.icmsBase).toBe(132)
      expect(imp.icmsAliquota).toBe(18)
      expect(imp.icmsValor).toBe(23.76)
      expect(imp.icmsStMva).toBe(40)
      expect(imp.icmsStBase).toBe(184.8)
      expect(imp.icmsStValor).toBe(9.5)
    })

    it('deve extrair IPI isento (IPINT) do item 2', () => {
      const nfe = getSampleNFe()
      const imp = nfe.itens[1].impostos
      expect(imp.ipiCST).toBe('03')
      expect(imp.ipiValor).toBe(0)
    })

    it('deve extrair PIS/COFINS não tributados do item 2', () => {
      const nfe = getSampleNFe()
      const imp = nfe.itens[1].impostos
      expect(imp.pisCST).toBe('06')
      expect(imp.pisValor).toBe(0)
      expect(imp.cofinsCST).toBe('06')
      expect(imp.cofinsValor).toBe(0)
    })

    // Item 3: ICMS60
    it('deve extrair item 3 (ICMS60 - ST cobrado anteriormente)', () => {
      const nfe = getSampleNFe()
      const item3 = nfe.itens[2]
      expect(item3.produto.descricao).toBe('OLEO LUBRIFICANTE 1L')
      expect(item3.produto.valorDesconto).toBe(8)
    })

    it('deve extrair ICMS60 do item 3', () => {
      const nfe = getSampleNFe()
      const imp = nfe.itens[2].impostos
      expect(imp.icmsCST).toBe('60')
      // ICMS60 não tem vBC/pICMS/vICMS padrão, são zeros
      expect(imp.icmsBase).toBe(0)
      expect(imp.icmsValor).toBe(0)
    })
  })

  describe('totais', () => {
    it('deve extrair totais da NF-e', () => {
      const nfe = getSampleNFe()
      expect(nfe.totais.valorProdutos).toBe(750)
      expect(nfe.totais.valorNF).toBe(774)
      expect(nfe.totais.valorDesconto).toBe(8)
      expect(nfe.totais.icmsBase).toBe(582)
      expect(nfe.totais.icmsValor).toBe(104.76)
      expect(nfe.totais.icmsStBase).toBe(184.8)
      expect(nfe.totais.icmsStValor).toBe(9.5)
      expect(nfe.totais.ipiValor).toBe(22.5)
      expect(nfe.totais.pisValor).toBe(10.2)
      expect(nfe.totais.cofinsValor).toBe(46.97)
    })
  })

  describe('edge cases', () => {
    it('deve lidar com campos ausentes retornando valores padrão', () => {
      const raw = parseNFeXML(`<?xml version="1.0"?>
        <NFe>
          <infNFe Id="NFe000">
            <ide><nNF>1</nNF><serie>1</serie></ide>
            <emit><CNPJ>11111111000111</CNPJ><xNome>Teste</xNome></emit>
            <dest><xNome>Dest</xNome></dest>
            <det nItem="1">
              <prod><cProd>1</cProd><xProd>Prod Simples</xProd><NCM>00000000</NCM><CFOP>5102</CFOP><uCom>UN</uCom><qCom>1</qCom><vUnCom>10</vUnCom><vProd>10</vProd></prod>
              <imposto></imposto>
            </det>
            <total><ICMSTot><vProd>10</vProd><vNF>10</vNF></ICMSTot></total>
          </infNFe>
        </NFe>`)
      const nfe = extractNFeData(raw)

      expect(nfe.itens[0].impostos.icmsCST).toBeNull()
      expect(nfe.itens[0].impostos.icmsValor).toBe(0)
      expect(nfe.itens[0].impostos.ipiValor).toBe(0)
      expect(nfe.emitente.crt).toBe(0) // CRT ausente
      expect(nfe.emitente.nomeFantasia).toBeNull()
    })
  })
})
