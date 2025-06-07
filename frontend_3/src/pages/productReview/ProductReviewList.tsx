import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
  Rating,
  Paper,
  Divider,
} from "@mui/material";

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

    const fetchProductName = fetch(
      `https://localhost:7039/api/Product/${productId}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Gabim: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        setProductName(data.productName);
      });

    Promise.all([fetchReviews, fetchProductName])
      .catch((err) => {
        console.error("Gabim gjatë marrjes së të dhënave:", err);
        setError("Gabim gjatë marrjes së të dhënave.");
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography color="error" mt={3}>
        {error}
      </Typography>
    );
  if (reviews.length === 0)
    return (
      <Typography mt={3} fontStyle="italic">
        Asnjë review për këtë produkt.
      </Typography>
    );

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Reviews për produktin:{" "}
        <span style={{ color: "#1976d2" }}>{productName || "Emri i panjohur"}</span>
      </Typography>

      {reviews.map((review) => (
        <Paper
          key={review.id}
          elevation={4}
          sx={{
            p: 3,
            mb: 3,
            borderLeft: "5px solid #1976d2",
            background: "#f9f9f9",
            borderRadius: "12px",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.01)",
            },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
           {review.userInfo ? (
  <>
    <Typography variant="subtitle1" fontWeight="bold">
      {review.userInfo.firstName} {review.userInfo.lastName}
    </Typography>
    <Typography variant="caption" color="textSecondary">
      {review.userInfo.email}
    </Typography>
  </>
) : (
  <Typography variant="subtitle2" fontStyle="italic" color="textSecondary">
    (Përdorues anonim)
  </Typography>
)}

          </Box>

          <Box display="flex" alignItems="center" mt={1}>
            <Rating
              value={review.rating}
              readOnly
              precision={1}
              max={5}
              sx={{ color: "#ffb400" }}
            />
            <Typography variant="body2" ml={1}>
              ({review.rating} yje)
            </Typography>
          </Box>

          <Typography sx={{ mt: 2, mb: 1 }}>{review.reviewText}</Typography>

          <Divider sx={{ my: 1 }} />

          <Typography variant="caption" color="gray">
            Publikuar më:{" "}
            {new Date(review.createdAt).toLocaleDateString("sq-AL", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default ProductReviewList;
