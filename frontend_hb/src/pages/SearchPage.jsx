// src/components/SearchChallenges.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SearchPage.css';

// Predefined available tags
const availableTags = [
  "Narrative", 
  "Descriptive", 
  "Prose", 
  "Poetic", 
  "Argumentative", 
  "Comparative"
];

const SearchPage = () => {
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // Array of selected tags
  const [tagInput, setTagInput] = useState('');          // Current text in the tag input field
  const [difficulty, setDifficulty] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle searching challenges
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    const params = {};
    if (title) params.title = title;
    if (selectedTags.length > 0) params.tags = selectedTags.join(','); // Pass comma-separated tags
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

  // Clear all filters
  const clearFilters = () => {
    setTitle('');
    setSelectedTags([]);
    setTagInput('');
    setDifficulty('');
  };

  // Helper for color-coding difficulty remains the same.
  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'green';
    if (diff === 'Medium') return 'orange';
    if (diff === 'Hard') return 'red';
    return 'inherit';
  };

  // Tag input handling
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  // When a suggestion is clicked, add it to selectedTags
  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput('');
  };

  // Remove a tag from selectedTags
  const handleTagRemove = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  // Filter suggestions based on current tagInput (case-insensitive) and exclude already selected tags
  const filteredSuggestions = availableTags.filter(tag =>
    tag.toLowerCase().includes(tagInput.toLowerCase()) && !selectedTags.includes(tag)
  );

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div style={{ padding: '2rem', width: '100%', boxSizing: 'border-box' }}>
      <div className='search_section'>
        <h2 className='text-4xl mb-8'>Search Challenges</h2>
        <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <input
            className='in'
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: '1', padding: '0.5rem' }}
          />

          {/* New Tag Selector Component */}
          <div className="tag-selector">
            {selectedTags.map((tag, index) => (
              <div key={index} className="tag-pill">
                {tag} <span className="remove-tag" onClick={() => handleTagRemove(tag)}>×</span>
              </div>
            ))}
            <input
              type="text"
              placeholder="Add tag..."
              value={tagInput}
              onChange={handleTagInputChange}
              className="tag-input"
            />
            {tagInput && filteredSuggestions.length > 0 && (
              <div className="tag-suggestions">
                {filteredSuggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item" onClick={() => handleTagSelect(suggestion)}>
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

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
