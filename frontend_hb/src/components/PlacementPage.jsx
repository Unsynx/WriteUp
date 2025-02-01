// src/components/PlacementPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

const PlacementPage = () => {
  const [essay, setEssay] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper function to count words
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if the essay meets the minimum word count
    if (countWords(essay) < 150) {
      setError('Your essay must contain at least 150 words.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      // Replace the endpoint URL with your actual placement assessment endpoint
      const response = await axios.post('http://localhost:5000/api/placement', { essay });
      // Assume the response data contains an object like: { level: "Intermediate", message: "Keep practicing your transitions." }
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Error evaluating your essay. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Placement Assessment</h1>
      <p>
        Please write a short essay (at least 150 words) on a topic of your choice.
        Our AI will evaluate your writing skills and place you in the appropriate level.
      </p>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <textarea 
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="Type your essay here..."
          style={{ width: '100%', height: '200px', padding: '1rem', fontSize: '1rem', marginBottom: '1rem' }}
        />
        <button 
          type="submit" 
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
          disabled={loading || countWords(essay) < 150}
        >
          {loading ? 'Evaluating...' : 'Submit Essay'}
        </button>
      </form>
      
      {countWords(essay) < 150 && (
        <p style={{ color: 'red' }}>Your essay must contain at least 150 words.</p>
      )}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {result && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
          <h2>Your Writing Level: {result.level}</h2>
          {result.message && <p>{result.message}</p>}
        </div>
      )}
    </div>
  );
};

export default PlacementPage;
