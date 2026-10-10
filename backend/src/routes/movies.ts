import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createId, getMovies, type Movie } from '../data/movies.js'

type OwnerRequest = FastifyRequest<{ Headers: { 'x-user-email'?: string } }>

function getOwner(request: OwnerRequest, reply: FastifyReply): string | null {
  const owner = request.headers['x-user-email']?.trim().toLocaleLowerCase('pt-BR')
  if (!owner || !/^\S+@\S+\.\S+$/.test(owner)) {
    reply.code(400).send({ message: 'Informe um e-mail válido no cabeçalho x-user-email.' })
    return null
  }
  return owner
}

function validMovie(value: unknown): value is Omit<Movie, 'id'> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const movie = value as Record<string, unknown>
  let validPosterUrl = false
  if (typeof movie.posterURL === 'string' && movie.posterURL.trim()) {
    try {
      const url = new URL(movie.posterURL)
      validPosterUrl = url.protocol === 'https:' || url.protocol === 'http:'
    } catch {
      /* URL inválida */
    }
  }
  return (
    typeof movie.title === 'string' &&
    movie.title.trim().length > 0 &&
    validPosterUrl &&
    (movie.year === undefined ||
      (typeof movie.year === 'number' &&
        Number.isInteger(movie.year) &&
        movie.year >= 1888 &&
        movie.year <= 2100)) &&
    (movie.overview === undefined || typeof movie.overview === 'string') &&
    (movie.genre === undefined || typeof movie.genre === 'string') &&
    (movie.imdbId === undefined || typeof movie.imdbId === 'string')
  )
}

function findMovieIndex(movies: Movie[], id: string): number {
  if (!/^\d+$/.test(id)) return -1
  const numericId = Number(id)
  if (!Number.isSafeInteger(numericId)) return -1
  return movies.findIndex((movie) => movie.id === numericId)
}

export async function movieRoutes(app: FastifyInstance) {
  app.get<{ Headers: { 'x-user-email'?: string } }>('/', async (request, reply) => {
    const owner = getOwner(request, reply)
    return owner ? getMovies(owner) : reply
  })

  app.get<{ Params: { id: string }; Headers: { 'x-user-email'?: string } }>('/:id', async (request, reply) => {
    const owner = getOwner(request, reply)
    if (!owner) return reply
    const movies = getMovies(owner)
    const index = findMovieIndex(movies, request.params.id)
    if (index < 0) return reply.code(404).send({ message: 'Filme não encontrado.' })
    return movies[index]
  })

  app.post<{ Body: unknown; Headers: { 'x-user-email'?: string } }>('/', async (request, reply) => {
    const owner = getOwner(request, reply)
    if (!owner) return reply
    if (!validMovie(request.body)) {
      return reply
        .code(400)
        .send({ message: 'Título e URL HTTP(S) do pôster são obrigatórios; confira os demais campos.' })
    }
    const movie: Movie = {
      title: request.body.title.trim(),
      posterURL: request.body.posterURL.trim(),
      id: createId(),
      ...(request.body.imdbId !== undefined && { imdbId: request.body.imdbId }),
      ...(request.body.year !== undefined && { year: request.body.year }),
      ...(request.body.overview !== undefined && { overview: request.body.overview }),
      ...(request.body.genre !== undefined && { genre: request.body.genre }),
    }
    getMovies(owner).unshift(movie)
    return reply.code(201).send(movie)
  })

  app.put<{ Params: { id: string }; Body: unknown; Headers: { 'x-user-email'?: string } }>('/:id', async (request, reply) => {
    const owner = getOwner(request, reply)
    if (!owner) return reply
    const movies = getMovies(owner)
    const index = findMovieIndex(movies, request.params.id)
    if (index < 0) return reply.code(404).send({ message: 'Filme não encontrado.' })
    if (!validMovie(request.body)) {
      return reply
        .code(400)
        .send({ message: 'Título e URL HTTP(S) do pôster são obrigatórios; confira os demais campos.' })
    }
    movies[index] = {
      title: request.body.title.trim(),
      posterURL: request.body.posterURL.trim(),
      id: movies[index].id,
      ...(request.body.imdbId !== undefined && { imdbId: request.body.imdbId }),
      ...(request.body.year !== undefined && { year: request.body.year }),
      ...(request.body.overview !== undefined && { overview: request.body.overview }),
      ...(request.body.genre !== undefined && { genre: request.body.genre }),
    }
    return movies[index]
  })

  app.delete<{ Params: { id: string }; Headers: { 'x-user-email'?: string } }>('/:id', async (request, reply) => {
    const owner = getOwner(request, reply)
    if (!owner) return reply
    const movies = getMovies(owner)
    const index = findMovieIndex(movies, request.params.id)
    if (index < 0) return reply.code(404).send({ message: 'Filme não encontrado.' })
    movies.splice(index, 1)
    return reply.code(204).send()
  })
}
