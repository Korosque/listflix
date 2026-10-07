import type { Movie } from '../types/movie'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function request<T>(path: string, owner: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set('x-user-email', owner)
  if (init?.body !== undefined) headers.set('Content-Type', 'application/json')
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(body?.message || `Erro na API (${response.status}).`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const watchlistApi = {
  list: (owner: string) => request<Movie[]>('/movies', owner),
  get: (id: number, owner: string) => request<Movie>(`/movies/${id}`, owner),
  create: (movie: Omit<Movie, 'id'>, owner: string) => request<Movie>('/movies', owner, { method: 'POST', body: JSON.stringify(movie) }),
  update: (movie: Movie, owner: string) => request<Movie>(`/movies/${movie.id}`, owner, { method: 'PUT', body: JSON.stringify(movie) }),
  remove: (id: number, owner: string) => request<void>(`/movies/${id}`, owner, { method: 'DELETE' }),
}
