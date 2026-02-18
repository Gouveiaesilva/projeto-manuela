'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Building2, ArrowRight, ArrowLeft, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useAnaliseStore } from '@/stores/analise-store'
import { formatCNPJ } from '@/lib/utils'

const ANEXOS = [
  { value: 'anexo_i', label: 'Anexo I — Comércio' },
  { value: 'anexo_ii', label: 'Anexo II — Indústria' },
  { value: 'anexo_iii', label: 'Anexo III — Serviços (locação, faturamento)' },
  { value: 'anexo_iv', label: 'Anexo IV — Serviços (construção, advocacia)' },
  { value: 'anexo_v', label: 'Anexo V — Serviços (tecnologia, engenharia)' },
]

export function ConfigForm() {
  const { nfe, config, setConfig, analisar, resetar, processando } = useAnaliseStore()

  if (!nfe) return null

  const regimeLabel = nfe.emitente.crt === 1 || nfe.emitente.crt === 2
    ? 'Simples Nacional'
    : nfe.emitente.crt === 3
      ? 'Lucro Real / Presumido'
      : 'Não identificado'

  return (
    <div className="space-y-6">
      {/* Info do emitente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="size-4" />
            Emitente Identificado
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/clientes/novo?cnpj=${nfe.emitente.cnpj}&razao=${encodeURIComponent(nfe.emitente.razaoSocial)}&fantasia=${encodeURIComponent(nfe.emitente.nomeFantasia || '')}&crt=${nfe.emitente.crt}`}>
              <UserPlus className="mr-1.5 size-3.5" />
              Criar Cliente
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Razão Social</p>
              <p className="font-medium">{nfe.emitente.razaoSocial}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CNPJ</p>
              <p className="font-medium">{formatCNPJ(nfe.emitente.cnpj)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Regime Tributário</p>
              <p className="font-medium">{regimeLabel}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">UF</p>
              <p className="font-medium">{nfe.emitente.uf || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">NF-e</p>
              <p className="font-medium">Nº {nfe.numero} | Série {nfe.serie}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Itens</p>
              <p className="font-medium">{nfe.itens.length} produto(s)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuração da análise */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Parâmetros da Análise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="rbt12">Receita Bruta 12 meses (R$)</Label>
              <Input
                id="rbt12"
                type="number"
                value={config.rbt12}
                onChange={(e) => setConfig({ rbt12: Number(e.target.value) })}
                min={0}
                max={4800000}
                step={10000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anexo">Anexo Simples Nacional</Label>
              <Select
                value={config.anexo}
                onValueChange={(val) => setConfig({ anexo: val })}
              >
                <SelectTrigger id="anexo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ANEXOS.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="margem">Margem Desejada (%)</Label>
              <Input
                id="margem"
                type="number"
                value={config.margemDesejada}
                onChange={(e) => setConfig({ margemDesejada: Number(e.target.value) })}
                min={0}
                max={99}
                step={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={resetar}>
          <ArrowLeft className="mr-2 size-4" />
          Novo XML
        </Button>
        <Button onClick={analisar} disabled={processando}>
          {processando ? 'Analisando...' : 'Analisar NF-e'}
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  )
}
