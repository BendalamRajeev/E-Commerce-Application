
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b">
      {/* Product Image */}
      <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0 sm:mr-6">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-md"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex-grow mr-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-lg hover:text-brand-purple transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mt-1">
          Price: {formatCurrency(product.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center mt-4 sm:mt-0 mr-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleDecreaseQuantity}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="w-10 text-center">{quantity}</span>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleIncreaseQuantity}
          disabled={quantity >= product.stock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Item Total */}
      <div className="text-right sm:ml-4 mt-4 sm:mt-0">
        <div className="font-medium">
          {formatCurrency(product.price * quantity)}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2"
          onClick={handleRemove}
        >
          <Trash className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
