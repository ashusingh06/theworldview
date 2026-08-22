import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Menu, X, ArrowRight, User as UserIcon, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      navigate(`/#${id}`);
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full px-4 sm:px-6 transition-all duration-200">
      <div className="max-w-6xl mx-auto rounded-full border border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md px-4 sm:px-6 py-2 shadow-lg shadow-black/5">
        <div className="flex items-center justify-between h-11 sm:h-12">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 group-hover:border-zinc-700 transition-colors shadow-xs">
              <Compass className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-zinc-100">
                TheWorldView
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400 bg-zinc-900/60 py-1.5 px-5 rounded-full border border-zinc-800/60">
            <button
              onClick={() => scrollToSection('discover')}
              className="hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Discover
            </button>
            <button
              onClick={() => scrollToSection('journeys')}
              className="hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Journeys
            </button>
            <button
              onClick={() => scrollToSection('destinations')}
              className="hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Destinations
            </button>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center shadow-xs"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200 hover:border-zinc-700 transition-colors shadow-xs"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-all shadow-xs active:scale-95"
                >
                  <span>Start Planning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-zinc-800 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 pb-2 border-t border-zinc-800/80 space-y-2 mt-2">
            <nav className="flex flex-col space-y-1 text-xs font-medium text-zinc-300">
              <button
                onClick={() => scrollToSection('discover')}
                className="text-left px-3.5 py-2 rounded-full hover:bg-zinc-900"
              >
                Discover
              </button>
              <button
                onClick={() => scrollToSection('journeys')}
                className="text-left px-3.5 py-2 rounded-full hover:bg-zinc-900"
              >
                Journeys
              </button>
              <button
                onClick={() => scrollToSection('destinations')}
                className="text-left px-3.5 py-2 rounded-full hover:bg-zinc-900"
              >
                Destinations
              </button>
            </nav>

            <div className="pt-2 border-t border-zinc-800/80 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-center text-xs font-medium text-zinc-100"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 px-3 rounded-full bg-zinc-950 border border-zinc-800 text-center text-xs font-medium text-red-400 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-center text-xs font-medium text-zinc-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-3 rounded-full bg-zinc-100 text-center text-xs font-bold text-zinc-950"
                  >
                    Start Planning
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
