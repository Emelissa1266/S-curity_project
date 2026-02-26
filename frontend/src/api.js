export const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export function withApiBase(path) {
  if (!API_BASE_URL) return path
  if (path.startsWith('http')) return path
  if (path.startsWith('/')) return `${API_BASE_URL}${path}`
  return `${API_BASE_URL}/${path}`
}

