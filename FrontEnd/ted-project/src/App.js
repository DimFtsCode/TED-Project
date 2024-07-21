import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Register from './Register'; // Import the Register component

function App() {
  const [data, setData] = useState([]);
  const [newWord, setNewWord] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:5297/api/words')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const addWord = () => {
    axios.post('http://localhost:5297/api/words', JSON.stringify(newWord), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      setData(response.data);
      setNewWord('');
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  };

  const removeWord = (word) => {
    axios.delete(`http://localhost:5297/api/words/${word}`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </nav>
          <Routes>
            <Route 
              path="/" 
              element={
                <div>
                  <p>Data from SKata:</p>
                  <ul>
                    {data.map((item, index) => (
                      <li key={index}>
                        {item} <button onClick={() => removeWord(item)}>Remove</button>
                      </li>
                    ))}
                  </ul>
                  <input 
                    type="text" 
                    value={newWord} 
                    onChange={(e) => setNewWord(e.target.value)} 
                    placeholder="Add a new word" 
                  />
                  <button onClick={addWord}>Add Word</button>
                </div>
              } 
            />
            <Route path="/register" element={<Register />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
