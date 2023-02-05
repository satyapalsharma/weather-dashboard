const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = process.env.REACT_APP_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';

/**
 * Generic helper function to make API requests to the OpenWeatherMap API.
 * It handles constructing the URL, making the fetch request, and basic error handling.
 *
 * @param {string} endpoint - The specific API endpoint (e.g., 'weather', 'forecast').
 * @param {string} city - The name of the city for which to fetch data.
 * @returns {Promise<object>} - A promise that resolves to the JSON response from the API.
 * @throws {Error} - Throws an error if the API key is missing, the network request fails,
 *                   or the API returns an error status.
 */
const fetchData = async (endpoint, city) => {
  if (!API_KEY) {
    console.error('OpenWeather API key is not defined. Please set REACT_APP_OPENWEATHER_API_KEY in your .env.local file.');
    throw new Error('API key missing. Please configure your environment variables.');
  }

  // Construct the full URL with city, API key, and units (metric for Celsius)
  const url = `${BASE_URL}/${endpoint}?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);

    // Check if the HTTP response was successful (status code 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      // OpenWeather API often returns a 'message' field for errors (e.g., city not found)
      const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      console.error(`API Error for ${city} (${endpoint}):`, errorMessage);
      throw new Error(`Could not fetch data for "${city}". ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    // Catch network errors or errors thrown by response.json()
    console.error(`Network or parsing error fetching data from ${url}:`, error);
    throw new Error(`Failed to connect to weather service. Please check your internet connection or try again later. Details: ${error.message}`);
  }
};

/**
 * Fetches current weather data for a specified city.
 *
 * @param {string} city - The name of the city.
 * @returns {Promise<object>} - A promise that resolves to a simplified object
 *                               containing key current weather information.
 */
export const getCurrentWeather = async (city) => {
  const data = await fetchData('weather', city);

  // Extract and simplify relevant current weather data for easier consumption by components
  return {
    id: data.id,
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
    icon: data.weather[0].icon, // Icon code (e.g., '04d')
    mainWeather: data.weather[0].main, // Main weather condition (e.g., 'Clouds')
    timestamp: data.dt * 1000, // Convert Unix timestamp to milliseconds
  };
};

/**
 * Fetches 5-day / 3-hour weather forecast data for a specified city.
 *
 * @param {string} city - The name of the city.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of simplified
 *                                     forecast data points, each representing a 3-hour interval.
 */
export const getWeatherForecast = async (city) => {
  const data = await fetchData('forecast', city);

  // The 'list' array contains forecast data for every 3 hours.
  // We map over this list to extract and simplify the most relevant fields.
  // The consuming component (e.g., ForecastChart) will then process this list
  // further (e.g., aggregate into daily forecasts).
  return data.list.map(item => ({
    timestamp: item.dt * 1000, // Convert Unix timestamp to milliseconds
    temperature: item.main.temp,
    feelsLike: item.main.feels_like,
    humidity: item.main.humidity,
    pressure: item.main.pressure,
    windSpeed: item.wind.speed,
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    mainWeather: item.weather[0].main,
    dateTimeText: item.dt_txt, // Original date-time string from API (e.g., "2023-10-27 12:00:00")
  }));
};