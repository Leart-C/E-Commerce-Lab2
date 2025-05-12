import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";

type ParkingSpot = {
  id: number;
  location: string;
  size: string;
  status: string;
  pricePerHour: number;
};

const BASE_URL = "https://localhost:7024/api/ParkingSpot/Create"; // Adjust to your API

const AddParkingSpot: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState<Partial<ParkingSpot>>({
    location: "",
    size: "",
    status: "",
    pricePerHour: 0,
  });

  const navigate = useNavigate();

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === "pricePerHour" ? parseFloat(value) : value,
    }));
  };

  const addNewParkingSpot = async () => {
    try {
      setIsAdding(true);
      await axios.post(BASE_URL, formValues);
      setIsAdding(false);
      navigate(-1); // Redirect to the parkingSpots list page
    } catch (error) {
      console.log("Error adding new parking spot:", error);
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
                Add New Parking Spot
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>
                <TextField
                  name="location"
                  value={formValues.location || ""}
                  onChange={handleInputChange}
                  placeholder="Location"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Size</TableCell>
              <TableCell>
                <TextField
                  name="size"
                  value={formValues.size || ""}
                  onChange={handleInputChange}
                  placeholder="Size (e.g., Small, Medium, Large)"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>
                <TextField
                  name="status"
                  value={formValues.status || ""}
                  onChange={handleInputChange}
                  placeholder="Status (e.g., Available, Occupied)"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Price Per Hour</TableCell>
              <TableCell>
                <TextField
                  name="pricePerHour"
                  type="number"
                  value={formValues.pricePerHour || ""}
                  onChange={handleInputChange}
                  placeholder="Price Per Hour"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Button
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding}
                  onClick={addNewParkingSpot}
                >
                  {isAdding
                    ? "Adding new parking spot..."
                    : "Add new parking spot"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddParkingSpot;
