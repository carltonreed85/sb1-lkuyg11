import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  organizationId: string;
  avatarUrl?: string | null;
}

interface Organization {
  id: string;
  name: string;
  subdomain: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (organizationName: string, fullName: string, email: string, password: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo admin user
const demoUser: User = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  email: 'admin@rmd.com',
  role: 'admin',
  organizationId: 'org1',
  avatarUrl: null
};

const demoOrg: Organization = {
  id: 'org1',
  name: 'Medical Center',
  subdomain: 'medicalcenter'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for stored auth token and validate session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // In a real app, validate token with backend
          // For demo, use demo admin user
          setUser(demoUser);
          setOrganization(demoOrg);

          // Only redirect if on auth pages
          if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
            navigate('/dashboard');
          }
        } else if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup') {
          // If no token and trying to access protected route, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth validation failed:', error);
        localStorage.removeItem('authToken');
        setUser(null);
        setOrganization(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // For demo, use demo admin user
      setUser(demoUser);
      setOrganization(demoOrg);
      localStorage.setItem('authToken', 'demo-token');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (organizationName: string, fullName: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // For demo, create new org but use admin role
      const orgId = Math.random().toString();
      const newUser = {
        id: Math.random().toString(),
        name: fullName,
        email: email,
        role: 'admin' as const,
        organizationId: orgId,
        avatarUrl: null
      };
      const newOrg = {
        id: orgId,
        name: organizationName,
        subdomain: organizationName.toLowerCase().replace(/[^a-z0-9]/g, '')
      };

      setUser(newUser);
      setOrganization(newOrg);
      localStorage.setItem('authToken', 'demo-token');

      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setIsLoading(true);
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      organization, 
      isLoading, 
      login, 
      logout, 
      signup, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}