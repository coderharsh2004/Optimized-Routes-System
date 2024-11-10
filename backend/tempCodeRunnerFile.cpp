#include <iostream>
#include <vector>
#include <climits>
#include <sstream>

using namespace std;

void dijkstra(const vector<vector<int>>& graph, int source, vector<int>& dist, vector<int>& parent) {
    int n = graph.size();
    dist.assign(n, INT_MAX);
    parent.assign(n, -1);
    dist[source] = 0;
    
    vector<bool> visited(n, false);

    for (int i = 0; i < n; ++i) {
        // Find the node with the minimum distance
        int u = -1;
        for (int j = 0; j < n; ++j) {
            if (!visited[j] && (u == -1 || dist[j] < dist[u])) {
                u = j;
            }
        }
        
        visited[u] = true;

        // Update distances for neighbors of u
        for (int v = 0; v < n; ++v) {
            if (graph[u][v] != -1 && dist[u] != INT_MAX && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
                parent[v] = u;
            }
        }
    }
}

int main() {
    int n, source;

    // Input number of nodes (vertices)
    cout << "Enter the number of nodes: ";
    cin >> n;

    // Initialize the graph (adjacency matrix)
    vector<vector<int>> graph(n, vector<int>(n, -1));

    // Input the graph edges and weights
    cout << "Enter the adjacency matrix (use -1 for no direct edge between nodes):\n";
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            if (i != j) {
                cout << "Enter weight for edge (" << i << " -> " << j << "): ";
                cin >> graph[i][j];
            }
        }
    }

    // Input source node for Dijkstra
    cout << "Enter the source node: ";
    cin >> source;

    // Vector to store distances and parents for path reconstruction
    vector<int> dist, parent;

    // Run Dijkstra's algorithm
    dijkstra(graph, source, dist, parent);

    // Output the shortest distances from source
    cout << "Shortest distances from source " << source << " are:\n";
    for (int i = 0; i < n; ++i) {
        if (dist[i] == INT_MAX) {
            cout << "Node " << i << ": INF\n";
        } else {
            cout << "Node " << i << ": " << dist[i] << "\n";
        }
    }

    return 0;
}
