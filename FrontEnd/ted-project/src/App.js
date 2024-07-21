import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [newWord, setNewWord] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:5297/api/sample')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const addWord = () => {
    axios.post('http://localhost:5297/api/sample', JSON.stringify(newWord), {
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
    axios.delete(`http://localhost:5297/api/sample/${word}`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
