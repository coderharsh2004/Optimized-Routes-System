import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/DijkstraForm.css';
import GraphDisplay from './GraphDisplay'; // Import the GraphDisplay component

const DijkstraForm = ({ onSubmit }) => {
  const [graph, setGraph] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [cities, setCities] = useState('');
  const [shortestPaths, setShortestPaths] = useState(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Reset error message on each submit attempt

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

    const cityNames = cities.split(',').map((city) => city.trim());
    const sourceIndex = cityNames.indexOf(source.trim());
    const destinationIndex = cityNames.indexOf(destination.trim());

    if (sourceIndex === -1) {
      setError('Source city not found in the list of cities.');
      return;
    }

    if (destinationIndex === -1) {
      setError('Destination city not found in the list of cities.');
      return;
    }

    // Call the onSubmit function, passing the graph and cities, and setShortestPaths for storing the result
    onSubmit(parsedGraph, sourceIndex, destinationIndex, cityNames, setShortestPaths);
    setIsModalOpen(true);
  };

  return (
    <div className="dijkstra-form-container">
      <h2 className="dijkstra-form-title">Enter Graph Data (Cities and Distances)</h2>
      <form onSubmit={handleSubmit} className="dijkstra-form">
        {/* City Names Field */}
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
        
        {/* Graph Matrix Field */}
        <label className="dijkstra-form-label">
          Graph (distances as a comma-separated matrix):
          <textarea
            value={graph}
            onChange={(e) => setGraph(e.target.value)}
            placeholder="Enter distances as rows of comma-separated numbers (e.g., 0,10,15,-1)"
            className="dijkstra-form-textarea"
          />
        </label>
        <br />

        {/* Source City Field */}
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

        {/* Destination City Field */}
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

      {/* Modal for showing results */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Dijkstra Result"
        ariaHideApp={false}
        className="dijkstra-modal"
      >
        <h3>Shortest Path from {source} to {destination}</h3>
        <p>
          {shortestPaths && shortestPaths.destinationDistance === 'Unreachable'
            ? 'Destination is Unreachable'
            : `Shortest Distance: ${shortestPaths ? shortestPaths.destinationDistance : 'Not calculated yet'}`}
        </p>

        {/* Render the path, if available */}
        {shortestPaths && shortestPaths.path && (
          <div>
            <h4>Shortest Path:</h4>
            <p>{shortestPaths.path.join(' → ')}</p> {/* Display the path as a series of cities */}
          </div>
        )}

        {/* Render the graph using the GraphDisplay component */}
        <GraphDisplay graph={graph.split('\n').map(row => row.split(',').map(Number))} cityNames={cities.split(',')} />

        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default DijkstraForm;
