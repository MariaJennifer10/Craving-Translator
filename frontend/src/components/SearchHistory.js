import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/search-history?userId=${userId}`)
      .then(res => setHistory(res.data))
      .catch(err => console.error('Error fetching history:', err));
  }, [userId]);

  return (
    <div className="card max-w-lg mt-6">
      <h2 className="text-xl font-bold text-blue-500">Search History</h2>
      {history.length === 0 ? (
        <p>No search history available.</p>
      ) : (
        <ul className="mt-4">
          {history.map((item, index) => (
            <li key={index} className="py-1">
              {item.food} - {new Date(item.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchHistory;