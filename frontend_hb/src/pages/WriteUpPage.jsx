// src/components/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router';

const WriteUpPage = () => {
  const [text, setText] = useState('');

  async function handleSubmit() {
    await axios.post('http://localhost:5000/api/writeup', {
        "text": text
    }, {
      timeout:20000
    })
    setFeedback(response.data);
    console.log(response.data)
  }

  function renderHighlightedText() {
    // If there is no feedback or no highlights, return the plain text.
    if (!feedback || !feedback.highlights) return text;

    let segments = [];
    let prevIndex = 0;

    // Loop through each highlight range.
    feedback.highlights.forEach((index) => {
      console.log(index.range)
      const [start, end] = index.range;

      // Add non-highlighted text before the highlight.
      segments.push(
        <span key={`normal-${index}`}>
          {text.slice(prevIndex, start)}
        </span>
      );

      // Add the highlighted text.
      segments.push(
        <span key={`highlight-${index}`} style={{ backgroundColor: 'yellow' }}>
          {text.slice(start, end)}
        </span>
      );

      // Update the previous index.
      prevIndex = end;
    });

    // Append any remaining text after the last highlight.
    segments.push(
      <span key="last">
        {text.slice(prevIndex)}
      </span>
    );

    return segments;
  }


  return (
    <form onSubmit={handleSubmit}>
        <input
            type="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
        />
        <button>Submit</button>
    </form>
  );
};

export default WriteUpPage;
