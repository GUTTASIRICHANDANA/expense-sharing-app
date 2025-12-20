import axios from 'axios';

const api = axios.create({
    baseURL: 'https://expense-sharing-app-rucx.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
