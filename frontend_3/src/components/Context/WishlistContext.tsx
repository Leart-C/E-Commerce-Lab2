import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage'; 

// Define the shape of the Wishlist Context
interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'userWishlist';

export const WishlistProvider = ({ children }: { children: ReactNode }) => {

  const [wishlist, setWishlist] = useLocalStorage<string[]>(WISHLIST_STORAGE_KEY, []);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const contextValue: WishlistContextType = {
    wishlist,
    toggleWishlist,
    isWishlisted,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};