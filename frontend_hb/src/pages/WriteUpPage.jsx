// src/components/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

const WriteUpPage = () => {
  const [text, setText] = useState('');

  return (
    <div>
        <input
            type="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
        />
    </div>
  );
};

export default WriteUpPage;
