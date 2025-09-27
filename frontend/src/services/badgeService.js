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

export const badgeService = {
  async listMy() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/badges/me`, { headers });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load badges');
    return json.data;
  },
  async award(badge) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/badges/award`, {
      method: 'POST',
      headers,
      body: JSON.stringify(badge),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to award badge');
    return json.data;
  }
};


