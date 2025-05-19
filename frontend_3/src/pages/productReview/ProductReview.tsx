import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Rating,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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
        const res = await axios.get("https://localhost:7039/api/Product");
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

    console.log("Payload që po dërgohet:", payload); // 👈 Vendose këtu

    try {
      await axios.post("https://localhost:7039/api/ProductReview", payload, {
        headers: {
          Authorization: `Bearer ${token}`, // token nga login
        },
      });
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
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Produktet për Review
      </Typography>

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} md={6} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {product.description}
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(product.id)}
                  >
                    Shto Review
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth>
        <DialogTitle>Shto Review</DialogTitle>
        <DialogContent>
          {/* <TextField
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
          /> */}
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
