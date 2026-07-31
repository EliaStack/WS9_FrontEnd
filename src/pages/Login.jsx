import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { post } from "../services/api";


function Login() {

    const { setToken } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false); //Gestion des erreurs
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
            if (err.status == 400)
                setError(true);
        }

        //navigate('/login') //Redirection vers la page login
    }

    {/* Gestion des erreurs */ }
    let errorMsg = '';
    if (error)
        errorMsg = (<p className="error-form">Identifiants invalides</p>);
    else
        errorMsg = '';


    // Partie HTML React
    return (
        <form onSubmit={handlesubmit}>
            <h2>Connexion</h2>

            <label for="email" className="text-sm font-semibold text-gray-700">Status :</label>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} id="email"/>

            <label for="password" className="text-sm font-semibold text-gray-700">Status :</label>
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} id="password"/>

            <button>Se connecter</button>

            {/* Gestion des erreurs */}
            {errorMsg}
            {error && <p className="error-form">Identifiants invalides</p>}
        </form>
    )
};

export default Login;