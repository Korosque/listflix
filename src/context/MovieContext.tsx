import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Movie } from '../types/movie'
import { fetchMovies } from '../services/movies'
import { watchlistApi } from '../services/watchlist'

interface User {
  name: string
  email: string
}

interface MovieContextValue {
  movies: Movie[]
  saved: Movie[]
  savedLoading: boolean
  savedError: string
  savedActionError: string
  refreshSaved: () => Promise<boolean>
  addSaved: (movie: Omit<Movie, 'id'>) => Promise<void>
  updateSaved: (movie: Movie) => Promise<void>
  removeSaved: (id: number) => Promise<void>
  user: User | null
  query: string
  setQuery: (value: string) => void
  loading: boolean
  error: string
  toggleSaved: (movie: Movie) => void
  login: (email: string, password: string) => boolean
  signOut: () => void
  retry: () => void
}

const Context = createContext<MovieContextValue | null>(null)

export function MovieProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [saved, setSaved] = useState<Movie[]>([])
  const [savedLoading, setSavedLoading] = useState(true)
  const [savedError, setSavedError] = useState('')
  const [savedActionError, setSavedActionError] = useState('')
  const [user, setUser] = useState<User | null>(
    () => JSON.parse(localStorage.getItem('listflix-user') || 'null') as User | null,
  )
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError('')
    fetchMovies()
      .then((items) => {
        if (alive) setMovies(items)
      })
      .catch(() => {
        if (alive) {
          setError('Não conseguimos carregar o catálogo. Verifique sua conexão e tente novamente.')
        }
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => { alive = false }
  }, [attempt])

  const refreshSaved = async (): Promise<boolean> => {
    if (!user) {
      setSaved([])
      setSavedError('')
      setSavedLoading(false)
      return true
    }
    setSavedLoading(true)
    setSavedError('')
    try {
      setSaved(await watchlistApi.list(user.email))
      return true
    } catch (error) {
      setSavedError(error instanceof Error ? error.message : 'Não foi possível carregar sua lista.')
      return false
    } finally {
      setSavedLoading(false)
    }
  }

  useEffect(() => { void refreshSaved() }, [user?.email])

  const refreshAfterWrite = async (message: string) => {
    if (!(await refreshSaved())) throw new Error(message)
  }

  const addSaved = async (movie: Omit<Movie, 'id'>) => {
    setSavedActionError('')
    if (!user) throw new Error('Entre novamente para alterar sua lista.')
    await watchlistApi.create(movie, user.email)
    await refreshAfterWrite(
      'Filme cadastrado, mas não foi possível atualizar a lista. Tente recarregar.',
    )
  }

  const updateSaved = async (movie: Movie) => {
    setSavedActionError('')
    if (!user) throw new Error('Entre novamente para alterar sua lista.')
    await watchlistApi.update(movie, user.email)
    await refreshAfterWrite(
      'Filme atualizado, mas não foi possível atualizar a lista. Tente recarregar.',
    )
  }

  const removeSaved = async (id: number) => {
    setSavedActionError('')
    if (!user) throw new Error('Entre novamente para alterar sua lista.')
    await watchlistApi.remove(id, user.email)
    await refreshAfterWrite(
      'Filme removido, mas não foi possível atualizar a lista. Tente recarregar.',
    )
  }

  const toggleSaved = (movie: Movie) => {
    const existing = saved.find(
      (item) =>
        item.id === movie.id ||
        item.title.trim().toLocaleLowerCase('pt-BR') ===
          movie.title.trim().toLocaleLowerCase('pt-BR'),
    )
    setSavedActionError('')
    void (existing ? removeSaved(existing.id) : addSaved(movie)).catch(
      (error: unknown) => {
        setSavedActionError(
          error instanceof Error ? error.message : 'Não foi possível alterar sua lista.',
        )
      },
    )
  }

  const login = (email: string, password: string) => {
    if (!email.includes('@') || password.length < 4) return false
    const next = {
      name: email
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
      email,
    }
    setUser(next)
    localStorage.setItem('listflix-user', JSON.stringify(next))
    return true
  }

  const signOut = () => {
    localStorage.removeItem('listflix-user')
    setUser(null)
    setSaved([])
    setSavedActionError('')
  }

  const value = useMemo(
    () => ({
      movies,
      saved,
      savedLoading,
      savedError,
      savedActionError,
      refreshSaved,
      addSaved,
      updateSaved,
      removeSaved,
      user,
      query,
      setQuery,
      loading,
      error,
      toggleSaved,
      login,
      signOut,
      retry: () => setAttempt((n) => n + 1),
    }),
    [movies, saved, savedLoading, savedError, savedActionError, user, query, loading, error],
  )
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useMovies() {
  const value = useContext(Context)
  if (!value) throw new Error('useMovies deve ser usado dentro de MovieProvider')
  return value
}
