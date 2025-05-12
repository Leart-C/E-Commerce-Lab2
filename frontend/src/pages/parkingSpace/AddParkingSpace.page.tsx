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
import { PATH_DASHBOARD } from "../../routes/paths";

type ParkingSpace = {
  id: string;
  location: string;
  size: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  pricePerHour: number;
};

const BASE_URL = "https://localhost:7024/api/ParkingSpace/Create"; // Adjust to your API

const AddParkingSpace: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState<Partial<ParkingSpace>>({
    location: "",
    size: "",
    status: "",
    createdAt: new Date().toISOString().split("T")[0], // Default to today
    updatedAt: new Date().toISOString().split("T")[0], // Default to today
    pricePerHour: 0,
  });

  const navigate = useNavigate();

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const addNewParkingSpace = async () => {
    try {
      setIsAdding(true);
      await axios.post(BASE_URL, formValues);
      setIsAdding(false);
      navigate(PATH_DASHBOARD.parkingSpace); // Redirect to the parking spaces list page
    } catch (error) {
      console.error("Error adding new parking space:", error);
    }
  };

  return (
    <Box
      className="add-parking-space-container"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        padding: 2,
      }}
    >
      <TableContainer
        className="add-parking-space-form"
        component={Paper}
        sx={{ maxWidth: 600 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                className="add-parking-space-title"
                colSpan={2}
                align="center"
              >
                Add New Parking Space
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
                  className="add-parking-space-input"
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
                  placeholder="Size"
                  fullWidth
                  className="add-parking-space-input"
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
                  placeholder="Status"
                  fullWidth
                  className="add-parking-space-input"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Created At</TableCell>
              <TableCell>
                <TextField
                  name="createdAt"
                  value={formValues.createdAt || ""}
                  onChange={handleInputChange}
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className="add-parking-space-input"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Updated At</TableCell>
              <TableCell>
                <TextField
                  name="updatedAt"
                  value={formValues.updatedAt || ""}
                  onChange={handleInputChange}
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className="add-parking-space-input"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Price Per Hour</TableCell>
              <TableCell>
                <TextField
                  name="pricePerHour"
                  value={formValues.pricePerHour || ""}
                  onChange={handleInputChange}
                  placeholder="Price Per Hour"
                  type="number"
                  fullWidth
                  className="add-parking-space-input"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Button
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding}
                  onClick={addNewParkingSpace}
                  className="add-parking-space-button"
                >
                  {isAdding
                    ? "Adding new parking space..."
                    : "Add Parking Space"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddParkingSpace;
