
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Package, Eye } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types';
import { api } from '@/services/api';
import { formatCurrency } from '@/lib/utils';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const userOrders = await api.orders.getUserOrders(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

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
    }).format(date);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Orders</h1>
            <Button asChild className="bg-brand-purple hover:bg-brand-purple-dark">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-16">
                <Package className="h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Button asChild className="bg-brand-purple hover:bg-brand-purple-dark">
                  <Link to="/products">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        <CardTitle>Order #{order.id.split('-')[1]}</CardTitle>
                        <CardDescription>
                          Placed on {formatDate(order.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} capitalize`}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Separator className="my-4" />
                        
                        <div className="space-y-3">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.product.id} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden mr-3">
                                  <img 
                                    src={item.product.image} 
                                    alt={item.product.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{item.product.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {formatCurrency(item.product.price)} × {item.quantity}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {order.items.length > 3 && (
                            <p className="text-sm text-gray-500 italic">
                              + {order.items.length - 3} more items
                            </p>
                          )}
                        </div>
                        
                        <Separator className="my-4" />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div className="mb-3 sm:mb-0">
                          <p className="text-sm font-medium text-gray-500">Shipping Address</p>
                          <p className="text-sm">
                            {order.shippingAddress.street}, {order.shippingAddress.city},
                            <br />
                            {order.shippingAddress.state}, {order.shippingAddress.zip},
                            <br />
                            {order.shippingAddress.country}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-500">Order Total</p>
                          <p className="text-xl font-semibold">{formatCurrency(order.total)}</p>
                          <Button 
                            asChild
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                          >
                            <Link to={`/orders/${order.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Orders;
