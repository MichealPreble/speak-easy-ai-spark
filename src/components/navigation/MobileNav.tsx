
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';

const MobileNav = () => {
  const [open, setOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const { trackEvent } = useAnalytics();
  const navigate = useNavigate();

  const handleNavClick = (action: string, label: string) => {
    trackEvent(action, 'Navigation', label);
    setOpen(false);
  };

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link
      to={to}
      onClick={() => handleNavClick(`click_nav_${label.toLowerCase()}`, label)}
      className={cn(
        "flex w-full items-center py-2 text-lg font-medium transition-colors hover:text-primary",
        "focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
    >
      {label}
    </Link>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="md:hidden"
          aria-label="Open main menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-6 px-2">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl font-bold"
              onClick={() => handleNavClick('click_nav_home', 'Home')}
            >
              SpeakEasyAI
            </Link>
            <Button
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => setOpen(false)}
            >
              <X aria-label="Close main menu" />
            </Button>
          </div>
          <nav className="flex flex-col gap-4">
            <NavLink to="/practice" label="Practice" />
            <NavLink to="/newsletter" label="Newsletter" />
            {user ? (
              <>
                <NavLink to="/profile" label="Profile" />
                <Button
                  variant="outline"
                  onClick={() => {
                    handleNavClick('click_nav_signout', 'Sign Out');
                    signOut();
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  handleNavClick('click_nav_signin', 'Sign In');
                  navigate('/auth');
                  setOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
