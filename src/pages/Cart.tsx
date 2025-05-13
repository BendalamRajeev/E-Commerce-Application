
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowRight, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import CartItem from '@/components/cart/CartItem';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';

const Cart: React.FC = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4 flex justify-center">
              <ShoppingCart className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild className="bg-brand-purple hover:bg-brand-purple-dark">
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Cart Items ({items.reduce((sum, item) => sum + item.quantity, 0)})
                  </h2>
                  <Button variant="ghost" onClick={clearCart} className="text-gray-500">
                    Clear Cart
                  </Button>
                </div>
                
                <div>
                  {items.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(getCartTotal())}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(getCartTotal())}</span>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-brand-purple hover:bg-brand-purple-dark"
                  >
                    {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  {!isAuthenticated && (
                    <div className="flex items-start space-x-2 bg-amber-50 border border-amber-200 rounded-md p-3 text-sm">
                      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-800">
                        You'll need to log in before completing your purchase. 
                        <Link to="/login" className="underline ml-1">
                          Login now
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
