
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
  console.log(graph, sourceIndex, destinationIndex, cityNames);

  // Convert the graph to a string representation that can be passed to the C++ program
  const graphString = graph.map(row => row.join(' ')).join('\n');
  
  // Create the input string in the expected format for the C++ program
  const input = `${graphString}\n${sourceIndex} ${destinationIndex}`;
  console.log('Input to C++ program:\n', input)
  // Resolve the absolute path to the executable
  const dijkstraPath = path.resolve(__dirname, 'dij.exe'); // Ensure the C++ program is in the same directory
  console.log('Executable path:', dijkstraPath);
  // Run the compiled C++ program using the resolved path and pass the input via stdin
  exec(dijkstraPath, { input: input }, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send('Error running C++ program');
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      res.status(500).send('Error running C++ program');
      return;
    }

    // Log stdout to debug the C++ program's output
    console.log(`stdout: ${stdout}`);

    // Assuming the C++ program outputs the distance as a single value
    const distance = stdout.trim();

    // Get the distance to the destination city
    const destinationDistance = distance === 'INF' ? 'Unreachable' : distance;

    // Get the result to send back to the frontend
    const result = {
      sourceCity: cityNames[sourceIndex],
      destinationCity: cityNames[destinationIndex],
      destinationDistance
    };

    // Send the result to the frontend
    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
