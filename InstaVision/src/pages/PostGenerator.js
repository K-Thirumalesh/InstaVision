import React, { useState } from 'react';import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const PostGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/posts/generate', 
        { prompt },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setGeneratedPost(response.data.content);
      setError('');
    } catch (error) {
      setError('Failed to generate post');
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Generate Post</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md mb-8">
        <div className="mb-4">
          <label htmlFor="prompt" className="block mb-2">Prompt</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            rows="4"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Generate Post
        </button>
      </form>
      {generatedPost && (
        <div>
          <h3 className="text-xl font-bold mb-2">Generated Post:</h3>
          <p className="bg-gray-100 p-4 rounded">{generatedPost}</p>
        </div>
      )}
    </div>
  );
};

export default PostGenerator;

