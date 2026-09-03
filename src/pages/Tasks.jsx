import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Task from '../components/Task';
import { get } from '../services/api';
import { useLocation } from 'react-router-dom';
//import Tags from "../pages/Tags";
import Tag from '../components/Tag';

function Tasks() {
  // 1. Déclaration unique des états
  const location = useLocation();
  // On extrait le projectId envoyé via le state du Link
  const projectId = location.state?.projectId;
  const projectTitle = location.state?.projectTitle;
  //const assigneeId = location.state?.assigneeId;
  //const assigneeName = location.state?.assigneeName;

  const user = JSON.parse(localStorage.getItem('user'));
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const [tags, setTags] = useState([]);
  const [tagsPagination, setTagsPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');

  const fetchTasks = async (page = 1) => {
    try {
      // Vérification de sécurité : si on n'a pas de projectId, on arrête
      if (!projectId) {
        console.error('Aucun projectId trouvé dans le state.');
        return;
      }
      const params = new URLSearchParams({ page });
      if (statusFilter) params.set('status', statusFilter);
      if (priorityFilter) params.set('priority', priorityFilter);
      if (sortBy) {
        params.set('sortBy', sortBy);
        params.set('order', order);
      }
      // On utilise ici la variable projectId récupérée
      const result = await get(
        `/api/task/taskUser/${projectId}?${params.toString()}`,
      );
      setTasks(result.data.tasks);
      setPagination(result.data.pagination);
    } catch (error) {
      console.error('Erreur lors de la récupération :', error);
    }
  };

  const fetchTags = async (page = 1) => {
    try {
      // Vérification de sécurité : si on n'a pas de projectId, on arrête
      if (!projectId) {
        console.error('Aucun projectId trouvé dans le state.');
        return;
      }
      // On récupére les commentaires relatif au projet
      const result = await get(`/api/tags/${projectId}?page=${page}`);
      setTags(result.data.tags);
      setTagsPagination(result.data.pagination);
    } catch (error) {
      console.error('Erreur lors de la récupération :', error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
      fetchTags();
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchTasks(1);
    }
  }, [statusFilter, priorityFilter, sortBy, order]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/*TASKS*/}
        <div className="flex-1 min-w-0">
          <div className="pb-6 lg:pb-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-gray-300 dark:border-gray-700">
            <h2>Mes Tâches :</h2>
            <Link
              className="inline-block mb-4 text-blue-600 underline"
              to="/createTask"
              state={{
                projectId: projectId,
                projectTitle: projectTitle,
                assigneeId: user._id,
                assigneeName: `${user.firstName} ${user.lastName}`,
              }}
            >
              + Nouvelle tâche
            </Link>

            {/*FILTRES ET TRI*/}
            <div className="flex flex-wrap gap-2 mb-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 text-sm"
              >
                <option value="">Tous les statuts</option>
                <option value="open">Open</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 text-sm"
              >
                <option value="">Toutes les priorités</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 text-sm"
              >
                <option value="">Sans tri</option>
                <option value="dueAt">Trier par échéance</option>
                <option value="priority">Trier par priorité</option>
              </select>

              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                disabled={!sortBy}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 text-sm disabled:opacity-50"
              >
                <option value="asc">Croissant</option>
                <option value="desc">Décroissant</option>
              </select>
            </div>

            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                onUpdate={() => fetchTasks(pagination.page)}
              />
            ))}
          </div>

          {/*PAGINATION TASKS*/}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={pagination.page === 1}
              onClick={() => fetchTasks(pagination.page - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Précédent
            </button>

            <span>
              Page {pagination.page} sur {pagination.totalPages}
            </span>

            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => fetchTasks(pagination.page + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Suivant
            </button>
          </div>
        </div>

        {/*TAGS*/}
        <div className="w-full lg:w-[400px] lg:pl-6">
          <div>
            <h2>Commentaire du projet :</h2>
            <Link
              className="inline-block mb-4 text-blue-600 underline"
              to="/createTag"
              state={{
                projectId: projectId,
                projectTitle: projectTitle,
              }}
            >
              + Nouveau commentaire
            </Link>
            {tags.map((tag) => (
              <Tag
                key={tag.id}
                tag={tag}
                tasks={tasks}
                onUpdate={() => fetchTags(tagsPagination.page)}
                onTaskUpdate={() => fetchTasks(pagination.page)}
              />
            ))}
          </div>

          {/*PAGINATION TAGS*/}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={tagsPagination.page === 1}
              onClick={() => fetchTags(tagsPagination.page - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Précédent
            </button>

            <span>
              Page {tagsPagination.page} sur {tagsPagination.totalPages}
            </span>

            <button
              disabled={tagsPagination.page === tagsPagination.totalPages}
              onClick={() => fetchTags(tagsPagination.page + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <Link
          to="/projects"
          className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition shadow-sm"
        >
          ← Retour aux projets
        </Link>
      </div>
    </div>
  );
}

export default Tasks;
