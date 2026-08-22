import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, 
  Map, 
  Sparkles, 
  User as UserIcon, 
  LogOut, 
  Plus, 
  Menu, 
  X,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Compass },
    { name: 'My Trips', path: '/trips', icon: Map },
    { name: 'Discover', path: '/dashboard#explore-destinations', icon: Sparkles },
    { name: 'Profile', path: '/settings', icon: UserIcon },
  ];

  return (
    <header className="sticky top-3 sm:top-4 z-40 w-full px-4 sm:px-6 transition-all duration-200">
      <div className="max-w-6xl mx-auto rounded-full border border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md px-4 sm:px-6 py-2 shadow-lg shadow-black/5">
        <div className="flex items-center justify-between h-11 sm:h-12">
          
          {/* Logo & Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
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

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-full border border-zinc-800/60">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle, Plan New Trip & User Menu */}
          <div className="hidden md:flex items-center gap-2">
            
            {/* Circular Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center shadow-xs"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
            </button>

            {/* Circular / Pill CTA */}
            <Link
              to="/create-trip"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Plan New Trip</span>
            </Link>

            {/* User Avatar & Circular Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1 px-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer text-xs text-zinc-300 shadow-xs"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-700"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 text-[10px] font-bold uppercase">
                      {(currentUser.displayName || currentUser.email || 'U')[0]}
                    </div>
                  )}
                  <span className="font-medium max-w-[100px] truncate hidden lg:inline">
                    {currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-52 rounded-2xl bg-zinc-900 border border-zinc-800 p-2 shadow-2xl z-50 animate-fadeIn space-y-1"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-zinc-800 text-xs">
                      <p className="font-semibold text-zinc-200 truncate">{currentUser.displayName}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{currentUser.email}</p>
                    </div>

                    <Link
                      to="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Profile & Settings</span>
                    </Link>

                    <Link
                      to="/trips"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                    >
                      <Map className="w-3.5 h-3.5 text-zinc-400" />
                      <span>My Trips</span>
                    </Link>

                    <div className="my-1 border-t border-zinc-800" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
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
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-zinc-800 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 pb-2 border-t border-zinc-800/80 space-y-2 mt-2">
            <nav className="flex flex-col space-y-1 text-xs font-medium">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full ${
                      isActive ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
              <Link
                to="/create-trip"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-full bg-zinc-100 text-center text-xs font-bold text-zinc-950"
              >
                + Plan New Trip
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-center text-xs font-medium text-red-400 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
