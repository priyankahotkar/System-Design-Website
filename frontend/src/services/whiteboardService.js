const API_URL = import.meta.env.VITE_API_URL;

import { getAuthToken } from '../utils/auth';

const getAuthHeaders = async () => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'credentials': 'include',
  };
};

export const whiteboardService = {
  async create(questionId) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/whiteboard`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ questionId }),
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create whiteboard');
    return json.data; // { id, owner, users, state }
  },

  async getOrJoin(id) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/whiteboard/${id}`, {
      headers,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to join whiteboard');
    return json.data;
  },

  async listByQuestion(questionId) {
    const url = new URL(`${API_URL}/whiteboard`);
    if (questionId) url.searchParams.set('questionId', questionId);
    const headers = await getAuthHeaders();
    const res = await fetch(url.toString(), {
      headers,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load whiteboards');
    return json.data; // array
  },
};


