
import { Product, User, Order, CartItem, Address } from '../types';

// Mock product data
const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    description: 'High-quality noise cancelling headphones with premium sound and comfort.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stock: 15
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    price: 249.99,
    description: 'Track your fitness, receive notifications, and more with this advanced smartwatch.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stock: 20
  },
  {
    id: '3',
    name: 'Organic Cotton T-shirt',
    price: 29.99,
    description: 'Soft, comfortable t-shirt made from 100% organic cotton.',
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stock: 50
  },
  {
    id: '4',
    name: 'Designer Sunglasses',
    price: 159.99,
    description: 'Protect your eyes in style with these trendy designer sunglasses.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stock: 30
  },
  {
    id: '5',
    name: 'Professional Camera Kit',
    price: 1299.99,
    description: 'Complete professional camera kit with lenses and accessories.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stock: 5
  },
  {
    id: '6',
    name: 'Leather Wallet',
    price: 49.99,
    description: 'Handcrafted genuine leather wallet with multiple card slots.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123264281-39e2a3a7c0e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stock: 25
  },
  {
    id: '7',
    name: 'Wireless Charging Pad',
    price: 39.99,
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618677366787-9727aacca7ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stock: 40
  },
  {
    id: '8',
    name: 'Fitness Tracker Band',
    price: 89.99,
    description: 'Track steps, heart rate, and sleep with this water-resistant fitness band.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stock: 18
  }
];

// Mock user data
const users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123', // In real app, this would be hashed
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'customer@example.com',
    password: 'customer123', // In real app, this would be hashed
    name: 'Test Customer',
    role: 'customer'
  }
];

// Mock orders data
let orders: Order[] = [];

// In-memory cart store (session-based in a real app)
let carts: Record<string, CartItem[]> = {};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate JWT token
const generateToken = (user: User): string => {
  return `mock-jwt-token-${user.id}-${user.role}-${Date.now()}`;
};

export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      await delay(500); // Simulate network delay
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      const token = generateToken(user);
      return { user: { ...user, password: '******' }, token };
    },
    
    register: async (email: string, password: string, name: string) => {
      await delay(500);
      
      if (users.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        password, // In real app, this would be hashed
        name,
        role: 'customer'
      };
      
      users.push(newUser);
      const token = generateToken(newUser);
      
      return { user: { ...newUser, password: '******' }, token };
    },
    
    getCurrentUser: async (token: string) => {
      await delay(300);
      
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token');
      }
      
      const userId = token.split('-')[2];
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return { ...user, password: '******' };
    }
  },
  
  // Products endpoints
  products: {
    getAll: async () => {
      await delay(300);
      return products;
    },
    
    getById: async (id: string) => {
      await delay(200);
      const product = products.find(p => p.id === id);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      return product;
    },
    
    getByCategory: async (category: string) => {
      await delay(300);
      return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    },
    
    search: async (query: string) => {
      await delay(300);
      const lowercaseQuery = query.toLowerCase();
      return products.filter(p => 
        p.name.toLowerCase().includes(lowercaseQuery) || 
        p.description.toLowerCase().includes(lowercaseQuery)
      );
    },
    
    create: async (product: Omit<Product, 'id'>) => {
      await delay(500);
      
      const newProduct: Product = {
        ...product,
        id: `product-${Date.now()}`
      };
      
      products.push(newProduct);
      return newProduct;
    },
    
    update: async (id: string, updates: Partial<Product>) => {
      await delay(500);
      
      const index = products.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error('Product not found');
      }
      
      products[index] = { ...products[index], ...updates };
      return products[index];
    },
    
    delete: async (id: string) => {
      await delay(500);
      
      const index = products.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error('Product not found');
      }
      
      const deletedProduct = products[index];
      products.splice(index, 1);
      
      return deletedProduct;
    }
  },
  
  // Cart endpoints
  cart: {
    getCart: async (userId: string) => {
      await delay(200);
      return carts[userId] || [];
    },
    
    addToCart: async (userId: string, productId: string, quantity: number) => {
      await delay(300);
      
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      if (!carts[userId]) {
        carts[userId] = [];
      }
      
      const existingCartItem = carts[userId].find(item => item.product.id === productId);
      
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        carts[userId].push({ product, quantity });
      }
      
      return carts[userId];
    },
    
    updateCartItem: async (userId: string, productId: string, quantity: number) => {
      await delay(300);
      
      if (!carts[userId]) {
        throw new Error('Cart not found');
      }
      
      const cartItemIndex = carts[userId].findIndex(item => item.product.id === productId);
      
      if (cartItemIndex === -1) {
        throw new Error('Item not found in cart');
      }
      
      if (quantity <= 0) {
        carts[userId] = carts[userId].filter(item => item.product.id !== productId);
      } else {
        carts[userId][cartItemIndex].quantity = quantity;
      }
      
      return carts[userId];
    },
    
    removeFromCart: async (userId: string, productId: string) => {
      await delay(300);
      
      if (!carts[userId]) {
        throw new Error('Cart not found');
      }
      
      carts[userId] = carts[userId].filter(item => item.product.id !== productId);
      return carts[userId];
    },
    
    clearCart: async (userId: string) => {
      await delay(300);
      carts[userId] = [];
      return [];
    }
  },
  
  // Order endpoints
  orders: {
    createOrder: async (userId: string, cartItems: CartItem[], shippingAddress: Address) => {
      await delay(800);
      
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Cannot create order with empty cart');
      }
      
      const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        userId,
        items: [...cartItems],
        total,
        status: 'pending',
        shippingAddress,
        createdAt: new Date().toISOString()
      };
      
      orders.push(newOrder);
      
      // Clear the user's cart after order creation
      carts[userId] = [];
      
      return newOrder;
    },
    
    getUserOrders: async (userId: string) => {
      await delay(500);
      return orders.filter(order => order.userId === userId);
    },
    
    getAllOrders: async () => {
      await delay(500);
      return orders;
    },
    
    getOrderById: async (orderId: string) => {
      await delay(300);
      
      const order = orders.find(o => o.id === orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    },
    
    updateOrderStatus: async (orderId: string, status: Order['status']) => {
      await delay(500);
      
      const orderIndex = orders.findIndex(o => o.id === orderId);
      
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }
      
      orders[orderIndex].status = status;
      return orders[orderIndex];
    }
  }
};
