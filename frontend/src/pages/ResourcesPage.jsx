import { useEffect, useState } from 'react';
import { badgeService } from '../services/badgeService';
import { useAuth } from '../components/auth';
import Button from '../components/common/Button';
import BadgePill from '../components/common/BadgePill';
import ConfettiBurst from '../components/common/ConfettiBurst';

const PHASES = [
  {
    key: 'phase1',
    title: 'Phase 1: Foundation',
    badge: { key: 'novice', title: 'System Design Novice' },
    topics: ['Networking Basics', 'Databases', 'Caching', 'Concurrency', 'Design Patterns'],
    resources: [
      { label: 'System Design Primer GitHub', url: 'https://github.com/donnemartin/system-design-primer' },
      { label: 'System Design 101 by ByteByteGo', url: 'https://bytebytego.com/' },
      { label: "Aryan Mittal's LLD Crash Course", url: 'https://www.youtube.com/@aryancodes' },
    ],
  },
  {
    key: 'phase2',
    title: 'Phase 2: Low-Level Design (LLD)',
    badge: { key: 'lld_architect', title: 'LLD Architect' },
    topics: ['Class Diagrams', 'OOP & SOLID', 'Design Patterns', 'Concurrency in Design'],
    resources: [
      { label: "Aryan Mittal's LLD Playlist", url: 'https://www.youtube.com/@aryancodes' },
      { label: 'Awesome LLD GitHub Repository', url: 'https://github.com/ashishps1/awesome-low-level-design' },
    ],
  },
  {
    key: 'phase3',
    title: 'Phase 3: High-Level Design (HLD)',
    badge: { key: 'system_architect', title: 'System Architect' },
    topics: ['System Components', 'Data Flow', 'Scalability', 'Fault Tolerance'],
    resources: [
      { label: 'System Design Fight Club GitHub', url: 'https://github.com/ashishps1/system-design-resources' },
      { label: 'System Design Roadmap by Roadmap.sh', url: 'https://roadmap.sh/system-design' },
    ],
  },
  {
    key: 'phase4',
    title: 'Phase 4: Practical Application',
    badge: { key: 'system_developer', title: 'System Developer' },
    topics: ['URL Shortener', 'Chat Application', 'E-commerce System'],
    resources: [
      { label: 'System Design Primer Projects', url: 'https://github.com/donnemartin/system-design-primer' },
      { label: 'CodeWithAryan Projects', url: 'https://www.youtube.com/@aryancodes' },
    ],
  },
  {
    key: 'phase5',
    title: 'Phase 5: Advanced Topics',
    badge: { key: 'guru', title: 'System Design Guru' },
    topics: ['Distributed Systems', 'Event-Driven Architecture', 'Real-Time Systems', 'Cloud Infrastructure'],
    resources: [
      { label: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/' },
      { label: 'System Design Resources by InterviewReady', url: 'https://interviewready.io/' },
    ],
  },
  {
    key: 'phase6',
    title: 'Phase 6: Interview Preparation',
    badge: { key: 'interview_ready', title: 'Interview Ready' },
    topics: ['Problem-Solving', 'Communication', 'Trade-offs'],
    resources: [
      { label: 'System Design Interview Preparation GitHub', url: 'https://github.com/shashank88/system_design' },
      { label: 'System Design Fight Club YouTube Channel', url: 'https://www.youtube.com/@bytebytego' },
    ],
  },
];

const ResourcesPage = () => {
  const { isAuthenticated } = useAuth();
  const [myBadges, setMyBadges] = useState([]);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        if (isAuthenticated) {
          const list = await badgeService.listMy();
          setMyBadges(list || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [isAuthenticated]);

  const hasBadge = (key) => myBadges?.some(b => b.key === key);

  const handleMarkComplete = async (badge) => {
    try {
      await badgeService.award({ key: badge.key, title: badge.title });
      const list = await badgeService.listMy();
      setMyBadges(list || []);
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1500);
    } catch (e) {
      alert(e.message || 'Failed to award badge');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <ConfettiBurst fire={celebrate} />
      <h1 className="text-2xl font-bold text-slate-900 mb-6">System Design Mastery Roadmap</h1>
      <div className="space-y-6">
        {PHASES.map((phase) => (
          <div key={phase.key} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">{phase.title}</h2>
              <div className="flex items-center gap-2">
                {hasBadge(phase.badge.key) ? (
                  <BadgePill title={phase.badge.title} badgeKey={phase.badge.key} />
                ) : (
                  <Button size="small" variant="secondary" onClick={() => handleMarkComplete(phase.badge)}>
                    Mark Complete → Earn {phase.badge.title}
                  </Button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">Topics to Cover</h3>
                <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                  {phase.topics.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Resources</h3>
                <ul className="text-sm text-primary-700 space-y-1">
                  {phase.resources.map((r) => (
                    <li key={r.label}>
                      <a href={r.url} target="_blank" rel="noreferrer" className="hover:underline">{r.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;


