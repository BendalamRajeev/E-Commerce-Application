
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '../types';
import { api } from '../services/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          const user = await api.auth.getCurrentUser(storedToken);
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token: storedToken }
          });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    
    try {
      const { user, token } = await api.auth.login(email, password);
      
      localStorage.setItem('token', token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to login'
      });
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : 'Failed to login'
      });
    }
  };

  const register = async (email: string, password: string, name: string) => {
    dispatch({ type: 'REGISTER_REQUEST' });
    
    try {
      const { user, token } = await api.auth.register(email, password, name);
      
      localStorage.setItem('token', token);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user, token }
      });
      
      toast({
        title: "Registration Successful",
        description: `Welcome, ${user.name}!`
      });
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to register'
      });
      
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : 'Failed to register'
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully."
    });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
