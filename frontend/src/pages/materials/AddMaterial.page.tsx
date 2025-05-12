import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Supplier } from "../../types/global.typing";

type FormValues = {
  name: string;
  description: string;
  supplierId: string;
};

export const AddMaterial = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    description: "",
    supplierId: "",
  });
  const [suppliersList, setSuppliersList] = useState<Supplier[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Function to fetch suppliers from the API
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("https://localhost:7149/api/Supplier/Get");
      setSuppliersList(res.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setError("Error fetching suppliers. Please try again.");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Function to handle input change in the form
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

  // Function to add a new material
  const addNewMaterial = async () => {
    try {
      setIsAdding(true);
      await axios.post(
        "https://localhost:7149/api/Material/Create",
        formValues
      );
      setIsAdding(false);
      navigate("/materials");
    } catch (error) {
      console.log("Error adding new material:", error);
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
      }}
    >
      <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} align="center">
                Add New Material
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>
                <TextField
                  name="name"
                  onChange={handleInputChange}
                  placeholder="Name"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>
                <TextField
                  name="description"
                  onChange={handleInputChange}
                  placeholder="Description"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Supplier</TableCell>
              <TableCell>
                {error ? (
                  <div>{error}</div>
                ) : (
                  <Select
                    name="supplierId"
                    value={formValues.supplierId}
                    onChange={handleInputChange}
                    fullWidth
                  >
                    {suppliersList.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {`${supplier.name} - ${supplier.info}`}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Button
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding}
                  onClick={addNewMaterial}
                >
                  {isAdding ? "Adding new material..." : "Add new material"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddMaterial;
