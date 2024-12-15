import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = () => {
  const [query, setQuery] = useState<string>(""); // User input
  const [results, setResults] = useState<string | null>(""); // Displayed results or errors
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [city, setCity] = useState<string>(""); // Access the context to update the city

  const API_URL = "https://api.openweathermap.org/data/2.5/forecast"; // OpenWeather API URL
  const API_KEY = "5c39343e5c27e119e010125e99fa753a"; // Replace with your OpenWeather API key

  useEffect(() => {
    // Only make a request if the query has a value (i.e., user has entered something)
    if (query.length === 0) {
      setResults(""); // Reset results if query is empty
      return;
    }

    // Fetch results from the API
    const fetchResults = async () => {
      setLoading(true); // Start loading

      try {
        // Make the API request with city name as the query parameter
        const response = await axios.get(API_URL, {
          params: {
            q: query, // City query
            mode: "json", // JSON response format
            appid: API_KEY, // API key
          },
        });

        // Check if the response has valid data (city found)
        if (response.data && response.data.city) {
          setResults(
            `Weather in ${response.data.city.name}: ${response.data.list[0].weather[0].description}, Temperature: ${response.data.list[0].main.temp}°C`
          ); // Display weather description and temperature
          setCity(response.data.city.name); // Update the global city
        } else {
          setResults("No results found.");
        }
      } catch (error) {
        setResults("Error fetching data, please try again later.");
      } finally {
        setLoading(false); // End loading
      }
    };

    // Debounce the API call to avoid too many requests while typing
    const debounceTimer = setTimeout(() => {
      fetchResults(); // Call the API after 500ms delay
    }, 500);

    // Cleanup debounce timer on component unmount or query change
    return () => clearTimeout(debounceTimer);
  }, [query, setCity]); // Re-run when the `query` changes

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update query when user types
        placeholder="Enter city..."
        className="search-input"
      />
      {loading && <p>Loading...</p>} {/* Show loading status */}
      <div>
        <p>{results}</p> {/* Show results or error message */}
      </div>
    </div>
  );
};

export default SearchBar;
