import type { TabelaAnexo } from './tipos'

// ============================================
// Tabelas do Simples Nacional - LC 123/2006
// Valores em percentual (%) e R$
// ============================================

export const ANEXO_I: TabelaAnexo = {
  nome: 'Anexo I',
  descricao: 'Comércio',
  faixas: [
    {
      faixa: 1,
      rbt12Min: 0,
      rbt12Max: 180000,
      aliquotaNominal: 4.00,
      parcelaDeduzir: 0,
      distribuicao: { irpj: 5.50, csll: 3.50, cofins: 12.74, pis: 2.76, cpp: 41.50, icms: 34.00 },
    },
    {
      faixa: 2,
      rbt12Min: 180000.01,
      rbt12Max: 360000,
      aliquotaNominal: 7.30,
      parcelaDeduzir: 5940,
      distribuicao: { irpj: 5.50, csll: 3.50, cofins: 12.74, pis: 2.76, cpp: 41.50, icms: 34.00 },
    },
    {
      faixa: 3,
      rbt12Min: 360000.01,
      rbt12Max: 720000,
      aliquotaNominal: 9.50,
      parcelaDeduzir: 13860,
      distribuicao: { irpj: 5.50, csll: 3.50, cofins: 12.74, pis: 2.76, cpp: 41.50, icms: 33.50 },
    },
    {
      faixa: 4,
      rbt12Min: 720000.01,
      rbt12Max: 1800000,
      aliquotaNominal: 10.70,
      parcelaDeduzir: 22500,
      distribuicao: { irpj: 5.50, csll: 3.50, cofins: 12.74, pis: 2.76, cpp: 41.50, icms: 33.50 },
    },
    {
      faixa: 5,
      rbt12Min: 1800000.01,
      rbt12Max: 3600000,
      aliquotaNominal: 14.30,
      parcelaDeduzir: 87300,
      distribuicao: { irpj: 5.50, csll: 3.50, cofins: 12.74, pis: 2.76, cpp: 41.50, icms: 33.50 },
    },
    {
      faixa: 6,
      rbt12Min: 3600000.01,
      rbt12Max: 4800000,
      aliquotaNominal: 19.00,
      parcelaDeduzir: 378000,
      distribuicao: { irpj: 13.50, csll: 10.00, cofins: 28.27, pis: 6.13, cpp: 42.10, icms: 0 },
    },
  ],
}

export const ANEXO_II: TabelaAnexo = {
  nome: 'Anexo II',
  descricao: 'Indústria',
  faixas: [
    {
      faixa: 1,
      rbt12Min: 0,
      rbt12Max: 180000,
      aliquotaNominal: 4.50,
      parcelaDeduzir: 0,
      distribuicao: { irpj: 5.50, csll: 3.50, cofins: 12.74, pis: 2.76, cpp: 41.50, icms: 34.00 },
    },
    {
      faixa: 2,
      rbt12Min: 180000.01,
      rbt12Max: 360000,
      aliquotaNominal: 7.80,
      parcelaDeduzir: 5940,
      distribuicao: { irpj: 5.50, csll: 3.50, cofins: 12.74, pis: 2.76, cpp: 41.50, icms: 34.00 },
    },
    {
      faixa: 3,
      rbt12Min: 360000.01,
      rbt12Max: 720000,
      aliquotaNominal: 10.00,
      parcelaDeduzir: 13860,
      distribuicao: { irpj: 5.50, csll: 3.50, cofins: 12.74, pis: 2.76, cpp: 41.50, icms: 33.50 },
    },
    {
      faixa: 4,
      rbt12Min: 720000.01,
      rbt12Max: 1800000,
      aliquotaNominal: 11.20,
      parcelaDeduzir: 22500,
      distribuicao: { irpj: 5.50, csll: 3.50, cofins: 12.74, pis: 2.76, cpp: 41.50, icms: 33.50 },
    },
    {
      faixa: 5,
      rbt12Min: 1800000.01,
      rbt12Max: 3600000,
      aliquotaNominal: 14.70,
      parcelaDeduzir: 85500,
      distribuicao: { irpj: 5.50, csll: 3.50, cofins: 12.74, pis: 2.76, cpp: 41.50, icms: 33.50 },
    },
    {
      faixa: 6,
      rbt12Min: 3600000.01,
      rbt12Max: 4800000,
      aliquotaNominal: 30.00,
      parcelaDeduzir: 720000,
      distribuicao: { irpj: 13.50, csll: 10.00, cofins: 28.27, pis: 6.13, cpp: 42.10, icms: 0 },
    },
  ],
}

