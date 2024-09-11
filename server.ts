import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { DirectMessage, Message, Server as PrismaServer } from "@prisma/client";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", async (socket) => {
    socket.on("message", (data: Message | DirectMessage) => {
      // Check if the message is from a channel or a direct conversation
      if ("channelId" in data) {
        // It's a Message (channel)
        io.emit(`message:${data.channelId}`, data);
      } else if ("conversationId" in data) {
        // It's a DirectMessage (direct conversation)
        io.emit(`message:${data.conversationId}`, data);
      }
    });

    socket.on("channel", (data: PrismaServer) => {
      io.emit(`channel:${data.id}`, data);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
