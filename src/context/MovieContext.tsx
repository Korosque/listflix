import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Movie } from '../types/movie'
import { fetchMovies } from '../services/movies'
interface User { name: string; email: string }
interface MovieContextValue { movies: Movie[]; saved: Movie[]; user: User | null; query: string; setQuery: (value: string) => void; loading: boolean; error: string; toggleSaved: (movie: Movie) => void; login: (email: string, password: string) => boolean; signOut: () => void; retry: () => void }
const Context = createContext<MovieContextValue | null>(null)
export function MovieProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [saved, setSaved] = useState<Movie[]>(() => JSON.parse(localStorage.getItem('listflix-saved') || '[]') as Movie[])
  const [user, setUser] = useState<User | null>(() => JSON.parse(localStorage.getItem('listflix-user') || 'null') as User | null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => { let alive = true; setLoading(true); setError(''); fetchMovies().then((items) => { if (alive) setMovies(items) }).catch(() => { if (alive) setError('Não conseguimos carregar o catálogo. Verifique sua conexão e tente novamente.') }).finally(() => { if (alive) setLoading(false) }); return () => { alive = false } }, [attempt])
  useEffect(() => { localStorage.setItem('listflix-saved', JSON.stringify(saved)) }, [saved])
  const toggleSaved = (movie: Movie) => setSaved((current) => current.some((item) => item.id === movie.id) ? current.filter((item) => item.id !== movie.id) : [movie, ...current])
  const login = (email: string, password: string) => { if (!email.includes('@') || password.length < 4) return false; const next = { name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()), email }; setUser(next); localStorage.setItem('listflix-user', JSON.stringify(next)); return true }
  const signOut = () => { localStorage.removeItem('listflix-user'); setUser(null) }
  const value = useMemo(() => ({ movies, saved, user, query, setQuery, loading, error, toggleSaved, login, signOut, retry: () => setAttempt((n) => n + 1) }), [movies, saved, user, query, loading, error])
  return <Context.Provider value={value}>{children}</Context.Provider>
}
export function useMovies() { const value = useContext(Context); if (!value) throw new Error('useMovies deve ser usado dentro de MovieProvider'); return value }
