import { useEffect } from 'react';

// Lightweight confetti using canvas-confetti via CDN when available, fallback CSS burst
const ConfettiBurst = ({ fire }) => {
  useEffect(() => {
    if (!fire) return;
    const shoot = () => {
      const confetti = window.confetti;
      if (confetti) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    };
    shoot();
  }, [fire]);

  return null;
};

export default ConfettiBurst;


