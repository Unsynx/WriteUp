// src/components/DiscussionBoard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiscussionBoard = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [error, setError] = useState('');

  // Dummy fetch function; in real app, fetch posts from backend.
  useEffect(() => {
    // Example: axios.get('http://localhost:5000/api/discussions').then(response => setPosts(response.data))
    // For demo, we use static posts.
    setPosts([
      { id: '1', username: 'UserA', content: 'I love the daily quests – they really help me improve my writing!' },
      { id: '2', username: 'UserB', content: 'The placement test was eye-opening. I now know what to work on.' },
    ]);
  }, []);

  const handleAddPost = () => {
    if (newPost.trim() === '') {
      setError('Post cannot be empty.');
      return;
    }
    // In a real app, post to the backend.
    const post = { id: Date.now().toString(), username: 'CurrentUser', content: newPost };
    setPosts((prevPosts) => [post, ...prevPosts]);
    setNewPost('');
    setError('');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2>Discussion Board</h2>
      <div style={{ marginBottom: '1.5rem' }}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your thoughts..."
          style={{ width: '100%', height: '100px', padding: '1rem' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleAddPost} style={{ padding: '0.5rem 1rem', marginTop: '0.5rem' }}>Post</button>
      </div>
      <div>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
              <p><strong>{post.username}</strong></p>
              <p>{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscussionBoard;
