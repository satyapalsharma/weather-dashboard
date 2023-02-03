import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastChart from './components/ForecastChart';
import * as weatherService from './services/weatherService'; // Import all functions from weatherService
import './App.css';

/**
 * Main application component for the Weather Dashboard.
 * Manages state for weather data, city, units, loading, and errors.
 * Orchestrates data fetching and renders child components.
 */
function App() {
  // State to store the current weather data
  const [currentWeather, setCurrentWeather] = useState(null);
  // State to store the forecast data for the chart
  const [forecastData, setForecastData] = useState(null);
  // State to store the currently selected city
  const [city, setCity] = useState('London'); // Default city on initial load
  // State to manage loading status during data fetching
  const [loading, setLoading] = useState(false);
  // State to store any error messages encountered during data fetching
  const [error, setError] = useState(null);
  // State to manage temperature unit ('metric' for Celsius, 'imperial' for Fahrenheit)
  const [unit, setUnit] = useState('metric'); // Default to Celsius

  /**
   * Fetches current weather and 5-day/3-hour forecast data for a given city and unit.
   * This function is memoized using `useCallback` to prevent unnecessary re-creations
   * on every render, which helps optimize performance and avoids issues with `useEffect` dependencies.
   *
   * @param {string} selectedCity - The name of the city to fetch weather data for.
   * @param {string} selectedUnit - The temperature unit ('metric' or 'imperial').
   */
  const fetchWeatherData = useCallback(async (selectedCity, selectedUnit) => {
    setLoading(true); // Set loading state to true before fetching
    setError(null);   // Clear any previous errors

    try {
      // Fetch current weather data using the weather service
      const currentWeatherData = await weatherService.getWeatherByCity(selectedCity, selectedUnit);
      setCurrentWeather(currentWeatherData);

      // Fetch forecast data using the weather service
      const forecastWeatherData = await weatherService.getForecastByCity(selectedCity, selectedUnit);
      setForecastData(forecastWeatherData);

    } catch (err) {
      console.error("Failed to fetch weather data:", err);
      // Set a user-friendly error message
      setError(`Could not retrieve weather for "${selectedCity}". Please check the city name and try again.`);
      setCurrentWeather(null); // Clear previous data on error
      setForecastData(null);    // Clear previous data on error
    } finally {
      setLoading(false); // Set loading state to false after fetching (success or failure)
    }
  }, []); // Empty dependency array means this function is created once and never changes

  /**
   * useEffect hook to trigger data fetching when the component mounts
   * or when the `city` or `unit` state changes.
   * The `fetchWeatherData` function is included in the dependency array,
   * but since it's memoized with `useCallback` with an empty dependency array,
   * it won't cause unnecessary re-runs of this effect.
   */
  useEffect(() => {
    fetchWeatherData(city, unit);
  }, [city, unit, fetchWeatherData]); // Dependencies: city, unit, and the memoized fetchWeatherData function

  /**
   * Handles the search event triggered by the SearchBar component.
   * Updates the `city` state, which in turn triggers the `useEffect` hook
   * to fetch new weather data for the entered city.
   *
   * @param {string} newCity - The city name entered by the user.
   */
  const handleSearch = (newCity) => {
    if (newCity && newCity.trim() !== '') {
      setCity(newCity.trim());
    }
  };

  /**
   * Handles the change in temperature unit.
   * Toggles the `unit` state between 'metric' (Celsius) and 'imperial' (Fahrenheit).
   * This change also triggers the `useEffect` hook to refetch data with the new unit.
   */
  const handleUnitChange = () => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather Dashboard</h1>
      </header>

      <main className="App-main">
        {/* SearchBar component for city input */}
        <SearchBar onSearch={handleSearch} />

        {/* Unit toggle button */}
        <div className="unit-toggle-container">
          <button onClick={handleUnitChange} className="unit-toggle-button">
            Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
          </button>
        </div>

        {/* Conditional rendering for loading state */}
        {loading && <p className="loading-message">Loading weather data...</p>}

        {/* Conditional rendering for error messages */}
        {error && <p className="error-message">{error}</p>}

        {/* Render CurrentWeather and ForecastChart only when data is available
            and there's no loading or error state */}
        {!loading && !error && currentWeather && (
          <>
            {/* CurrentWeather component displays the current weather conditions */}
            <CurrentWeather data={currentWeather} unit={unit} />

            {/* ForecastChart component displays the 5-day forecast data */}
            {forecastData && <ForecastChart data={forecastData} unit={unit} />}
          </>
        )}

        {/* Display a message if no data is available and not currently loading or in an error state */}
        {!loading && !error && !currentWeather && !forecastData && (
          <p className="no-data-message">Search for a city to see the weather!</p>
        )}
      </main>

      <footer className="App-footer">
        <p>&copy; {new Date().getFullYear()} Weather Dashboard. Powered by OpenWeatherMap API.</p>
      </footer>
    </div>
  );
}

export default App;