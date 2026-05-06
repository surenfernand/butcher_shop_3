export const normalizePostalCode = (value?: string | null): string => {
  return (value || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export const getPostalPrefix = (value?: string | null): string => {
  return normalizePostalCode(value).slice(0, 3)
}
