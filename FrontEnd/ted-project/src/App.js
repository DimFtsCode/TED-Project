import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5297/api/sample')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Data from API:</p>
        <ul>
          {data.map((item, index) => (
            <lu key={index}>{item}</lu>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
