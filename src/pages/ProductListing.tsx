
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { api } from '@/services/api';
import { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const ProductListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortOrder, setSortOrder] = useState('default');
  
  const category = searchParams.get('category');
  const query = searchParams.get('q');

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      
      try {
        let fetchedProducts: Product[] = [];
        
        if (query) {
          fetchedProducts = await api.products.search(query);
        } else if (category) {
          fetchedProducts = await api.products.getByCategory(category);
        } else {
          fetchedProducts = await api.products.getAll();
        }
        
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [category, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (searchQuery.trim()) {
      newSearchParams.set('q', searchQuery.trim());
      newSearchParams.delete('category');
    } else {
      newSearchParams.delete('q');
    }
    
    setSearchParams(newSearchParams);
  };

  const handleSort = (value: string) => {
    setSortOrder(value);
    let sortedProducts = [...products];
    
    switch (value) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // No sorting needed for default
        break;
    }
    
    setProducts(sortedProducts);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {category ? `${category} Products` : query ? 'Search Results' : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {isLoading
              ? 'Loading products...'
              : `Showing ${products.length} ${products.length === 1 ? 'product' : 'products'}`
            }
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </form>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <Select value={sortOrder} onValueChange={handleSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default ProductListing;