export const ANEXO_III: TabelaAnexo = {
  nome: 'Anexo III',
  descricao: 'Serviços (receitas de locação de bens móveis, agências de viagem, escritórios de contabilidade, etc.)',
  faixas: [
    {
      faixa: 1,
      rbt12Min: 0,
      rbt12Max: 180000,
      aliquotaNominal: 6.00,
      parcelaDeduzir: 0,
      distribuicao: { irpj: 4.00, csll: 3.50, cofins: 12.82, pis: 2.78, cpp: 43.40, icms: 33.50 },
    },
    {
      faixa: 2,
      rbt12Min: 180000.01,
      rbt12Max: 360000,
      aliquotaNominal: 11.20,
      parcelaDeduzir: 9360,
      distribuicao: { irpj: 4.00, csll: 3.50, cofins: 14.05, pis: 3.05, cpp: 43.40, icms: 32.00 },
    },
    {
      faixa: 3,
      rbt12Min: 360000.01,
      rbt12Max: 720000,
      aliquotaNominal: 13.50,
      parcelaDeduzir: 17640,
      distribuicao: { irpj: 4.00, csll: 3.50, cofins: 13.64, pis: 2.96, cpp: 43.40, icms: 32.50 },
    },
    {
      faixa: 4,
      rbt12Min: 720000.01,
      rbt12Max: 1800000,
      aliquotaNominal: 16.00,
      parcelaDeduzir: 35640,
      distribuicao: { irpj: 4.00, csll: 3.50, cofins: 13.64, pis: 2.96, cpp: 43.40, icms: 32.50 },
    },
    {
      faixa: 5,
      rbt12Min: 1800000.01,
      rbt12Max: 3600000,
      aliquotaNominal: 21.00,
      parcelaDeduzir: 125640,
      distribuicao: { irpj: 4.00, csll: 3.50, cofins: 12.82, pis: 2.78, cpp: 43.40, icms: 33.50 },
    },
    {
      faixa: 6,
      rbt12Min: 3600000.01,
      rbt12Max: 4800000,
      aliquotaNominal: 33.00,
      parcelaDeduzir: 648000,
      distribuicao: { irpj: 35.00, csll: 15.00, cofins: 16.03, pis: 3.47, cpp: 30.50, icms: 0 },
    },
  ],
}

