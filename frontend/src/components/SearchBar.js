import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = ({ onSelectFood }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length > 0) {
      axios.get('http://localhost:5000/api/foods')
        .then(res => {
          const filtered = res.data.filter(food =>
            food.toLowerCase().includes(query.toLowerCase())
          );
          setSuggestions(filtered);
        })
        .catch(err => console.error('Error fetching suggestions:', err));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelect = food => {
    setQuery('');
    setSuggestions([]);
    onSelectFood(food);
    axios.post('http://localhost:5000/api/search', {
      userId: 'anonymous',
      food,
    }).catch(err => console.error('Error saving search:', err));
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Enter your craving..."
        className="w-full p-3 rounded-full border-2 border-pink-300 focus:outline-none focus:border-blue-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border border-pink-300 rounded-lg mt-1 max-h-60 overflow-auto">
          {suggestions.map((food, index) => (
            <li
              key={index}
              onClick={() => handleSelect(food)}
              className="p-2 hover:bg-pink-100 cursor-pointer"
            >
              {food}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;