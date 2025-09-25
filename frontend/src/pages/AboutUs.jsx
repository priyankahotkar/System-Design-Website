import { BookOpen, PenTool, Users, Sparkles } from "lucide-react";

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="card p-5 h-full">
    <div className="flex items-center gap-3 mb-2">
      <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
    </div>
    <p className="text-sm text-slate-600">{desc}</p>
  </div>
);

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium mb-3">
              <Sparkles className="h-4 w-4" /> Crafted for System Design Learners
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Learn, Design, and Collaborate — in One Place</h1>
            <p className="text-slate-700 leading-relaxed">
              Hi, I’m <span className="font-semibold">Priyanka Hotkar</span>. I built SystemDesign Pro to make Low‑Level Design and System Design
              practice approachable, hands‑on, and collaborative — not a LeetCode clone, but a space tailored
              for designing, coding, and discussing solutions together.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-primary-500" />
                <span className="font-semibold text-slate-900">DesignNova</span>
              </div>
              <ul className="text-sm text-slate-700 space-y-2 list-disc pl-5">
                <li>Collaborative whiteboard with real‑time updates</li>
                <li>Built‑in code editor for LLD exploration</li>
                <li>Discussion forum powered by GitHub (Giscus)</li>
                <li>Roadmap with badges to track progress</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">The Story</h2>
          <p className="text-slate-700">
            While preparing for interviews, I wanted a place to sketch architectures, refine class designs,
            validate ideas in code, and discuss trade‑offs — all in one flow. That’s why this platform brings a
            <span className="font-medium"> collaborative whiteboard</span> and a <span className="font-medium">code editor</span> together, with a community space to learn
            out loud.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Feature
            icon={PenTool}
            title="Design + Code"
            desc="Sketch diagrams on the whiteboard and validate ideas in the editor side‑by‑side."
          />
        
          <Feature
            icon={Users}
            title="Collaborate Live"
            desc="Invite peers to the same board and see updates in real time as you ideate."
          />

          <Feature
            icon={BookOpen}
            title="Roadmap & Badges"
            desc="Follow a curated learning path and earn badges as you complete each phase."
          />
        </div>
      </div>

      {/* Closing */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Thanks for Being Here</h3>
          <p className="text-slate-600">
            Whether you’re getting started or leveling up, I hope this space helps you learn faster and enjoy
            the craft of system design.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;


