import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMyBlogs, deleteBlog } from '../store/slices/blogSlice';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './MyBlogs.scss';

const MyBlogs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all, published, drafts
  const [isDeleting, setIsDeleting] = useState(null);
  
  const dispatch = useDispatch();
  const { myBlogs, pagination, isLoading } = useSelector((state) => state.blog);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 12,
      published: filter === 'all' ? undefined : filter === 'published',
    };
    dispatch(getMyBlogs(params));
  }, [dispatch, currentPage, filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    setIsDeleting(id);
    try {
      await dispatch(deleteBlog(id)).unwrap();
      toast.success('Blog deleted successfully');
    } catch (error) {
      toast.error('Failed to delete blog');
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  return (
    <div className="my-blogs">
      <div className="container">
        <div className="page-header">
          <h1>My Blogs</h1>
          <p>Manage your blog posts</p>
          <Link to="/create-blog" className="create-button">
            Create New Blog
          </Link>
        </div>

        <div className="blog-filters">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({pagination.totalBlogs || 0})
            </button>
            <button
              className={`filter-tab ${filter === 'published' ? 'active' : ''}`}
              onClick={() => setFilter('published')}
            >
              Published
            </button>
            <button
              className={`filter-tab ${filter === 'drafts' ? 'active' : ''}`}
              onClick={() => setFilter('drafts')}
            >
              Drafts
            </button>
          </div>
        </div>

        {isLoading && currentPage === 1 ? (
          <LoadingSpinner text="Loading your blogs..." />
        ) : (
          <>
            <div className="blogs-grid">
              {myBlogs.map((blog) => (
                <article key={blog._id} className="blog-card">
                  <div className="blog-status">
                    <span className={`status-badge ${blog.published ? 'published' : 'draft'}`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {blog.featuredImage && (
                    <div className="blog-image">
                      <img src={blog.featuredImage} alt={blog.title} />
                    </div>
                  )}

                  <div className="blog-content">
                    <h2>
                      <Link to={`/blogs/${blog._id}`}>
                        {blog.title}
                      </Link>
                    </h2>
                    
                    <div className="blog-meta">
                      <span className="date">
                        {formatDate(blog.createdAt)}
                      </span>
                      <span className="views">
                        👁️ {blog.views} views
                      </span>
                      <span className="likes">
                        ❤️ {blog.likes?.length || 0} likes
                      </span>
                    </div>

                    <p className="excerpt">{blog.excerpt}</p>

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="blog-tags">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="blog-actions">
                      <Link to={`/edit-blog/${blog._id}`} className="edit-button">
                        Edit
                      </Link>
                      <Link to={`/blogs/${blog._id}`} className="view-button">
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        disabled={isDeleting === blog._id}
                        className="delete-button"
                      >
                        {isDeleting === blog._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {myBlogs.length === 0 && !isLoading && (
              <div className="no-blogs">
                <h3>No blogs found</h3>
                <p>
                  {filter === 'all' 
                    ? "You haven't written any blogs yet." 
                    : filter === 'published'
                    ? "You don't have any published blogs."
                    : "You don't have any draft blogs."
                  }
                </p>
                <Link to="/create-blog" className="create-first-button">
                  Create Your First Blog
                </Link>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev || isLoading}
                  className="pagination-button"
                >
                  Previous
                </button>
                
                <div className="pagination-info">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext || isLoading}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
