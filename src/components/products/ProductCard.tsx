
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Card className="hover-card overflow-hidden group">
      <Link to={`/products/${product.id}`}>
        <CardHeader className="p-0">
          <div className="aspect-square w-full overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg truncate">{product.name}</h3>
          <p className="text-brand-purple text-lg font-semibold mt-2">
            {formatCurrency(product.price)}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full bg-brand-purple hover:bg-brand-purple-dark"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
