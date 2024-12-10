const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const routes = require("./routes/ticketTimeRoutes");
const socketHandlers = require("./sockets/socketHandlers");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000/", methods: ["GET", "POST"] },
});

app.locals.io = io;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/", routes);

socketHandlers(io);

const PORT = 5000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
