import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { getBlog, likeBlog, addComment } from '../store/slices/blogSlice';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './SingleBlog.scss';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBlog, isLoading } = useSelector((state) => state.blog);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isLiking, setIsLiking] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(getBlog(id));
  }, [dispatch, id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like blogs');
      navigate('/login');
      return;
    }

    setIsLiking(true);
    try {
      await dispatch(likeBlog(id)).unwrap();
    } catch (error) {
      toast.error('Failed to like blog');
    } finally {
      setIsLiking(false);
    }
  };

  const onSubmitComment = async (data) => {
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }

    try {
      await dispatch(addComment({ id, content: data.content })).unwrap();
      reset();
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), 'MMMM dd, yyyy');
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading blog..." />;
  }

  if (!currentBlog) {
    return (
      <div className="single-blog">
        <div className="container">
          <div className="error-message">
            <h2>Blog not found</h2>
            <p>The blog you're looking for doesn't exist.</p>
            <Link to="/blogs" className="back-button">
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLiked = currentBlog.likes?.some(like => like.toString() === user?.id);

  return (
    <div className="single-blog">
      <div className="container">
        <div className="blog-header">
          <div className="blog-meta">
            <Link to={`/profile/${currentBlog.author._id}`} className="author-link">
              <img
                src={currentBlog.author.avatar || '/default-avatar.png'}
                alt={currentBlog.author.username}
                className="author-avatar"
              />
              <span>{currentBlog.author.username}</span>
            </Link>
            <span className="publish-date">
              {formatDate(currentBlog.createdAt)}
            </span>
          </div>

          <h1>{currentBlog.title}</h1>

          {currentBlog.tags && currentBlog.tags.length > 0 && (
            <div className="blog-tags">
              {currentBlog.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="blog-stats">
            <span className="views">👁️ {currentBlog.views} views</span>
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`like-button ${isLiked ? 'liked' : ''}`}
            >
              {isLiking ? '...' : '❤️'} {currentBlog.likes?.length || 0} likes
            </button>
          </div>
        </div>

        {currentBlog.featuredImage && (
          <div className="featured-image">
            <img src={currentBlog.featuredImage} alt={currentBlog.title} />
          </div>
        )}

        <div className="blog-content">
          <ReactMarkdown>{currentBlog.content}</ReactMarkdown>
        </div>

        <div className="blog-actions">
          {isAuthenticated && user?.id === currentBlog.author._id && (
            <div className="author-actions">
              <Link to={`/edit-blog/${currentBlog._id}`} className="edit-button">
                Edit Blog
              </Link>
            </div>
          )}
        </div>

        <div className="comments-section">
          <h3>Comments ({currentBlog.comments?.length || 0})</h3>

          {isAuthenticated && (
            <form onSubmit={handleSubmit(onSubmitComment)} className="comment-form">
              <div className="form-group">
                <textarea
                  {...register('content', {
                    required: 'Comment is required',
                    maxLength: {
                      value: 1000,
                      message: 'Comment must be less than 1000 characters',
                    },
                  })}
                  placeholder="Write a comment..."
                  className={errors.content ? 'error' : ''}
                  rows="4"
                />
                {errors.content && (
                  <span className="error-message">{errors.content.message}</span>
                )}
              </div>
              <button type="submit" className="submit-comment">
                Post Comment
              </button>
            </form>
          )}

          <div className="comments-list">
            {currentBlog.comments?.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <img
                    src={comment.user.avatar || '/default-avatar.png'}
                    alt={comment.user.username}
                    className="comment-avatar"
                  />
                  <div className="comment-meta">
                    <span className="comment-author">{comment.user.username}</span>
                    <span className="comment-date">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="comment-content">
                  {comment.content}
                </div>
              </div>
            ))}

            {(!currentBlog.comments || currentBlog.comments.length === 0) && (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
