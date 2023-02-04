import React from 'react';
import { formatTemperature, formatTime, getWeatherIconUrl } from '../utils/helpers';
import '../App.css'; // Assuming global styles or specific styles for this component are defined here

/**
 * CurrentWeather Component
 * Displays the current weather information for a given location.
 * It takes weather data and the selected unit system as props.
 *
 * @param {object} props - The component props.
 * @param {object | null} props.currentWeather - The current weather data object from the OpenWeather API.
 *                                                Can be null if data is not yet loaded or an error occurred.
 * @param {string} props.unit - The unit system ('metric' for Celsius, 'imperial' for Fahrenheit).
 */
const CurrentWeather = ({ currentWeather, unit }) => {
  // Render a placeholder or loading message if no current weather data is available.
  if (!currentWeather) {
    return (
      <div className="current-weather-container weather-card">
        <p className="loading-message">Search for a city to see current weather!</p>
      </div>
    );
  }

  // Destructure relevant data from the currentWeather object for easier access.
  // This assumes the structure of the OpenWeather API current weather response.
  const {
    name,
    sys: { country, sunrise, sunset },
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
    weather, // An array, we typically use the first element for main conditions
    wind: { speed: windSpeed },
    dt // Data calculation time, useful for displaying "Last updated"
  } = currentWeather;

  // Extract the main weather condition and icon from the 'weather' array.
  const mainWeather = weather[0];
  const weatherIconUrl = getWeatherIconUrl(mainWeather.icon);

  // Determine the appropriate wind speed unit based on the selected unit system.
  // OpenWeather API returns wind speed in m/s for metric and mph for imperial
  // when the 'units' parameter is passed in the API request.
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <div className="current-weather-container weather-card">
      {/* City Name and Country */}
      <h2 className="city-name">{name}, {country}</h2>
      {/* Display the last updated time for the weather data */}
      <p className="last-updated">Last updated: {formatTime(dt)}</p>

      {/* Main weather summary: icon, current temperature, and description */}
      <div className="weather-summary">
        <img
          src={weatherIconUrl}
          alt={mainWeather.description}
          className="weather-icon"
        />
        <div className="temperature-info">
          <p className="current-temp">{formatTemperature(temp, unit)}</p>
          <p className="weather-description">{mainWeather.description}</p>
        </div>
      </div>

      {/* Additional temperature details: feels like, min/max */}
      <div className="temp-details">
        <p>Feels like: {formatTemperature(feels_like, unit)}</p>
        <p>Min: {formatTemperature(temp_min, unit)} / Max: {formatTemperature(temp_max, unit)}</p>
      </div>

      {/* Detailed weather metrics in a grid layout */}
      <div className="weather-details-grid">
        <div className="detail-item">
          <span className="detail-label">Humidity:</span>
          <span className="detail-value">{humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind:</span>
          {/* Display wind speed, formatted to one decimal place */}
          <span className="detail-value">{windSpeed.toFixed(1)} {windUnit}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Pressure:</span>
          <span className="detail-value">{pressure} hPa</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Sunrise:</span>
          <span className="detail-value">{formatTime(sunrise)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Sunset:</span>
          <span className="detail-value">{formatTime(sunset)}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;