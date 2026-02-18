import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileUp, ArrowRight, History } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatNumber, formatCNPJ } from '@/lib/utils'

export default async function AnalisesPage() {
  let analises: {
    id: string
    emit_razao_social: string
    emit_cnpj: string
    numero_nfe: number
    valor_nf: number
    margem_media: number | null
    carga_media_percentual: number | null
    total_produtos: number
    produtos_lucrativos: number
    produtos_deficitarios: number
    created_at: string
  }[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('analises')
      .select('id, emit_razao_social, emit_cnpj, numero_nfe, valor_nf, margem_media, carga_media_percentual, total_produtos, produtos_lucrativos, produtos_deficitarios, created_at')
      .order('created_at', { ascending: false })

    analises = (data || []).map(a => ({
      ...a,
      valor_nf: Number(a.valor_nf),
      margem_media: a.margem_media ? Number(a.margem_media) : null,
      carga_media_percentual: a.carga_media_percentual ? Number(a.carga_media_percentual) : null,
    }))
  } catch {
    // Supabase não configurado
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Histórico de Análises</h1>
          <p className="text-muted-foreground">Todas as análises de NF-e realizadas</p>
        </div>
        <Button asChild>
          <Link href="/analise-xml">
            <FileUp className="mr-2 size-4" /> Nova Análise
          </Link>
        </Button>
      </div>

      {analises.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <History className="size-8 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Nenhuma análise ainda</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Faça upload de um XML de NF-e para começar.
              </p>
              <Button asChild className="mt-4">
                <Link href="/analise-xml">
                  <FileUp className="mr-2 size-4" /> Iniciar Análise
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {analises.map((a) => (
            <Link
              key={a.id}
              href={`/analise-xml/${a.id}`}
              className="block"
            >
              <Card className="transition-all hover:border-primary/30 hover:shadow-md">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-lg font-semibold">{a.emit_razao_social}</p>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          NF {a.numero_nfe}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatCNPJ(a.emit_cnpj)} | {a.total_produtos} produto(s) |{' '}
                        <span className="text-emerald-600">{a.produtos_lucrativos} lucr.</span>
                        {a.produtos_deficitarios > 0 && (
                          <> | <span className="text-red-600">{a.produtos_deficitarios} def.</span></>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(a.valor_nf)}</p>
                        <div className="flex gap-2">
                          {a.carga_media_percentual !== null && (
                            <span className="text-xs text-muted-foreground">
                              Carga: {formatNumber(a.carga_media_percentual)}%
                            </span>
                          )}
                          {a.margem_media !== null && (
                            <Badge
                              variant={a.margem_media >= 10 ? 'default' : a.margem_media >= 0 ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              Margem: {formatNumber(a.margem_media)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="size-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
