// src/components/SearchChallenges.jsx
import React, { useState } from 'react';
import axios from 'axios';

const SearchChallenges = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [difficulty, setDifficulty] = useState(''); // holds the selected difficulty
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const params = {};
    if (title) params.title = title;
    if (tags) params.tags = tags;
    if (difficulty) params.difficulty = difficulty;
    try {
      const response = await axios.get('http://localhost:5000/api/challenges', { params });
      setChallenges(response.data);
    } catch (err) {
      setError('Error fetching challenges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine the color for a given difficulty.
  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'green';
    if (diff === 'Medium') return 'orange';
    if (diff === 'Hard') return 'red';
    return 'inherit';
  };

  return (
    <div style={{ padding: '2rem', width: '100%', boxSizing: 'border-box' }}>
      <h2>Search Challenges</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '30%', padding: '0.5rem', marginRight: '1rem' }}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ width: '30%', padding: '0.5rem', marginRight: '1rem' }}
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{ width: '20%', padding: '0.5rem', marginRight: '1rem' }}
        >
          <option value="">All Difficulties</option>
          <option value="Easy" style={{ color: 'green' }}>Easy</option>
          <option value="Medium" style={{ color: 'orange' }}>Medium</option>
          <option value="Hard" style={{ color: 'red' }}>Hard</option>
        </select>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Search</button>
      </form>
      {loading && <p>Loading challenges...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {challenges.map(challenge => (
          <li key={challenge._id} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
            <h3>{challenge.title}</h3>
            <p>
              <strong>Difficulty:</strong>{' '}
              <span style={{ color: getDifficultyColor(challenge.difficulty) }}>
                {challenge.difficulty}
              </span>
            </p>
            <p>{challenge.essay_prompt}</p>
            <p>
              <strong>Tags:</strong> {challenge.tags.join(', ')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchChallenges;
