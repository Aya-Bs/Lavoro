import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Créer une instance axios avec les headers d'authentification
const createAuthAxios = () => {
    const token = localStorage.getItem('token');

    return axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        withCredentials: true
    });
};

// Fonction pour récupérer les informations utilisateur à partir du token JWT
export const fetchUserInfo = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found in localStorage');
            return null;
        }

        const api = createAuthAxios();
        const response = await api.get('/users/me');

        if (response.data) {
            // Stocker les informations utilisateur dans localStorage
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        }

        return null;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
};

// Fonction pour récupérer tous les utilisateurs
export const fetchAllUsers = async () => {
    try {
        console.log('Fetching all users from API...');
        const api = createAuthAxios();
        const response = await api.get('/users/all');

        console.log('Users response:', response.data);

        if (response.data && Array.isArray(response.data.users)) {
            return response.data.users;
        } else if (response.data && Array.isArray(response.data)) {
            return response.data;
        }

        console.warn('Invalid users response format:', response.data);
        return [];
    } catch (error) {
        console.error('Error fetching all users:', error);
        return [];
    }
};

// Fonction pour organiser les utilisateurs par ordre alphabétique pour l'affichage des contacts
export const organizeUsersByAlphabet = (users) => {
    if (!Array.isArray(users) || users.length === 0) {
        return {};
    }

    // Filtrer les utilisateurs valides (qui ont un nom)
    const validUsers = users.filter(user => user && typeof user.name === 'string');

    // Trier les utilisateurs par nom
    validUsers.sort((a, b) => a.name.localeCompare(b.name));

    // Organiser les utilisateurs par première lettre du nom
    const organizedUsers = {};

    validUsers.forEach(user => {
        const firstLetter = user.name.charAt(0).toUpperCase();

        if (!organizedUsers[firstLetter]) {
            organizedUsers[firstLetter] = [];
        }

        organizedUsers[firstLetter].push(user);
    });

    return organizedUsers;
};

export default {
    fetchUserInfo,
    fetchAllUsers,
    organizeUsersByAlphabet
};
