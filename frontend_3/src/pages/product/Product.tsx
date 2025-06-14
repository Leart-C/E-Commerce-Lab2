/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useContext } from "react";

import Swal from "sweetalert2";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { CategoryDto } from "../category/Category";
import { AuthContext } from "../../auth/auth.context";
import { getSession } from "../../auth/auth.utils";
import { IAuthContext } from "../../types/auth.types";
import axiosInstance from "../../utils/axiosInstance";

// --- NEW IMPORTS FOR WISHLIST & TABS ---
import TabsComponent, { TabConfig } from "../../components/Tabs/TabLayout"; // Your generic tab component
import { useWishlist } from "../../components/Context/WishlistContext"; // Wishlist context hook
import WishlistTab from "../../components/Tabs/WishlistTabs"; // The component that displays wishlisted items
import { FaStar, FaRegStar } from "react-icons/fa"; // Star icons from react-icons (install with: npm install react-icons)
// --- END NEW IMPORTS ---

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

interface ProductCreateDto {
  productName: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
}

const Product: React.FC = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [formData, setFormData] = useState<Partial<ProductCreateDto>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const { isAuthenticated } = useContext(AuthContext) as IAuthContext;

  // --- NEW: Initialize wishlist context ---
  const { toggleWishlist, isWishlisted } = useWishlist();

  const productApiUrl = "https://localhost:7039/api/Product";
  const categoryApiUrl = "https://localhost:7039/api/Category"; // Ensure this URL is correct
  const uploadImageUrl = "https://localhost:7039/api/Product/upload-image";

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get<ProductDto[]>(productApiUrl);
      setProducts(response.data);
    } catch (error) {
      Swal.fire("Gabim", "Nuk u morën produktet.", "error");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get<CategoryDto[]>(categoryApiUrl);
      setCategories(response.data);
    } catch (error) {
      Swal.fire("Gabim", "Nuk u morën kategoritë.", "error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: event.target.value as string,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formImage = new FormData();
    formImage.append("file", file);

    try {
      const response = await axiosInstance.post(uploadImageUrl, formImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { imageUrl } = response.data;
      setFormData((prev) => ({ ...prev, imageUrl }));
    } catch (error) {
      Swal.fire("Gabim gjatë ngarkimit të fotos", "", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getSession();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (
        !formData.productName ||
        !formData.description ||
        !formData.price ||
        !formData.categoryId
      ) {
        Swal.fire("Kujdes", "Të gjitha fushat janë të detyrueshme.", "warning");
        return;
      }

      if (editingId) {
        const originalProduct = products.find((p) => p.id === editingId);
        if (!originalProduct) throw new Error("Produkti nuk u gjet");

        const updatedProduct: ProductDto = {
          id: editingId,
          productName: formData.productName!,
          description: formData.description!,
          price: Number(formData.price!),
          categoryId: formData.categoryId!,
          imageUrl: formData.imageUrl ?? originalProduct.imageUrl,
          userId: originalProduct.userId!,
          userInfo: originalProduct.userInfo!,
        };

        await axiosInstance.put(productApiUrl, updatedProduct, { headers });
        Swal.fire(
          "U përditësua!",
          "Produkti u përditësua me sukses.",
          "success"
        );
      } else {
        await axiosInstance.post(productApiUrl, formData, { headers });
        Swal.fire("U shtua!", "Produkti u shtua me sukses.", "success");
      }

      setFormData({});
      setEditingId(null);
      setOpenModal(false);
      fetchProducts();
    } catch (error) {
      Swal.fire("Gabim!", "Ndodhi një gabim gjatë ruajtjes.", "error");
    }
  };

  const handleEdit = (product: ProductDto) => {
    setFormData({
      productName: product.productName,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
    });
    setEditingId(product.id || null);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setFormData({});
    setEditingId(null);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "A jeni i sigurt?",
      text: "Ky veprim nuk mund të zhbëhet!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Po, fshije!",
      cancelButtonText: "Anulo",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`${productApiUrl}/${id}`);
        Swal.fire("Fshirë!", "Produkti u fshi me sukses.", "success");
        fetchProducts();
      } catch (error) {
        Swal.fire("Gabim!", "Nuk u arrit të fshihet produkti.", "error");
      }
    }
  };

  // --- NEW: Define tabs for the Product page ---
  const productPageTabs: TabConfig[] = [
    {
      id: "overview",
      label: "Overview",
      // The content of the 'Overview' tab is your existing product management table
      component: (
        <div style={{ padding: "0px" }}>
          {" "}
          {/* Minimal padding as the outer div has padding */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            sx={{ mb: 2 }}
          >
            Shto Produkt
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Emri</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Përshkrimi</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Çmimi</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Kategoria</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Foto</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Wishlist</strong>
                  </TableCell>{" "}
                  {/* <-- NEW: Column for Wishlist */}
                  <TableCell>
                    <strong>Veprime</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>
                      {categories.find((c) => c.id === product.categoryId)
                        ?.categoryName ?? "Pa kategori"}
                    </TableCell>
                    <TableCell>
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt="Foto" width={60} />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    {/* --- NEW: Wishlist Star Button in table row --- */}
                    <TableCell>
                      {product.id && ( // Only show if product has an ID
                        <button
                          onClick={() => toggleWishlist(product.id!)} // Use ! for non-null assertion
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "20px",
                            color: "#FFD700",
                          }}
                          aria-label={
                            isWishlisted(product.id!)
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          {isWishlisted(product.id!) ? (
                            <FaStar />
                          ) : (
                            <FaRegStar />
                          )}
                        </button>
                      )}
                    </TableCell>
                    {/* --- END NEW: Wishlist Star Button --- */}
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          onClick={() => handleEdit(product)}
                          variant="outlined"
                          color="primary"
                        >
                          Edito
                        </Button>
                        <Button
                          onClick={() => handleDelete(product.id!)}
                          variant="outlined"
                          color="error"
                        >
                          Fshi
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ),
    },
    {
      id: "wishlist",
      label: "Wishlist",
      // Pass the *entire* list of products to WishlistTab, it will filter them
      component: <WishlistTab allProducts={products} />,
    },
  ];
  // --- END NEW: Define tabs ---

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
        Menaxhimi i Produkteve
      </h2>

      {/* --- NEW: Render the TabsComponent here --- */}
      <TabsComponent tabs={productPageTabs} initialTabId="overview" />
      {/* --- END NEW: Render the TabsComponent --- */}

      {/* Your existing Dialog for Add/Edit Product (remains outside the tabs) */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Edito Produktin" : "Shto Produkt"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Emri i Produktit"
              name="productName"
              value={formData.productName || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Përshkrimi"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              label="Çmimi"
              name="price"
              type="number"
              value={formData.price || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="category-label">Kategoria</InputLabel>
              <Select
                labelId="category-label"
                name="categoryId"
                value={formData.categoryId || ""}
                label="Kategoria"
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              {" "}
              Ngarko Foto
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {formData.imageUrl && (
              <Paper
                variant="outlined"
                sx={{
                  mt: 2,
                  p: 1,
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
                />
              </Paper>
            )}
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={() => setOpenModal(false)} color="secondary">
                {" "}
                Anulo{" "}
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {" "}
                Ruaj{" "}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Product;
