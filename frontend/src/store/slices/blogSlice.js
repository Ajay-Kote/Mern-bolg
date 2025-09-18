import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from '../../services/blogService';

const initialState = {
  blogs: [],
  currentBlog: null,
  myBlogs: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    hasNext: false,
    hasPrev: false,
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const getBlogs = createAsyncThunk(
  'blog/getBlogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await blogService.getBlogs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch blogs'
      );
    }
  }
);

export const getBlog = createAsyncThunk(
  'blog/getBlog',
  async (id, { rejectWithValue }) => {
    try {
      const response = await blogService.getBlog(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch blog'
      );
    }
  }
);

export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await blogService.createBlog(blogData);
      return response.data.blog;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create blog'
      );
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async ({ id, blogData }, { rejectWithValue }) => {
    try {
      const response = await blogService.updateBlog(id, blogData);
      return response.data.blog;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update blog'
      );
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id, { rejectWithValue }) => {
    try {
      await blogService.deleteBlog(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete blog'
      );
    }
  }
);

export const getMyBlogs = createAsyncThunk(
  'blog/getMyBlogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await blogService.getMyBlogs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch your blogs'
      );
    }
  }
);

export const likeBlog = createAsyncThunk(
  'blog/likeBlog',
  async (id, { rejectWithValue }) => {
    try {
      const response = await blogService.likeBlog(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to like blog'
      );
    }
  }
);

export const addComment = createAsyncThunk(
  'blog/addComment',
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const response = await blogService.addComment(id, content);
      return { id, comment: response.data.comment };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add comment'
      );
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearBlogs: (state) => {
      state.blogs = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalBlogs: 0,
        hasNext: false,
        hasPrev: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Blogs
      .addCase(getBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Single Blog
      .addCase(getBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
        state.error = null;
      })
      .addCase(getBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Blog
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs.unshift(action.payload);
        state.error = null;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Blog
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        if (state.currentBlog && state.currentBlog._id === action.payload._id) {
          state.currentBlog = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Blog
      .addCase(deleteBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
        state.myBlogs = state.myBlogs.filter(blog => blog._id !== action.payload);
        if (state.currentBlog && state.currentBlog._id === action.payload) {
          state.currentBlog = null;
        }
        state.error = null;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get My Blogs
      .addCase(getMyBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBlogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getMyBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Like Blog
      .addCase(likeBlog.fulfilled, (state, action) => {
        const { id, likes, isLiked } = action.payload;
        const blog = state.blogs.find(blog => blog._id === id);
        if (blog) {
          blog.likes = likes;
          blog.isLiked = isLiked;
        }
        if (state.currentBlog && state.currentBlog._id === id) {
          state.currentBlog.likes = likes;
          state.currentBlog.isLiked = isLiked;
        }
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { id, comment } = action.payload;
        if (state.currentBlog && state.currentBlog._id === id) {
          state.currentBlog.comments.push(comment);
        }
      });
  },
});

export const { clearCurrentBlog, clearError, clearBlogs } = blogSlice.actions;
export default blogSlice.reducer;
