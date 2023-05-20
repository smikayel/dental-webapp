import React from 'react';
import logo from './logo.svg';
import Viewer from './shared/3dComponents/StlLoader/Viewer'

import './App.css';


function App() {
  return (
    <div className="App">
      {/* TODO: remove this commented part and change the structure for this text */}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
        </a>
      </header> */}
      <Viewer />
    </div>
  );
}

export default App;
