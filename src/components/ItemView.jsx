import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BottomBar from './BottomBar';

const items = [
  {
    id: 1,
    name: 'Sample Item',
    price: 10,
    image: 'https://example.com/image.jpg',
    description: 'This is a sample item.'
  },
  {
    id: 2,
    name: 'Another Item',
    price: 15,
    image: 'https://example.com/image2.jpg',
    description: 'This is another sample item.'
  }
];

const ItemView = () => {
  const { id } = useParams();
  const { addToCart, addToWishlist } = useCart();
  const item = items.find(item => item.id === parseInt(id));

  if (!item) {
    return <div>Item not found</div>;
  }

  const handleAddToCart = () => {
    addToCart(item);
    alert('Added to cart!');
  };

  const handleAddToWishlist = () => {
    addToWishlist(item);
    alert('Added to wishlist!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="relative">
        <img src={item.image} alt={item.name} className="w-full h-96 object-cover" />
        <Link to="/">
          <ChevronLeft />
        </Link>
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold">{item.name}</h2>
        <p className="text-gray-600 mt-2">{item.description}</p>
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200 flex space-x-4">
        <button onClick={handleAddToWishlist} className="w-1/2 bg-pink-100 text-pink-600 font-bold py-3 rounded-lg flex items-center justify-center space-x-2">
          <Heart />
          <span>Wishlist</span>
        </button>
        <button onClick={handleAddToCart} className="w-1/2 bg-pink-500 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2">
          <ShoppingCart />
          <span>Add to Cart</span>
        </button>
      </div>
      <BottomBar />
    </div>
  );
};

export default ItemView;