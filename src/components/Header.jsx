import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Header() {
    const token = localStorage.getItem('token'); //Récupération du token
    const navigate = useNavigate(); //Utiliser pour la redirection de page
    const [menuOpen, setMenuOpen] = useState(false);

    //Déconnexion
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login')
    }

    return ( //Le code se met dedans
        <header className="bg-blue-700 text-white p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">TaskManager</h1>

                {/* Bouton hamburger : visible uniquement sur mobile */}
                <button
                    className="md:hidden p-1"
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Ouvrir le menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Nav desktop : toujours visible à partir de md */}
                <nav className="hidden md:flex items-center">
                    {token && <Link className="mr-4" to="/">Accueil</Link>}
                    {!token && <Link className="mr-4" to="/tasks">Tâches</Link>}
                    {!token && <Link className='mr-4' to="/login">Connexion</Link>}
                    {token && <Link className='mr-4' to="/register">Inscription</Link>}

                    <button className="underline" onClick={handleLogout}>Déconnexion</button>
                </nav>
            </div>

            {/* Nav mobile : repliable, affichée sous le header quand ouverte */}
            {menuOpen && (
                <nav className="md:hidden flex flex-col gap-3 mt-4 pt-4 border-t border-blue-500">
                    {token && <Link onClick={() => setMenuOpen(false)} to="/">Accueil</Link>}
                    {!token && <Link onClick={() => setMenuOpen(false)} to="/tasks">Tâches</Link>}
                    {!token && <Link onClick={() => setMenuOpen(false)} to="/login">Connexion</Link>}
                    {token && <Link onClick={() => setMenuOpen(false)} to="/register">Inscription</Link>}

                    <button className="underline text-left" onClick={() => { setMenuOpen(false); handleLogout(); }}>Déconnexion</button>
                </nav>
            )}
        </header>
    )
}


export default Header;



