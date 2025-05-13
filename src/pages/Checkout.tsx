
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/services/api';
import { Address } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

const formSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zip: z.string().min(1, "ZIP/Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
    },
  });

  const handleSubmit = async (values: CheckoutFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const shippingAddress: Address = {
        street: values.street,
        city: values.city,
        state: values.state,
        zip: values.zip,
        country: values.country
      };
      
      // Create the order
      const order = await api.orders.createOrder(user.id, items, shippingAddress);
      
      // Clear the cart after successful order
      await clearCart();
      
      toast({
        title: "Order Placed!",
        description: `Your order #${order.id.split('-')[1]} has been placed successfully.`,
      });
      
      // Redirect to order confirmation
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : 'Something went wrong during checkout',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                        
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="street"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main St" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input placeholder="City" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State/Province</FormLabel>
                                  <FormControl>
                                    <Input placeholder="State" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="zip"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ZIP/Postal Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="ZIP Code" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Country" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment Information - for a prototype, we're not implementing real payment */}
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cardName">Name on Card</Label>
                            <Input id="cardName" placeholder="John Doe" />
                          </div>
                          
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="•••• •••• •••• ••••" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiration Date</Label>
                              <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input id="cvv" placeholder="•••" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-brand-purple hover:bg-brand-purple-dark"
                        disabled={isSubmitting || items.length === 0}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Processing...
                          </span>
                        ) : (
                          `Place Order (${formatCurrency(getCartTotal())})`
                        )}
                      </Button>
                      
                      <p className="text-sm text-gray-500 text-center">
                        By placing your order, you agree to our terms of service and privacy policy.
                      </p>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  {/* List Items */}
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center text-sm">
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
                            <p className="text-gray-500">
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
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatCurrency(getCartTotal())}</span>
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
                      <span>{formatCurrency(getCartTotal())}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Checkout;
