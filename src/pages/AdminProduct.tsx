
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { api } from '@/services/api';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

const AdminProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    price: 0,
    description: '',
    category: 'Electronics',
    image: '',
    stock: 0
  });

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        setIsLoading(true);
        
        try {
          const productData = await api.products.getById(id!);
          setProduct(productData);
        } catch (error) {
          console.error('Failed to fetch product:', error);
          
          toast({
            variant: "destructive",
            title: "Error",
            description: 'Failed to load product data'
          });
          
          navigate('/admin');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [id, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEditing) {
        await api.products.update(id!, product);
        
        toast({
          title: "Success",
          description: "Product updated successfully"
        });
      } else {
        const newProduct = await api.products.create(product);
        
        toast({
          title: "Success",
          description: "Product created successfully"
        });
      }
      
      navigate('/admin');
    } catch (error) {
      console.error('Failed to save product:', error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to save product'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.products.delete(id!);
        
        toast({
          title: "Success",
          description: "Product deleted successfully"
        });
        
        navigate('/admin');
      } catch (error) {
        console.error('Failed to delete product:', error);
        
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to delete product'
        });
      }
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <Layout>
          <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={product.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      name="image"
                      type="url"
                      value={product.image}
                      onChange={handleChange}
                      required
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={product.description}
                      onChange={handleChange}
                      rows={4}
                      required
                    />
                  </div>
                </div>
                
                {product.image && (
                  <div className="border rounded-md p-4">
                    <p className="text-sm font-medium mb-2">Image Preview</p>
                    <div className="aspect-square w-40 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={product.image}
                        alt="Product preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Image+Error';
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isSubmitting}
                    >
                      Delete Product
                    </Button>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    className="bg-brand-purple hover:bg-brand-purple-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Saving...
                      </span>
                    ) : (
                      isEditing ? 'Update Product' : 'Create Product'
                    )}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminProduct;
