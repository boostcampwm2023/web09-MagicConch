import { Server } from "socket.io";

const io = new Server(3000, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);
});
