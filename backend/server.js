import { createServer } from "node:http";
import { Server } from "socket.io";

const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const httpServer = createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Handle socket.io requests
    if (req.url?.startsWith('/socket.io/')) {
        return;
    }
    
    // Handle other requests with a simple response
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Socket.io server is running', timestamp: new Date().toISOString() }));
});

let io;

// Initialize socket.io with the HTTP server
initializeSocket(httpServer);

httpServer.listen(port, () => {
    console.log(`Socket server running on http://${hostname}:${port}`);
    console.log(`Socket.io endpoint: http://${hostname}:${port}/socket.io/`);
});

export default function initializeSocket(server) {
    if (!io) {
        io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true
            },
            path: "/socket.io/",
            transports: ["polling", "websocket"],
            pingTimeout: 60000,
            pingInterval: 25000,
            connectTimeout: 20000
        });

        io.on("connection", (socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on("authenticate", (userId) => {
                socket.userId = userId;
                console.log(`User ${userId} authenticated with socket ${socket.id}`);
            });

            // Add your chat message handlers here
            socket.on("message", (data) => {
                console.log(`Message received: ${JSON.stringify(data)}`);
                // Broadcast message to all connected clients
                io.emit("message", data);
            });

            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.id}`);
            });

            socket.on("error", (error) => {
                console.error(`Socket error for ${socket.id}:`, error);
            });
        });
    }
    return io;
}