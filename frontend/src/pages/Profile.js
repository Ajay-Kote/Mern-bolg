import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getBlogs } from '../store/slices/blogSlice';
import { format } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Profile.scss';

const Profile = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blog);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile/${id}`);
        
        if (!response.ok) {
          throw new Error('User not found');
        }
        
        const data = await response.json();
        setUserProfile(data);
        
        // Fetch user's blogs
        dispatch(getBlogs({ author: id, limit: 6 }));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [id, dispatch]);

  const formatDate = (date) => {
    return format(new Date(date), 'MMMM dd, yyyy');
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (error || !userProfile) {
    return (
      <div className="profile">
        <div className="container">
          <div className="error-message">
            <h2>Profile not found</h2>
            <p>The user profile you're looking for doesn't exist.</p>
            <Link to="/blogs" className="back-button">
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userProfile.user._id;

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="avatar-section">
              <img
                src={userProfile.user.avatar || '/default-avatar.png'}
                alt={userProfile.user.username}
                className="profile-avatar"
              />
            </div>
            
            <div className="profile-details">
              <h1>{userProfile.user.username}</h1>
              {userProfile.user.bio && (
                <p className="bio">{userProfile.user.bio}</p>
              )}
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number">{userProfile.blogs.length}</span>
                  <span className="stat-label">Blogs</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {userProfile.blogs.reduce((total, blog) => total + blog.views, 0)}
                  </span>
                  <span className="stat-label">Total Views</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {userProfile.blogs.reduce((total, blog) => total + (blog.likes?.length || 0), 0)}
                  </span>
                  <span className="stat-label">Total Likes</span>
                </div>
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <div className="profile-actions">
              <Link to="/my-blogs" className="action-button">
                Manage Blogs
              </Link>
              <Link to="/create-blog" className="action-button primary">
                Write New Blog
              </Link>
            </div>
          )}
        </div>

        <div className="profile-content">
          <div className="blogs-section">
            <div className="section-header">
              <h2>Recent Blogs</h2>
              {userProfile.blogs.length > 0 && (
                <Link to={`/blogs?author=${userProfile.user._id}`} className="view-all-link">
                  View All
                </Link>
              )}
            </div>

            {userProfile.blogs.length > 0 ? (
              <div className="blogs-grid">
                {userProfile.blogs.map((blog) => (
                  <article key={blog._id} className="blog-card">
                    {blog.featuredImage && (
                      <div className="blog-image">
                        <img src={blog.featuredImage} alt={blog.title} />
                      </div>
                    )}
                    <div className="blog-content">
                      <h3>
                        <Link to={`/blogs/${blog._id}`}>
                          {blog.title}
                        </Link>
                      </h3>
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
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="no-blogs">
                <h3>No blogs yet</h3>
                <p>
                  {isOwnProfile 
                    ? "You haven't written any blogs yet. Start sharing your thoughts!" 
                    : `${userProfile.user.username} hasn't written any blogs yet.`
                  }
                </p>
                {isOwnProfile && (
                  <Link to="/create-blog" className="create-button">
                    Write Your First Blog
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
