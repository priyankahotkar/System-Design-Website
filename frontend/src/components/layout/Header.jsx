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
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-400" />
            <span className="text-xl font-bold text-white">DesignNova</span>
          </Link>

          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Questions
            </Link>
            <Link 
              to="/discussion-forum" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Discussion Forum
            </Link>
            <Link 
              to="/resources" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Resources
            </Link>
            <Link 
              to="/about-us" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              About Us
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                  <Link to="/profile">
                  <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-300 font-medium">{user.name}</span>
                  </div>
                  </Link>
                <Button
                  variant="outline"
                  size="small"
                  onClick={handleLogout}
                  className="flex items-center space-x-1 border-gray-700 text-gray-300 hover:bg-gray-800"
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
              className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800"
            >
              Questions
            </Link>
            <Link 
              to="/leaderboard" 
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800"
            >
              Leaderboard
            </Link>
            <Link 
              to="/resources" 
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800"
            >
              Resources
            </Link>
            <div className="border-t border-gray-700 my-2" />
            {isAuthenticated ? (
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="w-full text-left px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 flex items-center gap-2"
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