import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css'; // CSSをインポート


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        <LikeButton />
      </header>
    </div>
  );
}

function LikeButton() {
  const [count, setCount] = useState(999);
  const handleClick = () => {
    setCount(count + 1);
  }
  return (
    <span className="likeButton" onClick={handleClick}>♥ {count}</span>
  );
}

export default App;
