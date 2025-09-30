const API_URL = import.meta.env.VITE_API_URL;
import { getAuthToken } from "../utils/auth";

const getAuthHeaders = async () => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

export const markAsSolvedService = {
  // Get list of questions the user has solved
  async listMy() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/solvedQuestions/me`, {
      headers,
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to load solved questions");
    return json.data; // array of solved question IDs
  },

  // Check if a single question is solved
  async isSolved(questionId) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/solvedQuestions/${questionId}/solved`, {
      headers,
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to fetch solved status");
    return json.data.isSolved; // boolean
  },

  // Mark a question as solved
  async mark(questionId) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/solvedQuestions/${questionId}/solved`, {
      method: "POST",
      headers,
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to mark as solved");
    return json.data;
  },

  // Unmark a question as solved
  async unmark(questionId) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/solvedQuestions/${questionId}/solved`, {
      method: "DELETE",
      headers,
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to unmark as solved");
    return json.data;
  },
};
