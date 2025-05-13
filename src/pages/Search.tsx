
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { api } from '@/services/api';
import { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) {
        setProducts([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const searchResults = await api.products.search(query);
        setProducts(searchResults);
      } catch (error) {
        console.error('Failed to search products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    searchProducts();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">
            {query ? `Search Results for "${query}"` : 'Search Products'}
          </h1>
          
          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Button
                type="submit"
                className="bg-brand-purple hover:bg-brand-purple-dark"
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </div>

        {query && (
          <div className="mb-4">
            {isLoading ? (
              <p>Searching...</p>
            ) : (
              <p className="text-gray-600">
                Found {products.length} {products.length === 1 ? 'product' : 'products'} for "{query}"
              </p>
            )}
          </div>
        )}
        
        {query ? (
          <ProductGrid products={products} isLoading={isLoading} />
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">Enter a search term to find products</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
