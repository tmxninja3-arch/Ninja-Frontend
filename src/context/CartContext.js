import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (game) => {
    const existingItem = cartItems.find((item) => item._id === game._id);

    if (existingItem) {
      toast.warning('Game already in cart!');
      return;
    }

    setCartItems([...cartItems, game]);
    toast.success(`${game.title} added to cart!`);
  };

  // Remove item from cart
  const removeFromCart = (gameId) => {
    const item = cartItems.find((item) => item._id === gameId);
    setCartItems(cartItems.filter((item) => item._id !== gameId));
    if (item) {
      toast.info(`${item.title} removed from cart`);
    }
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    toast.info('Cart cleared');
  };

  // Get total price
  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  // Get cart count
  const getCartCount = () => {
    return cartItems.length;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};