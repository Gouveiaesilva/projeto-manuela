import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parseNFeXML } from '@/lib/xml/parser'

const sampleXML = readFileSync(join(__dirname, 'fixtures', 'nfe-sample.xml'), 'utf-8')

describe('parseNFeXML', () => {
  it('deve parsear XML de NF-e válido', () => {
    const result = parseNFeXML(sampleXML)
    expect(result).toBeDefined()
    expect(result.ide).toBeDefined()
    expect(result.emit).toBeDefined()
    expect(result.dest).toBeDefined()
    expect(result.det).toBeDefined()
    expect(result.total).toBeDefined()
  })

  it('deve retornar det como array', () => {
    const result = parseNFeXML(sampleXML)
    expect(Array.isArray(result.det)).toBe(true)
    expect((result.det as unknown[]).length).toBe(3)
  })

  it('deve preservar atributos com prefixo @_', () => {
    const result = parseNFeXML(sampleXML)
    expect(result['@_Id']).toContain('35210612345678000195')
  })

  it('deve extrair dados do emitente', () => {
    const result = parseNFeXML(sampleXML)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emit = result.emit as any
    expect(emit.CNPJ).toBe(12345678000195)
    expect(emit.xNome).toBe('EMPRESA TESTE LTDA')
    expect(emit.CRT).toBe(1)
  })

  it('deve rejeitar XML sem elemento NFe', () => {
    expect(() => parseNFeXML('<root><data>test</data></root>')).toThrow('elemento <NFe> não encontrado')
  })

  it('deve rejeitar XML sem infNFe', () => {
    expect(() => parseNFeXML('<NFe><other>test</other></NFe>')).toThrow('elemento <infNFe> não encontrado')
  })

  it('deve parsear NF-e sem nfeProc wrapper', () => {
    const xmlSemProc = `<?xml version="1.0"?>
      <NFe xmlns="http://www.portalfiscal.inf.br/nfe">
        <infNFe Id="NFe123">
          <ide><nNF>1</nNF><serie>1</serie></ide>
          <emit><CNPJ>11111111000111</CNPJ><xNome>Teste</xNome><CRT>1</CRT></emit>
          <dest><xNome>Dest</xNome></dest>
          <det nItem="1">
            <prod><cProd>1</cProd><xProd>Prod</xProd><NCM>00000000</NCM><CFOP>5102</CFOP><uCom>UN</uCom><qCom>1</qCom><vUnCom>10</vUnCom><vProd>10</vProd></prod>
            <imposto><ICMS><ICMS00><orig>0</orig><CST>00</CST><vBC>10</vBC><pICMS>18</pICMS><vICMS>1.80</vICMS></ICMS00></ICMS></imposto>
          </det>
          <total><ICMSTot><vProd>10</vProd><vNF>10</vNF><vBC>10</vBC><vICMS>1.80</vICMS></ICMSTot></total>
        </infNFe>
      </NFe>`
    const result = parseNFeXML(xmlSemProc)
    expect(result).toBeDefined()
    expect(result.ide).toBeDefined()
  })
})
