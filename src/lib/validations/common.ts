import { z } from 'zod'

/**
 * Valida dígitos verificadores do CNPJ.
 */
export function validarCNPJ(cnpj: string): boolean {
  const numeros = cnpj.replace(/\D/g, '')
  if (numeros.length !== 14) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numeros)) return false

  // Calcula primeiro dígito verificador
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let soma = 0
  for (let i = 0; i < 12; i++) {
    soma += parseInt(numeros[i]) * pesos1[i]
  }
  let resto = soma % 11
  const digito1 = resto < 2 ? 0 : 11 - resto

  if (parseInt(numeros[12]) !== digito1) return false

  // Calcula segundo dígito verificador
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  soma = 0
  for (let i = 0; i < 13; i++) {
    soma += parseInt(numeros[i]) * pesos2[i]
  }
  resto = soma % 11
  const digito2 = resto < 2 ? 0 : 11 - resto

  return parseInt(numeros[13]) === digito2
}

/**
 * Formata CNPJ para exibição: XX.XXX.XXX/XXXX-XX
 */
export function formatarCNPJ(cnpj: string): string {
  const numeros = cnpj.replace(/\D/g, '')
  return numeros.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}

export const cnpjSchema = z
  .string()
  .transform(val => val.replace(/\D/g, ''))
  .pipe(
    z
      .string()
      .length(14, 'CNPJ deve ter 14 dígitos')
      .refine(validarCNPJ, 'CNPJ inválido')
  )

export const ncmSchema = z
  .string()
  .regex(/^\d{8}$/, 'NCM deve ter exatamente 8 dígitos numéricos')
