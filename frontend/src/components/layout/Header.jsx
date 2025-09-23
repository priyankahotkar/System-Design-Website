import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, BookOpen, Menu } from "lucide-react";
import { useAuth } from "../auth";
import Button from "../common/Button";
import { useState } from "react";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-slate-900">SystemDesign Pro</span>
          </Link>

          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Questions
            </Link>
            <Link 
              to="/leaderboard" 
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Leaderboard
            </Link>
            <Link 
              to="/resources" 
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Resources
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-700 font-medium">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="small"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="primary">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-2 space-y-1">
            <Link 
              to="/dashboard" 
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100"
            >
              Questions
            </Link>
            <Link 
              to="/leaderboard" 
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100"
            >
              Leaderboard
            </Link>
            <Link 
              to="/resources" 
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100"
            >
              Resources
            </Link>
            <div className="border-t border-slate-200 my-2" />
            {isAuthenticated ? (
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="w-full text-left px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="block px-3 py-2">
                <Button variant="primary" className="w-full">Sign In</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;