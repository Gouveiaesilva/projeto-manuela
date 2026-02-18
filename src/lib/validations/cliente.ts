import { z } from 'zod'
import { cnpjSchema } from './common'

export const clienteSchema = z.object({
  razao_social: z.string().min(3, 'Mínimo 3 caracteres').max(200),
  nome_fantasia: z.string().max(200).optional().or(z.literal('')),
  cnpj: cnpjSchema,
  regime: z.enum(['simples_nacional', 'lucro_real', 'lucro_presumido'], {
    message: 'Selecione o regime tributário',
  }),
  atividade: z.enum(['industria', 'comercio_revenda', 'comercio_encomenda'], {
    message: 'Selecione a atividade',
  }),
  anexo_simples: z.enum(['anexo_i', 'anexo_ii', 'anexo_iii', 'anexo_iv', 'anexo_v']).optional().or(z.literal('')),
  faixa_faturamento: z.coerce.number().int().min(1).max(6).optional(),
  rbt12: z.coerce.number().positive('RBT12 deve ser positivo').optional(),
  telefone: z.string().max(20).optional().or(z.literal('')),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  observacoes: z.string().max(1000).optional().or(z.literal('')),
})

export type ClienteFormData = z.infer<typeof clienteSchema>
