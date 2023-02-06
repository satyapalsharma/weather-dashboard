```javascript
/**
 * src/utils/helpers.js
 *
 * This file contains a collection of utility functions designed to assist with common tasks
 * in the Weather Dashboard application, such as temperature conversions, date/time formatting,
 * and weather icon URL generation.
 *
 * These helpers promote code reusability and maintainability by centralizing common logic.
 */

/**
 * Converts temperature from Kelvin to Celsius.
 * OpenWeatherMap API often returns temperatures in Kelvin by default.
 *
 * @param {number} kelvin - Temperature in Kelvin.
 * @returns {number} Temperature in Celsius, rounded to one decimal place. Returns NaN for invalid input.
 */
export const kelvinToCelsius = (kelvin) => {
  