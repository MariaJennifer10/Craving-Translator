import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodDetails = ({ food }) => {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (food) {
      setDetails(null); // Reset details when food changes
      setError(null); // Reset error
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/foods/${encodeURIComponent(food)}`)
        .then((res) => setDetails(res.data))
        .catch((err) => {
          console.error('Error fetching food details:', err);
          setError('Failed to load food details. Please try again.');
        });
    }
  }, [food]);

  if (!food) return null;

  if (error) {
    return (
      <div className="card max-w-lg mt-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!details) return null;

  return (
    <div className="card max-w-lg mt-6">
      {details.message ? (
        <p className="text-red-500">{details.message}</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-blue-500">{details['Craved Food']}</h2>
          <p className="text-red-500 mt-2">
            <strong className="text-base font-bold">Drawback:</strong>
            <span className="text-sm font-normal"> {details.Drawback}</span>
          </p>
          <p className="mt-4">
            <strong className="text-xl font-semibold">Healthy Alternative:</strong>
            <span className="text-sm font-normal"> {details['Healthy Alternative']}</span>
          </p>
          <p>
            <strong className="text-base font-bold">Ingredients:</strong>
            <span className="text-sm font-normal"> {details.Ingredients}</span>
          </p>
          <p>
            <strong className="text-base font-bold">Nutrient Content:</strong>
            <span className="text-sm font-normal"> {details['Nutrient Content']}</span>
          </p>
          <p>
            <strong className="text-base font-bold">Benefits:</strong>
            <span className="text-sm font-normal"> {details.Benefits}</span>
          </p>
        </>
      )}
    </div>
  );
};

export default FoodDetails;