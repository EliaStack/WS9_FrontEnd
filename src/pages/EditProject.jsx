import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { get, patch } from "../services/api";


function EditTask() {
    const navigate = useNavigate();
    const location = useLocation();
    const project = location.state?.project //Récupère toutes les infos du projet
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [status, setStatus] = useState('');
    const [owner, setOwner] = useState(`${project.owner.firstName} ${project.owner.lastName}`);
    const [members, setMembers] = useState([]);   // Pour stocker les IDs des membres sélectionnés
    const [projectId, setProjectId] = useState(location.state?.projectId || '');


    const [users, setUsers] = useState([]);       // Pour stocker la liste de tous les utilisateurs du site
    const [searchTerm, setSearchTerm] = useState('');
    //Récupération des users
    useEffect(() => {
        get('api/users/userGet')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
            });
    }, []);

    useEffect(() => {
        get('api/projet/' + project._id)
            .then(response => {
                setTitle(response.data.title);
                setDescription(response.data.description);
                setStartAt(response.data.startAt ? response.data.startAt.split('T')[0] : '');
                setEndAt(response.data.endAt ? response.data.endAt.split('T')[0] : '');
                setStatus(response.data.status);
                //  setOwner(response.data.owner);
                setMembers(response.data.members)

                if (!projectId) {
                    setProjectId(response.data.project?._id || response.data.project);
                }
            });
    }, [project._id])

    const handleSubmit = async (e) => {
        e.preventDefault(); //Evite le rechargement de la page
        try {
            //Appel API
            await patch('api/projet/' + project._id, { title, description, startAt, endAt, status, owner: project.owner, members })
            navigate('/projects', {
                state: {
                    projectId: projectId
                }
            });
        } catch (error) {
            console.error("Erreur modification :", error);
        }

    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 md:px-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 className="bg-blue-700 text-white text-xl font-semibold px-4 py-2 rounded mb-2 text-center">
                    Modifier un projet
                </h2>

                <div className="flex flex-col gap-1">
                    <label for="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Titre du projet :</label>
                    <input placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 w-full" id="title"/>
                </div>

                <div className="flex flex-col gap-1">
                    <label for="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description du projet :</label>
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 w-full min-h-[90px]" id="description"></textarea>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col gap-1 flex-1">
                        <label for="datestart" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Date de création :</label>
                        <input type="date" value={startAt} onChange={(e) => setStartAt(e.target.value)} className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 w-full" id="datestart"/>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <label for="dateend" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Date d'échéance :</label>
                        <input type="date" value={endAt} onChange={(e) => setEndAt(e.target.value)} className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 w-full" id="dateend"/>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col gap-1 flex-1">
                        <label for="status" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status :</label>
                        <select
                            value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 w-full" id="status">
                            <option value="actif">Actif</option>
                            <option value="archivé">Archivé</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <label for="createur" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Créateur :</label>
                        <input readOnly placeholder="Créateur du projet" value={owner} className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-gray-100 dark:bg-gray-600 dark:text-gray-300" id="createur"/>
                    </div>
                </div>

                <label className="block font-medium mb-1">Membres du projet :</label>
                {/* Affichage des membres : nom/prénom à gauche et petite croix bleue cliquable tout à droite */}
                <div className="flex flex-col gap-2 mb-3">
                    {members.map(memberId => {
                        const userObj = users.find(u => u._id === memberId);
                        if (!userObj) return null;
                        const lastName = (userObj.LastName || userObj.lastName || '').toUpperCase();

                        return (
            <div key={memberId} className="max-w-md bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm px-4 py-2.5 rounded-xl flex justify-between items-center shadow-sm">
                                {/* Nom, prénom et email à gauche */}
                                <div className="flex flex-col">
                                    <span className="font-semibold">
                                        {lastName} {userObj.firstName}
                                    </span>
                                    <span className="text-gray-400 text-xs">
                                        {userObj.email}
                                    </span>
                                </div>

                                {/* Petite croix bleue tout à droite (via un div pour échapper au style global des boutons) */}
                                <div
                                    onClick={() => setMembers(members.filter(id => id !== memberId))}
                                    className="bg-blue-600 hover:bg-blue-700 text-w cursor-pointer w-7 h-7 rounded-full flex items-center justify-center transition shadow-sm shrink-0"
                                    title="Supprimer"
                                >
                                    <svg className="w-3.5 h-3.5 text-white pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Input de recherche et suggestions */}
                <div className="relative mb-2">
                    <input
                        type="text"
                        placeholder="Rechercher un membre (prénom ou nom)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                const filtered = users.filter(user => {
                                    if (!searchTerm.trim()) return false;
                                    const search = searchTerm.toLowerCase();
                                    const firstName = user.firstName?.toLowerCase() || '';
                                    // Sécurité pour gérer à la fois 'LastName' et 'lastName'
                                    const lastName = (user.LastName || user.lastName)?.toLowerCase() || '';
                                    return (firstName.includes(search) || lastName.includes(search)) && !members.includes(user._id);
                                });
                                if (filtered.length > 0) {
                                    setMembers([...members, filtered[0]._id]);
                                    setSearchTerm('');
                                }
                            }
                        }}
                        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                    />

                    {/* Liste déroulante des suggestions filtrées */}
                    {searchTerm.trim() !== '' && (
                        <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
                            {users
                                .filter(user => {
                                    const search = searchTerm.toLowerCase();
                                    const firstName = user.firstName?.toLowerCase() || '';
                                    const lastName = (user.LastName || user.lastName)?.toLowerCase() || '';
                                    return (firstName.includes(search) || lastName.includes(search)) && !members.includes(user._id);
                                })
                                .map(user => (
                                    <li
                                        key={user._id}
                                        onClick={() => {
                                            setMembers([...members, user._id]);
                                            setSearchTerm('');
                                        }}
                                        className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer text-sm flex justify-between items-center border-b dark:border-gray-600 last:border-b-0"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium dark:text-gray-100">{user.firstName} {user.LastName || user.lastName}</span>
                                            <span className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</span>
                                        </div>
                                        <span className="text-blue-500 text-xs font-bold">+ Ajouter</span>
                                    </li>
                                ))}

                            {/* Message si aucun utilisateur ne correspond */}
                            {users.filter(user => {
                                const search = searchTerm.toLowerCase();
                                const firstName = user.firstName?.toLowerCase() || '';
                                const lastName = (user.LastName || user.lastName)?.toLowerCase() || '';
                                return (firstName.includes(search) || lastName.includes(search)) && !members.includes(user._id);
                            }).length === 0 && (
                                    <li className="px-3 py-3 text-gray-500 dark:text-gray-400 text-sm italic text-center bg-gray-50 dark:bg-gray-700">
                                        Aucun utilisateur trouvé pour "{searchTerm}"
                                    </li>
                                )}
                        </ul>
                    )}
                </div>
                <small className="text-gray-500 dark:text-gray-400 block mb-2">Tapez un nom, puis cliquez dessus ou appuyez sur Entrée pour l'ajouter.</small>
                <br></br>

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


export default EditTask;
