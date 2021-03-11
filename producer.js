require("dotenv").config();

const _ = require("lodash");
const cors = require("cors");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const connectedUsers = {};

function bootstrapServer() {
  const app = express();
  const server = http.Server(app);
  const websocket = socketio(server);

  app.use(cors());
  app.use(express.json());

  websocket.on("connection", (socket) => {
    const { id } = socket.handshake.query;

    console.log(`Consumer conectado: ${id}`);
    connectedUsers[id] = socket.id;
  });

  return { server, websocket };
}

const { server, websocket } = bootstrapServer();

server.listen({ port: process.env.PORT || 3333 }, () => {
  console.log("Server iniciado.");

  setInterval(() => {
    const connectedIds = Object.values(connectedUsers);

    if (!connectedIds.length) {
      return;
    }

    connectedIds.forEach((id) => {
      const payload = { value: _.random(4, 10) };

      websocket.to(id).emit("data", payload);
    });
  }, 1e3);
});
