// src/components/SearchChallenges.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SearchPage.css';
import api from '../util/api';

const availableTags = [
  "narrative", 
  "descriptive", 
  "prose", 
  "poetic", 
  "argumentative", 
  "comparative"
];

const SearchPage = () => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // holds the tags added by the user
  const [tagInput, setTagInput] = useState('');          // current text in the tag input field
  const [suggestions, setSuggestions] = useState([]);      // suggestions based on the input
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedChallenges, setCompletedChallenges] = useState([]);

  // Handle changes in the tag input field and update suggestions.
  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    if (value.trim() !== "") {
      const filtered = availableTags.filter(
        (tag) =>
          tag.toLowerCase().includes(value.toLowerCase()) &&
          !selectedTags.includes(tag)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Add a tag from the suggestions or when the user presses Enter.
  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput('');
    setSuggestions([]);
  };

  // Remove a tag from the selected tags.
  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  // When the user presses Enter, attempt to add the tag.
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const match = availableTags.find(
        (tag) => tag.toLowerCase() === tagInput.trim().toLowerCase()
      );
      if (match) {
        addTag(match);
      } else if (suggestions.length === 1) {
        addTag(suggestions[0]);
      }
    }
  };

  // Build search parameters and fetch challenges.
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    const params = {};
    if (title) params.title = title;
    if (selectedTags.length > 0) params.tags = selectedTags.join(","); // join selected tags
    if (difficulty) params.difficulty = difficulty;
    try {
      const response = await api.get('/challenges', { params });
      setChallenges(response.data);
    } catch (err) {
      setError('Error fetching challenges. Please try again.');
    } finally {
      setLoading(false);
      try {
        const token = localStorage.getItem('token');
        const r2 = await api.get("/completed", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        setCompletedChallenges(r2.data.complete)
      } finally { }
    }
  };

  // Clear all filters.
  const clearFilters = () => {
    setTitle('');
    setSelectedTags([]);
    setTagInput('');
    setDifficulty('');
  };

  // Helper for color-coding difficulty.
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
    <div style={{ padding: '2rem', width: '100%', boxSizing: 'border-box', backgroundColor: "white"}}>
      <div className='search_section'>
        <h2 className='text-4xl mb-8'>Search Challenges</h2>
        <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem'}}>
            <input
              className='in'
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{width: "500px", paddingLeft: '0.5rem' }}
            />
          {/* New Tag Input Section */}
          <div className="tag-input-container" style={{ position: 'relative', flex: '1' }}>
            <div className="selected-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {selectedTags.map((tag, index) => (
                <div className="search-tag" key={index}>
                  <p style={{ margin: 0 }}>{tag}</p>
                  <span className="remove-tag" onClick={() => removeTag(tag)} style={{ cursor: 'pointer', marginLeft: '5px' }}>x</span>
                </div>
              ))}
            </div>
            <input
              className='in'
              type="text"
              placeholder="Add tag..."
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              style={{ width: '100%', padding: '0.5rem' }}
            />
            {suggestions.length > 0 && (
              <div className="tag-suggestions" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #ccc', zIndex: 10 }}>
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} className="suggestion-item" onClick={() => addTag(suggestion)} style={{ padding: '0.5rem', cursor: 'pointer' }}>
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


            <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" style={{ padding: '0.5rem 1rem' }} className='search_button'>Search</button>
            <button type="button" onClick={() => { clearFilters(); handleSearch(); }} style={{ padding: '0.5rem 1rem' }} className='search_button'>
              Clear
            </button>
          </div>
          </div>
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
                <div className='tag_group'>
                  {challenge.tags.map((tag, index) => (
                    <div className='tag' key={index}>
                      <p>{tag}</p>
                    </div>
                  ))}
                </div>
                {completedChallenges.includes(challenge._id) ? <div className='tag complete' >Completed</div> : ""}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;
