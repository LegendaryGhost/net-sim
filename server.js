class Server {
    pos_x;
    pos_y;
    ip_address;
    websites;
    radius = 25;
    selected = false;
    disabled = false;

    constructor(pos_x, pos_y, ip_address, websites) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.ip_address = ip_address;
        this.websites = websites;
    }

    draw(context) {
        let circle = new Path2D();
        circle.arc(this.pos_x, this.pos_y, this.radius, 0, 2 * Math.PI, false);

        if(this.disabled) {
            context.fillStyle = 'red'; // Fill color
        } else {
            context.fillStyle = 'blue'; // Fill color
        }
        context.fill(circle); // Fill the circle

        if(this.selected) {
            context.strokeStyle = '#FFFFFF'; // Stroke color
        } else {
            context.strokeStyle = '#000066'; // Stroke color
        }
        context.lineWidth = 5; // Stroke width
        context.stroke(circle); // Stroke the circle

        // Set the font properties
        context.font = '15px Arial';
        context.fillStyle = 'black';

        // Draw the text
        context.fillText(
            this.ip_address[0] + '.' + this.ip_address[1] + '.' + this.ip_address[2] + '.' + this.ip_address[3],
            this.pos_x - this.radius,
            this.pos_y + 2 * this.radius
        );
    }

    contains(x, y) {
        // Calculate the distance between the point (x, y) and the center of the circle
        let distance = Math.sqrt(Math.pow(x - this.pos_x, 2) + Math.pow(y - this.pos_y, 2));

        // Check if the distance is less than or equal to the radius
        return distance <= this.radius;
    }

}