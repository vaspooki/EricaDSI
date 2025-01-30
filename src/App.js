import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <SearchBar />
    </div>
  );
}

export default App;
