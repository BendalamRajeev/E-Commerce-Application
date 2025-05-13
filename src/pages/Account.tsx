
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Package, LogOut } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const Account: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Account Summary */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-6">
                  <div className="bg-brand-purple h-16 w-16 rounded-full flex items-center justify-center text-white mr-4">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500 mt-1 capitalize">
                      Account Type: {user?.role}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button asChild variant="outline" className="flex items-center">
                    <Link to="/orders">
                      <Package className="mr-2 h-4 w-4" />
                      View Orders
                    </Link>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link to="/orders">Order History</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link to="/cart">View Cart</Link>
                </Button>
                {user?.role === 'admin' && (
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Link to="/admin">Admin Dashboard</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Settings and Preferences (simplified for prototype) */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Settings & Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  These settings are simplified for the prototype and don't actually save changes.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Email Preferences</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="orderUpdates"
                          className="mr-2"
                          defaultChecked
                        />
                        <label htmlFor="orderUpdates">Order updates and receipts</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="promotions"
                          className="mr-2"
                          defaultChecked
                        />
                        <label htmlFor="promotions">Promotional emails and offers</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="newsletter"
                          className="mr-2"
                        />
                        <label htmlFor="newsletter">Weekly newsletter</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Account Security</h3>
                    <Button variant="outline" className="mr-3">
                      Change Password
                    </Button>
                    <Button variant="outline">
                      Two-Factor Authentication
                    </Button>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="bg-brand-purple hover:bg-brand-purple-dark">
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Account;
