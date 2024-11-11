const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 5000;

// Enable CORS for cross-origin requests from the frontend
app.use(cors());
app.use(express.json());

// Route to run the Dijkstra C++ code
app.post('/run-dijkstra', (req, res) => {
  const { graph, sourceIndex, destinationIndex, cityNames } = req.body;
  console.log('Received data:', graph, sourceIndex, destinationIndex, cityNames);

  // Convert the graph to a string representation that can be passed to the C++ program
  const graphString = graph.map(row => row.join(' ')).join('\n');
  
  // Create the input string in the expected format for the C++ program
  const input = `${graph.length}\n${graphString}\n${sourceIndex} ${destinationIndex}`;
  console.log('Input to C++ program:\n', input);

  // Resolve the absolute path to the executable
  const dijkstraPath = path.resolve(__dirname, 'dij.exe');
  console.log('Executable path:', dijkstraPath);

  // Execute the C++ program, passing input through stdin
  const child = exec(dijkstraPath, (error, stdout, stderr) => {
    if (error) {
      console.error('Execution error:', error.message);
      return res.status(500).json({ error: 'Error running C++ program' });
    }

    if (stderr) {
      console.error('stderr:', stderr);
      return res.status(500).json({ error: stderr });
    }

    // Log stdout for debugging and handle the output from the C++ program
    console.log('stdout:', stdout);
    const distance = stdout.trim();

    // Determine if the destination is reachable
    const destinationDistance = distance === 'INF' ? 'Unreachable' : distance;

    // Prepare the result to send back to the frontend
    const result = {
      sourceCity: cityNames[sourceIndex],
      destinationCity: cityNames[destinationIndex],
      destinationDistance
    };

    // Send the result back to the frontend
    res.json(result);
  });

  // Provide input to the child process via stdin
  child.stdin.write(input);
  child.stdin.end();
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
