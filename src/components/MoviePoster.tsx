import { useEffect, useState } from 'react'
import { Clapperboard } from 'lucide-react'

interface MoviePosterProps { title: string; src: string; imdbId?: string; className: string; loading?: 'lazy' | 'eager' }

export function MoviePoster({ title, src, imdbId, className, loading = 'lazy' }: MoviePosterProps) {
  const [attempt, setAttempt] = useState(0)
  // A API de exemplo fornece o pôster de Up em um host que bloqueia hotlink.
  const primary = title.trim().toLowerCase() === 'up'
    ? 'https://image.tmdb.org/t/p/w500/mFvoEwSfLqbcWwFsDjQebn9bzFe.jpg'
    : src
  const candidates = [primary, ...(imdbId ? [`https://images.metahub.space/poster/medium/${imdbId}/img`] : [])]
  const image = candidates[attempt]

  useEffect(() => setAttempt(0), [src, imdbId, title])

  if (!image) return <div className={`${className} poster-fallback`} role="img" aria-label={`Pôster indisponível: ${title}`}><Clapperboard size={25}/><span>{title}</span></div>
  return <img className={className} src={image} alt={`Pôster de ${title}`} loading={loading} onError={() => setAttempt((current) => current + 1)}/>
}
