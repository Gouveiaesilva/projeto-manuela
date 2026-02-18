import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { formatarCNPJ } from '@/lib/validations/common'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

const regimeLabels: Record<string, string> = {
  simples_nacional: 'Simples Nacional',
  lucro_real: 'Lucro Real',
  lucro_presumido: 'Lucro Presumido',
}

const atividadeLabels: Record<string, string> = {
  industria: 'Indústria',
  comercio_revenda: 'Revenda',
  comercio_encomenda: 'Encomenda',
}

export default async function ClientesPage() {
  const supabase = await createClient()

  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('*')
    .order('razao_social')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes e empresas
          </p>
        </div>
        <Button asChild>
          <Link href="/clientes/novo">
            <Plus className="mr-2 size-4" />
            Novo Cliente
          </Link>
        </Button>
      </div>

      {!clientes || clientes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4">Nenhum cliente cadastrado</p>
          <Button asChild>
            <Link href="/clientes/novo">
              <Plus className="mr-2 size-4" />
              Cadastrar primeiro cliente
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Razão Social</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Regime</TableHead>
                <TableHead>Atividade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>
                    <Link
                      href={`/clientes/${cliente.id}`}
                      className="font-medium hover:underline"
                    >
                      {cliente.razao_social}
                    </Link>
                    {cliente.nome_fantasia && (
                      <p className="text-sm text-muted-foreground">
                        {cliente.nome_fantasia}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatarCNPJ(cliente.cnpj)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {regimeLabels[cliente.regime] || cliente.regime}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {atividadeLabels[cliente.atividade] || cliente.atividade}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
