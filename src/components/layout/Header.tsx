
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { User, ShoppingCart, Search, Menu, X, Sun, Moon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = items.reduce((count, item) => count + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-brand-purple">BazaarBharat</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-brand-purple transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-foreground hover:text-brand-purple transition-colors">
              Products
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-foreground hover:text-brand-purple transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Search, Theme Toggle, Cart, and User - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-8"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-purple"
              >
                <Search size={18} />
              </button>
            </form>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-foreground hover:text-brand-purple transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            <Link to="/cart" className="relative text-foreground hover:text-brand-purple transition-colors">
              <ShoppingCart />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-brand-purple hover:bg-brand-purple-dark">
                  {cartItemCount}
                </Badge>
              )}
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-medium">Namaste, {user?.name}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account')}>
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    Orders
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            
            <Link to="/cart" className="relative mr-4 text-foreground">
              <ShoppingCart />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-brand-purple hover:bg-brand-purple-dark">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menu">
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-background border-t animate-fade-in">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-8"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-purple"
              >
                <Search size={18} />
              </button>
            </form>
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-foreground hover:text-brand-purple transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-foreground hover:text-brand-purple transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="text-foreground hover:text-brand-purple transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <Link
                    to="/orders"
                    className="text-foreground hover:text-brand-purple transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-foreground hover:text-brand-purple transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Login
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
