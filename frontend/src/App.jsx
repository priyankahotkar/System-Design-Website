import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/auth';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PracticePage from './pages/PracticePage';
import ProfileBadgesPage from './pages/ProfileBadgesPage';
import ResourcesPage from './pages/ResourcesPage';
import Discussions from './pages/Discussions';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/practice/:id" element={<PracticePage />} />
            <Route path="/profile/badges" element={<ProfileBadgesPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/discussion-forum" element={<Discussions />} />
            <Route path="/about-us" element={<AboutUs />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;