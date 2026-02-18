import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatarCNPJ } from '@/lib/validations/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil, Plus, Calculator } from 'lucide-react'
import { DeleteClienteButton } from './delete-button'

const regimeLabels: Record<string, string> = {
  simples_nacional: 'Simples Nacional',
  lucro_real: 'Lucro Real',
  lucro_presumido: 'Lucro Presumido',
}

const atividadeLabels: Record<string, string> = {
  industria: 'Indústria',
  comercio_revenda: 'Comércio - Revenda',
  comercio_encomenda: 'Comércio - Encomenda',
}

const anexoLabels: Record<string, string> = {
  anexo_i: 'Anexo I - Comércio',
  anexo_ii: 'Anexo II - Indústria',
  anexo_iii: 'Anexo III - Serviços',
  anexo_iv: 'Anexo IV - Serviços',
  anexo_v: 'Anexo V - Serviços',
}

export default async function ClienteDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: cliente } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()

  if (!cliente) notFound()

  const { data: produtos } = await supabase
    .from('produtos')
    .select('*')
    .eq('cliente_id', id)
    .order('nome')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{cliente.razao_social}</h1>
          {cliente.nome_fantasia && (
            <p className="text-muted-foreground">{cliente.nome_fantasia}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/clientes/${id}/editar`}>
              <Pencil className="mr-2 size-4" />
              Editar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/calculadora?cliente=${id}`}>
              <Calculator className="mr-2 size-4" />
              Calcular Preço
            </Link>
          </Button>
          <DeleteClienteButton clienteId={id} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">CNPJ</dt>
              <dd className="font-mono">{formatarCNPJ(cliente.cnpj)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Regime Tributário</dt>
              <dd><Badge variant="outline">{regimeLabels[cliente.regime]}</Badge></dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Atividade</dt>
              <dd>{atividadeLabels[cliente.atividade]}</dd>
            </div>
            {cliente.anexo_simples && (
              <div>
                <dt className="text-sm text-muted-foreground">Anexo Simples</dt>
                <dd>{anexoLabels[cliente.anexo_simples]}</dd>
              </div>
            )}
            {cliente.rbt12 && (
              <div>
                <dt className="text-sm text-muted-foreground">RBT12</dt>
                <dd>R$ {Number(cliente.rbt12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</dd>
              </div>
            )}
            {cliente.telefone && (
              <div>
                <dt className="text-sm text-muted-foreground">Telefone</dt>
                <dd>{cliente.telefone}</dd>
              </div>
            )}
            {cliente.email && (
              <div>
                <dt className="text-sm text-muted-foreground">E-mail</dt>
                <dd>{cliente.email}</dd>
              </div>
            )}
            {cliente.observacoes && (
              <div className="md:col-span-2">
                <dt className="text-sm text-muted-foreground">Observações</dt>
                <dd>{cliente.observacoes}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Produtos</CardTitle>
          <Button size="sm" asChild>
            <Link href={`/clientes/${id}/produtos/novo`}>
              <Plus className="mr-2 size-4" />
              Adicionar Produto
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {!produtos || produtos.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              Nenhum produto cadastrado para este cliente.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>NCM</TableHead>
                  <TableHead className="text-right">Custo (R$)</TableHead>
                  <TableHead>Tipo ICMS</TableHead>
                  <TableHead className="text-right">Margem (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell>
                      <Link
                        href={`/produtos/${produto.id}`}
                        className="font-medium hover:underline"
                      >
                        {produto.nome}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{produto.ncm_1}</TableCell>
                    <TableCell className="text-right">
                      {Number(produto.custo_aquisicao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{produto.tipo_icms}</TableCell>
                    <TableCell className="text-right">{Number(produto.margem_desejada).toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
