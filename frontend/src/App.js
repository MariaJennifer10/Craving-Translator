import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import FoodDetails from './components/FoodDetails';
import SearchHistory from './components/SearchHistory';

function App() {
  const [selectedFood, setSelectedFood] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 bg-pink-100">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">Craving Translator</h1>
      <SearchBar onSelectFood={setSelectedFood} />
      <FoodDetails food={selectedFood} />
      <SearchHistory userId="anonymous" />
    </div>
  );
}

export default App;