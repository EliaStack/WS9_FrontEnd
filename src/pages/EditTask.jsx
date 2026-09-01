import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { get, patch } from '../services/api';

function EditTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const [projectId, setProjectId] = useState(location.state?.projectId || '');

  useEffect(() => {
    get('api/task/' + id).then((response) => {
      setTitle(response.data.title);
      setDescription(response.data.description);
      setDueAt(response.data.dueAt ? response.data.dueAt.split('T')[0] : '');
      setPriority(response.data.priority);
      setStatus(response.data.status);
      setComment(response.data.comment);

      if (!projectId) {
        setProjectId(response.data.project?._id || response.data.project);
      }
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); //Evite le rechargement de la page
    try {
      //Appel API
      await patch('api/task/' + id, {
        title,
        description,
        dueAt,
        priority,
        status,
        comment,
      });
      navigate('/tasks', {
        state: {
          projectId: projectId,
        },
      });
    } catch (error) {
      console.error('Erreur modification :', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:px-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="bg-blue-700 text-white text-xl font-semibold px-4 py-2 rounded mb-2 text-center">
          Modifier la tâche : {title}{' '}
        </h2>

        <div className="flex flex-col gap-1">
          <label
            for="titre"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Titre de la tâche :
          </label>
          <input
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 w-full"
            id="titre"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            for="description"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Description de la tâche :
          </label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 w-full min-h-[90px]"
            id="description"
          ></textarea>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <label
              for="dateend"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Date d'échéance :
            </label>
            <input
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 w-full"
              id="dateend"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label
              for="priority"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Priorité de la tâche :
            </label>
            <select
              placeholder="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 w-full"
              id="priority"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            for="status"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Status :
          </label>
          <select
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 w-full"
            id="status"
          >
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            id="comment"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Commentaires :
          </label>
          <textarea
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 w-full min-h-[90px]"
            id="comment"
          ></textarea>
        </div>

        <button className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-lg font-semibold transition shadow-sm w-full">
          Modifier
        </button>
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
  );
}

export default EditTask;
