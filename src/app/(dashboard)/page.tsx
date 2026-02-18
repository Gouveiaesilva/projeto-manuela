import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileUp, ArrowRight, History, Calculator } from 'lucide-react'
import { formatCurrency, formatNumber, formatCNPJ } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()

  let user = null
  let totalClientes = 0
  let totalAnalises = 0
  let totalCalculos = 0
  let margemMedia: number | null = null
  let ultimasAnalises: {
    id: string
    emit_razao_social: string
    emit_cnpj: string
    numero_nfe: number
    valor_nf: number
    margem_media: number | null
    total_produtos: number
    created_at: string
  }[] = []

  try {
    const { data: { user: u } } = await supabase.auth.getUser()
    user = u

    const [
      { count: tc },
      { count: ta },
      { count: tcalc },
      { data: analises },
      { data: margemData },
    ] = await Promise.all([
      supabase.from('clientes').select('*', { count: 'exact', head: true }),
      supabase.from('analises').select('*', { count: 'exact', head: true }),
      supabase.from('calculos').select('*', { count: 'exact', head: true }),
      supabase
        .from('analises')
        .select('id, emit_razao_social, emit_cnpj, numero_nfe, valor_nf, margem_media, total_produtos, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('analises').select('margem_media'),
    ])

    totalClientes = tc ?? 0
    totalAnalises = ta ?? 0
    totalCalculos = tcalc ?? 0

    margemMedia = margemData && margemData.length > 0
      ? margemData.reduce((sum, c) => sum + Number(c.margem_media || 0), 0) / margemData.length
      : null

    ultimasAnalises = (analises || []).map(a => ({
      ...a,
      valor_nf: Number(a.valor_nf),
      margem_media: a.margem_media ? Number(a.margem_media) : null,
    }))
  } catch {
    // Supabase não configurado
  }

  const isEmpty = totalAnalises === 0 && totalClientes === 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {user?.email ? `Bem-vindo, ${user.email}` : 'Visão geral do sistema'}
        </p>
      </div>

      {/* CTA de upload proeminente */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <FileUp className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Analisar NF-e</h2>
              <p className="text-sm text-muted-foreground">
                Faça upload de um XML para análise tributária automática
              </p>
            </div>
          </div>
          <Button asChild size="lg">
            <Link href="/analise-xml">
              Iniciar Análise <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <StatsCards
        totalClientes={totalClientes}
        totalAnalises={totalAnalises}
        totalCalculos={totalCalculos}
        margemMedia={margemMedia}
      />

      {isEmpty ? (
        <Card>
          <CardContent className="py-12">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <FileUp className="size-8 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Comece agora</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Faça upload do seu primeiro XML de NF-e para gerar uma análise
                tributária completa com insights e recomendações.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button asChild>
                  <Link href="/analise-xml">
                    <FileUp className="mr-2 size-4" /> Análise XML
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/calculadora">
                    <Calculator className="mr-2 size-4" /> Calculadora
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="size-4" />
                Últimas Análises
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/analises">Ver todas <ArrowRight className="ml-1 size-3" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ultimasAnalises.map((a) => (
                <Link
                  key={a.id}
                  href={`/analise-xml/${a.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{a.emit_razao_social}</p>
                    <p className="text-xs text-muted-foreground">
                      NF {a.numero_nfe} | {formatCNPJ(a.emit_cnpj)} | {a.total_produtos} produto(s)
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-3 text-right">
                    <div>
                      <p className="text-sm font-medium">{formatCurrency(a.valor_nf)}</p>
                      {a.margem_media !== null && (
                        <Badge variant={a.margem_media >= 10 ? 'default' : a.margem_media >= 0 ? 'secondary' : 'destructive'} className="text-xs">
                          {formatNumber(a.margem_media)}%
                        </Badge>
                      )}
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
