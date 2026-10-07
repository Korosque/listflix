import { useState, type FormEvent } from 'react'
import { ArrowRight, BookmarkPlus, Heart, Pencil, RotateCcw, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PosterCard } from '../components/PosterCard'
import { useMovies } from '../context/MovieContext'
import { watchlistApi } from '../services/watchlist'
import type { Movie } from '../types/movie'

const blank = { title: '', posterURL: '', year: '', genre: '', overview: '' }
export function Watchlist() {
 const { saved, savedLoading, savedError, refreshSaved, addSaved, updateSaved, removeSaved, user } = useMovies()
 const [form, setForm] = useState(blank)
 const [editing, setEditing] = useState<number | null>(null)
 const [saving, setSaving] = useState(false)
 const [loadingEdit, setLoadingEdit] = useState(false)
 const [feedback, setFeedback] = useState('')
 async function edit(movie: Movie) {
  if (!user) return
  setLoadingEdit(true); setFeedback('')
  try {
   const current = await watchlistApi.get(movie.id, user.email)
   setEditing(current.id)
   setForm({ title: current.title, posterURL: current.posterURL, year: current.year ? String(current.year) : '', genre: current.genre || '', overview: current.overview || '' })
   window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) { setFeedback(error instanceof Error ? error.message : 'Não foi possível carregar este filme para edição.') }
  finally { setLoadingEdit(false) }
 }
 function reset() { setEditing(null); setForm(blank); setFeedback('') }
 async function submit(event: FormEvent) {
  event.preventDefault(); setSaving(true); setFeedback('')
  const movie = { title: form.title.trim(), posterURL: form.posterURL.trim(), year: form.year ? Number(form.year) : undefined, genre: form.genre.trim() || undefined, overview: form.overview.trim() || undefined }
  try {
   if (editing === null) await addSaved(movie as Omit<Movie, 'id'>)
   else await updateSaved({ ...movie, id: editing } as Movie)
   reset(); setFeedback(editing === null ? 'Filme cadastrado na lista.' : 'Filme atualizado.')
  } catch (error) { setFeedback(error instanceof Error ? error.message : 'Não foi possível salvar o filme.') }
  finally { setSaving(false) }
 }
 async function remove(id: number) {
  if (!window.confirm('Remover este filme da sua lista?')) return
  try { await removeSaved(id); setFeedback('Filme removido.') } catch (error) { setFeedback(error instanceof Error ? error.message : 'Não foi possível remover o filme.') }
 }
 return <div className="page-content inner-page"><div className="page-heading"><div><span className="eyebrow"><Heart size={14}/> SUA PRÓXIMA MARATONA</span><h1>Minha lista<span className="green-dot">.</span></h1><p>Os filmes que já têm lugar marcado na sua próxima sessão.</p></div><span className="catalog-total">{saved.length} SALVOS</span></div>
  <form className="movie-form" onSubmit={submit}><div className="form-heading"><div><strong>{editing === null ? 'Adicionar filme' : 'Editar filme'}</strong><span> Seus títulos ficam disponíveis enquanto o servidor estiver ligado.</span></div>{editing !== null && <button type="button" className="secondary-button" onClick={reset}><X size={14}/> Cancelar edição</button>}</div>
   <div className="movie-form-fields"><label>Título<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nome do filme"/></label><label>URL do pôster<input required type="url" value={form.posterURL} onChange={(e) => setForm({ ...form, posterURL: e.target.value })} placeholder="https://..."/></label><label>Ano<input type="number" min="1888" max="2100" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2026"/></label><label>Gênero<input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} placeholder="Drama"/></label><label className="wide-field">Sinopse<input value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} placeholder="Uma breve descrição (opcional)"/></label></div>
   <div className="movie-form-actions"><button className="primary-button" disabled={saving}>{saving ? 'Salvando…' : editing === null ? <><BookmarkPlus size={15}/> Cadastrar filme</> : <><Pencil size={15}/> Salvar edição</>}</button>{feedback && <span role="status">{feedback}</span>}</div>
  </form>
  {savedLoading ? <div className="state-card"><span className="loader"/><h3>Carregando sua lista</h3><p>Consultando o servidor ListFlix...</p></div> : savedError ? <div className="state-card error-state"><h3>Sua lista está indisponível.</h3><p>{savedError}</p><button className="secondary-button" onClick={() => void refreshSaved()}><RotateCcw size={15}/> Tentar novamente</button></div> : saved.length ? <><div className="list-summary"><span><Heart size={15}/> {saved.length} {saved.length === 1 ? 'filme guardado' : 'filmes guardados'}</span><span><Trash2 size={14}/> Remova ou edite seus filmes</span></div><div className="movie-grid catalog-grid">{saved.map((movie) => <div className="watchlist-card" key={movie.id}><PosterCard movie={movie} saved onToggle={() => void remove(movie.id)}/><button className="watch-edit" disabled={loadingEdit} onClick={() => void edit(movie)}>{loadingEdit ? 'Carregando…' : <><Pencil size={13}/> Editar</>}</button></div>)}</div></> : <div className="empty-list"><span className="empty-icon"><BookmarkPlus size={24}/></span><span className="eyebrow">SUA PRÓXIMA DESCOBERTA ESTÁ ESPERANDO</span><h2>Uma lista em branco<br/>é só o começo<span className="green-dot">.</span></h2><p>Explore o catálogo e guarde os filmes que quer assistir. Eles ficam todos aqui, esperando a hora certa.</p><Link className="primary-button" to="/catalogo">Explorar catálogo <ArrowRight size={16}/></Link></div>}</div>
}
