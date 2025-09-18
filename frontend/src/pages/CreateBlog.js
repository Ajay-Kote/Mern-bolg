import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createBlog } from '../store/slices/blogSlice';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './CreateEditBlog.scss';

const CreateBlog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      published: false,
    },
  });

  const watchedTags = watch('tags');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const blogData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      };
      
      const result = await dispatch(createBlog(blogData)).unwrap();
      toast.success('Blog created successfully!');
      navigate(`/blogs/${result._id}`);
    } catch (error) {
      toast.error(error || 'Failed to create blog');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-edit-blog">
      <div className="container">
        <div className="page-header">
          <h1>Create New Blog</h1>
          <p>Share your thoughts with the world</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="blog-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              {...register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 200,
                  message: 'Title must be less than 200 characters',
                },
              })}
              className={errors.title ? 'error' : ''}
              placeholder="Enter blog title"
            />
            {errors.title && (
              <span className="error-message">{errors.title.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="featuredImage">Featured Image URL</label>
            <input
              type="url"
              id="featuredImage"
              {...register('featuredImage')}
              placeholder="https://example.com/image.jpg"
            />
            <small>Optional: Add a featured image for your blog</small>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              {...register('tags')}
              placeholder="react, javascript, web development"
            />
            <small>Separate tags with commas</small>
            {watchedTags && (
              <div className="tags-preview">
                {watchedTags.split(',').map((tag, index) => {
                  const trimmedTag = tag.trim();
                  return trimmedTag ? (
                    <span key={index} className="tag-preview">
                      {trimmedTag}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              {...register('content', {
                required: 'Content is required',
                minLength: {
                  value: 50,
                  message: 'Content must be at least 50 characters',
                },
              })}
              className={errors.content ? 'error' : ''}
              placeholder="Write your blog content here..."
              rows="15"
            />
            {errors.content && (
              <span className="error-message">{errors.content.message}</span>
            )}
            <small>You can use Markdown formatting</small>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                {...register('published')}
              />
              <span className="checkmark"></span>
              Publish immediately
            </label>
            <small>If unchecked, the blog will be saved as a draft</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/my-blogs')}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="small" text="" /> : 'Create Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
