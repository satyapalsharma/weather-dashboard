import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components (scales, elements, etc.)
// This is necessary to ensure Chart.js can render various chart types and features.
Chart.register(...registerables);

/**
 * ForecastChart Component
 * Displays a line chart of temperature forecasts over time using Chart.js.
 * It visualizes the 5-day / 3-hour temperature forecast data.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.forecastData - An array of forecast objects,
 *   each expected to have `dt_txt` (timestamp string) and `main.temp` (temperature).
 *   This data is typically fetched from the OpenWeather API's 5-day / 3-hour forecast endpoint.
 * @param {string} props.unit - The temperature unit ('metric' for Celsius, 'imperial' for Fahrenheit).
 *   Used to display the correct unit symbol in the chart labels and tooltips.
 */
const ForecastChart = ({ forecastData, unit }) => {
  // `chartRef` is a ref to the canvas DOM element where the Chart.js chart will be drawn.
  const chartRef = useRef(null);
  // `chartInstanceRef` is a ref to store the Chart.js instance itself.
  // This allows us to destroy and re-create/update the chart efficiently.
  const chartInstanceRef = useRef(null);

  // useEffect hook to handle chart initialization, updates, and cleanup.
  // It runs when `forecastData` or `unit` props change.
  useEffect(() => {
    // Ensure the canvas element is available before attempting to draw.
    if (!chartRef.current) {
      return;
    }

    // --- Cleanup previous chart instance ---
    // If a chart instance already exists, destroy it to prevent memory leaks
    // and ensure a clean re-render with new data or options.
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    // --- Handle no data scenario ---
    // If no forecast data is provided, there's nothing to chart.
    if (!forecastData || forecastData.length === 0) {
      return;
    }

    // --- Prepare data for Chart.js ---
    // Map the raw forecast data into labels (timestamps) and data points (temperatures).
    const labels = forecastData.map(item => {
      const date = new Date(item.dt_txt);
      // Format date and time for display on the X-axis, e.g., "Mar 15, 12:00".
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Use 24-hour format for consistency
      });
    });

    const temperatures = forecastData.map(item => item.main.temp);

    // Get the 2D rendering context of the canvas element.
    const ctx = chartRef.current.getContext('2d');

    // Determine the temperature unit symbol based on the `unit` prop.
    const tempUnitSymbol = unit === 'metric' ? '°C' : '°F