import { Server } from "socket.io";

const io = new Server(3000);

io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);
});
