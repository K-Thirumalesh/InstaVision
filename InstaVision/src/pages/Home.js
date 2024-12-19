import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setPosts(response.data);
      } catch (error) {
        setError('Failed to fetch posts');
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {user ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-4 rounded shadow">
              <p className="mb-2">{post.content}</p>
              <p className="text-sm text-gray-500">
                Posted by {post.user.username} on {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Please log in to view posts.</p>
      )}
    </div>
  );
};

export default Home;

