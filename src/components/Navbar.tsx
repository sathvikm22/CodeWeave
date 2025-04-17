
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  Home, 
  BookOpen, 
  Settings,
  LogOut,
  Sun,
  Moon,
  HelpCircle,
  BarChart
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isLoggedIn, updatePreferences } = useUser();
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(
    document.documentElement.classList.contains('dark')
  );
  const location = useLocation();

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
    if (isLoggedIn) {
      updatePreferences({ theme: newTheme });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="bg-background border-b border-border py-3 px-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="font-bold text-2xl text-primary">CodeWeave</div>
          </Link>
        </div>

        <div className="flex items-center space-x-1 md:space-x-3">
          {isLoggedIn ? (
            <>
              <Link to="/">
                <Button 
                  variant={isActive('/') ? "default" : "ghost"} 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Home size={18} />
                  <span className="hidden md:inline">Home</span>
                </Button>
              </Link>
              
              <Link to="/visualization">
                <Button 
                  variant={isActive('/visualization') ? "default" : "ghost"} 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Code size={18} />
                  <span className="hidden md:inline">Visualization</span>
                </Button>
              </Link>
              
              <Link to="/sorting">
                <Button 
                  variant={isActive('/sorting') ? "default" : "ghost"} 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <BarChart size={18} />
                  <span className="hidden md:inline">Sorting</span>
                </Button>
              </Link>
              
              <Link to="/resources">
                <Button 
                  variant={isActive('/resources') ? "default" : "ghost"} 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <BookOpen size={18} />
                  <span className="hidden md:inline">Resources</span>
                </Button>
              </Link>
              
              <Link to="/settings">
                <Button 
                  variant={isActive('/settings') ? "default" : "ghost"} 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Settings size={18} />
                  <span className="hidden md:inline">Settings</span>
                </Button>
              </Link>
              
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="flex items-center">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              
              <Button variant="ghost" size="sm" className="flex items-center">
                <HelpCircle size={18} />
              </Button>
              
              <div className="flex items-center gap-2 ml-2">
                <div className="text-sm font-medium hidden md:block">
                  {user?.name}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-destructive"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
