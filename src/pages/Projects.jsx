import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Project from '../components/Project';
import { get } from '../services/api';
import UserProfil from '../components/UserProfil';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchProjects = async (page = 1) => {
    try {
      const result = await get(`api/projet/projectUser?page=${page}`);
      setProjects(result.data.projects);
      setPagination({
        page: page,
        totalPages: result.data.totalPages,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération :', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <div>
        <UserProfil></UserProfil>
      </div>
      <div>
        <h2>Mes projets</h2>
        <Link
          className="inline-block mb-4 text-blue-600 underline"
          to="/createProject"
          state={{
            assigneeId: user._id,
            assigneeName: `${user.firstName} ${user.lastName}`,
          }}
        >
          + Nouveau projet
        </Link>

        {projects.map((project) => (
          <Project
            project={project}
            key={project._id}
            onUpdate={() => fetchProjects(pagination.page)}
          />
        ))}
      </div>

      {/*PAGINATION*/}
      <div className="flex gap-4 mt-6 items-center">
        <button
          disabled={pagination.page === 1}
          onClick={() => fetchProjects(pagination.page - 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Précédent
        </button>

        <span>
          Page {pagination.page} sur {pagination.totalPages}
        </span>

        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => fetchProjects(pagination.page + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

export default Projects;
