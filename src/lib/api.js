const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export async function apiRequest(path, options = {}) {
  const { body, headers = {}, ...rest } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed')
  }

  return payload
}