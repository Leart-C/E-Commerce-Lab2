import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, CircularProgress } from "@mui/material";

interface Review {
  id: string;
  reviewText: string;
  rating: number;
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

const ProductReviewList: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [productName, setProductName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    // Fetch reviews
    const fetchReviews = fetch(
      `https://localhost:7039/api/ProductReview/product/${productId}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Gabim: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
      });

    // Fetch product name
    const fetchProductName = fetch(
      `https://localhost:7039/api/Product/${productId}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Gabim: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        setProductName(data.productName); // Use 'productName' as it is in your DTO
      });

    // Wait for both fetches to complete
    Promise.all([fetchReviews, fetchProductName])
      .catch((err) => {
        console.error("Gabim gjatë marrjes së të dhënave:", err);
        setError("Gabim gjatë marrjes së të dhënave.");
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (reviews.length === 0)
    return <Typography>Asnjë review për këtë produkt.</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Review për produktin: {productName || "Emri i panjohur"}
      </Typography>
      {reviews.map((review) => (
        <Box
          key={review.id}
          sx={{
            mb: 2,
            p: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {review.userInfo.firstName} {review.userInfo.lastName} (
            {review.userInfo.email})
          </Typography>
          <Typography>Rating: {review.rating} / 10</Typography>
          <Typography sx={{ mt: 1 }}>{review.reviewText}</Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "gray", mt: 1 }}>
            Data: {new Date(review.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ProductReviewList;
