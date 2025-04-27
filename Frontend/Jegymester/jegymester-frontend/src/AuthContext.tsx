import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";

interface User {
  userId: number;
  username: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

interface JwtPayload {
  nameid: string;
  email: string;
  exp: number;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const parseToken = (token: string): User | null => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.log('Token expired');
        return null;
      }
      const roleClaim = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      let roles: string[] = [];
      
      if (roleClaim) {
        if (Array.isArray(roleClaim)) {
          roles = roleClaim;
        } else {
          roles = [roleClaim];
        }
      }
      
      console.log("Parsed roles from token:", roles);
      
      return {
        userId: parseInt(decoded.nameid),
        username: decoded.email,
        email: decoded.email,
        roles: roles
      };
      
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const userData = parseToken(token);
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    const userData = parseToken(token);
    
    if (userData) {
      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      console.log("User logged in with roles:", userData.roles);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };
  
  const getToken = () => {
    return localStorage.getItem('token');
  };
  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  const isAdmin = hasRole('Admin');

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin, 
      hasRole,
      login, 
      logout, 
      getToken 
    }}>
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
