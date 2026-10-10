import { BookmarkPlus, Check, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Movie } from '../types/movie'
import { MoviePoster } from './MoviePoster'

interface PosterCardProps {
  movie: Movie
  saved: boolean
  onToggle: (movie: Movie) => void
}

export function PosterCard({ movie, saved, onToggle }: PosterCardProps) {
  return (
    <article className="movie-card">
      <Link className="poster-link" to={`/filme/${movie.id}`} state={{ movie }}>
        <MoviePoster
          className="poster"
          src={movie.posterURL}
          title={movie.title}
          imdbId={movie.imdbId}
        />
        <span className="rating">
          <Star size={12} fill="currentColor" /> 8.4
        </span>
      </Link>
      <div className="card-info">
        <Link className="movie-title" to={`/filme/${movie.id}`} state={{ movie }}>
          {movie.title}
        </Link>
        <span className="movie-year">
          {movie.year || 'Clássico'} · {movie.genre || 'Filme'}
        </span>
        <button
          className={`save-button ${saved ? 'is-saved' : ''}`}
          onClick={() => onToggle(movie)}
          aria-label={saved ? 'Remover da lista' : 'Adicionar à lista'}
        >
          {saved ? (
            <Check size={15} />
          ) : (
            <BookmarkPlus size={15} />
          )}
          {saved ? 'Na sua lista' : 'Quero assistir'}
        </button>
      </div>
    </article>
  )
}
