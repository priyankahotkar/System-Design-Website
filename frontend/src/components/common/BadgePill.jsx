const EMOJI_BY_KEY = {
  novice: '🥇',
  lld_architect: '🥈',
  system_architect: '🥉',
  system_developer: '🏅',
  guru: '🏆',
  interview_ready: '🎖️',
  problem_solver: '🎯',
  innovator: '🧪',
  mentor: '📚',
};

const BadgePill = ({ title, badgeKey }) => (
  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
    <span className="mr-1">{EMOJI_BY_KEY[badgeKey] || '🏅'}</span>
    {title}
  </span>
);

export default BadgePill;


