import express from "express";
import http from "http";

const app = express();

app.get('/', (req, res) => {
    res.send('Projekt IO 4');
});

const server = http.createServer(app);

export { server };