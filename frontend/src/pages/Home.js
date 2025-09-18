import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getBlogs } from '../store/slices/blogSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Home.scss';

const Home = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector((state) => state.blog);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getBlogs({ limit: 6 }));
  }, [dispatch]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to MERN Blog</h1>
          <p>Share your thoughts, stories, and ideas with the world</p>
          {isAuthenticated ? (
            <Link to="/create-blog" className="cta-button">
              Write Your First Blog
            </Link>
          ) : (
            <div className="hero-buttons">
              <Link to="/signup" className="cta-button primary">
                Get Started
              </Link>
              <Link to="/blogs" className="cta-button secondary">
                Read Blogs
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="featured-blogs">
        <div className="container">
          <h2>Latest Blogs</h2>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="blogs-grid">
              {blogs.slice(0, 6).map((blog) => (
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
                    <h3>
                      <Link to={`/blogs/${blog._id}`}>
                        {blog.title}
                      </Link>
                    </h3>
                    <p className="excerpt">{blog.excerpt}</p>
                    <div className="blog-stats">
                      <span className="views">{blog.views} views</span>
                      <span className="likes">{blog.likes?.length || 0} likes</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/blogs" className="view-all-button">
              View All Blogs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
