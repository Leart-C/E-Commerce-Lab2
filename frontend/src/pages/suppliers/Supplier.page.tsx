import { useState, useEffect } from "react";
// import "./products.scss";
import axios from "axios";
import { ISupplier } from "../../types/global.typing";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Add } from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { RolesEnum } from "../../types/auth.types"; // Adjust the import path if necessary

// Mock user object for demonstration purposes
const user = {
  role: RolesEnum.ADMIN, // Replace this with actual role determination logic
};

const baseUrl = "https://localhost:7149/api/Supplier/Get";
const deleteURL = "https://localhost:7149/api/Supplier";

const Supplier: React.FC = () => {
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [selectedSupplierID, setSelectedSupplierID] = useState<string | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const redirect = useNavigate();

  const fetchSupplierList = async () => {
    try {
      const response = await axios.get<ISupplier[]>(baseUrl);
      setSuppliers(response.data);
      if (location?.state) {
        Swal.fire({
          icon: "success",
          title: location?.state?.message,
        });
        redirect(location.pathname, { replace: true });
      }
    } catch (error) {
      alert("An Error Happened");
    }
  };

  useEffect(() => {
    fetchSupplierList();
  }, []);

  const redirectToEditPage = (id: string) => {
    redirect(`/suppliers/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedSupplierID(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSupplierID(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedSupplierID) {
      try {
        await axios.delete(`${deleteURL}/${selectedSupplierID}`);
        setSuppliers(
          (prevSuppliers) =>
            prevSuppliers?.filter(
              (supplier) => supplier.id !== selectedSupplierID
            ) || null
        );
      } catch (error) {
        console.error("Failed to delete material:", error);
      } finally {
        handleClose();
      }
    }
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
        boxSizing: "border-box",
      }}
    >
      <Stack direction="column" spacing={2} width="100%" maxWidth="1200px">
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => redirect("/suppliers/add")}
          sx={{ alignSelf: "flex-end" }}
        >
          Add new supplier
        </Button>
        <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Info</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers?.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>{material.id}</TableCell>
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.info}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => redirectToEditPage(material.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleDeleteClick(material.id)}
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
          <DialogTitle>Delete Material</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this supplier? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default Supplier;
