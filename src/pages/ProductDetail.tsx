
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Product } from '@/types';
import { api } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Minus, Plus, ArrowLeft, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedProduct = await api.products.getById(id);
        setProduct(fetchedProduct);
      } catch (err) {
        console.error('Failed to load product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity < 1 || (product && newQuantity > product.stock)) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity} × ${product.name} added to your cart`,
      action: (
        <Link to="/cart">
          <Button variant="outline" size="sm">
            View Cart
          </Button>
        </Link>
      ),
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-40 w-full" />
              <div className="flex space-x-4 pt-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 flex-grow" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-8">{error || 'Product not found'}</p>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/products"
          className="inline-flex items-center text-brand-purple hover:underline mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          {/* Product Information */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-brand-purple mb-4">
              {formatCurrency(product.price)}
            </p>
            
            <div className="mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Category:</span>
                <span>{product.category}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Availability:</span>
                {product.stock > 0 ? (
                  <span className="inline-flex items-center text-green-600">
                    <Check className="mr-1 h-4 w-4" />
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </div>
            </div>
            
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-4">Quantity:</span>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="h-10 w-10 rounded-none"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="h-10 w-10 rounded-none"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-brand-purple hover:bg-brand-purple-dark"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
