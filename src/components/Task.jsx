import axios from "axios";
import { Link } from "react-router-dom";


function Task({ task, onUpdate }) {
    const token = localStorage.getItem('token');
    //Supprimer une tâche
    const deleteTask = async () => {
        await axios.delete('http://localhost:3000/api/task/' + task._id, {
            headers: { Authorization: 'Bearer ' + token }
        });
        onUpdate();
    };

    //Marquer une tâche comme fini
    const markAsFinished = async () => {

        await axios.patch('http://localhost:3000/api/task/' + task._id, { status: 'done' }, {
            headers: { Authorization: 'Bearer ' + token }
        });
        onUpdate();
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-600 border-l-[6px] border-l-blue-600 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 mb-6 flex flex-col md:flex-row gap-4 md:items-center">

            {/* Colonne gauche */}
            <div className="flex-1 min-w-0">
                {/* ... (En-tête et Titre identiques) ... */}
                <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${task.status === 'done' || task.status === 'closed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : task.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                        {task.status === 'done' || task.status === 'closed' ? 'Terminée' :
                            task.status === 'in_progress' ? 'En cours' :
                                'A faire'}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{task.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{task.description}</p>

                {/* Priorité et Échéance */}
                <div className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase flex flex-col sm:flex-row gap-1 sm:gap-4 mb-4">
                    <p><strong>Priorité :</strong> {task.priority || 'Non définie'}</p>
                    <p><strong>Échéance :</strong> {task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'Aucune'}</p>
                </div>

                {/* Bloc commentaires unifié */}
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600 text-sm italic text-gray-700 dark:text-gray-300">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 not-italic">Commentaires :</p>

                    {/* Affichage des Tags comme des commentaires listés */}

                    {task.tags && task.tags.map((tag, idx) => (
                        <p key={`tag-${idx}`} className="bg-gray-50 dark:bg-gray-700 p-0 rounded-lg border border-gray-100 dark:border-gray-600 text-sm italic text-gray-700 dark:text-gray-300">
                            • {tag.name || 'Nom du tag inconnu'}
                        </p>
                    ))}

                    {/* Affichage des commentaires */}
                    {Array.isArray(task.comments) && task.comments.map((c, i) => (
                        <p key={`com-${i}`} className="mb-1">• {c}</p>
                    ))}
                </div>
            </div>

            {/* Colonne centrale : Boutons */}
            <div className={`grid gap-2 w-full md:grid-cols-1 md:w-auto md:min-w-[120px] ${
                task.status !== 'done' ? 'grid-cols-3' : 'grid-cols-2'
            }`}>
                {task.status !== 'done' && (
                    <button className="bg-green-500 text-black hover:bg-green-600 px-2 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase transition w-full shadow-sm" onClick={() => markAsFinished()}>Terminer</button>
                )}
                <Link className="bg-orange-400 text-black hover:bg-orange-500 px-2 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase transition w-full shadow-sm text-center" to={`/editTask/${task._id}`}>Modifier</Link>
                <button className="bg-red-500 text-black hover:bg-red-600 px-2 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase transition w-full shadow-sm" onClick={() => deleteTask()}>Supprimer</button>
            </div>

            {/* Colonne droite : Responsable */}
            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-300 dark:border-gray-600 pt-4 md:pt-0 md:pl-4 w-full md:w-auto md:min-w-[150px]">
                <div className="flex flex-col text-left md:text-right text-xs w-full">
                    <span className="font-bold text-black dark:text-gray-200 uppercase tracking-wide">Responsable :</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-300 mb-1 md:mb-4">{task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Personne'}</span>
                    {/*<span className="font-bold text-gray-400 uppercase">ID : {task.project || 'N/A'}</span>*/}
                </div>
            </div>
        </div>
    )
}

export default Task;
