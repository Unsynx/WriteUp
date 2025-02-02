// src/components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { data, useLocation } from 'react-router';
import './WriteUpPage.css'
import { TailSpin } from 'react-loading-icons'
import ChallengeGraph from '../components/ChallengeGraph.jsx'

const WriteUpPage = () => {
  const location = useLocation();
  const challenge = location.state;

  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState({});
  const [submitted, setSubmitted] = useState(false)
  const [graphData, setGraphData] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    const token = localStorage.getItem('token');

    const response = await axios.post('http://127.0.0.1:5000/api/writeup', 
      { 'text': text }, 
      { headers: { Authorization: `Bearer ${token}` } }, 
      { timeout: 20000 }
    )
    setFeedback(response.data);
    console.log(response.data)

    const r2 = await axios.post('http://127.0.0.1:5000/api/complete_challenge', { 
        'elo': response.data.elo,
        'challenge_id': challenge._id
       }, 
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setGraphData(r2.data.scores)
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

// Helper for color-coding difficulty.
const getDifficultyColor = (diff) => {
  if (diff === 'Easy') return 'green';
  if (diff === 'Medium') return 'orange';
  if (diff === 'Hard') return 'red';
  return 'inherit';
};


return ( 
  <div className='write_cont'>
    <div className='user_col'>
      {submitted ? (
        <div>
          <h3>Original Text:</h3>
          <p>{text}</p>
          <h3>Highlighted Text:</h3>
          <p>{renderHighlightedText()}</p>
        </div>
      ) : (
        <textarea
        placeholder='Start writing here...'
        className='essay_field'
        type="input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', resize: "none" }}
        />
      )}

    {/* this is the uneditable essay submission */}
    {/* this is the prose feedback for the future */}

    </div>
    <div className='feedback_col'>
      <div>
        <button 
        className='submit_w_btn'
        onClick={handleSubmit} disabled={submitted}>
          {submitted && !feedback ? <TailSpin stroke='black' className='mr-3' height={"30px"}/> : ''} Submit
        </button>
      </div>
      <div>
      <div className='p-5'>
        <h2 className='text-3xl mb-3'>{challenge.title}</h2>
        <p className='mb-3'>
          <strong>Difficulty:</strong>{' '}
          <span style={{ color: getDifficultyColor(challenge.difficulty) }}>
            {challenge.difficulty}
          </span>
        </p>
        <p>{challenge.essay_prompt}</p>
        <br /><hr /><br />

          {submitted && (<div>
            {feedback && feedback.future ? (
              <div>
                <p>{feedback.future}</p>
                <br /><hr /><br />
                <p className='text-2xl mb-5'>Your score: {feedback.elo}</p>
                <ChallengeGraph values={graphData} />
              </div>
              ) : (
              <p>Loading Feedback...</p>)
            }
            </div>)} 

        </div>
      </div>
    </div>
  </div>
)
}

export default WriteUpPage;