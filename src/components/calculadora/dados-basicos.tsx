'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useCalculadoraStore } from '@/stores/calculadora-store'
import type { Cliente, Produto } from '@/types/database'

const regimeLabels: Record<string, string> = {
  simples_nacional: 'Simples Nacional',
  lucro_real: 'Lucro Real',
  lucro_presumido: 'Lucro Presumido',
}

const operacaoLabels: Record<string, string> = {
  revenda: 'Revenda',
  industrializacao: 'Industrialização',
  encomenda: 'Encomenda',
}

interface DadosBasicosProps {
  clienteIdInicial?: string
  produtoIdInicial?: string
}

export function DadosBasicos({ clienteIdInicial, produtoIdInicial }: DadosBasicosProps) {
  const { cliente, produto, operacao, setCliente, setProduto, setOperacao } = useCalculadoraStore()

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loadingClientes, setLoadingClientes] = useState(true)
  const [loadingProdutos, setLoadingProdutos] = useState(false)

  // Carregar clientes
  useEffect(() => {
    async function loadClientes() {
      const supabase = createClient()
      const { data } = await supabase
        .from('clientes')
        .select('*')
        .order('razao_social')
      setClientes(data || [])
      setLoadingClientes(false)

      // Auto-selecionar se clienteIdInicial
      if (clienteIdInicial && data) {
        const c = data.find((c: Cliente) => c.id === clienteIdInicial)
        if (c) setCliente(c)
      }
    }
    loadClientes()
  }, [clienteIdInicial, setCliente])

  // Carregar produtos quando cliente muda
  useEffect(() => {
    if (!cliente) {
      setProdutos([])
      return
    }
    async function loadProdutos() {
      setLoadingProdutos(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('produtos')
        .select('*')
        .eq('cliente_id', cliente!.id)
        .order('nome')
      setProdutos(data || [])
      setLoadingProdutos(false)

      // Auto-selecionar se produtoIdInicial
      if (produtoIdInicial && data) {
        const p = data.find((p: Produto) => p.id === produtoIdInicial)
        if (p) setProduto(p)
      }
    }
    loadProdutos()
  }, [cliente, produtoIdInicial, setProduto])

  function handleClienteChange(clienteId: string) {
    const c = clientes.find((c) => c.id === clienteId) || null
    setCliente(c)
    setProduto(null)
  }

  function handleProdutoChange(produtoId: string) {
    const p = produtos.find((p) => p.id === produtoId) || null
    setProduto(p)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Básicos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <Select
              value={cliente?.id || ''}
              onValueChange={handleClienteChange}
              disabled={loadingClientes}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingClientes ? 'Carregando...' : 'Selecione um cliente'} />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.razao_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Produto *</Label>
            <Select
              value={produto?.id || ''}
              onValueChange={handleProdutoChange}
              disabled={!cliente || loadingProdutos}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !cliente
                      ? 'Selecione um cliente primeiro'
                      : loadingProdutos
                        ? 'Carregando...'
                        : 'Selecione um produto'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {produtos.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Operação</Label>
            <Select value={operacao} onValueChange={(v) => setOperacao(v as typeof operacao)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(operacaoLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {cliente && (
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{regimeLabels[cliente.regime]}</Badge>
            {cliente.anexo_simples && (
              <Badge variant="secondary">{cliente.anexo_simples.replace('_', ' ').toUpperCase()}</Badge>
            )}
            {cliente.rbt12 && (
              <Badge variant="secondary">
                RBT12: R$ {Number(cliente.rbt12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
