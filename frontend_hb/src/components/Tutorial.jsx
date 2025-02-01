// src/components/Tutorial.jsx
import React from 'react';

const Tutorial = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2>Welcome to WriteQuest!</h2>
      <p>
        In this tutorial, we'll guide you through the key features of our platform:
      </p>
      <ol>
        <li><strong>Placement Assessment:</strong> Test your writing skills and get placed at your appropriate level.</li>
        <li><strong>Daily Quests:</strong> Engage in quick writing challenges to build your skills.</li>
        <li><strong>Competitions:</strong> Participate in contests to win real prizes and recognition.</li>
        <li><strong>Leaderboard & Badges:</strong> Track your progress, earn badges, and climb the leaderboard.</li>
        <li><strong>Community & Feedback:</strong> Join our community to get feedback and collaborate with other writers.</li>
      </ol>
      <p>
        Use the navigation menu to explore these features, and feel free to revisit this tutorial anytime.
      </p>
    </div>
  );
};

export default Tutorial;
