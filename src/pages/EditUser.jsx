import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { get, patch } from "../services/api";


function EditUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    const { id } = useParams();
    const { token } = useAuth();
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [password, setPassword] = useState(user?.password || '');

    const [userId, setUserId] = useState(user?._id || '');

    useEffect(() => {
        get('api/users/userId/' + id)
            .then(response => {
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
            });
    }, [id])


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await patch('api/users/userModify/' + id, { firstName, lastName, password });

            const updatedUser = { ...user, firstName, lastName };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            navigate('/projects', { state: { userId } });
        } catch (error) {
            console.error("Erreur modification :", error);
        }
    };
    return (
        <div className="max-w-2xl mx-auto px-4 py-6 md:px-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 className="bg-blue-700 text-white text-xl font-semibold px-4 py-2 rounded mb-2 text-center">Modifier l'utilisateur : {firstName} {lastName} </h2>

                <div className="flex flex-col gap-1">
                    <label for="firstname" className="text-sm font-semibold text-gray-700">Nom :</label>
                    <input placeholder="FirstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" id="firstname"/>
                </div>
                <div className="flex flex-col gap-1">
                    <label for="lastname" className="text-sm font-semibold text-gray-700">Prénom :</label>
                    <input placeholder="LastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" id="lastname"/>
                </div>
                <div className="flex flex-col gap-1">
                    <label for="password" className="text-sm font-semibold text-gray-700">Mot de passe :</label>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" id="password"/>
                </div>


                <button className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-lg font-semibold transition shadow-sm w-full">Modifier</button>
            </form>
            <div className="flex justify-center mt-4">
                <Link
                    to="/projects"
                    className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition shadow-sm w-full sm:w-auto text-center"
                >
                    ← Retour aux projets
                </Link>
            </div>
        </div>

    )
};


export default EditUser;
