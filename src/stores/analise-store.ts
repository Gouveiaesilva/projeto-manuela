'use client'

import { create } from 'zustand'
import type { NFeParseada, AnaliseConfig, AnaliseXML } from '@/lib/xml/types'
import { parseNFeXML, extractNFeData, analisarNFe } from '@/lib/xml'

type Etapa = 'upload' | 'config' | 'resultado'

interface AnaliseState {
  // Etapa atual do fluxo
  etapa: Etapa

  // Upload
  arquivo: File | null
  xmlString: string | null

  // Parse
  nfe: NFeParseada | null

  // Config
  config: AnaliseConfig

  // Resultado
  analise: AnaliseXML | null

  // Estado
  processando: boolean
  erro: string | null

  // Actions
  setArquivo: (arquivo: File) => Promise<void>
  setConfig: (config: Partial<AnaliseConfig>) => void
  analisar: () => void
  reanalisar: () => void
  voltarParaConfig: () => void
  resetar: () => void
}

const defaultConfig: AnaliseConfig = {
  rbt12: 360000,
  anexo: 'anexo_i',
  margemDesejada: 20,
}

export const useAnaliseStore = create<AnaliseState>((set, get) => ({
  etapa: 'upload',
  arquivo: null,
  xmlString: null,
  nfe: null,
  config: { ...defaultConfig },
  analise: null,
  processando: false,
  erro: null,

  setArquivo: async (arquivo: File) => {
    set({ processando: true, erro: null, arquivo })

    try {
      const xmlString = await arquivo.text()

      // Parse XML → NFeParseada
      const raw = parseNFeXML(xmlString)
      const nfe = extractNFeData(raw)

      set({
        xmlString,
        nfe,
        processando: false,
        etapa: 'config',
      })
    } catch (error) {
      set({
        processando: false,
        erro: error instanceof Error ? error.message : 'Erro ao processar XML',
        arquivo: null,
        xmlString: null,
        nfe: null,
      })
    }
  },

  setConfig: (partial) => {
    const config = { ...get().config, ...partial }
    set({ config })
  },

  analisar: () => {
    const { nfe, config } = get()
    if (!nfe) return

    set({ processando: true, erro: null })

    try {
      const analise = analisarNFe(nfe, config)
      set({
        analise,
        processando: false,
        etapa: 'resultado',
      })
    } catch (error) {
      set({
        processando: false,
        erro: error instanceof Error ? error.message : 'Erro na análise',
      })
    }
  },

  reanalisar: () => {
    set({ etapa: 'config', analise: null })
  },

  voltarParaConfig: () => {
    set({ etapa: 'config', analise: null })
  },

  resetar: () => {
    set({
      etapa: 'upload',
      arquivo: null,
      xmlString: null,
      nfe: null,
      config: { ...defaultConfig },
      analise: null,
      processando: false,
      erro: null,
    })
  },
}))
