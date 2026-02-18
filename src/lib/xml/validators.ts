import { z } from 'zod'

export const analiseConfigSchema = z.object({
  rbt12: z.number().min(0, 'Receita bruta deve ser maior ou igual a zero').max(4800000, 'Limite do Simples Nacional é R$ 4.800.000,00'),
  anexo: z.enum(['anexo_i', 'anexo_ii', 'anexo_iii', 'anexo_iv', 'anexo_v'], {
    message: 'Selecione o anexo do Simples Nacional',
  }),
  margemDesejada: z.number().min(0, 'Margem deve ser positiva').max(99, 'Margem não pode ser 100% ou mais'),
})

export const uploadSchema = z.object({
  arquivo: z
    .instanceof(File)
    .refine((f) => f.size <= 5 * 1024 * 1024, 'Arquivo deve ter no máximo 5MB')
    .refine((f) => f.name.endsWith('.xml'), 'Arquivo deve ser XML'),
})

export type AnaliseConfigForm = z.infer<typeof analiseConfigSchema>
export type UploadForm = z.infer<typeof uploadSchema>
