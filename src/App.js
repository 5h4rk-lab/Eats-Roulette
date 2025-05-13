import React, { useState } from "react";
import './index.css';

function App() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchNearbyRestaurants = (lat, lng, callback) => {
    const location = new window.google.maps.LatLng(lat, lng);
    const map = new window.google.maps.Map(document.createElement('div'));

    const service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location: location,
        radius: 5000,
        type: 'restaurant',
        openNow: true,
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          callback(results);
        } else {
          console.error("Places API error:", status);
          callback([]);
        }
      }
    );
  };

  const fetchRestaurant = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      searchNearbyRestaurants(lat, lng, (places) => {
        if (places.length === 0) {
          alert("No restaurants found nearby.");
          setLoading(false);
          return;
        }
        const random = places[Math.floor(Math.random() * places.length)];
        setRestaurant(random);
        setLoading(false);
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Eats Roulette</h1>
      <button
        onClick={fetchRestaurant}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded shadow"
      >
        {loading ? "Spinning..." : "Spin to Dine"}
      </button>

      {restaurant && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-2">{restaurant.name}</h2>
          <p className="mb-1">⭐ {restaurant.rating || "N/A"}</p>
          <p className="mb-1">📍 {restaurant.vicinity}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${restaurant.geometry.location.lat()},${restaurant.geometry.location.lng()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View on Map
          </a>
        </div>
      )}
    </div>
  );
}

export default App;