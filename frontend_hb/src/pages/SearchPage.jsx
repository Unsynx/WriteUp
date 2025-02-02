// src/components/SearchChallenges.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SearchPage.css';

const SearchPage = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
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

  // ----- CHANGED: Clear all filters -----
  const clearFilters = () => {
    setTitle('');
    setTags('');
    setDifficulty('');
  };

  // Helper for color-coding difficulty
  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'green';
    if (diff === 'Medium') return 'orange';
    if (diff === 'Hard') return 'red';
    return 'inherit';
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div style={{ padding: '2rem', width: '100%', boxSizing: 'border-box' }}>
      <div className='search_section'>
        <h2 className='text-4xl mb-8'>Search Challenges</h2>
        <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <input
            className='in'
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: '1', padding: '0.5rem' }}
          />
          <input
            className='in'
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ flex: '1', padding: '0.5rem' }}
          />
          <select
            className='in'
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{ width: '120px', padding: '0.5rem' }}
          >
            <option value="">All</option>
            <option value="Easy" style={{ color: 'green' }}>Easy</option>
            <option value="Medium" style={{ color: 'orange' }}>Medium</option>
            <option value="Hard" style={{ color: 'red' }}>Hard</option>
          </select>
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>Search</button>
          {/* ----- CHANGED: Clear Button ----- */}
          <button type="button" onClick={() => { clearFilters(); handleSearch(); }} style={{ padding: '0.5rem 1rem' }}>
            Clear
          </button>
        </form>
      </div>
      {loading && <p>Loading challenges...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className='results'>
        {(!loading && challenges.length === 0) ? (
          <p>No challenges found. Try adjusting your filters.</p>
        ) : (
          challenges.map(challenge => (
            <Link key={challenge._id} className='result_card' to={"/write/" + challenge._id} state={challenge}>
              <h3 className='text-3xl mb-3'>{challenge.title}</h3>
              <p>
                <strong>Difficulty:</strong>{' '}
                <span style={{ color: getDifficultyColor(challenge.difficulty) }}>
                  {challenge.difficulty}
                </span>
              </p>
              <p className='chal_desc'>{challenge.essay_prompt}</p>
              <div className='tags'>
                {challenge.tags.map((tag, index) => (
                  <div className='tag' key={index}>
                    <p>{tag}</p>
                  </div>
                ))}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;
