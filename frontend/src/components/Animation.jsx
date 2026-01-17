import React, { useState } from 'react';

const Animation = () => {
  const [isRunning, setIsRunning] = useState(true);

  return (
    <div className="min-h-screen bg-transparent overflow-hidden">
      <style jsx>{`
        @font-face {
          font-family: 'Muybridge';
          src: url('https://www.lorp.org/fonts/MuybridgeGX.woff2') format('woff2');
        }

        @keyframes gallop {
          from { font-variation-settings: "TIME" 0; }
          to { font-variation-settings: "TIME" 15; }
        }

        @keyframes run {
          0% { transform: translateX(-400px) translateY(-50%); }
          100% { transform: translateX(calc(100vw + 400px)) translateY(-50%); }
        }

        .horse {
          font-family: 'Muybridge';
          font-size: 250px;
          animation: 
            gallop 0.6s linear infinite,
            run 5s linear infinite;
          position: absolute;
          top: 50%;
          left: 0;
          cursor: pointer;
          color: #8B4513;
        }
      `}</style>

      <div 
        className="horse"
        style={{ animationPlayState: isRunning ? 'running' : 'paused' }}
        onClick={() => setIsRunning(!isRunning)}
      >
        🐎
      </div>
    </div>
  );
};

export default Animation;