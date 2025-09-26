import { io } from "socket.io-client";

const socket = io("", {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;