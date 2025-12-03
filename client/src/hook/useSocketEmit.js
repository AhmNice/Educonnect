import { socket } from "../lib/socket_io";

export function useSocketEmit() {
  const emit = (event, payload) => {
    socket.emit(event, payload);
  };

  const emitWithAck = (event, payload) => {
    return new Promise((resolve) => {
      socket.emit(event, payload, (response) => {
        resolve(response);
      });
    });
  };

  return { emit, emitWithAck };
}