export const ANEXO_IV: TabelaAnexo = {
  nome: 'Anexo IV',
  descricao: 'Serviços (construção civil, vigilância, limpeza, obras, etc.)',
  faixas: [
    {
      faixa: 1,
      rbt12Min: 0,
      rbt12Max: 180000,
      aliquotaNominal: 4.50,
      parcelaDeduzir: 0,
      distribuicao: { irpj: 18.80, csll: 15.20, cofins: 17.67, pis: 3.83, cpp: 44.50, icms: 0 },
    },
    {
      faixa: 2,
      rbt12Min: 180000.01,
      rbt12Max: 360000,
      aliquotaNominal: 9.00,
      parcelaDeduzir: 8100,
      distribuicao: { irpj: 19.80, csll: 15.20, cofins: 20.55, pis: 4.45, cpp: 40.00, icms: 0 },
    },
    {
      faixa: 3,
      rbt12Min: 360000.01,
      rbt12Max: 720000,
      aliquotaNominal: 10.20,
      parcelaDeduzir: 12420,
      distribuicao: { irpj: 20.80, csll: 15.20, cofins: 19.73, pis: 4.27, cpp: 40.00, icms: 0 },
    },
    {
      faixa: 4,
      rbt12Min: 720000.01,
      rbt12Max: 1800000,
      aliquotaNominal: 14.00,
      parcelaDeduzir: 39780,
      distribuicao: { irpj: 17.80, csll: 19.20, cofins: 18.90, pis: 4.10, cpp: 40.00, icms: 0 },
    },
    {
      faixa: 5,
      rbt12Min: 1800000.01,
      rbt12Max: 3600000,
      aliquotaNominal: 22.00,
      parcelaDeduzir: 183780,
      distribuicao: { irpj: 18.80, csll: 19.20, cofins: 18.08, pis: 3.92, cpp: 40.00, icms: 0 },
    },
    {
      faixa: 6,
      rbt12Min: 3600000.01,
      rbt12Max: 4800000,
      aliquotaNominal: 33.00,
      parcelaDeduzir: 828000,
      distribuicao: { irpj: 53.50, csll: 21.50, cofins: 20.55, pis: 4.45, cpp: 0, icms: 0 },
    },
  ],
}

export const ANEXO_V: TabelaAnexo = {
  nome: 'Anexo V',
  descricao: 'Serviços (auditoria, tecnologia, publicidade, engenharia, etc.)',
  faixas: [
    {
      faixa: 1,
      rbt12Min: 0,
      rbt12Max: 180000,
      aliquotaNominal: 15.50,
      parcelaDeduzir: 0,
      distribuicao: { irpj: 14.00, csll: 12.00, cofins: 28.85, pis: 6.25, cpp: 38.90, icms: 0 },
    },
    {
      faixa: 2,
      rbt12Min: 180000.01,
      rbt12Max: 360000,
      aliquotaNominal: 18.00,
      parcelaDeduzir: 4500,
      distribuicao: { irpj: 14.00, csll: 12.00, cofins: 27.85, pis: 6.05, cpp: 40.10, icms: 0 },
    },
    {
      faixa: 3,
      rbt12Min: 360000.01,
      rbt12Max: 720000,
      aliquotaNominal: 19.50,
      parcelaDeduzir: 9900,
      distribuicao: { irpj: 14.00, csll: 12.00, cofins: 23.85, pis: 5.15, cpp: 45.00, icms: 0 },
    },
    {
      faixa: 4,
      rbt12Min: 720000.01,
      rbt12Max: 1800000,
      aliquotaNominal: 20.50,
      parcelaDeduzir: 17100,
      distribuicao: { irpj: 14.00, csll: 12.00, cofins: 23.85, pis: 5.15, cpp: 45.00, icms: 0 },
    },
    {
      faixa: 5,
      rbt12Min: 1800000.01,
      rbt12Max: 3600000,
      aliquotaNominal: 23.00,
      parcelaDeduzir: 62100,
      distribuicao: { irpj: 14.00, csll: 12.00, cofins: 23.85, pis: 5.15, cpp: 45.00, icms: 0 },
    },
    {
      faixa: 6,
      rbt12Min: 3600000.01,
      rbt12Max: 4800000,
      aliquotaNominal: 30.50,
      parcelaDeduzir: 540000,
      distribuicao: { irpj: 16.00, csll: 12.00, cofins: 35.00, pis: 7.00, cpp: 30.00, icms: 0 },
    },
  ],
}

// Mapa de anexos por chave
export const ANEXOS: Record<string, TabelaAnexo> = {
  anexo_i: ANEXO_I,
  anexo_ii: ANEXO_II,
  anexo_iii: ANEXO_III,
  anexo_iv: ANEXO_IV,
  anexo_v: ANEXO_V,
}
