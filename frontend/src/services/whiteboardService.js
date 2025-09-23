const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const whiteboardService = {
  async create(questionId) {
    const res = await fetch(`${API_URL}/whiteboard`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ questionId }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create whiteboard');
    return json.data; // { id, owner, users, state }
  },

  async getOrJoin(id) {
    const res = await fetch(`${API_URL}/whiteboard/${id}`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to join whiteboard');
    return json.data;
  },

  async listByQuestion(questionId) {
    const url = new URL(`${API_URL}/whiteboard`);
    if (questionId) url.searchParams.set('questionId', questionId);
    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load whiteboards');
    return json.data; // array
  },
};


