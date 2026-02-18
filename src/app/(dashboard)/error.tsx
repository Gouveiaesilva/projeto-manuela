'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center py-20">
      <Card className="max-w-md">
        <CardContent className="pt-6 text-center">
          <AlertTriangle className="mx-auto mb-4 size-12 text-destructive" />
          <h2 className="text-lg font-semibold">Algo deu errado</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {error.message || 'Ocorreu um erro inesperado.'}
          </p>
          <Button onClick={reset} className="mt-4">
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
