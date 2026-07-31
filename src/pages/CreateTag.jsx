import { useState } from "react";
import axios from 'axios';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { post } from "../services/api";
import { useEffect } from "react";



function CreateTag() {
    const navigate = useNavigate();
    const location = useLocation();
    const projectTitle = location.state?.projectTitle;
    const projectId = location.state?.projectId;


    const [name, setTitle] = useState('');
    const [project, setProject] = useState(projectId);


    const handleSubmit = async (e) => {
        e.preventDefault(); //Evite le rechargement de la page
        //Appel API

        if (name.length <= 3) {
            setError("Veuillez mettre au minimum trois caractères");
            return;
        }


        await post('api/tags/tagCreate', { name, project })
        navigate('/projects', {
            state: {
                projectId: projectId
            }
        });
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 md:px-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 className="bg-blue-700 text-white text-xl font-semibold px-4 py-2 rounded mb-2 text-center">Créer un commentaire</h2>

                <div className="flex flex-col gap-1">
                    <label for="titre" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Titre :</label>
                    <input placeholder="Titre" value={name} onChange={(e) => setTitle(e.target.value)} className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 w-full" id="titre"/>
                </div>

                <div className="flex flex-col gap-1">
                    <label for="project" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Projet concerné :</label>
                    <input readOnly placeholder="Projet concerné" value={projectTitle} className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-gray-100 dark:bg-gray-600 dark:text-gray-300" id="project"/>
                </div>

                <button className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-lg font-semibold transition shadow-sm w-full">Créer</button>
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

export default CreateTag;