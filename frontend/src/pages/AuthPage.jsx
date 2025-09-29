import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/auth';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-700">
          {mode === 'login' ? (
            <LoginForm onToggleMode={() => setMode('signup')} />
          ) : (
            <SignupForm onToggleMode={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;