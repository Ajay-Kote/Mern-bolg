import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getBlogs, clearBlogs } from '../store/slices/blogSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './BlogFeed.scss';

const BlogFeed = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  
  const dispatch = useDispatch();
  const { blogs, pagination, isLoading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(clearBlogs());
    setCurrentPage(1);
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 12,
      search: searchTerm,
      tag: selectedTag,
    };
    dispatch(getBlogs(params));
  }, [dispatch, currentPage, searchTerm, selectedTag]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUniqueTags = () => {
    const tags = blogs.flatMap(blog => blog.tags || []);
    return [...new Set(tags)].slice(0, 10);
  };

  if (error) {
    return (
      <div className="blog-feed">
        <div className="container">
          <div className="error-message">
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-feed">
      <div className="container">
        <div className="blog-header">
          <h1>All Blogs</h1>
          <p>Discover amazing stories and insights</p>
        </div>

        <div className="blog-filters">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>

          <div className="tag-filters">
            <button
              className={`tag-filter ${selectedTag === '' ? 'active' : ''}`}
              onClick={() => setSelectedTag('')}
            >
              All
            </button>
            {getUniqueTags().map((tag) => (
              <button
                key={tag}
                className={`tag-filter ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {isLoading && currentPage === 1 ? (
          <LoadingSpinner text="Loading blogs..." />
        ) : (
          <>
            <div className="blogs-grid">
              {blogs.map((blog) => (
                <article key={blog._id} className="blog-card">
                  {blog.featuredImage && (
                    <div className="blog-image">
                      <img src={blog.featuredImage} alt={blog.title} />
                    </div>
                  )}
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="author">
                        By {blog.author?.username}
                      </span>
                      <span className="date">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>
                    <h2>
                      <Link to={`/blogs/${blog._id}`}>
                        {blog.title}
                      </Link>
                    </h2>
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

                    <div className="blog-stats">
                      <span className="views">
                        👁️ {blog.views} views
                      </span>
                      <span className="likes">
                        ❤️ {blog.likes?.length || 0} likes
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {blogs.length === 0 && !isLoading && (
              <div className="no-blogs">
                <h3>No blogs found</h3>
                <p>Try adjusting your search or filters</p>
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

export default BlogFeed;
