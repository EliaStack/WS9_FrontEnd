import { del, patch } from '../services/api';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Tag({ tag, tasks, onUpdate, onTaskUpdate }) {
  const [selectedTaskId, setSelectedTaskId] = useState('');

  // Supprimer un tag
  const deleteTag = async () => {
    await del('api/tags/' + tag._id);
    onUpdate();
  };

  // Associer le tag à la tâche sélectionnée
  const associateTag = async () => {
    if (!selectedTaskId) {
      return;
    }
    await patch('api/task/' + selectedTaskId + '/tags/add/' + tag._id, {});
    setSelectedTaskId('');
    onUpdate();
    onTaskUpdate();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-400 dark:border-gray-600 border-l-[6px] border-l-blue-600 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 mb-6 flex flex-col gap-4 relative">
      {/* Colonne gauche */}
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600 text-sm italic text-gray-700 dark:text-gray-300">
          <p className="mb-1">• {tag.name}</p>
          {Array.isArray(tag.comments) &&
            tag.comments.map((c, i) => (
              <p key={`com-${i}`} className="mb-1">
                • {c}
              </p>
            ))}
        </div>
      </div>

      <div className="w-full">
        {/* Colonne centrale : Boutons */}
        <div className="grid grid-cols-2 items-stretch justify-center gap-2 w-full">
          <Link
            className="bg-orange-400 text-black hover:bg-orange-500 px-2 py-2 rounded-lg text-[10px] font-bold uppercase transition w-full shadow-sm text-center"
            to={`/editTag/${tag._id}`}
            state={{ tag: tag }}
          >
            Modifier
          </Link>
          <button
            className="bg-red-500 text-black hover:bg-red-600 px-2 py-2 rounded-lg text-[10px] font-bold uppercase transition w-full shadow-sm"
            onClick={() => deleteTag()}
          >
            Supprimer
          </button>

          {/* Sélecteur de tâche + bouton Associer */}
          <select
            className="col-span-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-2 py-2 text-xs w-full"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            <option value="">-- Choisir une tâche --</option>
            {tasks &&
              tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
          </select>

          <button
            className="col-span-2 bg-violet-600 text-white hover:bg-violet-700 px-2 py-2 rounded-lg text-[10px] font-bold uppercase transition w-full shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => associateTag()}
            disabled={!selectedTaskId}
          >
            Associer
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tag;
