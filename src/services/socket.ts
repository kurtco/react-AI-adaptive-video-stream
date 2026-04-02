import { io, Socket } from "socket.io-client";

// Conexión al gateway de NestJS que ya validamos con curl
const SOCKET_URL = "http://localhost:3000";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"],
});
