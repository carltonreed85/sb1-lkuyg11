import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  updateAvatar: (avatarUrl: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({ 
  user: null,
  updateAvatar: () => {},
  logout: () => {}
});

const defaultUser: User = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@referralmd.com',
  role: 'admin',
  avatarUrl: null
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  const updateAvatar = (avatarUrl: string) => {
    setUser(prev => ({
      ...prev,
      avatarUrl
    }));
  };

  const logout = () => {
    // Add logout logic here
    console.log('User logged out');
  };

  return (
    <UserContext.Provider value={{ user, updateAvatar, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}