import { io } from "socket.io-client";

const socketInit = () => {
  const options = {
    "force-new-connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transport: ["websocket"],
  };
  return io(process.env.REACT_APP_API_URL as string, options);
};

export default socketInit;
