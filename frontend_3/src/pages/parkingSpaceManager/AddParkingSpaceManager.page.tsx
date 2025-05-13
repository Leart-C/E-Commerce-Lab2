import React, { useState, useEffect, ChangeEvent } from "react";
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
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "../../routes/paths";

type ParkingSpaceManagerDto = {
  id: number;
  status: string;
  pagesa: number;
  kontakti: string;
  parkingSpaceId: number;
};

type ParkingSpace = {
  id: number;
  location: string;
};

const statuses = [
  { label: "Active", value: "active" },
  { label: "Declined", value: "declined" },
];

const initialValues: ParkingSpaceManagerDto = {
  id: 0,
  status: "",
  pagesa: 0,
  kontakti: "",
  parkingSpaceId: 0,
};

export const AddParkingSpaceManager: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] =
    useState<ParkingSpaceManagerDto>(initialValues);
  const [parkingSpacesList, setParkingSpacesList] = useState<ParkingSpace[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch parking spaces from the API
  const fetchParkingSpaces = async () => {
    try {
      const res = await axios.get<ParkingSpace[]>(
        "https://localhost:7024/api/ParkingSpace/Get"
      );
      setParkingSpacesList(res.data);
    } catch (error) {
      console.error("Error fetching parking spaces:", error);
      setError("Error fetching parking spaces. Please try again.");
    }
  };

  useEffect(() => {
    fetchParkingSpaces();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    const { status, pagesa, kontakti, parkingSpaceId } = formValues;
    return (
      status.trim() !== "" &&
      pagesa > 0 &&
      kontakti.trim() !== "" &&
      parkingSpaceId > 0
    );
  };

  // Add a new ParkingSpaceManager
  const addNewParkingSpaceManager = async () => {
    try {
      setIsAdding(true);
      setError(null);
      setSuccessMessage(null);

      await axios.post(
        "https://localhost:7024/api/ParkingSpaceManager/Create",
        formValues
      );

      setSuccessMessage("Parking Space Manager added successfully!");
      setFormValues(initialValues);
      navigate(PATH_DASHBOARD.parkingSpaceManager); // Redirect to the list of parking space managers
    } catch (error: any) {
      console.error("Error adding new Parking Space Manager:", error);
      setError(
        error.response?.data?.message ||
          "Error adding new Parking Space Manager. Please try again."
      );
    } finally {
      setIsAdding(false);
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
        className="table-container"
        component={Paper}
        sx={{ maxWidth: 600 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header" colSpan={2} align="center">
                Add New Parking Space Manager
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error && (
              <TableRow>
                <TableCell
                  className="error-message"
                  colSpan={2}
                  align="center"
                  style={{ color: "red" }}
                >
                  {error}
                </TableCell>
              </TableRow>
            )}
            {successMessage && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  align="center"
                  style={{ color: "green" }}
                  className="success-message"
                >
                  {successMessage}
                </TableCell>
              </TableRow>
            )}
            <TableRow className="input-row">
              <TableCell>Status</TableCell>
              <TableCell>
                <Select
                  name="status"
                  value={formValues.status}
                  onChange={(e) =>
                    handleInputChange(
                      e as { target: { name: string; value: string } }
                    )
                  }
                  className="select-field"
                  fullWidth
                >
                  {statuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
            <TableRow className="input-row">
              <TableCell>Payment</TableCell>
              <TableCell>
                <TextField
                  name="pagesa"
                  type="number"
                  onChange={handleInputChange}
                  value={formValues.pagesa}
                  placeholder="Amount"
                  fullWidth
                  className="input-field"
                />
              </TableCell>
            </TableRow>
            <TableRow className="input-row">
              <TableCell>Contact</TableCell>
              <TableCell>
                <TextField
                  name="kontakti"
                  onChange={handleInputChange}
                  value={formValues.kontakti}
                  placeholder="Contact"
                  fullWidth
                  className="input-field"
                />
              </TableCell>
            </TableRow>
            <TableRow className="input-row">
              <TableCell>Parking Space</TableCell>
              <TableCell>
                <Select
                  name="parkingSpaceId"
                  value={formValues.parkingSpaceId}
                  onChange={(e) =>
                    handleInputChange(
                      e as { target: { name: string; value: string } }
                    )
                  }
                  fullWidth
                  className="select-field"
                >
                  {parkingSpacesList.map((space) => (
                    <MenuItem key={space.id} value={space.id}>
                      {space.location}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                className="button-container"
                colSpan={2}
                align="center"
              >
                <Button
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding || !isFormValid()}
                  onClick={addNewParkingSpaceManager}
                  className="submit-button"
                >
                  {isAdding ? "Adding new manager..." : "Add New Manager"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddParkingSpaceManager;
