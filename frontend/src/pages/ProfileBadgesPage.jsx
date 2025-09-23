import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/auth';
import { badgeService } from '../services/badgeService';
import BadgePill from '../components/common/BadgePill';

const ProfileBadgesPage = () => {
  const { isAuthenticated } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const list = await badgeService.listMy();
        setBadges(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">Your Badges</h1>
      {loading ? (
        <div className="text-slate-500">Loading badges...</div>
      ) : badges.length === 0 ? (
        <div className="text-slate-500">No badges earned yet.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {badges.map((b, idx) => (
            <BadgePill key={`${b.key}-${idx}`} title={b.title} badgeKey={b.key} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileBadgesPage;


