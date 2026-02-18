import type { FaixaSimplesNacional, TabelaAnexo } from '@/lib/tabelas/tipos'
import type { CalculoSimplesInput, CalculoSimplesOutput } from '@/types/calculadora'
import { ANEXOS } from '@/lib/tabelas/simples-nacional'
import { calcularICMSST } from './icms-st'

/**
 * Encontra a faixa do Simples Nacional para o RBT12 informado.
 */
export function encontrarFaixa(rbt12: number, anexo: TabelaAnexo): FaixaSimplesNacional {
  const faixa = anexo.faixas.find(f => rbt12 >= f.rbt12Min && rbt12 <= f.rbt12Max)
  if (!faixa) {
    throw new Error(`Faixa não encontrada para RBT12 R$ ${rbt12} no ${anexo.nome}`)
  }
  return faixa
}

/**
 * Calcula a alíquota efetiva do Simples Nacional.
 * Fórmula: (RBT12 × Alíquota Nominal - Parcela a Deduzir) / RBT12
 */
export function calcularAliquotaEfetiva(rbt12: number, anexo: TabelaAnexo): {
  aliquotaEfetiva: number
  faixa: FaixaSimplesNacional
  icmsDentroSimples: number
  aliquotaSemIcms: number
} {
  const faixa = encontrarFaixa(rbt12, anexo)

  // Faixa 1 não tem parcela a deduzir, alíquota efetiva = nominal
  const aliquotaEfetiva = faixa.parcelaDeduzir === 0
    ? faixa.aliquotaNominal
    : ((rbt12 * (faixa.aliquotaNominal / 100) - faixa.parcelaDeduzir) / rbt12) * 100

  // Percentual de ICMS dentro da alíquota efetiva
  const icmsDentroSimples = aliquotaEfetiva * (faixa.distribuicao.icms / 100)

  // Alíquota sem a parcela de ICMS (para quando ICMS-ST é fora do DAS)
  const aliquotaSemIcms = aliquotaEfetiva - icmsDentroSimples

  return {
    aliquotaEfetiva,
    faixa,
    icmsDentroSimples,
    aliquotaSemIcms,
  }
}

/**
 * Calcula a carga tributária total para o Simples Nacional,
 * considerando se o ICMS-ST está fora do DAS.
 */
export function calcularCargaTributariaSimples(input: CalculoSimplesInput): CalculoSimplesOutput {
  const anexo = ANEXOS[input.anexo]
  if (!anexo) {
    throw new Error(`Anexo "${input.anexo}" não encontrado`)
  }

  const { aliquotaEfetiva, faixa, icmsDentroSimples, aliquotaSemIcms } = calcularAliquotaEfetiva(input.rbt12, anexo)

  const icmsStForaDAS = input.tipoIcms === 'substituicao_tributaria'

  let cargaTotalPercentual: number
  let icmsStValor = 0

  if (icmsStForaDAS) {
    // Quando ICMS-ST está fora do DAS:
    // 1. Remove o ICMS de dentro do Simples
    // 2. Calcula ICMS-ST separadamente
    const icmsProprio = input.custoCompra * (icmsDentroSimples / 100)

    icmsStValor = calcularICMSST({
      baseCalculo: input.custoCompra,
      mva: input.mva,
      aliquotaICMS: input.aliquotaIcms,
      icmsProprio,
    })

    // Carga = alíquota do Simples sem ICMS + ICMS-ST como percentual do custo
    const icmsStPercentual = (icmsStValor / input.custoCompra) * 100
    cargaTotalPercentual = aliquotaSemIcms + icmsStPercentual
  } else {
    // ICMS está dentro do DAS normalmente
    cargaTotalPercentual = aliquotaEfetiva
  }

  // Detalhamento da distribuição dos tributos
  const detalhamento = {
    irpj: aliquotaEfetiva * (faixa.distribuicao.irpj / 100),
    csll: aliquotaEfetiva * (faixa.distribuicao.csll / 100),
    cofins: aliquotaEfetiva * (faixa.distribuicao.cofins / 100),
    pis: aliquotaEfetiva * (faixa.distribuicao.pis / 100),
    cpp: aliquotaEfetiva * (faixa.distribuicao.cpp / 100),
    icms: icmsStForaDAS ? 0 : icmsDentroSimples,
  }

  return {
    cargaTotalPercentual,
    icmsStForaDAS,
    icmsStValor,
    aliquotaEfetiva,
    icmsDentroSimples,
    aliquotaSemIcms,
    detalhamento,
  }
}
