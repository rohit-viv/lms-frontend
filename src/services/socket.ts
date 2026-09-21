import { io } from 'socket.io-client';

export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL ||
    'http://localhost:4000',
  {
    autoConnect: false,
  },
);

export const connectSocket = (
  token: string,
) => {
  socket.auth = { token };

  if (!socket.connected) {
    socket.connect();
  }
};
