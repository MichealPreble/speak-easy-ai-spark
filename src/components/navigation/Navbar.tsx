
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, LogIn, LogOut } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/context/AuthContext';
import MobileNav from './MobileNav';

const Navbar: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const { trackEvent } = useAnalytics();
  const navigate = useNavigate();

  const handleNavClick = (action: string, label: string) => {
    trackEvent(action, 'Navigation', label);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-lg p-4" aria-label="Main navigation">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link
            to="/"
            className="text-2xl font-bold text-foreground"
            onClick={() => handleNavClick('click_nav_home', 'Home')}
            aria-label="SpeakEasyAI Home"
          >
            SpeakEasyAI
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/practice"
            onClick={() => handleNavClick('click_nav_practice', 'Practice')}
            aria-label="Practice Page"
          >
            <Button variant="ghost" className="text-foreground/80 hover:text-primary">
              Practice
            </Button>
          </Link>
          <Link
            to="/newsletter"
            onClick={() => handleNavClick('click_nav_newsletter', 'Newsletter')}
            aria-label="Newsletter Page"
          >
            <Button variant="ghost" className="text-foreground/80 hover:text-primary">
              Newsletter
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-foreground/80 hover:text-primary"
                aria-label={user ? 'User Menu' : 'Sign In'}
                onClick={() => handleNavClick('click_nav_user', user ? 'User Menu' : 'Sign In')}
              >
                {loading ? (
                  'Loading...'
                ) : user ? (
                  <User className="w-5 h-5" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user ? (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      handleNavClick('click_nav_profile', 'Profile');
                      navigate('/profile');
                    }}
                    aria-label="Go to Profile"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={signOut}
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    handleNavClick('click_nav_signin', 'Sign In');
                    navigate('/auth');
                  }}
                  aria-label="Sign In"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
