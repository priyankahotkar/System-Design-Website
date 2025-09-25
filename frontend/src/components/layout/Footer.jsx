import { BookOpen, Github, Linkedin, X } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">DesignNova</span>
            </div>
            <p className="text-slate-300 text-sm">
              Master system design with interactive practice sessions and real-world scenarios.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Questions</a></li>
              <li><a href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Practice</a></li>
              <li><a href="/resources" className="text-slate-300 hover:text-white transition-colors">Resources</a></li>
              <li><a href="/discussion-forum" className="text-slate-300 hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:unlimitlytech@gmail.com" className="text-slate-300 hover:text-white transition-colors">Email us</a></li>
              <li><a href="/privacy-policy" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/contact-us" className="text-slate-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/terms-and-conditions" className="text-slate-300 hover:text-white transition-colors">Terms and Conditions</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/priyankahotkar" className="text-slate-300 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://priyankahotkar.github.io/Portfolio-2.0/" className="text-slate-300 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/priyanka-hotkar-3a667a259" className="text-slate-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 DesignNova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;