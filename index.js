const popUpBackground = document.getElementById('pop-up-background');
const addServerForm = document.getElementById('add-server-form');
const addServerMenu = document.getElementById("add-server-context");
const selectedServerForm = document.getElementById("selected-server-form");
const canvas = document.getElementById('network');
const context = canvas.getContext('2d');
let servers = [];
let selectedServer;

const getCanvasRelativeCoordinate = (absolute_x, absolute_y) => {
    const canvasRect = canvas.getBoundingClientRect();
    const x = absolute_x - canvasRect.left;
    const y = absolute_y - canvasRect.top;
    return {'x': x, 'y': y};
};

const selectServer = server => {
    for (const serverElement of servers) {
        serverElement.selected = false;
    }
    server.selected = true;
    selectedServer = server;
    selectedServerForm.querySelector('#selected-ip').textContent = server.ip_address.join('.');
    selectedServerForm.querySelector('#selected-websites').value = server.websites.join(';');
    drawNetwork();
};

const drawNetwork = () => {
    context.fillStyle = "grey"; // Set the fill color to blue
    context.fillRect(0, 0, canvas.width, canvas.height);

    servers.forEach(server => server.draw(context));
};

addServerForm.addEventListener('reset', () => {
    popUpBackground.style.display = 'none';
    addServerForm.style.display = 'none';
    addServerMenu.style.display = 'none';
});

addServerForm.addEventListener('submit', event => {
    event.preventDefault();
    const {x, y} = getCanvasRelativeCoordinate(parseInt(addServerMenu.style.left), parseInt(addServerMenu.style.top));
    const formData = new FormData(event.target);
    const ip_address = [
        formData.get('ip-1'),
        formData.get('ip-2'),
        formData.get('ip-3'),
        formData.get('ip-4')
    ];
    const same_ip_server = servers.find(server => JSON.stringify(server.ip_address) === JSON.stringify(ip_address));
    const websites = [...new Set(formData.get('websites').split(';'))];

    if (same_ip_server) {
        alert(`L'adresse IP ${ip_address[0]}.${ip_address[1]}.${ip_address[2]}.${ip_address[3]} est déjà utilisée`);
        return;
    }

    servers.push(new Server(x, y, ip_address, websites));
    drawNetwork();
    addServerForm.reset();
});

addServerMenu.querySelector("button").addEventListener('click', () => {
    popUpBackground.style.display = 'block';
    addServerForm.style.display = 'block';
});

selectedServerForm.addEventListener('submit', event => {
    event.preventDefault();
    if (selectedServer) {
        const formData = new FormData(ev.target);
        selectedServer.websites = [...new Set(formData.get('selected-websites').split(';'))];
    }
});

selectedServerForm.addEventListener('reset', event => {
    servers = servers.filter(server => JSON.stringify(server.ip_address) !== JSON.stringify(selectedServer.ip_address));
    selectedServer = null;
    selectedServerForm.querySelector('#selected-ip').textContent = '0.0.0.0';
    drawNetwork();
});

canvas.addEventListener('contextmenu', event => {
    event.preventDefault();
    addServerMenu.style.top = event.y + "px";
    addServerMenu.style.left = event.x + "px";
    addServerMenu.style.display = "block";
});

canvas.addEventListener('click', event => {
    const {x, y} = getCanvasRelativeCoordinate(event.x, event.y);
    for (const server of servers) {
        if (server.contains(x, y)) {
            selectServer(server);
        }
    }
});

document.addEventListener('click', () => {
    addServerMenu.style.display = 'none';
});

drawNetwork();
