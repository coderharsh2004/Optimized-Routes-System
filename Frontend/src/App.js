import React, { useState } from 'react';
import './App.css'; // Importing the CSS file
import DijkstraForm from './components/DijkstraForm'; // Update the path if needed

const App = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const handleDijkstraSubmit = async (graph, sourceIndex, destinationIndex, cityNames) => {
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
      const resultString = `
        Source City: ${sourceCity}
        Destination City: ${destinationCity}
        Shortest Distance: ${destinationDistance === 'Unreachable' ? 'Unreachable' : destinationDistance}
      `;

      setResult(resultString); // Set the result to display
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message); // Display error message if request fails
      setResult(null); // Clear any previous results
    }
  };

  return (
    <div className="app-container">
      <h1>Dijkstra Algorithm - Find Shortest Path Between Cities</h1>
      <DijkstraForm onSubmit={handleDijkstraSubmit} />
      
      {/* Display result or error */}
      {result && (
        <div className="result-container">
          <h3>Shortest Path from Source to Destination:</h3>
          <pre>{result}</pre>
        </div>
      )}

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
