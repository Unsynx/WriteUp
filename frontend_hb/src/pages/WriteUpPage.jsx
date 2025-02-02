// src/components/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router';

const WriteUpPage = () => {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState();
  const [showform, setShowform] = useState(true);


  async function handleSubmit(e) {
    e.preventDefault();

    const response = await axios.post('http://127.0.0.1:5000/api/writeup', {
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
  <div>
    { showform && (<form onSubmit={handleSubmit}>
            <input
                type="input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ width: '100%', padding: '0.5rem' }}
            />
            <button>Submit</button>
    </form>)} 
    {/* this is the uneditable essay submission */}
    {!showform && (
        <div>
          <h3>Original Text:</h3>
          <p>{text}</p>

          <h3>Highlighted Text:</h3>
          <p>{renderHighlightedText()}</p>
        </div>
      )}
    {/* this is the prose feedback for the future */}
    {!showform && (<div>
      {feedback && feedback.future ? (<p>{feedback.future}</p>) : (<p>loading</p>)}
      </div>)} 
    {/* highlight system */}
  </div>
);
}

export default WriteUpPage;