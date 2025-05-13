// File: src/App.js
import React, { useState, useEffect } from "react";
import './index.css';

function App() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(5000);
  const [noResults, setNoResults] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [cuisine, setCuisine] = useState("");

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  const searchNearbyRestaurants = (lat, lng, callback, failCallback) => {
    const location = new window.google.maps.LatLng(lat, lng);
    const map = new window.google.maps.Map(document.createElement("div"));
    const service = new window.google.maps.places.PlacesService(map);

    let didRespond = false;

    const timer = setTimeout(() => {
      if (!didRespond) {
        console.warn("Timeout: Google Places API took too long.");
        failCallback();
      }
    }, 7000);

    service.nearbySearch(
      {
        location: location,
        radius: radius,
        type: 'restaurant',
        keyword: cuisine || undefined
      },
      (results, status) => {
        clearTimeout(timer);
        didRespond = true;

        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const filteredResults = results.filter(
            (place) => !place.name.toLowerCase().includes("gas station")
          );
          callback(filteredResults);
        } else {
          console.error("Places API error:", status);
          failCallback();
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
    setNoResults(false);
    setRestaurant(null);

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      searchNearbyRestaurants(
        lat,
        lng,
        (places) => {
          if (places.length === 0) {
            setNoResults(true);
          } else {
            const random = places[Math.floor(Math.random() * places.length)];
            setRestaurant(random);
          }
          setLoading(false);
        },
        () => {
          setNoResults(true);
          setLoading(false);
        }
      );
    }, (error) => {
      setLoading(false);
      console.error("Geolocation error:", error);
      alert(`Failed to fetch location: ${error.message}`);
    }, { timeout: 7000 });
  };

  const cuisines = [
    { label: "Any", value: "", emoji: "🌐" },
    { label: "Italian", value: "italian", emoji: "🍝" },
    { label: "Mexican", value: "mexican", emoji: "🌮" },
    { label: "Chinese", value: "chinese", emoji: "🥡" },
    { label: "Indian", value: "indian", emoji: "🍛" },
    { label: "Japanese", value: "japanese", emoji: "🍣" },
    { label: "Thai", value: "thai", emoji: "🍜" }
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-white to-gray-50 text-black'} min-h-screen w-full p-4 flex flex-col items-center`}>
      <h1 className="text-center text-4xl sm:text-5xl font-header text-ketchup mb-6 leading-tight drop-shadow-sm">🍔 Eats Roulette 🍟</h1>

      <div className={`w-full max-w-md rounded-xl shadow-lg p-4 mb-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Search Radius: {radius / 1000} km</label>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-ketchup"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">Choose Cuisine</label>
          <div className="flex flex-wrap gap-2 justify-center">
            {cuisines.map((item) => (
              <button
                key={item.value}
                onClick={() => setCuisine(item.value)}
                className={`text-sm px-4 py-2 rounded-full font-semibold border transition ${
                  cuisine === item.value
                    ? 'bg-ketchup text-white border-ketchup'
                    : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{item.emoji}</span>{item.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={fetchRestaurant}
          className="w-full bg-mustard hover:bg-ketchup text-black font-bold px-4 py-3 rounded-lg shadow transition-all duration-200 transform hover:scale-105"
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2 animate-pulse">
              <svg className="w-5 h-5 animate-spinPlate" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="4" strokeDasharray="31.4" strokeLinecap="round"/>
              </svg>
              Spinning...
            </span>
          ) : (
            <span>🎲 Spin to Dine!</span>
          )}
        </button>

        {noResults && (
          <div className="mt-4 text-center text-red-500 font-semibold">
            😞 No restaurants found or request timed out.
          </div>
        )}
      </div>

      {restaurant && (
        <div className={`max-w-md w-full rounded-xl shadow-lg p-4 border animate-fade-in ${darkMode ? 'bg-gray-800 border-green-700' : 'bg-white border-lettuce'}`}>
          <h2 className="text-2xl font-header text-ketchup mb-2 text-center">{restaurant.name}</h2>
          <p className="text-md text-center">⭐ {restaurant.rating || "N/A"}</p>
          <p className="text-sm text-center mb-3">📍 {restaurant.vicinity || "Unknown address"}</p>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${restaurant.geometry.location.lat()},${restaurant.geometry.location.lng()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center w-full sm:w-auto text-white bg-lettuce hover:bg-green-700 px-4 py-2 rounded-full font-semibold"
            >
              View on Map
            </a>
            <button
              onClick={fetchRestaurant}
              className="text-center w-full sm:w-auto bg-ketchup text-white hover:bg-red-700 px-4 py-2 rounded-full font-bold"
            >
              🔁 Spin Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
