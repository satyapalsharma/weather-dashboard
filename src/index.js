import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global styles for the application
import App from './App'; // The root component of our React application

/**
 * This is the entry point of the React application.
 * It renders the main App component into the DOM.
 *
 * Using React 18's createRoot API for better performance and new features.
 */

// Find the root DOM element where the React app will be mounted.
// This element is typically defined in public/index.html with an id of 'root'.
const rootElement = document.getElementById('root');

// Ensure the root element exists before attempting to create a root.
if (rootElement) {
  // Create a React root. This is the new way to render in React 18+.
  // It enables concurrent features and improved performance.
  const root = ReactDOM.createRoot(rootElement);

  // Render the App component into the root.
  // React.StrictMode is a tool for highlighting potential problems in an application.
  // It activates additional checks and warnings for its descendants during development mode.
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Log an error if the root element is not found, which would prevent the app from starting.
  console.error('Failed to find the root element. Make sure an element with id="root" exists in public/index.html.');
}