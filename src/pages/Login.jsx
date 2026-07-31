import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { post } from "../services/api";


function Login() {

    const { setToken } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); //Gestion des erreurs
    const navigate = useNavigate(); //Utiliser pour la redirection de page

    const handlesubmit = async (e) => {
        e.preventDefault(); //Evite le rechargement de la page
        //Appel API
        try {
            const result = await post('api/users/login', { email, password }) //Mettre url de l'api et les données à soumettres
            setToken(result.data.token); //Pour stocker une donnée
            //On récupère le token et le user connecté
            setToken(result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user));

            navigate('/projects');
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Email ou mot de passe incorrect.');
            } else {
                setError('Une erreur est survenue, veuillez réessayer.');
            }
        }

        //navigate('/login') //Redirection vers la page login
    }

    // Partie HTML React
    return (
        <form onSubmit={handlesubmit}>
            <h2>Connexion</h2>

            <label for="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status :</label>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} id="email"/>

            <label for="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status :</label>
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} id="password"/>

            <button>Se connecter</button>

            {/* Gestion des erreurs */}
            {error && <p className="error-form">{error}</p>}
        </form>
    )
};

export default Login;