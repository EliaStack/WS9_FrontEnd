//import heroImg from './assets/hero.png'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Task from './pages/Tasks';
import Project from './pages/Projects';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import EditProject from './pages/EditProject';
import PrivateRoute from './PrivateRoute';
import CreateTag from './pages/CreateTag';
import CreateProject from './pages/CreateProject';
import EditTag from './pages/EditTag';
import EditUser from './pages/EditUser';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header></Header>
        <main className="flex-1 max-w-4xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home></Home>}></Route>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/register" element={<Register></Register>}></Route>
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <Project></Project>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <Task></Task>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/editTask/:id"
              element={
                <PrivateRoute>
                  <EditTask></EditTask>
                </PrivateRoute>
              }
            ></Route>{' '}
            {/*Pour modifier une tâche en cours*/}
            <Route
              path="/editProject/:id"
              element={
                <PrivateRoute>
                  <EditProject></EditProject>
                </PrivateRoute>
              }
            ></Route>{' '}
            {/*Pour modifier un projet en cours*/}
            <Route
              path="/editTag/:id"
              element={
                <PrivateRoute>
                  <EditTag></EditTag>
                </PrivateRoute>
              }
            ></Route>{' '}
            {/*Pour modifier un tag en cours*/}
            <Route
              path="/editUser/:id"
              element={
                <PrivateRoute>
                  <EditUser></EditUser>
                </PrivateRoute>
              }
            ></Route>{' '}
            {/*Pour modifier un user*/}
            <Route
              path="/createTask"
              element={
                <PrivateRoute>
                  <CreateTask></CreateTask>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/createTag"
              element={
                <PrivateRoute>
                  <CreateTag></CreateTag>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/createProject"
              element={
                <PrivateRoute>
                  <CreateProject></CreateProject>
                </PrivateRoute>
              }
            ></Route>
          </Routes>
        </main>
        <Footer></Footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
