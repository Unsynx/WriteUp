// src/components/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

const WriteUpPage = () => {
  const [text, setText] = useState('');

  async function handleSubmit() {
    await axios.post('http://localhost:5000/api/writeup', {
        "text": text
    })
    
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
