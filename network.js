class Network {
    servers = [];
    connections = [];
    selectedServer = null;
    linkingMode = false;

    draw(canvas, context, clientX, clientY) {
        context.fillStyle = "grey"; // Set the fill color to blue
        context.fillRect(0, 0, canvas.width, canvas.height);

        if (this.linkingMode) {
            context.strokeStyle = '#FFFFFF';
            context.lineWidth = 5; // Stroke width
            context.beginPath(); // Reset the current path
            context.moveTo(this.selectedServer.pos_x, this.selectedServer.pos_y); // Starting point
            context.lineTo(clientX, clientY); // Ending point
            context.stroke(); // Draw the line
        }

        context.strokeStyle = '#000066';
        context.lineWidth = 5; // Stroke width
        for (const connection of this.connections) {
            const x1 = connection.server1.pos_x;
            const y1 = connection.server1.pos_y;
            const x2 = connection.server2.pos_x;
            const y2 = connection.server2.pos_y;
            context.beginPath(); // Reset the current path
            context.moveTo(x1, y1); // Starting point
            context.lineTo(x2, y2); // Ending point
            context.stroke(); // Draw the line

            // Set the font properties
            context.font = '15px Arial';
            context.fillStyle = 'back';

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
    }
}