// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://s-veiculos-git-main-alefs-projects-16b120f4.vercel.app/api/vehicles', // URL do seu servidor
});

export const getVehicles = () => api.get('/');
export const createVehicle = (vehicle) => api.post('/', vehicle);
export const updateVehicle = (id, vehicle) => api.put(`/${id}`, vehicle);
export const deleteVehicle = (id) => api.delete(`/${id}`);

export default api;
