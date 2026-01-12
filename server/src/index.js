import express from "express";
import http from "http";

const app = express();

app.get('/', (req, res) => {
    res.send('Projekt IO 4');
});

const server = http.createServer(app);

server.listen(3000, '0.0.0.0', () => {
    console.log("HTTP server is running on port 3000");
});

export { server };