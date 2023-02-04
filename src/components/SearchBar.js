import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * SearchBar Component
 *
 * A functional React component for searching cities to display weather information.
 * It includes an input field, a search button, and basic input validation.
 *
 * @param {object} props - The component's props.
 * @param {function(string): void} props.onSearch - Callback function to execute when a search is submitted.
 * @param {boolean} [props.isLoading=false] - Indicates if a search operation is currently in progress,
 *                                            disabling the input and button.
 */
function SearchBar({ onSearch, isLoading = false }) {
  // State to hold the current value of the search input field
  const [searchTerm, setSearchTerm] = useState('');
  // State to manage and display validation errors
  const [error, setError] = useState('');
  // Ref to directly access the input DOM element, useful for focusing
  const inputRef = useRef(null);

  // Effect hook to focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Handles changes to the input field.
   * Updates the `searchTerm` state and clears any previous error messages
   * as the user starts typing again.
   *
   * @param {object} event - The change event object from the input field.
   */
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    // Clear error message if user starts typing after an error
    if (error) {
      setError('');
    }
  };

  /**
   * Handles the submission of the search form.
   * Prevents default form submission, validates the input, and calls the
   * `onSearch` prop with the trimmed search term if valid.
   *
   * @param {object} event - The form submission event object.
   */
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default browser form submission (page reload)

    const trimmedSearchTerm = searchTerm.trim();

    // Basic validation: check if the search term is empty
    if (!trimmedSearchTerm) {
      setError('Please enter a city name.');
      return; // Stop the submission if validation fails
    }

    // Call the parent component's search handler with the valid search term
    onSearch(trimmedSearchTerm);
    // Optionally, clear the search term after successful submission
    // setSearchTerm('');
    setError(''); // Clear any lingering errors after a successful submission
  };

  /**
   * Handles key down events, specifically for the 'Enter' key to submit the search.
   * This provides a convenient way for users to trigger a search without clicking the button.
   *
   * @param {object} event - The keyboard event object.
   */
  const handleKeyDown = (event) => {
    // If 'Enter' key is pressed and no search is currently loading, submit the form
    if (event.key === 'Enter' && !isLoading) {
      handleSubmit(event);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <div className="search-input-group">
        {/* Visually hidden label for accessibility */}
        <label htmlFor="city-search" className="sr-only">Search for a city</label>
        <input
          id="city-search"
          type="text"
          className="search-input"
          placeholder="Enter city name, e.g., London"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={inputRef} // Attach the ref to the input element
          disabled={isLoading} // Disable input while a search is in progress
          aria-label="City search input"
          // Provide accessibility feedback for validation errors
          aria-describedby={error ? "search-error" : undefined}
          aria-invalid={!!error} // Set to true if there's an error
        />
        <button
          type="submit"
          className="search-button"
          disabled={isLoading} // Disable button while a search is in progress
          aria-label="Search city weather"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {/* Display error message if `error` state is not empty */}
      {error && (
        <p id="search-error" className="search-error-message" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

// PropTypes for type checking and documentation, enhancing component robustness
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired, // onSearch must be a function and is required
  isLoading: PropTypes.bool,           // isLoading must be a boolean
};

export default SearchBar;