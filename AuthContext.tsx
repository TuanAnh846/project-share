import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';

interface MockUser {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role?: string;
  phone?: string;
  timezone?: string;
  department?: string;
  joinDate?: string;
  title?: string;
  company?: string;
  website?: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  recordActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    localStorage.removeItem('mockUser');
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      signOut();
    }, INACTIVITY_TIMEOUT);
  }, [signOut]);

  useEffect(() => {
    if (!user) return;

    resetInactivityTimer();

    const handleActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('mousemove', handleActivity);

    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [user, resetInactivityTimer]);

  const recordActivity = useCallback(() => {
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const mockUser: MockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        fullName,
      };
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      resetInactivityTimer();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const mockUser: MockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        fullName: email.split('@')[0],
        role: 'Member',
        joinDate: new Date().toISOString(),
        timezone: 'UTC',
      };
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      resetInactivityTimer();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, recordActivity }}>
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
