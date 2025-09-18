import api from './api';

const blogService = {
  getBlogs: (params) => api.get('/blogs', { params }),
  getBlog: (id) => api.get(`/blogs/${id}`),
  createBlog: (blogData) => api.post('/blogs', blogData),
  updateBlog: (id, blogData) => api.put(`/blogs/${id}`, blogData),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
  getMyBlogs: (params) => api.get('/users/my-blogs', { params }),
  likeBlog: (id) => api.post(`/blogs/${id}/like`),
  addComment: (id, content) => api.post(`/blogs/${id}/comments`, { content }),
};

export default blogService;
