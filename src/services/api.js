import axios from "axios";

const api = axios.create({ //Créer une instance d'axios avec une certaine config
    baseURL: import.meta.env.VITE_API_URL, //Tout nos appel API vont commencer par
});

//Intrcepteur: chaque requête interceptée(GET/PUT/PATCH,ect...) récupère la config. de l'appel
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); //Vérif s'il y a un token et l'ajoute à la requête API
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (reponse) => reponse,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
)

export const get = (url, config = {}) => api.get(url, config);
export const post = (url, data, config = {}) => api.post(url, data, config);
export const patch = (url, data, config = {}) => api.patch(url, data, config);
export const del = (url, config = {}) => api.delete(url, config);

export default api;