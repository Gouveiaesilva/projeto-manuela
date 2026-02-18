import type {
  NFeEmitente,
  NFeDestinatario,
  NFeProduto,
  NFeImpostos,
  NFeItem,
  NFeTotais,
  NFeParseada,
} from './types'

// Helpers seguros para acesso a valores numéricos e strings
function num(val: unknown): number {
  if (val === undefined || val === null || val === '') return 0
  const n = Number(val)
  return isNaN(n) ? 0 : n
}

function str(val: unknown): string {
  if (val === undefined || val === null) return ''
  return String(val).trim()
}

function strOrNull(val: unknown): string | null {
  if (val === undefined || val === null || String(val).trim() === '') return null
  return String(val).trim()
}

/** CST/CSOSN — preserva zeros à esquerda (CST = 2 dígitos, CSOSN = 3 dígitos) */
function cst(val: unknown, digits: number = 2): string | null {
  if (val === undefined || val === null || val === '') return null
  return String(val).padStart(digits, '0')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawObj = Record<string, any>

/**
 * Extrai os dados estruturados de um objeto raw de infNFe.
 */
export function extractNFeData(infNFe: RawObj): NFeParseada {
  const ide = infNFe.ide || {}
  const emit = infNFe.emit || {}
  const dest = infNFe.dest || {}
  const det = infNFe.det || []
  const total = infNFe.total?.ICMSTot || {}

  // Chave de acesso (atributo @_Id da infNFe ou vazio)
  const chaveAcesso = str(infNFe['@_Id']).replace(/^NFe/, '')

  return {
    chaveAcesso,
    numero: num(ide.nNF),
    serie: num(ide.serie),
    dataEmissao: str(ide.dhEmi || ide.dEmi),
    emitente: extractEmitente(emit),
    destinatario: extractDestinatario(dest),
    itens: (det as RawObj[]).map(extractItem),
    totais: extractTotais(total),
  }
}

function extractEmitente(emit: RawObj): NFeEmitente {
  const end = emit.enderEmit || {}
  return {
    cnpj: str(emit.CNPJ),
    razaoSocial: str(emit.xNome),
    nomeFantasia: strOrNull(emit.xFant),
    inscricaoEstadual: strOrNull(emit.IE),
    uf: str(end.UF),
    municipio: str(end.xMun),
    crt: num(emit.CRT),
  }
}

function extractDestinatario(dest: RawObj): NFeDestinatario {
  const end = dest.enderDest || {}
  return {
    cnpj: strOrNull(dest.CNPJ),
    cpf: strOrNull(dest.CPF),
    razaoSocial: str(dest.xNome),
    uf: str(end.UF),
    municipio: str(end.xMun),
  }
}

function extractItem(det: RawObj): NFeItem {
  const prod = det.prod || {}
  const imposto = det.imposto || {}

  return {
    produto: extractProduto(det, prod),
    impostos: extractImpostos(imposto),
  }
}

function extractProduto(det: RawObj, prod: RawObj): NFeProduto {
  return {
    numero: num(det['@_nItem']),
    codigo: str(prod.cProd),
    ean: strOrNull(prod.cEAN),
    descricao: str(prod.xProd),
    ncm: str(prod.NCM),
    cfop: str(prod.CFOP),
    unidade: str(prod.uCom),
    quantidade: num(prod.qCom),
    valorUnitario: num(prod.vUnCom),
    valorTotal: num(prod.vProd),
    valorDesconto: num(prod.vDesc),
    valorFrete: num(prod.vFrete),
    valorSeguro: num(prod.vSeg),
    valorOutros: num(prod.vOutro),
  }
}

function extractImpostos(imposto: RawObj): NFeImpostos {
  const icms = extractICMS(imposto.ICMS || {})
  const ipi = extractIPI(imposto.IPI || {})
  const pis = extractPIS(imposto.PIS || {})
  const cofins = extractCOFINS(imposto.COFINS || {})

  return { ...icms, ...ipi, ...pis, ...cofins }
}

// ICMS tem várias sub-tags: ICMS00, ICMS10, ICMS20, ICMS30, ICMS60, ICMS70, ICMSSN101, etc.
function extractICMS(icmsGroup: RawObj): Pick<NFeImpostos,
  'icmsCST' | 'icmsOrigem' | 'icmsBase' | 'icmsAliquota' | 'icmsValor' |
  'icmsStBase' | 'icmsStMva' | 'icmsStAliquota' | 'icmsStValor' |
  'csosn' | 'icmsSnCredito' | 'icmsSnCreditoValor'
> {
  // Encontra a sub-tag (ICMS00, ICMS10, etc.)
  const tag = Object.keys(icmsGroup).find(k => k.startsWith('ICMS')) || ''
  const icms: RawObj = icmsGroup[tag] || {}

  return {
    icmsCST: cst(icms.CST),
    icmsOrigem: strOrNull(icms.orig),
    icmsBase: num(icms.vBC),
    icmsAliquota: num(icms.pICMS),
    icmsValor: num(icms.vICMS),
    // ST
    icmsStBase: num(icms.vBCST),
    icmsStMva: num(icms.pMVAST),
    icmsStAliquota: num(icms.pICMSST),
    icmsStValor: num(icms.vICMSST),
    // Simples Nacional
    csosn: cst(icms.CSOSN, 3),
    icmsSnCredito: num(icms.pCredSN),
    icmsSnCreditoValor: num(icms.vCredICMSSN),
  }
}

function extractIPI(ipiGroup: RawObj): Pick<NFeImpostos, 'ipiCST' | 'ipiBase' | 'ipiAliquota' | 'ipiValor'> {
  // IPI pode estar em IPITrib ou IPINT
  const trib = ipiGroup.IPITrib || {}
  return {
    ipiCST: cst(trib.CST ?? ipiGroup.IPINT?.CST),
    ipiBase: num(trib.vBC),
    ipiAliquota: num(trib.pIPI),
    ipiValor: num(trib.vIPI),
  }
}

function extractPIS(pisGroup: RawObj): Pick<NFeImpostos, 'pisCST' | 'pisBase' | 'pisAliquota' | 'pisValor'> {
  const aliq = pisGroup.PISAliq || pisGroup.PISOutr || {}
  const nt = pisGroup.PISNT || {}
  return {
    pisCST: cst(aliq.CST ?? nt.CST),
    pisBase: num(aliq.vBC),
    pisAliquota: num(aliq.pPIS),
    pisValor: num(aliq.vPIS),
  }
}

function extractCOFINS(cofinsGroup: RawObj): Pick<NFeImpostos, 'cofinsCST' | 'cofinsBase' | 'cofinsAliquota' | 'cofinsValor'> {
  const aliq = cofinsGroup.COFINSAliq || cofinsGroup.COFINSOutr || {}
  const nt = cofinsGroup.COFINSNT || {}
  return {
    cofinsCST: cst(aliq.CST ?? nt.CST),
    cofinsBase: num(aliq.vBC),
    cofinsAliquota: num(aliq.pCOFINS),
    cofinsValor: num(aliq.vCOFINS),
  }
}

function extractTotais(tot: RawObj): NFeTotais {
  return {
    valorProdutos: num(tot.vProd),
    valorNF: num(tot.vNF),
    valorDesconto: num(tot.vDesc),
    valorFrete: num(tot.vFrete),
    valorSeguro: num(tot.vSeg),
    valorOutros: num(tot.vOutro),
    icmsBase: num(tot.vBC),
    icmsValor: num(tot.vICMS),
    icmsStBase: num(tot.vBCST),
    icmsStValor: num(tot.vST),
    ipiValor: num(tot.vIPI),
    pisValor: num(tot.vPIS),
    cofinsValor: num(tot.vCOFINS),
  }
}
