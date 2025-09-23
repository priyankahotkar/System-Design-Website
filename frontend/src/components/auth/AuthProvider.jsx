import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, sendEmailVerification, updateProfile as updateFirebaseProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { AuthContext } from './AuthContext';
import { STORAGE_KEYS } from '../../utils/constants';
import { authService } from '../../services/authService';

const API_URL = import.meta.env.VITE_API_URL;
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (token) => {
    try {
      console.log('Fetching user profile with token:', token);
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('User profile data:', data);
        return data.data;
      } else {
        console.error('Failed to fetch user profile:', await response.text());
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      try {
        if (firebaseUser) {
          // Get the stored token
          let token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
          console.log('Stored token:', token);

          if (!token) {
            // Attempt silent rehydration by exchanging Firebase user for backend JWT
            try {
              const response = await authService.loginWithGoogle(firebaseUser);
              if (response?.data?.token) {
                token = response.data.token;
                localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
                setUser(response.data);
              }
            } catch (rehydrateErr) {
              console.error('Silent token rehydration failed:', rehydrateErr);
            }
          }

          if (token) {
            const userData = await fetchUserProfile(token);
            if (userData) {
              setUser(userData);
            } else {
              // Token invalid, force new login
              await logout();
            }
          } else {
            // Still no token, force new login
            await logout();
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state check failed:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signup = async (userData) => {
    try {
      // Get the token from userData
      if (!userData || !userData.token) {
        throw new Error('Invalid signup data');
      }

      // Store the JWT token
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, userData.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      console.log('Firebase user:', firebaseUser);

      // Use authService to handle Google login
      const response = await authService.loginWithGoogle(firebaseUser);
      console.log('Google login response:', response);
      
      if (!response.data || !response.data.token) {
        throw new Error('Invalid response from server');
      }
      
      // Store the JWT token
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
      setUser(response.data);
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signupWithEmail = async (name, email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name && cred.user) {
        await updateFirebaseProfile(cred.user, { displayName: name });
      }
      await sendEmailVerification(cred.user);
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Email signup failed:', error);
      throw new Error(error.message || 'Email signup failed');
    }
  };

  const loginWithEmailPassword = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = cred.user;
      if (!firebaseUser.emailVerified) {
        await signOut(auth);
        throw new Error('Please verify your email before logging in.');
      }
      const response = await authService.loginWithGoogle(firebaseUser);
      if (!response.data || !response.data.token) {
        throw new Error('Invalid response from server');
      }
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${API_URL}/auth/updateprofile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const { data } = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      updateProfile,
      isAuthenticated: !!user,
      signup,
      signupWithEmail,
      loginWithEmailPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};