import api from './api';

const userService = {
  getUserProfile: (id) => api.get(`/users/profile/${id}`),
  getUserStats: () => api.get('/users/stats'),
};

export default userService;
