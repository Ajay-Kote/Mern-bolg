import api from './api';

const authService = {
  login: (userData) => api.post('/auth/login', userData),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

export default authService;
