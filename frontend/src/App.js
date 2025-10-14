
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [lexiconResults, setLexiconResults] = useState([]);
  const [scope, setScope] = useState('NT');

  const handleSearch = async () => {
    setLexiconResults([]); // Clear lexicon results
    try {
      const response = await axios.get(`http://localhost:8000/search/grammatical`, {
        params: { query, scope },
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleLexicon = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/lexicon/lookup`, {
        params: { query },
      });
      setLexiconResults(response.data.results);
    } catch (error) {
      console.error('Error fetching lexicon results:', error);
    }
  };

  return (
    <div className="App">
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="... لټون"
          className="search-input"
        />
        <select value={scope} onChange={(e) => setScope(e.target.value)} className="scope-select">
          <option value="NT">NT</option>
          <option value="OT">OT</option>
          <option value="ALL">All</option>
        </select>
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <div className="button-container">
        <button onClick={handleSearch} className="action-button">Search</button>
        <button onClick={handleLexicon} className="action-button">Lexicon</button>
      </div>
      <div className="results-container">
        {results.map((result, index) => (
          <div key={index} className="result-item">
            {result}
          </div>
        ))}
        {lexiconResults.map((result, index) => (
          <div key={index} className="result-item">
            {JSON.stringify(result)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
