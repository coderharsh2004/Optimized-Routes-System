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

    bool operator>(const Node& other) const {
        return dist > other.dist;
    }
};

// Dijkstra's algorithm function
void dijkstra(const vector<vector<int>>& graph, int source, vector<int>& dist, vector<int>& parent) {
    int n = graph.size();
    dist.assign(n, INT_MAX);
    parent.assign(n, -1);
    dist[source] = 0;

    priority_queue<Node, vector<Node>, greater<Node>> pq;
    pq.push({0, source});  // Start with the source node

    while (!pq.empty()) {
        int u = pq.top().vertex;
        int currentDist = pq.top().dist;
        pq.pop();

        if (currentDist > dist[u]) {
            continue;
        }

        for (int v = 0; v < n; ++v) {
            if (graph[u][v] != -1 && dist[u] != INT_MAX && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
                parent[v] = u;
                pq.push({dist[v], v});
            }
        }
    }
}

int main() {
    int n, source, destination;

    // Read the number of nodes
    if (!(cin >> n)) {
        cerr << "Error: Invalid input for the number of nodes." << endl;
        return 1;
    }

    vector<vector<int>> graph(n, vector<int>(n, -1));

    // Read the adjacency matrix
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            if (!(cin >> graph[i][j])) {
                cerr << "Error: Invalid input in adjacency matrix." << endl;
                return 1;
            }
            if (i == j) {
                graph[i][j] = 0;
            }
        }
    }

    // Read source and destination
    if (!(cin >> source >> destination) || source < 0 || source >= n || destination < 0 || destination >= n) {
        cerr << "Invalid source or destination node!" << endl;
        return 1;
    }

    vector<int> dist, parent;

    // Run Dijkstra's algorithm
    dijkstra(graph, source, dist, parent);

    // Output shortest distance
    if (dist[destination] == INT_MAX) {
        cout << "INF" << endl;  // Unreachable destination
    } else {
        cout << dist[destination] << endl;  // Shortest distance
    }

    return 0;
}
