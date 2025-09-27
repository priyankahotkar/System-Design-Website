import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const EmailVerificationNotice = () => {
  const { user, logout, resendEmailVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  if (!user || user.emailVerified) {
    return null;
  }

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage('');
    try {
      const success = await resendEmailVerification();
      if (success) {
        setResendMessage('Verification email sent! Please check your inbox.');
      } else {
        setResendMessage('Unable to send verification email. Please try again.');
      }
    } catch (error) {
      setResendMessage('Error sending verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black p-4 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium">
              Please verify your email address to continue using the application.
            </p>
            <p className="text-xs mt-1">
              We sent a verification link to <strong>{user.email}</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {resendMessage && (
            <span className="text-xs text-green-700 font-medium">
              {resendMessage}
            </span>
          )}
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-black px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            {isResending ? 'Sending...' : 'Resend Email'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationNotice;
