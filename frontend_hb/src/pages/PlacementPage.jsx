// src/components/PlacementPage.jsx

import React, { useState } from 'react';
import axios from 'axios';

const PlacementPage = () => {
  const [essay, setEssay] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const wordCount = countWords(essay);
  const minWords = 150;
  const wordsLeft = Math.max(minWords - wordCount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (wordCount < minWords) {
      setError(`You need at least ${minWords} words to submit.`);
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await axios.post('http://localhost:5000/api/placement', { essay });
      setResult(response.data);
    } catch (err) {
      setError('Error evaluating your essay. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Placement Assessment</h1>
      <p>
        Please write a short essay (at least {minWords} words) on a topic of your choice.
        Our AI will evaluate your writing skills and place you in the appropriate level.
      </p>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="Type your essay here..."
          style={{ width: '100%', height: '200px', padding: '1rem', fontSize: '1rem', marginBottom: '0.5rem' }}
        />
        {/* ----- CHANGED: Live word count feedback ----- */}
        <p style={{ marginBottom: '1rem', color: wordCount < minWords ? 'red' : 'green' }}>
          Word Count: {wordCount} {wordCount < minWords && `(Need ${wordsLeft} more)`}
        </p>
        <button
          type="submit"
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
          disabled={loading || wordCount < minWords}
        >
          {loading ? 'Evaluating...' : 'Submit Essay'}
        </button>
      </form>
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
