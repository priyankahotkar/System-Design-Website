import { useEffect, useRef } from 'react';

const Discussions = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Clear previous script if any (hot reload safety)
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const script = document.createElement('script');
      script.src = 'https://giscus.app/client.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-repo', 'priyankahotkar/System-Design-Website');
      script.setAttribute('data-repo-id', 'R_kgDOP1XV7g');
      script.setAttribute('data-category', 'General');
      script.setAttribute('data-category-id', 'DIC_kwDOP1XV7s4Cv38J');
      script.setAttribute('data-mapping', 'pathname');
      script.setAttribute('data-strict', '0');
      script.setAttribute('data-reactions-enabled', '1');
      script.setAttribute('data-emit-metadata', '0');
      script.setAttribute('data-input-position', 'bottom');
      script.setAttribute('data-theme', 'catppuccin_latte');
      script.setAttribute('data-lang', 'en');
      script.setAttribute('data-loading', 'lazy');
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Discussion Forum</h1>
      <p className="text-slate-600 mb-6">Ask questions, share insights, and discuss system design topics with the community.</p>
      <div ref={containerRef} />
    </div>
  );
};

export default Discussions;


