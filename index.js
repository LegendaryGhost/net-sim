const popUpBackground = document.getElementById('pop-up-background');
const addServerForm = document.getElementById('add-server-form');
const addServerMenu = document.getElementById("add-server-context");
const serverMenu = document.getElementById("server-context");
const linkingForm = document.getElementById('linking-form');
const selectedServerForm = document.getElementById("selected-server-form");
const canvas = document.getElementById('network');
const context = canvas.getContext('2d');
const network = new Network();
let toLinkServer = null;

const getCanvasRelativeCoordinate = (absolute_x, absolute_y) => {
    const canvasRect = canvas.getBoundingClientRect();
    const x = absolute_x - canvasRect.left;
    const y = absolute_y - canvasRect.top;
    return {'x': x, 'y': y};
};

const selectServer = server => {
    for (const serverElement of network.servers) {
        serverElement.selected = false;
    }
    server.selected = true;
    network.selectedServer = server;
    selectedServerForm.querySelector('#selected-ip').textContent = server.ip_address.join('.');
    selectedServerForm.querySelector('#selected-websites').value = server.websites.join(';');
    network.draw(canvas, context);
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
    const same_ip_server = network.servers.find(server => JSON.stringify(server.ip_address) === JSON.stringify(ip_address));
    const websites = [...new Set(formData.get('websites').split(';'))];

    if (same_ip_server) {
        alert(`L'adresse IP ${ip_address[0]}.${ip_address[1]}.${ip_address[2]}.${ip_address[3]} est déjà utilisée`);
        return;
    }

    network.addServer(new Server(x, y, ip_address, websites));
    network.draw(canvas, context);
    addServerForm.reset();
});

addServerMenu.querySelector("button").addEventListener('click', () => {
    popUpBackground.style.display = 'block';
    addServerForm.style.display = 'block';
});

serverMenu.querySelector("button#link-server").addEventListener('click', () => {
    network.linkingMode = true;
    network.draw(canvas, context);
});

selectedServerForm.addEventListener('submit', event => {
    event.preventDefault();
    if (network.selectedServer) {
        const formData = new FormData(event.target);
        network.selectedServer.websites = [...new Set(formData.get('selected-websites').split(';'))];
        alert('Les données du serveur ont été sauvegardées');
    } else {
        alert("Aucun serveur n'a été sélectionné !");
    }
});

selectedServerForm.addEventListener('reset', () => {
    network.servers = network.servers.filter(server => JSON.stringify(server.ip_address) !== JSON.stringify(network.selectedServer.ip_address));
    network.selectedServer = null;
    selectedServerForm.querySelector('#selected-ip').textContent = '0.0.0.0';
    network.draw(canvas, context);
});

linkingForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const latency = parseInt(formData.get('latency').toString());
    network.addConnection(network.selectedServer, toLinkServer, latency);
    network.linkingMode = false;
    linkingForm.reset();
    network.draw(canvas, context);
});

linkingForm.addEventListener('reset', () => {
    popUpBackground.style.display = 'none';
    linkingForm.style.display = 'none';
    toLinkServer = null;
});

canvas.addEventListener('contextmenu', event => {
    event.preventDefault();
    let clickedOnServer = false;
    for (const server of network.servers) {
        const {x, y} = getCanvasRelativeCoordinate(event.x, event.y);
        if (server.contains(x, y)) {
            selectServer(server);
            clickedOnServer = true;
            break;
        }
    }

    if (clickedOnServer) {
        serverMenu.style.top = event.y + "px";
        serverMenu.style.left = event.x + "px";
        serverMenu.style.display = "block";
        addServerMenu.style.display = 'none';
    } else {
        addServerMenu.style.top = event.y + "px";
        addServerMenu.style.left = event.x + "px";
        addServerMenu.style.display = "block";
        serverMenu.style.display = 'none';
    }

    network.draw(canvas, context);
});

canvas.addEventListener('click', event => {
    const {x, y} = getCanvasRelativeCoordinate(event.x, event.y);
    let clickedServer = null;
    for (const server of network.servers) {
        if (server.contains(x, y)) {
            clickedServer = server;
        }
    }

    if(network.linkingMode) {
        if (clickedServer && JSON.stringify(clickedServer) !== JSON.stringify(network.selectedServer)) {
            toLinkServer = clickedServer;
            popUpBackground.style.display = 'block';
            linkingForm.style.display = 'block';
            return;
        }
        network.linkingMode = false;
        network.draw(canvas, context);
    } else if (clickedServer) {
        selectServer(clickedServer);
    }
});

canvas.addEventListener('mousemove', event => {
    const {x, y} = getCanvasRelativeCoordinate(event.x, event.y);
    network.draw(canvas, context, x, y);
});

document.addEventListener('click', () => {
    addServerMenu.style.display = 'none';
    serverMenu.style.display = 'none';
});

network.draw(canvas, context);
