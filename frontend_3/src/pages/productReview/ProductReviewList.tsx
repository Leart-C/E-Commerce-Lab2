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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    fetch(`https://localhost:7039/api/ProductReview/product/${productId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Gabim: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
          setError(null);
        } else {
          setReviews([]);
          setError("Nuk u gjetën review për këtë produkt.");
        }
      })
      .catch((err) => {
        console.error("Gabim gjatë marrjes së review-ve:", err);
        setError("Gabim gjatë marrjes së review-ve.");
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
        Review për produktin {productId}
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
