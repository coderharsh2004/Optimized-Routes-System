import React, { useState } from 'react';
import './App.css'; // Importing the CSS file
import DijkstraForm from './components/DijkstraForm'; // Update the path if needed

const App = () => {
  const [error, setError] = useState(null);

  const handleDijkstraSubmit = async (graph, sourceIndex, destinationIndex, cityNames, setShortestPaths) => {
    console.log('Sending data to backend:', { graph, sourceIndex, destinationIndex, cityNames });

    try {
      // Sending data to backend via POST request
      const response = await fetch('http://localhost:5000/run-dijkstra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          graph,
          sourceIndex,  // Send source index
          destinationIndex,  // Send destination index
          cityNames,  // Send city names
        }),
      });

      // Handling the response
      if (!response.ok) {
        throw new Error('Error running Dijkstra algorithm');
      }

      const data = await response.json();

      // Check if the destination is reachable
      const { sourceCity, destinationCity, destinationDistance } = data;

      // Prepare the result for display
      setShortestPaths({
        sourceCity,
        destinationCity,
        destinationDistance,
      });
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message); // Display error message if request fails
    }
  };

  return (
    <div className="app-container">
      <h1>Dijkstra Algorithm - Find Shortest Path Between Cities</h1>
      <DijkstraForm onSubmit={handleDijkstraSubmit} />

      {/* Display error */}
      {error && (
        <div className="error-container">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default App;
