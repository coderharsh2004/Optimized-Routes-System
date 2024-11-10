#include <iostream>
#include <vector>
#include <climits>
#include <queue>
#include <sstream>

using namespace std;

// Define a structure for the priority queue element
struct Node {
    int dist;  // The distance from the source
    int vertex;  // The node index

    // Comparison operator to prioritize nodes with smaller distances
    bool operator>(const Node& other) const {
        return dist > other.dist;
    }
};

// Dijkstra's algorithm using a priority queue
void dijkstra(const vector<vector<int>>& graph, int source, vector<int>& dist, vector<int>& parent) {
    int n = graph.size();
    dist.assign(n, INT_MAX);
    parent.assign(n, -1);
    dist[source] = 0;

    // Priority queue to store {distance, node} pairs. It automatically sorts by distance.
    priority_queue<Node, vector<Node>, greater<Node>> pq;
    pq.push({0, source});  // Start with the source node

    while (!pq.empty()) {
        // Get the node with the smallest distance
        int u = pq.top().vertex;
        int currentDist = pq.top().dist;
        pq.pop();

        // If the distance is outdated, skip processing this node
        if (currentDist > dist[u]) {
            continue;
        }

        // Update the distances to neighboring nodes
        for (int v = 0; v < n; ++v) {
            if (graph[u][v] != -1 && dist[u] != INT_MAX && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
                parent[v] = u;
                pq.push({dist[v], v});  // Push the updated distance and node into the priority queue
            }
        }
    }
}

int main() {
    int n, source, destination;

    // Read the number of nodes (vertices)
    cin >> n;

    // Initialize the graph (adjacency matrix)
    vector<vector<int>> graph(n, vector<int>(n, -1));

    // Read the adjacency matrix (space-separated values, -1 for no edge)
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            cin >> graph[i][j];
            if (i == j) {
                graph[i][j] = 0;  // Distance to itself is always 0
            }
        }
    }

    // Read the source and destination nodes
    cin >> source >> destination;

    // Validate source and destination indices
    if (source < 0 || source >= n || destination < 0 || destination >= n) {
        cout << "Invalid source or destination node!" << endl;
        return 1;
    }

    // Vectors to store distances and parents for path reconstruction
    vector<int> dist, parent;

    // Run Dijkstra's algorithm
    dijkstra(graph, source, dist, parent);

    // Output the shortest distances from source
    if (dist[destination] == INT_MAX) {
        cout << "INF\n";  // Destination is unreachable
    } else {
        cout << dist[destination] << "\n";  // Output the shortest distance to the destination
    }

    return 0;
}
