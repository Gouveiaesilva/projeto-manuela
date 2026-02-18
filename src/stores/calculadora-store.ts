'use client'

import { create } from 'zustand'
import type { Cliente, Produto } from '@/types/database'
import type { CustoComposicao, KPIOutput, CalculoSimplesOutput } from '@/types/calculadora'
import {
  calcularCargaTributariaSimples,
  calcularCustoTotal,
  custoComposicaoVazio,
  calcularPrecoVenda,
  calcularKPIs,
} from '@/lib/calculadora'

interface CalculadoraState {
  // Dados selecionados
  cliente: Cliente | null
  produto: Produto | null
  operacao: 'revenda' | 'industrializacao' | 'encomenda'

  // Custos
  custos: CustoComposicao
  custoTotal: number
  margemDesejada: number

  // Resultados
  cargaTributaria: number
  simplesOutput: CalculoSimplesOutput | null
  precoVenda: number | null
  kpis: KPIOutput | null
  erro: string | null

  // Actions
  setCliente: (cliente: Cliente | null) => void
  setProduto: (produto: Produto | null) => void
  setOperacao: (op: 'revenda' | 'industrializacao' | 'encomenda') => void
  setCusto: (campo: keyof CustoComposicao, valor: number) => void
  setMargemDesejada: (margem: number) => void
  recalcular: () => void
  resetar: () => void
}

export const useCalculadoraStore = create<CalculadoraState>((set, get) => ({
  cliente: null,
  produto: null,
  operacao: 'revenda',
  custos: custoComposicaoVazio(),
  custoTotal: 0,
  margemDesejada: 0,
  cargaTributaria: 0,
  simplesOutput: null,
  precoVenda: null,
  kpis: null,
  erro: null,

  setCliente: (cliente) => {
    set({ cliente })
    get().recalcular()
  },

  setProduto: (produto) => {
    if (produto) {
      const custos = {
        ...custoComposicaoVazio(),
        custoCompra: Number(produto.custo_aquisicao),
      }
      set({
        produto,
        custos,
        margemDesejada: Number(produto.margem_desejada),
      })
    } else {
      set({ produto: null })
    }
    get().recalcular()
  },

  setOperacao: (operacao) => {
    set({ operacao })
    get().recalcular()
  },

  setCusto: (campo, valor) => {
    const custos = { ...get().custos, [campo]: valor }
    set({ custos })
    get().recalcular()
  },

  setMargemDesejada: (margemDesejada) => {
    set({ margemDesejada })
    get().recalcular()
  },

  recalcular: () => {
    const { cliente, produto, custos, margemDesejada } = get()

    if (!cliente || !produto) {
      set({ custoTotal: 0, cargaTributaria: 0, simplesOutput: null, precoVenda: null, kpis: null, erro: null })
      return
    }

    const custoTotal = calcularCustoTotal(custos)

    if (custoTotal <= 0) {
      set({ custoTotal, cargaTributaria: 0, precoVenda: null, kpis: null, erro: null })
      return
    }

    try {
      let cargaTributaria = 0
      let simplesOutput: CalculoSimplesOutput | null = null

      if (cliente.regime === 'simples_nacional' && cliente.anexo_simples && cliente.rbt12) {
        simplesOutput = calcularCargaTributariaSimples({
          rbt12: Number(cliente.rbt12),
          anexo: cliente.anexo_simples,
          tipoIcms: produto.tipo_icms,
          aliquotaIcms: Number(produto.aliquota_icms),
          mva: Number(produto.mva_iva),
          custoCompra: custos.custoCompra,
        })
        cargaTributaria = simplesOutput.cargaTotalPercentual
      } else {
        // Lucro Real / Presumido: soma direta das alíquotas
        const pis = 1.65 // PIS não-cumulativo padrão
        const cofins = 7.6 // COFINS não-cumulativo padrão
        const icms = produto.tipo_icms === 'isento' ? 0 : Number(produto.aliquota_icms)
        const ipi = Number(produto.aliquota_ipi)
        cargaTributaria = pis + cofins + icms + ipi
      }

      const precoVenda = calcularPrecoVenda(custoTotal, cargaTributaria, margemDesejada)
      const impostoTotal = precoVenda * (cargaTributaria / 100)

      const kpis = calcularKPIs({
        precoVenda,
        custoTotal,
        impostoTotal,
      })

      set({
        custoTotal,
        cargaTributaria,
        simplesOutput,
        precoVenda,
        kpis,
        erro: null,
      })
    } catch (error) {
      set({
        custoTotal,
        precoVenda: null,
        kpis: null,
        erro: error instanceof Error ? error.message : 'Erro no cálculo',
      })
    }
  },

  resetar: () => {
    set({
      cliente: null,
      produto: null,
      operacao: 'revenda',
      custos: custoComposicaoVazio(),
      custoTotal: 0,
      margemDesejada: 0,
      cargaTributaria: 0,
      simplesOutput: null,
      precoVenda: null,
      kpis: null,
      erro: null,
    })
  },
}))
