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
  const [hoveredIndex, setHoveredIndex] = useState(null);


  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    const token = localStorage.getItem('token');

    const response = await axios.post('http://127.0.0.1:5000/api/writeup', 
      { 'text': text, 'prompt': challenge.essay_prompt }, 
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
    if (!feedback || !feedback.highlights) return text;
  
    let segments = [];
  
    for (let i = 0; i < feedback.highlights.length; i++) {
      let [start, end] = feedback.highlights[i].range;
      let startNext = feedback.highlights[i + 1]?.range?.[0] || text.length;
  
      // Change color based on hover state
      const bgColor = hoveredIndex === i ? 'lightblue' : 'yellow';
  
      // Add the highlighted text
      segments.push(
        <span 
          key={`highlight-${i}`} 
          style={{ backgroundColor: bgColor, transition: "background-color 0.2s ease-in-out" }}
        >
          {text.substring(start, end)}
        </span>
      );
  
      // Add non-highlighted text
      segments.push(
        <span key={`text-${i}`} style={{ backgroundColor: 'white' }}>
          {text.substring(end, startNext)}
        </span>
      );
    }
  
    return segments;
  }
  

  function renderAdvice() {
    if (!feedback || !feedback.highlights) return text;
  
    return feedback.highlights.map((sec, index) => (
      <div 
        key={index} 
        onMouseEnter={() => setHoveredIndex(index)} 
        onMouseLeave={() => setHoveredIndex(null)}
        style={{ cursor: 'pointer', transition: "color 0.2s ease-in-out" }}
      >
        <h3 className='text-xl bold italic'>" {text.substring(sec.range[0], sec.range[1])} "</h3>
        <p className='mb-5 text-slate-500'>{sec.comment}</p>
      </div>
    ));
  }

// Helper for color-coding difficulty.
const getDifficultyColor = (diff) => {
  if (diff === 'Easy') return 'green';
  if (diff === 'Medium') return 'orange';
  if (diff === 'Hard') return 'red';
  return 'inherit';
};

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}


return ( 
  <div className='write_cont'>
    <div className='user_col'>
      {submitted ? (
        <div className='p-5'>
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
          {submitted && isEmpty(feedback) ? <TailSpin stroke='black' className='mr-3' height={"30px"}/> : ''} Submit
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
                <div className='quotes'>
                  {renderAdvice()}
                </div>
                <br /><hr /><br />
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