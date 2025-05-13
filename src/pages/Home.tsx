
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { api } from '@/services/api';
import { Product } from '@/types';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await api.products.getAll();
        // For demo purposes, we'll just use the first few products as "featured"
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-purple-light to-brand-purple text-white">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Welcome to BazaarBharat
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-10 animate-slide-in">
            Your one-stop destination for all your shopping needs. Browse our premium collection of products at competitive prices.
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-white text-brand-purple hover:bg-gray-100 animate-slide-in"
          >
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
          <Link 
            to="/products" 
            className="text-brand-purple hover:underline font-medium"
          >
            View All
          </Link>
        </div>
        <ProductGrid products={featuredProducts} isLoading={isLoading} />
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <Link to="/products?category=Electronics" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover-card">
                <div className="aspect-video bg-gray-200 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Electronics" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">Electronics</h3>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link to="/products?category=Clothing" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover-card">
                <div className="aspect-video bg-gray-200 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Clothing" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">Clothing</h3>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link to="/products?category=Accessories" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover-card">
                <div className="aspect-video bg-gray-200 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Accessories" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">Accessories</h3>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Start Shopping?
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Create an account today and enjoy a seamless shopping experience with ShopEase.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            asChild
            size="lg"
            className="bg-brand-purple hover:bg-brand-purple-dark"
          >
            <Link to="/register">Create Account</Link>
          </Button>
          <Button 
            asChild
            size="lg"
            variant="outline"
          >
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
