import { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/auth';
import QuestionsList from '../components/dashboard/QuestionsList';

const DashboardPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [imageError, setImageError] = useState(false);

  const initials = useMemo(() => {
    const name = user?.name?.trim() || '';
    if (!name) return '?';
    const parts = name.split(/\s+/);
    const first = parts[0]?.[0] || '';
    const second = parts[1]?.[0] || '';
    return (first + second).toUpperCase();
  }, [user?.name]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {user?.photoURL && !imageError ? (
              <img
                src={user.photoURL}
                alt={initials}
                className="w-16 h-16 rounded-full border-2 border-primary-500 object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-500">
                <span className="text-2xl font-semibold text-primary-700 tracking-wide">
                  {initials}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-slate-600">
                {user?.email}
              </p>
            </div>
          </div>
          <p className="text-slate-600">
            Continue your system design journey with our curated questions
          </p>
        </div>

        <QuestionsList />
      </div>
    </div>
  );
};

export default DashboardPage;