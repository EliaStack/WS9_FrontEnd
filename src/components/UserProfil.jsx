import { Link } from 'react-router-dom';

function UserProfil() {
  const user = JSON.parse(localStorage.getItem('user'));
  let userRole = '';

  if (user.roles == 'ROLE_USER') {
    userRole = 'Utilisateur';
  } else if (user.roles == 'ROLE_MANAGER') {
    userRole = 'Manager';
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-950 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800 pt-4 md:pt-6 px-4 md:px-6 pb-2 mb-8">
      <div className="flex flex-wrap justify-center sm:justify-between gap-x-8 gap-y-2 text-center sm:text-left">
        <p>
          <span className="font-semibold text-blue-700 dark:text-blue-300">
            Nom :
          </span>{' '}
          {user.lastName}
        </p>
        <p>
          <span className="font-semibold text-blue-700 dark:text-blue-300">
            Prénom :
          </span>{' '}
          {user.firstName}
        </p>
        <p>
          <span className="font-semibold text-blue-700 dark:text-blue-300">
            Email :
          </span>{' '}
          {user.email}
        </p>
        <p>
          <span className="font-semibold text-blue-700 dark:text-blue-300">
            Rôle :
          </span>{' '}
          {userRole}
        </p>
      </div>
      <div className="flex justify-center mt-4">
        <Link
          className="bg-orange-400 text-black hover:bg-orange-500 px-4 py-2 rounded-lg text-xs md:text-sm font-bold uppercase transition shadow-sm text-center"
          to={`/editUser/${user._id}`}
          state={{ user: user }}
        >
          Modifier
        </Link>
      </div>
    </div>
  );
}

export default UserProfil;
