import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { get, patch } from '../services/api';

function EditTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const tag = location.state?.tag;

  const { id } = useParams();
  const [name, setName] = useState(tag?.name || '');
  const [projectId, setProjectId] = useState(tag?.project._id || '');
  const projectTitle = tag.project.title;

  useEffect(() => {
    get('/api/tags/' + id).then((response) => {
      setName(response.data.name);
      setProjectId(response.data.project);
      if (!projectId) {
        setProjectId(response.data.project?._id || response.data.project);
      }
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); //Evite le rechargement de la page
    try {
      //Appel API
      await patch('api/tags/' + id, { name, project: projectId });
      navigate('/tasks', {
        state: {
          projectId: tag?.project?._id || tag?.project || projectId,
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
          Modifier le tag : {name}{' '}
        </h2>

        <div className="flex flex-col gap-1">
          <label
            for="titre"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Titre du tag :
          </label>
          <input
            placeholder="Titre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 w-full"
            id="titre"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            for="project"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Projet :
          </label>
          <input
            readOnly
            value={projectTitle}
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-gray-100 dark:bg-gray-600 dark:text-gray-300"
            id="project"
          />
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
