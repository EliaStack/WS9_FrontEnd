import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login"></Navigate>;
}

//children = appelle le composant enfant, dans app.jsx c'est l'appel dans task ou autres qui nécessite d'être connecté
