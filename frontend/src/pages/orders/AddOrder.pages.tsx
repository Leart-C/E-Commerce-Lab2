import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { IProduct } from "../../types/global.typing";
import { useNavigate } from "react-router-dom";

const URL = "https://localhost:7149/api/Product/Get";
const ADD_ORDER_URL = "https://localhost:7149/api/Orders/Create";

type Product = {
  id: number;
  title: string;
  brand: string;
  size: string;
};

type FormValues = {
  total: number;
  address: string;
  paymentMethod: string;
  productId: number;
  brand: string;
};

export const AddOrder = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    total: 0,
    address: "",
    paymentMethod: "",
    productId: 0,
    brand: "",
  });
  const [productsList, setProductsList] = useState<Product[] | null>(null);

  const navigate = useNavigate();

  const getProductsList = async () => {
    try {
      const res = await axios.get(URL);
      setProductsList(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getProductById = async () => {
    if (formValues.productId) {
      try {
        const res = await axios.get<IProduct>(
          `https://localhost:7149/api/Product/${formValues.productId}`
        );
        setFormValues((prevValues) => ({
          ...prevValues,
          brand: res.data.brand,
        }));
      } catch (error) {
        console.error("Error fetching product by ID:", error);
      }
    }
  };

  const addNewOrder = async () => {
    try {
      setIsAdding(true);
      await axios.post(ADD_ORDER_URL, formValues);
      setIsAdding(false);
      navigate("/orders");
    } catch (error) {
      console.log("Error adding new order:", error);
    }
  };

  useEffect(() => {
    getProductsList();
  }, []);

  useEffect(() => {
    if (formValues.productId) {
      getProductById();
    }
  }, [formValues.productId]);

  const handleInputChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<unknown>
  ) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        padding: 2,
      }}
    >
      <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} align="center">
                Add New Order
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>
                <TextField
                  name="total"
                  type="number"
                  onChange={handleInputChange}
                  placeholder="Total"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>
                <Select
                  name="productId"
                  value={formValues.productId}
                  onChange={handleInputChange}
                  fullWidth
                >
                  {productsList?.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.title}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>
                <TextField
                  name="address"
                  onChange={handleInputChange}
                  placeholder="Address"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Payment Method</TableCell>
              <TableCell>
                <TextField
                  name="paymentMethod"
                  onChange={handleInputChange}
                  placeholder="Payment Method"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>
                <TextField
                  name="brand"
                  onChange={handleInputChange}
                  placeholder="Brand"
                  value={formValues.brand}
                  fullWidth
                  disabled
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Button
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding}
                  onClick={addNewOrder}
                >
                  {isAdding ? "Adding new order..." : "Add new order"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddOrder;
