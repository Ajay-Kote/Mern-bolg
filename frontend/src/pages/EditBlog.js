import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { getBlog, updateBlog } from '../store/slices/blogSlice';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './CreateEditBlog.scss';

const EditBlog = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog, isLoading: blogLoading } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const watchedTags = watch('tags');

  useEffect(() => {
    dispatch(getBlog(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentBlog) {
      // Check if user is the author
      if (currentBlog.author._id !== user?.id) {
        toast.error('You are not authorized to edit this blog');
        navigate('/my-blogs');
        return;
      }

      // Set form values
      setValue('title', currentBlog.title);
      setValue('content', currentBlog.content);
      setValue('featuredImage', currentBlog.featuredImage || '');
      setValue('tags', currentBlog.tags?.join(', ') || '');
      setValue('published', currentBlog.published);
    }
  }, [currentBlog, user, setValue, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const blogData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      };
      
      await dispatch(updateBlog({ id, blogData })).unwrap();
      toast.success('Blog updated successfully!');
      navigate(`/blogs/${id}`);
    } catch (error) {
      toast.error(error || 'Failed to update blog');
    } finally {
      setIsLoading(false);
    }
  };

  if (blogLoading) {
    return <LoadingSpinner text="Loading blog..." />;
  }

  if (!currentBlog) {
    return (
      <div className="create-edit-blog">
        <div className="container">
          <div className="error-message">
            <h2>Blog not found</h2>
            <p>The blog you're trying to edit doesn't exist.</p>
            <button onClick={() => navigate('/my-blogs')} className="back-button">
              Back to My Blogs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-edit-blog">
      <div className="container">
        <div className="page-header">
          <h1>Edit Blog</h1>
          <p>Update your blog content</p>
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
              onClick={() => navigate(`/blogs/${id}`)}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="small" text="" /> : 'Update Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
