const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  signup: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  },

  loginWithGoogle: async (googleUser, isGoogleUser = true) => {
    console.log('Sending Google user data:', {
      email: googleUser.email,
      name: googleUser.displayName,
      firebaseUid: googleUser.uid,
      photoURL: googleUser.photoURL,
      isGoogleUser: isGoogleUser,
    });

    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: googleUser.email,
        name: googleUser.displayName,
        firebaseUid: googleUser.uid,
        photoURL: googleUser.photoURL,
        isGoogleUser: isGoogleUser,
      }),
    });

    const data = await response.json();
    console.log('Server response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Google login failed');
    }

    return data;
  },

  logout: async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Logout failed');
      }
    }
    return true;
  },

  verifyEmail: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Email verification failed');
    }

    return data;
  },

  confirmEmailVerification: async (email, firebaseUid = null) => {
    const response = await fetch(`${API_URL}/auth/confirm-email-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, firebaseUid }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Email verification confirmation failed');
    }

    return data;
  }
};