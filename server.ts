import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
const PORT = process.env.PORT || 5000;

const app = express();
const server = createServer(app);

app.use(express.static("build"));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const socketUserMapping: any = {};

io.on("connection", (socket) => {
  console.log("socket connected..", socket.id);
  socket.on("join", ({ roomId, username }) => {
    if (!(socket.id in socketUserMapping)) {
      socketUserMapping[socket.id] = username;
      socket.join(roomId);
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      clients.forEach((client) => {
        io.to(client).emit("joined", {
          socketId: socket.id,
          username,
          clients: clients.map((singleClient) => {
            return {
              socketId: singleClient,
              username: socketUserMapping[singleClient],
            };
          }),
        });
      });
    }
  });

  socket.on("code_change", ({ roomId, code }) => {
    socket.in(roomId).emit("code_change", { code });
  });
  socket.on("code_sync", ({ socketId, code }) => {
    io.to(socketId).emit("code_change", { code });
  });

  const handleLeave = () => {
    const rooms = socket.rooms;

    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: socketUserMapping[socket.id],
      });
      socket.leave(roomId);
    });
    delete socketUserMapping[socket.id];
  };

  // listning for leave room
  socket.on("leave", handleLeave);
  // lintining for tab or browser close
  socket.on("disconnecting", handleLeave);
});

server.listen(PORT, () => console.log("server listning on port --->", PORT));
