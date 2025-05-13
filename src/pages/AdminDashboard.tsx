
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Package, Users, ShoppingCart, Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { api } from '@/services/api';
import { Order, Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const [fetchedProducts, fetchedOrders] = await Promise.all([
          api.products.getAll(),
          api.orders.getAllOrders(),
        ]);
        
        setProducts(fetchedProducts);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button asChild className="bg-brand-purple hover:bg-brand-purple-dark">
              <Link to="/admin/add-product">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
            </div>
          ) : (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Total Products
                      </CardTitle>
                      <CardDescription className="text-2xl font-bold">
                        {products.length}
                      </CardDescription>
                    </div>
                    <div className="bg-brand-purple/20 p-2 rounded-full">
                      <Package className="h-5 w-5 text-brand-purple" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-gray-500">
                      {products.filter(p => p.stock < 10).length} products with low stock
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Total Orders
                      </CardTitle>
                      <CardDescription className="text-2xl font-bold">
                        {orders.length}
                      </CardDescription>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                      <ShoppingCart className="h-5 w-5 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-gray-500">
                      {orders.filter(o => o.status === 'pending').length} pending orders
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Total Revenue
                      </CardTitle>
                      <CardDescription className="text-2xl font-bold">
                        {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
                      </CardDescription>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-gray-500">
                      From {orders.length} orders
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Orders */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                            No orders found
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders.slice(0, 5).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id.split('-')[1]}</TableCell>
                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(order.status)} capitalize`}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>User #{order.userId.split('-')[1]}</TableCell>
                            <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                            <TableCell className="text-right">
                              <Button asChild size="sm" variant="ghost">
                                <Link to={`/admin/orders/${order.id}`}>View</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  
                  {orders.length > 5 && (
                    <div className="mt-4 text-center">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/admin/orders">View All Orders</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Manage Products */}
              <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <CardTitle>Manage Products</CardTitle>
                  <Button asChild size="sm" className="mt-2 sm:mt-0 bg-brand-purple hover:bg-brand-purple-dark">
                    <Link to="/admin/add-product">Add New Product</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                            No products found
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.slice(0, 5).map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden mr-3">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span className="truncate max-w-[200px]">{product.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatCurrency(product.price)}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>
                              <span className={product.stock < 10 ? 'text-red-600 font-medium' : ''}>
                                {product.stock}
                              </span>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button asChild size="sm" variant="outline">
                                <Link to={`/admin/edit-product/${product.id}`}>Edit</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  
                  {products.length > 5 && (
                    <div className="mt-4 text-center">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/admin/products">View All Products</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
