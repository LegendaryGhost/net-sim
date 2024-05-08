class Network {
    servers = [];
    connections = [];
    selectedServer = null;
    linkingMode = false;

    constructor() {
        this.servers = [
            new Server(50, 50, [127, 0, 0, 1], []),
            new Server(30, 500, [127, 0, 0, 2], ['facebook.com']),
            new Server(400, 30, [127, 0, 0, 3], []),
            new Server(200, 300, [127, 0, 0, 4], []),
            new Server(300, 400, [127, 0, 0, 5], ['facebook.com'])
        ]
        this.addConnection(this.servers[0], this.servers[3], 10);
        this.addConnection(this.servers[0], this.servers[2], 7);
        this.addConnection(this.servers[1], this.servers[3], 11);
        this.addConnection(this.servers[3], this.servers[4], 6);
        this.addConnection(this.servers[2], this.servers[4], 4);
    }

    draw(canvas, context, clientX, clientY) {
        context.fillStyle = "grey"; // Set the fill color to blue
        context.fillRect(0, 0, canvas.width, canvas.height);

        if (this.linkingMode) {
            context.strokeStyle = '#FFFFFF';
            context.lineWidth = 5; // Stroke width
            context.beginPath(); // Reset the current path
            context.moveTo(this.selectedServer.posX, this.selectedServer.posY); // Starting point
            context.lineTo(clientX, clientY); // Ending point
            context.stroke(); // Draw the line
        }

        context.strokeStyle = '#000066';
        context.lineWidth = 5; // Stroke width
        for (const connection of this.connections) {
            const x1 = connection.server1.posX;
            const y1 = connection.server1.posY;
            const x2 = connection.server2.posX;
            const y2 = connection.server2.posY;
            context.beginPath(); // Reset the current path
            context.moveTo(x1, y1); // Starting point
            context.lineTo(x2, y2); // Ending point
            context.stroke(); // Draw the line

            // Set the font properties
            context.font = '15px Arial';
            context.fillStyle = 'black';

            // Draw the text
            context.fillText(
                connection.latency,
                x1 + (x2 - x1) / 2 - 15,
                y1 + (y2 - y1) / 2 - 15
            );
        }

        this.servers.forEach(server => server.draw(context));
    };

    addServer(server) {
        this.servers.push(server);
    }

    addConnection(server1, server2, latency) {
        this.connections.push({ server1, server2, latency });
        server1.neighbours.push(server2);
        server2.neighbours.push(server1);
    }

    dijkstra(senderIp, receiverIp) {
        const senderServer = this.servers.find(server => server.ipAddress.join('.') === senderIp);
        const receiverServer = this.servers.find(server => server.ipAddress.join('.') === receiverIp);
        let currentServer = senderServer;

        this.servers.forEach(server => {
            server.colored = false;
            server.distance = Infinity;
            server.previous = null;
        });
        senderServer.distance = 0;

        while (currentServer) {
            const currentIp = currentServer.ipAddress.join('.');
            currentServer.colored = true;
            currentServer.neighbours.forEach(neighbour => {
                const neighbourIp = neighbour.ipAddress.join('.');
                const connection = this.connections.find(
                    connection =>
                        (connection.server1.ipAddress.join('.') === currentIp && connection.server2.ipAddress.join('.') === neighbourIp) ||
                        (connection.server1.ipAddress.join('.') === neighbourIp && connection.server2.ipAddress.join('.') === currentIp)
                );
                const distance = currentServer.distance + connection.latency;
                if(!neighbour.colored && !neighbour.disabled && distance < neighbour.distance) {
                    neighbour.distance = distance;
                    neighbour.previous = currentServer;
                }
            });

            currentServer = null;
            for (const server of this.servers) {
                if (!server.colored && !server.disabled) {
                    if (!currentServer) {
                        currentServer = server;
                    } else if(server.distance < currentServer.distance) {
                        currentServer = server;
                    }
                }
            }
        }

        const shortestPath = [];
        let previous = receiverServer;
        while (previous) {
            shortestPath.push(previous);
            previous = previous.previous;
        }

        return {path: shortestPath, distance: receiverServer.distance};
    }
}