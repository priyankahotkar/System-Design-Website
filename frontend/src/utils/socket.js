import { io } from 'socket.io-client';
import { getAuthToken } from './auth';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace('/api', '');

export async function createAuthedSocket() {
  const token = await getAuthToken();
  if (!token) {
    console.warn('No auth token found. Skipping socket connection.');
    return null;
  }
  return io(SOCKET_URL, {
    transports: ['websocket'], // websocket-only
    withCredentials: true,
    auth: { token },
    autoConnect: true,
  });
}


