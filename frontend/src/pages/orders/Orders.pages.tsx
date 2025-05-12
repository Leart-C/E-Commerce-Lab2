import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ORDERS_LIST = "https://localhost:7149/api/Orders";
const DELETE_ORDER = "https://localhost:7149/api/Orders"; // Adjust this URL if necessary

type ProductOrders = {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
  productId: number;
  product: {
    id: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    isDeleted: boolean;
    brand: string;
    title: string;
    product_Orders: string[];
  };
  orderId: number;
  order: string;
};

export type Order = {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
  orderDate: string;
  total: number;
  address: string;
  paymentMethod: string;
  brand: string;
  product_Orders: ProductOrders[];
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const navigate = useNavigate();

  // Function to redirect to the edit page for a specific order
  const redirectToEditPage = (id: string) => {
    navigate(`/orders/edit/${id}`);
  };

  // Function to fetch orders from the API
  const getOrders = async () => {
    try {
      const res = await axios.get(ORDERS_LIST);
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  // Function to handle delete button click, opening the confirmation dialog
  const handleDeleteClick = (id: string) => {
    setSelectedOrderId(id);
    setOpen(true);
  };

  // Function to close the confirmation dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedOrderId(null);
  };

  // Function to confirm the deletion of an order
  const handleDeleteConfirm = async () => {
    if (selectedOrderId) {
      try {
        await axios.delete(`${DELETE_ORDER}/${selectedOrderId}`);
        setOrders(
          (prevOrders) =>
            prevOrders?.filter((order) => order.id !== selectedOrderId) || null
        );
      } catch (error) {
        console.error("Failed to delete order:", error);
      } finally {
        handleClose();
      }
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      <Stack direction="column" spacing={2} width="100%" maxWidth="1200px">
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => navigate("/orders/add")}
          sx={{ alignSelf: "flex-end" }}
        >
          Add new order
        </Button>
        <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>{order.brand}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => redirectToEditPage(order.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleDeleteClick(order.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Order</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this order? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default Orders;
