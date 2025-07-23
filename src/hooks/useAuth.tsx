import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import { useMsal, useAccount } from '@azure/msal-react';
import { AccountInfo } from '@azure/msal-browser';
import { loginRequest } from '@/lib/msal-config';
import { apiClient } from '@/lib/api-client';
import { User } from '@/types/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!account;
  const isAdmin = user?.email === 'admin@inicio-insights.com';

  useEffect(() => {
    const initializeUser = async () => {
      if (account && !user) {
        try {
          // Try to get user from our database, create if doesn't exist
          const userData: User = {
            id: account.localAccountId,
            email: account.username || '',
            firstName: account.name?.split(' ')[0] || '',
            lastName: account.name?.split(' ').slice(1).join(' ') || '',
            createdAt: new Date().toISOString(),
            points: 0,
          };
          
          setUser(userData);
          
          // Optionally sync with your backend
          try {
            await apiClient.updateUserProfile(userData.id, userData);
          } catch (error) {
            console.log('User sync with backend failed, continuing with local data');
          }
        } catch (error) {
          console.error('Error initializing user:', error);
          toast.error('Failed to initialize user profile');
        }
      } else if (!account) {
        setUser(null);
      }
      setIsLoading(false);
    };

    if (inProgress === 'none') {
      initializeUser();
    }
  }, [account, inProgress, user]);

  const login = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    instance.logoutPopup({
      postLogoutRedirectUri: window.location.origin,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};