
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types';
import { api } from '@/services/api';
import { formatCurrency } from '@/lib/utils';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const orderData = await api.orders.getOrderById(id);
        
        // Only allow access to the user's own orders or admin users
        if (user?.role === 'admin' || user?.id === orderData.userId) {
          setOrder(orderData);
        } else {
          setError('You do not have permission to view this order');
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch order details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, user]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error || !order) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="flex flex-col items-center py-16">
                <h2 className="text-2xl font-semibold mb-2 text-red-600">Error</h2>
                <p className="text-gray-600 text-center mb-6">{error || 'Order not found'}</p>
                <Button asChild>
                  <Link to="/orders">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              to="/orders"
              className="inline-flex items-center text-brand-purple hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <Card className="mb-8">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <CardTitle>Order #{order.id.split('-')[1]}</CardTitle>
                    <Badge className={`${getStatusColor(order.status)} capitalize`}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                  
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center border-b pb-4">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <Link to={`/products/${item.product.id}`}>
                              <p className="font-medium hover:text-brand-purple transition-colors">
                                {item.product.name}
                              </p>
                            </Link>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(item.product.price)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                      {order.shippingAddress.country}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Credit Card (ending in 1234)</p>
                    <p className="text-sm text-gray-500 mt-1">
                      This is a mock payment for the prototype
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>Free</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>{formatCurrency(0)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 space-y-3">
                    <h4 className="font-medium">Need Help?</h4>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/contact">Contact Support</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default OrderDetail;
