// src/components/WishlistTab.tsx
import React from 'react';
import { useWishlist } from '../Context/WishlistContext'; // Adjust path as needed
import { Button } from "@mui/material"; // Assuming you're using MUI components

// Re-using your ProductDto interface
interface ProductDto {
    id?: string;
    productName: string;
    description: string;
    price: number;
    categoryId: string;
    imageUrl?: string;
    userId?: string;
    userInfo?: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

interface WishlistTabProps {
  // Now accepts the full list of all products
  allProducts: ProductDto[];
}

const WishlistTab: React.FC<WishlistTabProps> = ({ allProducts }) => {
  const { wishlist, toggleWishlist } = useWishlist();

  // Filter the allProducts array to get only the wishlisted ones
  const wishlistedProducts = allProducts.filter(product =>
    product.id && wishlist.includes(product.id)
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Wishlist</h2>
      {wishlistedProducts.length === 0 ? (
        <p>Your wishlist is empty. Start adding some products!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {wishlistedProducts.map(product => (
            <div key={product.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.productName} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
              )}
              <h3 style={{ margin: '10px 0 5px 0' }}>{product.productName}</h3>
              <p style={{ margin: '0 0 10px 0', color: '#555' }}>${product.price.toFixed(2)}</p>
              <Button
                onClick={() => product.id && toggleWishlist(product.id)}
                variant="outlined" // Using MUI button styles
                color="error"
                sx={{ mt: 1 }} // Add some top margin
              >
                Remove from Wishlist
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;