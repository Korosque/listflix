export interface Movie {
  id: number
  title: string
  posterURL: string
  imdbId?: string
  year?: number
  overview?: string
  genre?: string
}

const moviesByOwner = new Map<string, Movie[]>()
let nextId = 1

export function getMovies(owner: string): Movie[] {
  let movies = moviesByOwner.get(owner)
  if (!movies) {
    movies = []
    moviesByOwner.set(owner, movies)
  }
  return movies
}

export function createId(): number {
  return nextId++
}
