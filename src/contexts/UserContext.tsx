
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  name: string;
  email?: string; // Added email property
  preferences: {
    theme: 'light' | 'dark';
    recentStructures: string[];
    preferredLanguage: 'javascript' | 'python' | 'java';
    animationSpeed?: number; // Added animation speed property
    sound?: boolean;
    highContrast?: boolean;
  };
};

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
};

const defaultUser: User = {
  name: '',
  preferences: {
    theme: 'light',
    recentStructures: [],
    preferredLanguage: 'javascript',
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('codeweave-user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUserState(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const setUser = (newUser: User) => {
    const userToSave = { ...defaultUser, ...newUser };
    localStorage.setItem('codeweave-user', JSON.stringify(userToSave));
    setUserState(userToSave);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('codeweave-user');
    setUserState(null);
    setIsLoggedIn(false);
  };

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences,
      }
    };
    
    localStorage.setItem('codeweave-user', JSON.stringify(updatedUser));
    setUserState(updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, isLoggedIn, updatePreferences }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
