'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DadosBasicos } from '@/components/calculadora/dados-basicos'
import { AliquotasDisplay } from '@/components/calculadora/aliquotas-display'
import { FormacaoCusto } from '@/components/calculadora/formacao-custo'
import { KPICards } from '@/components/calculadora/kpi-cards'
import { SimulacaoTabela } from '@/components/calculadora/simulacao-tabela'
import { SimulacaoGrafico } from '@/components/calculadora/simulacao-grafico'
import { useCalculadoraStore } from '@/stores/calculadora-store'
import { salvarCalculo } from './actions'
import { toast } from 'sonner'
import { Save, RotateCcw } from 'lucide-react'

function CalculadoraContent() {
  const searchParams = useSearchParams()
  const clienteId = searchParams.get('cliente') || undefined
  const produtoId = searchParams.get('produto') || undefined

  const {
    cliente, produto, operacao, custos, custoTotal,
    cargaTributaria, simplesOutput, precoVenda, kpis,
    resetar,
  } = useCalculadoraStore()

  const [salvando, setSalvando] = useState(false)

  async function handleSalvar() {
    if (!cliente || !produto || !precoVenda || !kpis) return

    setSalvando(true)
    try {
      await salvarCalculo({
        cliente_id: cliente.id,
        produto_id: produto.id,
        operacao,
        regime_calculo: cliente.regime,
        custo_compra: custos.custoCompra,
        custo_embalagem: custos.custoEmbalagem,
        custo_mao_obra: custos.custoMaoObra,
        custo_operacional: custos.custoOperacional,
        custo_frete: custos.custoFrete,
        custo_outros: custos.custoOutros,
        custo_total: custoTotal,
        carga_tributaria_percentual: cargaTributaria,
        aliquota_efetiva_simples: simplesOutput?.aliquotaEfetiva ?? null,
        icms_dentro_simples: simplesOutput?.icmsDentroSimples ?? null,
        icms_st_fora_das: simplesOutput?.icmsStForaDAS ?? false,
        icms_st_valor: simplesOutput?.icmsStValor ?? 0,
        preco_sugerido: precoVenda,
        imposto_valor: kpis.impostoValor,
        margem_liquida: kpis.margemLiquida,
        margem_percentual: kpis.margemPercentual,
        markup: kpis.markup,
        margem_contribuicao: kpis.margemContribuicao,
        ponto_equilibrio: kpis.pontoEquilibrio,
        lucro_desejado: kpis.lucroDesejado,
      })
      toast.success('Cálculo salvo com sucesso!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar cálculo')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calculadora de Precificação</h1>
          <p className="text-muted-foreground">
            Calcule o preço de venda ideal com base nos custos e tributação.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetar}>
            <RotateCcw className="mr-2 size-4" /> Limpar
          </Button>
          <Button onClick={handleSalvar} disabled={!precoVenda || salvando}>
            <Save className="mr-2 size-4" /> {salvando ? 'Salvando...' : 'Salvar Cálculo'}
          </Button>
        </div>
      </div>

      <DadosBasicos clienteIdInicial={clienteId} produtoIdInicial={produtoId} />

      <div className="grid gap-6 lg:grid-cols-2">
        <FormacaoCusto />
        <AliquotasDisplay />
      </div>

      <KPICards />

      {precoVenda && (
        <>
          <SimulacaoGrafico />
          <SimulacaoTabela />
        </>
      )}
    </div>
  )
}

export default function CalculadoraPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <CalculadoraContent />
    </Suspense>
  )
}
