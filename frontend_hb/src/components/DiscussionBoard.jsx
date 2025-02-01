// src/components/DiscussionBoard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DiscussionBoard = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Example: axios.get('http://localhost:5000/api/discussions')
    //   .then(res => setPosts(res.data))
    // For demo, we use static posts with nested replies array.
    setPosts([
      {
        id: '1',
        username: 'UserA',
        content: 'I love the daily quests – they really help me improve my writing!',
        upvotes: 2,
        replies: [
          { id: 'r1', username: 'UserB', content: 'Totally agree!' }
        ],
      },
      {
        id: '2',
        username: 'UserB',
        content: 'The placement test was eye-opening. I now know what to work on.',
        upvotes: 1,
        replies: [],
      },
    ]);
  }, []);

  const handleAddPost = () => {
    if (newPost.trim() === '') {
      setError('Post cannot be empty.');
      return;
    }
    const post = {
      id: Date.now().toString(),
      username: 'CurrentUser',
      content: newPost,
      upvotes: 0,
      replies: [],
    };
    setPosts((prevPosts) => [post, ...prevPosts]);
    setNewPost('');
    setError('');
    toast.success('Post added successfully!');
  };

  const handleUpvote = (postId) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return { ...post, upvotes: post.upvotes + 1 };
      }
      return post;
    }));
    toast.info('Upvoted!');
  };

  const handleReply = (postId, replyContent) => {
    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty.');
      return;
    }
    const replyObj = {
      id: Date.now().toString(),
      username: 'CurrentUser',
      content: replyContent,
    };
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...post.replies, replyObj],
          };
        }
        return post;
      })
    );
    toast.success('Reply posted!');
  };

  return (
    <div style={{ width: '100%', padding: '2rem', boxSizing: 'border-box' }}>
      <h2>Discussion Board</h2>
      <div style={{ marginBottom: '1.5rem' }}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your thoughts..."
          style={{ width: '100%', height: '100px', padding: '1rem' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleAddPost} style={{ padding: '0.5rem 1rem', marginTop: '0.5rem' }}>
          Post
        </button>
      </div>
      <div>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <DiscussionPost
              key={post.id}
              post={post}
              onUpvote={handleUpvote}
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </div>
  );
};

const DiscussionPost = ({ post, onUpvote, onReply }) => {
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = () => {
    onReply(post.id, replyText);
    setReplyText('');
  };

  return (
    <div style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>{post.username}</strong> - {post.content}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <button
          onClick={() => onUpvote(post.id)}
          style={{ marginRight: '1rem', padding: '0.25rem 0.5rem' }}
        >
          Upvote ({post.upvotes})
        </button>
      </div>
      {post.replies && post.replies.length > 0 && (
        <div style={{ marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #eee' }}>
          {post.replies.map(reply => (
            <div key={reply.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{reply.username}:</strong> {reply.content}
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: '0.5rem' }}>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Add a reply..."
          style={{ width: '100%', height: '60px', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <button onClick={handleReplySubmit} style={{ padding: '0.25rem 0.5rem' }}>
          Reply
        </button>
      </div>
    </div>
  );
};

export default DiscussionBoard;
