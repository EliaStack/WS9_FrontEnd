import axios from "axios";
import { Link } from "react-router-dom";


function Project({ project, onUpdate }) {
    const token = localStorage.getItem('token');

    const deleteProject = async () => {
        await axios.delete('http://localhost:3000/api/projet/' + project._id, {
            headers: { Authorization: 'Bearer ' + token }
        });
        onUpdate();
    };

    const markAsFinished = async () => {
        await axios.patch('http://localhost:3000/api/projet/' + project._id, { status: 'archivé' }, {
            headers: { Authorization: 'Bearer ' + token }
        });
        onUpdate();
    }

    return (
        <div key={project._id} className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-600 border-l-[6px] border-l-blue-600 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 mb-6 flex flex-col md:flex-row gap-4 md:items-center">

            {/* Colonne gauche */}
            <Link to="/tasks" state={{ projectId: project._id, projectTitle: project.title }} className="flex-1 block hover:bg-gray-100/50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors cursor-pointer min-w-0">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${project.status?.trim().toLowerCase() === 'actif'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                        {project.status}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{project.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{project.description}</p>

                <div className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                    Démarré le : {project.startAt ? new Date(project.startAt).toLocaleDateString() : 'Non défini'}
                </div>

                <div className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                    Fin le : {project.endAt ? new Date(project.endAt).toLocaleDateString() : 'Non défini'}
                </div>
            </Link>

            {/* Colonne centrale : boutons */}
            <div className={`grid gap-2 w-full md:grid-cols-1 md:w-auto md:min-w-[120px] ${
                project.status !== 'archivé' ? 'grid-cols-3' : 'grid-cols-2'
            }`}>
                {project.status !== 'archivé' && (
                    <button
                        className="bg-green-500 text-black hover:bg-green-600 px-2 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase transition w-full shadow-sm"
                        onClick={(e) => { e.stopPropagation(); markAsFinished(); }}
                    >
                        Terminer
                    </button>
                )}
                <Link
                    className="bg-orange-400 text-black hover:bg-orange-500 px-2 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase transition w-full shadow-sm text-center"
                    to={`/editProject/${project._id}`}
                    state={{ project: project }}
                >
                    Modifier
                </Link>
                <button
                    className="bg-red-500 text-black hover:bg-red-600 px-2 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase transition w-full shadow-sm"
                    onClick={(e) => { e.stopPropagation(); deleteProject(); }}
                >
                    Supprimer
                </button>
            </div>

            {/* Colonne droite : Responsables */}
            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-300 dark:border-gray-600 pt-4 md:pt-0 md:pl-4 w-full md:min-w-[150px] md:w-auto">
                <div className="flex flex-col text-left md:text-right w-full">
                    <span className="text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wide">Responsable :</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                        {project.owner ? `${project.owner.firstName} ${project.owner.lastName}` : 'Non assigné'}
                    </span>
                    <span className="text-xs font-bold text-black dark:text-gray-200 uppercase tracking-wide">Membres :</span>
                    <div className="flex flex-col">
                        {project.members && project.members.length > 0
                            ? project.members.map((m, index) => (
                                <span key={index} className="text-sm font-semibold text-gray-800 dark:text-gray-300">
                                    {m.firstName} {m.lastName}
                                </span>
                            ))
                            : <span className="text-sm font-semibold text-gray-800 dark:text-gray-300 italic">Personne</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Project;