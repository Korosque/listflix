import { Clapperboard, Compass, Film, Heart, LogOut, Search } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useMovies } from '../context/MovieContext'

export function Layout() {
  const { user, signOut, query, setQuery, saved, savedActionError } = useMovies()
  const navigate = useNavigate()
  return <div className="app-shell">
    <header className="topbar">
      <NavLink to="/inicio" className="brand"><span className="brand-icon"><Clapperboard size={19}/></span>list<span>flix</span></NavLink>
      <nav className="main-nav"><NavLink to="/inicio"><Compass size={16}/> Início</NavLink><NavLink to="/catalogo"><Film size={16}/> Catálogo</NavLink><NavLink to="/minha-lista"><Heart size={16}/> Minha lista <span className="nav-count">{saved.length}</span></NavLink></nav>
      <label className="search-box"><Search size={16}/><input placeholder="Buscar um filme..." value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => navigate('/catalogo')} aria-label="Buscar filmes"/><kbd>⌘ K</kbd></label>
      <div className="user-menu"><span className="avatar">{user?.name.slice(0, 1).toUpperCase()}</span><span className="user-name">{user?.name}</span><button className="icon-button" onClick={signOut} aria-label="Sair"><LogOut size={16}/></button></div>
    </header>
    {savedActionError && <div className="api-action-error" role="alert">{savedActionError}</div>}
    <main><Outlet/></main>
    <footer className="footer"><span>LISTFLIX</span><span>Menos tempo procurando. Mais tempo assistindo.</span><span>Feito para quem ama cinema <span className="heart">♥</span></span></footer>
  </div>
}
