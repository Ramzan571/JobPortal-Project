import axios from 'axios';

// Backend ka address — apna port yahan likho
const API_URL = 'https://localhost:5182/api/jobs';

// Token lao localStorage se (login ke baad save hota hai)
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// Saari jobs lao
export const getAllJobs = () => axios.get(API_URL);

// Ek job lao
export const getJobById = (id) => axios.get(`${API_URL}/${id}`);

// Nayi job add karo (Admin only)
export const addJob = (jobData) => axios.post(API_URL, jobData, getAuthHeader());

// Job update karo (Admin only)
export const updateJob = (id, jobData) => axios.put(`${API_URL}/${id}`, jobData, getAuthHeader());

// Job delete karo (Admin only)
export const deleteJob = (id) => axios.delete(`${API_URL}/${id}`, getAuthHeader());