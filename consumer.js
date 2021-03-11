const io = require("socket.io-client");

const socket = io.io("http://localhost:3333", {
  query: {
    id: Math.random(),
  },
});

socket.on("data", (data) => {
  // processar
  console.log(data);
});

console.log("Vou começar a ouvir...");
socket.connect();
