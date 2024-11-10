import React, { useState } from 'react';
import '../styles/DijkstraForm.css';

const DijkstraForm = ({ onSubmit }) => {
  const [graph, setGraph] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState(''); // New state for destination city
  const [cities, setCities] = useState('');
  const [shortestPaths, setShortestPaths] = useState(null);  // State to store the results
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Reset error message on each submit attempt

    // Parse graph input into a proper format (parse as a matrix)
    let parsedGraph;
    try {
      parsedGraph = graph
        .split('\n')
        .map((row) => row.split(',').map((item) => {
          const num = Number(item.trim());
          if (isNaN(num)) throw new Error('Invalid distance value');
          return num;
        }));
    } catch (err) {
      setError('Invalid graph format. Ensure the input is a valid comma-separated matrix.');
      return;
    }

    // Parse cities
    const cityNames = cities.split(',').map((city) => city.trim()); // Split cities and trim spaces

    // Find the source index based on the city name
    const sourceIndex = cityNames.indexOf(source.trim()); // Trim spaces for consistency
    const destinationIndex = cityNames.indexOf(destination.trim()); // Trim spaces for destination city

    if (sourceIndex === -1) {
      setError('Source city not found in the list of cities.');
      return;
    }

    if (destinationIndex === -1) {
      setError('Destination city not found in the list of cities.');
      return;
    }

    // Call the onSubmit with parsed data
    onSubmit(parsedGraph, sourceIndex, destinationIndex, cityNames, setShortestPaths); // Pass destination index
  };

  return (
    <div className="dijkstra-form-container">
      <h2 className="dijkstra-form-title">Enter Graph Data (Cities and Distances)</h2>
      <form onSubmit={handleSubmit} className="dijkstra-form">
        <label className="dijkstra-form-label">
          City Names (comma-separated):
          <input
            type="text"
            value={cities}
            onChange={(e) => setCities(e.target.value)}
            placeholder="Enter city names (e.g., CityA,CityB,CityC)"
            className="dijkstra-form-input"
          />
        </label>
        <br />
        <label className="dijkstra-form-label">
          Graph (distances as a comma-separated matrix, e.g. 0,1,4,0):
          <textarea
            value={graph}
            onChange={(e) => setGraph(e.target.value)}
            placeholder="Enter distances as rows of comma-separated numbers"
            className="dijkstra-form-textarea"
          />
        </label>
        <br />
        <label className="dijkstra-form-label">
          Source City:
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter source city"
            className="dijkstra-form-input"
          />
        </label>
        <br />
        <label className="dijkstra-form-label">
          Destination City:
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination city"
            className="dijkstra-form-input"
          />
        </label>
        <br />
        <button type="submit" className="dijkstra-form-button">
          Run Dijkstra
        </button>

        {/* Display any error messages */}
        {error && <p className="error-message">{error}</p>}
      </form>

      {/* Display shortest path results */}
      {shortestPaths && (
        <div className="dijkstra-results">
          <h3>Shortest Path from {source} to {destination}</h3>
          <p>
            {shortestPaths[destination] === Infinity
              ? 'Destination is Unreachable'
              : `Shortest Distance: ${shortestPaths[destination]}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default DijkstraForm;

