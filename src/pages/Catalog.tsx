import { Clapperboard, RotateCcw, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PosterCard } from '../components/PosterCard'
import { useMovies } from '../context/MovieContext'
const filters = ['Todos', 'Animação', 'Ação e aventura', 'Comédia', 'Drama', 'Terror', 'Família']
export function Catalog() {
  const { movies, saved, toggleSaved, query, loading, error, retry } = useMovies()
  const [filter, setFilter] = useState('Todos')
  const filtered = useMemo(() => movies.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()) && (filter === 'Todos' || movie.genre === filter)), [movies, query, filter])
  return <div className="page-content inner-page"><div className="page-heading"><div><span className="eyebrow"><Clapperboard size={14}/> CURADORIA LISTFLIX</span><h1>Catálogo de filmes<span className="green-dot">.</span></h1><p>Encontre seu próximo favorito. Cada história merece uma chance.</p></div><span className="catalog-total">{movies.length} FILMES</span></div><div className="filter-row"><div className="filter-tabs">{filters.map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><span className="filter-count">{filtered.length} resultados</span></div>{loading ? <div className="state-card"><span className="loader"/><h3>Preparando a sessão</h3><p>Buscando títulos para você...</p></div> : error ? <div className="state-card error-state"><h3>O catálogo está descansando.</h3><p>{error}</p><button className="secondary-button" onClick={retry}><RotateCcw size={15}/> Tentar novamente</button></div> : filtered.length ? <div className="movie-grid catalog-grid">{filtered.map((movie) => <PosterCard key={movie.id} movie={movie} saved={saved.some((item) => item.id === movie.id)} onToggle={toggleSaved}/>)}</div> : <div className="state-card"><Search size={24}/><h3>Nenhum filme encontrado</h3><p>Tente outro título ou escolha um filtro diferente.</p></div>}</div>
}
