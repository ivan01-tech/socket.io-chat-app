import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import SocketIO from "./socket.js";

const PORT = process.env.PORT || 3500;
const app = express();
const server = createServer(app);
const io = new Server(server);
// the socket class create to handle all event on io
const socketEvent = new SocketIO(io);

app.use(express.static(path.join(process.cwd(), "build", "public")));

app.use(express.static(path.join(process.cwd(), "build", "services")));

app.get("/", function (req, res) {
  res.sendFile(
    path.join(process.cwd(), "build", "public", "html", "form.html")
  );
});

// to lunch to onConnectionevent
socketEvent.startSocket();

server.listen(PORT, function () {
  console.log("Server running on port  : ", PORT);
});
