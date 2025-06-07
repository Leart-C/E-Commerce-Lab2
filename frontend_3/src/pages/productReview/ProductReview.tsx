import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../auth/axiosInstance";

interface Product {
  id: string;
  name: string;
  description: string;
}

const ProductReview: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get(
          "https://localhost:7039/api/Product"
        );
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Gabim gjatë marrjes së produkteve:", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleOpenModal = (productId: string) => {
    setSelectedProductId(productId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setReviewText("");
    setRating(null);
    setName("");
    setEmail("");
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("accessToken");
    if (!selectedProductId || !reviewText || rating === null) {
      alert("Ju lutem plotësoni të gjitha fushat!");
      return;
    }

    const payload = {
      productId: selectedProductId,
      reviewText: reviewText.trim(),
      rating,
      name: name.trim(),
      email: email.trim(),
    };

    try {
      await axiosInstance.post(
        "https://localhost:7039/api/ProductReview",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleCloseModal();
      navigate(`/dashboard/productReview/${selectedProductId}`);
    } catch (err) {
      console.error("Gabim gjatë dërgimit të review:", err);
      alert(
        "Ka ndodhur një gabim gjatë dërgimit. Ju lutem kontrolloni të dhënat."
      );
    }
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        fontWeight={600}
        color="primary.main"
      >
        Produktet për Review
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 3,
                boxShadow: 3,
                transition: "0.3s",
                '&:hover': {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={500} gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleOpenModal(product.id)}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                  >
                    Shto Review
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle fontWeight={600}>Shto Review</DialogTitle>
        <DialogContent>
          <TextField
            label="Emri"
            fullWidth
            margin="dense"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Vlerësimi (1-10)"
            type="number"
            fullWidth
            margin="dense"
            value={rating !== null ? rating : ""}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                setRating(value);
              } else {
                setRating(null);
              }
            }}
            inputProps={{ min: 1, max: 10 }}
          />
          <TextField
            label="Shkruaj mendimin tuaj"
            multiline
            rows={4}
            fullWidth
            margin="dense"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Anulo</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            color="primary"
          >
            Dërgo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductReview;
