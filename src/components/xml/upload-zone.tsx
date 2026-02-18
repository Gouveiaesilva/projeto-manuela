'use client'

import { useCallback, useState } from 'react'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAnaliseStore } from '@/stores/analise-store'

export function UploadZone() {
  const { setArquivo, processando, erro } = useAnaliseStore()
  const [dragActive, setDragActive] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.xml')) {
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      return
    }
    await setArquivo(file)
  }, [setArquivo])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragActive(false)
  }, [])

  const handleClick = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xml'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleFile(file)
    }
    input.click()
  }, [handleFile])

  return (
    <div className="space-y-4">
      <Card
        className={`cursor-pointer border-2 border-dashed transition-all ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
        } ${processando ? 'pointer-events-none opacity-60' : ''}`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="flex flex-col items-center justify-center py-16">
          {processando ? (
            <>
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <FileText className="size-8 animate-pulse text-primary" />
              </div>
              <p className="text-lg font-semibold">Processando XML...</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Lendo e extraindo dados da NF-e
              </p>
            </>
          ) : (
            <>
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Upload className="size-8 text-primary" />
              </div>
              <p className="text-lg font-semibold">Arraste o XML da NF-e aqui</p>
              <p className="mt-1 text-sm text-muted-foreground">
                ou clique para selecionar o arquivo
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Aceita arquivos .xml de NF-e (até 5MB)
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {erro && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive">Erro ao processar XML</p>
            <p className="mt-1 text-sm text-muted-foreground">{erro}</p>
          </div>
        </div>
      )}
    </div>
  )
}
