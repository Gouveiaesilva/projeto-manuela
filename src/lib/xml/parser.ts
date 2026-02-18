import { XMLParser } from 'fast-xml-parser'

/**
 * Faz o parse de um XML de NF-e e retorna o objeto raw.
 * Usa fast-xml-parser com remoção de namespace para simplificar acesso.
 */
export function parseNFeXML(xmlString: string): Record<string, unknown> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    removeNSPrefix: true,
    isArray: (name) => {
      // <det> (itens da NF-e) deve sempre ser array, mesmo com 1 item
      return name === 'det'
    },
    parseTagValue: true,
    trimValues: true,
  })

  const parsed = parser.parse(xmlString)

  // NF-e pode estar em <nfeProc><NFe> ou diretamente em <NFe>
  const nfe = parsed?.nfeProc?.NFe ?? parsed?.NFe
  if (!nfe) {
    throw new Error('XML inválido: elemento <NFe> não encontrado')
  }

  const infNFe = nfe?.infNFe
  if (!infNFe) {
    throw new Error('XML inválido: elemento <infNFe> não encontrado')
  }

  return infNFe as Record<string, unknown>
}
