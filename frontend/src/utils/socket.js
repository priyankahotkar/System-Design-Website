import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace('/api', '');

export function createAuthedSocket() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.warn('No auth token found in localStorage. Skipping socket connection.');
    return null;
  }
  return io(SOCKET_URL, {
    transports: ['websocket'], // websocket-only
    withCredentials: true,
    auth: { token },
    autoConnect: true,
  });
}


