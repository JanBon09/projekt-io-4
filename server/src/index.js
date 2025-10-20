import express from "express";
import http from "http";

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Projekt IO 4');
});

const server = http.createServer(app);

export { server };