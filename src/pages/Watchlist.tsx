import { ArrowRight, BookmarkPlus, Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PosterCard } from '../components/PosterCard'
import { useMovies } from '../context/MovieContext'
export function Watchlist() {
 const { saved, toggleSaved } = useMovies()
 return <div className="page-content inner-page"><div className="page-heading"><div><span className="eyebrow"><Heart size={14}/> SUA PRÓXIMA MARATONA</span><h1>Minha lista<span className="green-dot">.</span></h1><p>Os filmes que já têm lugar marcado na sua próxima sessão.</p></div><span className="catalog-total">{saved.length} SALVOS</span></div>{saved.length ? <><div className="list-summary"><span><Heart size={15}/> {saved.length} {saved.length === 1 ? 'filme guardado' : 'filmes guardados'}</span><span><Trash2 size={14}/> Toque em “Na sua lista” para remover</span></div><div className="movie-grid catalog-grid">{saved.map((movie) => <PosterCard key={movie.id} movie={movie} saved onToggle={toggleSaved}/>)}</div></> : <div className="empty-list"><span className="empty-icon"><BookmarkPlus size={24}/></span><span className="eyebrow">SUA PRÓXIMA DESCOBERTA ESTÁ ESPERANDO</span><h2>Uma lista em branco<br/>é só o começo<span className="green-dot">.</span></h2><p>Explore o catálogo e guarde os filmes que quer assistir. Eles ficam todos aqui, esperando a hora certa.</p><Link className="primary-button" to="/catalogo">Explorar catálogo <ArrowRight size={16}/></Link></div>}</div>
}
