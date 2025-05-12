import { ChangeEvent, useState } from "react";
import { ISupplier } from "../../types/global.typing";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";

const BASE_URL = "https://localhost:7149/api/Supplier/Create";

const AddSupplier = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState<Partial<ISupplier>>({
    name: "",
    info: "",
  });

  const navigate = useNavigate();

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

  const addNewSupplier = async () => {
    try {
      setIsAdding(true);
      await axios.post(BASE_URL, formValues);
      setIsAdding(false);
      navigate("/suppliers");
    } catch (error) {
      console.log("Error adding new supplier:", error);
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
                Add New Supplier
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
              <TableCell>Info</TableCell>
              <TableCell>
                <TextField
                  name="info"
                  onChange={handleInputChange}
                  placeholder="Info"
                  fullWidth
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2} align="center">
                <Button
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding}
                  onClick={addNewSupplier}
                >
                  {isAdding ? "Adding new supplier..." : "Add new supplier"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddSupplier;
