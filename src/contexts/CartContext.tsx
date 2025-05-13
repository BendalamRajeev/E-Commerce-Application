
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null
};

type CartAction =
  | { type: 'FETCH_CART_REQUEST' }
  | { type: 'FETCH_CART_SUCCESS'; payload: CartItem[] }
  | { type: 'FETCH_CART_FAILURE'; payload: string }
  | { type: 'ADD_TO_CART_REQUEST' }
  | { type: 'ADD_TO_CART_SUCCESS'; payload: CartItem[] }
  | { type: 'ADD_TO_CART_FAILURE'; payload: string }
  | { type: 'UPDATE_QUANTITY_REQUEST' }
  | { type: 'UPDATE_QUANTITY_SUCCESS'; payload: CartItem[] }
  | { type: 'UPDATE_QUANTITY_FAILURE'; payload: string }
  | { type: 'REMOVE_FROM_CART_REQUEST' }
  | { type: 'REMOVE_FROM_CART_SUCCESS'; payload: CartItem[] }
  | { type: 'REMOVE_FROM_CART_FAILURE'; payload: string }
  | { type: 'CLEAR_CART_REQUEST' }
  | { type: 'CLEAR_CART_SUCCESS' }
  | { type: 'CLEAR_CART_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'FETCH_CART_REQUEST':
    case 'ADD_TO_CART_REQUEST':
    case 'UPDATE_QUANTITY_REQUEST':
    case 'REMOVE_FROM_CART_REQUEST':
    case 'CLEAR_CART_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'FETCH_CART_SUCCESS':
    case 'ADD_TO_CART_SUCCESS':
    case 'UPDATE_QUANTITY_SUCCESS':
    case 'REMOVE_FROM_CART_SUCCESS':
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null
      };
    case 'CLEAR_CART_SUCCESS':
      return {
        ...state,
        items: [],
        isLoading: false,
        error: null
      };
    case 'FETCH_CART_FAILURE':
    case 'ADD_TO_CART_FAILURE':
    case 'UPDATE_QUANTITY_FAILURE':
    case 'REMOVE_FROM_CART_FAILURE':
    case 'CLEAR_CART_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload
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

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Load cart on auth state change
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user) {
        dispatch({ type: 'FETCH_CART_REQUEST' });
        
        try {
          const cartItems = await api.cart.getCart(user.id);
          dispatch({ type: 'FETCH_CART_SUCCESS', payload: cartItems });
        } catch (error) {
          dispatch({
            type: 'FETCH_CART_FAILURE',
            payload: error instanceof Error ? error.message : 'Failed to fetch cart'
          });
        }
      } else {
        // For guest users, load cart from localStorage
        try {
          const storedCart = localStorage.getItem('guestCart');
          if (storedCart) {
            dispatch({ type: 'FETCH_CART_SUCCESS', payload: JSON.parse(storedCart) });
          }
        } catch (error) {
          console.error('Failed to load guest cart from localStorage');
        }
      }
    };
    
    loadCart();
  }, [isAuthenticated, user]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('guestCart', JSON.stringify(state.items));
    }
  }, [state.items, isAuthenticated]);

  const addToCart = async (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART_REQUEST' });
    
    try {
      let updatedCart: CartItem[];
      
      if (isAuthenticated && user) {
        updatedCart = await api.cart.addToCart(user.id, product.id, quantity);
      } else {
        // Guest user - handle cart locally
        const existingItemIndex = state.items.findIndex(
          (item) => item.product.id === product.id
        );
        
        if (existingItemIndex !== -1) {
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += quantity;
          updatedCart = updatedItems;
        } else {
          updatedCart = [...state.items, { product, quantity }];
        }
      }
      
      dispatch({ type: 'ADD_TO_CART_SUCCESS', payload: updatedCart });
      
      toast({
        title: "Item Added",
        description: `${product.name} added to your cart`
      });
    } catch (error) {
      dispatch({
        type: 'ADD_TO_CART_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to add to cart'
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to add to cart'
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY_REQUEST' });
    
    try {
      let updatedCart: CartItem[];
      
      if (isAuthenticated && user) {
        updatedCart = await api.cart.updateCartItem(user.id, productId, quantity);
      } else {
        // Guest user - handle cart locally
        if (quantity <= 0) {
          updatedCart = state.items.filter((item) => item.product.id !== productId);
        } else {
          updatedCart = state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          );
        }
      }
      
      dispatch({ type: 'UPDATE_QUANTITY_SUCCESS', payload: updatedCart });
    } catch (error) {
      dispatch({
        type: 'UPDATE_QUANTITY_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to update quantity'
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update quantity'
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART_REQUEST' });
    
    try {
      let updatedCart: CartItem[];
      
      if (isAuthenticated && user) {
        updatedCart = await api.cart.removeFromCart(user.id, productId);
      } else {
        // Guest user - handle cart locally
        updatedCart = state.items.filter((item) => item.product.id !== productId);
      }
      
      dispatch({ type: 'REMOVE_FROM_CART_SUCCESS', payload: updatedCart });
      
      toast({
        title: "Item Removed",
        description: "Item removed from your cart"
      });
    } catch (error) {
      dispatch({
        type: 'REMOVE_FROM_CART_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to remove from cart'
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to remove item'
      });
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART_REQUEST' });
    
    try {
      if (isAuthenticated && user) {
        await api.cart.clearCart(user.id);
      }
      
      dispatch({ type: 'CLEAR_CART_SUCCESS' });
    } catch (error) {
      dispatch({
        type: 'CLEAR_CART_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to clear cart'
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to clear cart'
      });
    }
  };

  const getCartTotal = (): number => {
    return state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const contextValue: CartContextType = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
