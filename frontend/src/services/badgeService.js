const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const badgeService = {
  async listMy() {
    const res = await fetch(`${API_URL}/badges/me`, { headers: getAuthHeaders() });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load badges');
    return json.data;
  },
  async award(badge) {
    const res = await fetch(`${API_URL}/badges/award`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(badge),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to award badge');
    return json.data;
  }
};


