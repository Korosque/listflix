import type { Movie } from '../types/movie'

const sources = [
  { endpoint: 'animation', label: 'Animação' },
  { endpoint: 'action-adventure', label: 'Ação e aventura' },
  { endpoint: 'comedy', label: 'Comédia' },
  { endpoint: 'drama', label: 'Drama' },
  { endpoint: 'horror', label: 'Terror' },
  { endpoint: 'family', label: 'Família' },
]

interface GhibliFilm { title: string; image: string; description: string; release_date: string }

function stableId(title: string): number {
  return Array.from(title.toLocaleLowerCase('pt-BR')).reduce((hash, character) => ((hash * 31) + character.codePointAt(0)!) >>> 0, 7)
}

function hasUsablePoster(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && !/(^|\.)example\.com$/i.test(parsed.hostname) && !/placeholder|no[-_]?image/i.test(url)
  } catch {
    return false
  }
}

function isValidImdbId(id?: string): id is string {
  return Boolean(id && /^tt\d{7,}$/.test(id))
}

function imdbPoster(id: string): string {
  return `https://images.metahub.space/poster/medium/${id}/img`
}

export async function fetchMovies(): Promise<Movie[]> {
  const [ghibliResponse, ...results] = await Promise.all([
    fetch('https://ghibliapi.vercel.app/films').then(async (response) => {
      if (!response.ok) throw new Error('Não foi possível carregar as animações agora.')
      return response.json() as Promise<GhibliFilm[]>
    }),
    ...sources.map(async ({ endpoint, label }) => {
    const response = await fetch(`https://api.sampleapis.com/movies/${endpoint}`)
    if (!response.ok) throw new Error('Não foi possível carregar o catálogo agora.')
    const movies = await response.json() as Movie[]
      return movies
        .filter((movie) => movie.title && (hasUsablePoster(movie.posterURL) || isValidImdbId(movie.imdbId)) && !/^(test|sample|am updated)\b/i.test(movie.title))
        .map((movie) => ({
          ...movie,
          id: stableId(movie.title),
          posterURL: hasUsablePoster(movie.posterURL) ? movie.posterURL : imdbPoster(movie.imdbId!),
          genre: label,
        }))
    }),
  ])

  const animation: Movie[] = ghibliResponse
    .filter((film) => film.title && hasUsablePoster(film.image))
    .map((film) => ({
      id: stableId(film.title),
      title: film.title,
      posterURL: film.image,
      year: Number(film.release_date) || undefined,
      overview: film.description,
      genre: 'Animação',
    }))

  const unique = new Map<string, Movie>()
  const allMovies = [...animation, ...results.flat()]
  allMovies.forEach((movie) => {
    const titleKey = movie.title.trim().toLocaleLowerCase('pt-BR')
    if (titleKey && !unique.has(titleKey)) unique.set(titleKey, movie)
  })
  return [...unique.values()]
}
