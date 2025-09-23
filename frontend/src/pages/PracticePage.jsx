import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/auth';
import PracticeSession from '../components/practice/PracticeSession';

const PracticePage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <PracticeSession />;
};

export default PracticePage;