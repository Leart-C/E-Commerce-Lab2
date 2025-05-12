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
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "../../routes/paths";

type FormValues = {
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
  parkingSpotId: string;
  parkingReservationManagerId: string;
};

type ParkingSpot = {
  id: string;
  location: string;
  size: string;
  pricePerHour: number;
  status: string;
};

type ParkingReservationManager = {
  id: string;
  managerName: string;
  managerContact: string;
};

type ReservationDetails = {
  createdAt: string;
  updatedAt: string;
};

export const statuses = [
  { label: "Active", value: "active" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Completed", value: "completed" },
];

const initialValues: FormValues = {
  startDate: "",
  endDate: "",
  status: "",
  totalAmount: 0,
  parkingSpotId: "",
  parkingReservationManagerId: "",
};

export const AddReservation = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [managers, setManagers] = useState<ParkingReservationManager[]>([]);
  const [reservationDetails, setReservationDetails] =
    useState<ReservationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch Parking Spots
  const fetchParkingSpots = async () => {
    try {
      const res = await axios.get<ParkingSpot[]>(
        "https://localhost:7024/api/ParkingSpot/Get"
      );
      setParkingSpots(res.data);
    } catch (error) {
      console.error("Error fetching parking spots:", error);
      setError("Error fetching parking spots. Please try again.");
    }
  };

  // Fetch Managers
  const fetchManagers = async () => {
    try {
      const res = await axios.get<ParkingReservationManager[]>(
        "https://localhost:7024/api/ParkingReservationManager/Get"
      );
      setManagers(res.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
      setError("Error fetching managers. Please try again.");
    }
  };

  useEffect(() => {
    fetchParkingSpots();
    fetchManagers();
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
    const {
      startDate,
      endDate,
      status,
      totalAmount,
      parkingSpotId,
      parkingReservationManagerId,
    } = formValues;

    return (
      startDate.trim() !== "" &&
      endDate.trim() !== "" &&
      status.trim() !== "" &&
      totalAmount > 0 &&
      parkingSpotId &&
      parkingReservationManagerId
    );
  };

  // Add a new reservation
  const addNewReservation = async () => {
    try {
      setIsAdding(true);
      setError(null);
      setSuccessMessage(null);

      const res = await axios.post<ReservationDetails>(
        "https://localhost:7024/api/Reservation/Create",
        formValues
      );

      setSuccessMessage("Reservation added successfully!");
      setReservationDetails(res.data);
      setFormValues(initialValues);
      navigate(PATH_DASHBOARD.reservations);
    } catch (error: any) {
      console.error("Error adding new reservation:", error);
      setError(
        error.response?.data?.message ||
          "Error adding new reservation. Please try again."
      );
    } finally {
      setIsAdding(false);
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
                Add New Reservation
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error && (
              <TableRow>
                <TableCell colSpan={2} align="center" style={{ color: "red" }}>
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
                >
                  {successMessage}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>Start Date</TableCell>
              <TableCell>
                <TextField
                  name="startDate"
                  type="date"
                  onChange={handleInputChange}
                  value={formValues.startDate}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>End Date</TableCell>
              <TableCell>
                <TextField
                  name="endDate"
                  type="date"
                  onChange={handleInputChange}
                  value={formValues.endDate}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
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
            <TableRow>
              <TableCell>Total Amount</TableCell>
              <TableCell>
                <TextField
                  name="totalAmount"
                  type="number"
                  onChange={handleInputChange}
                  value={formValues.totalAmount}
                  placeholder="Total Amount"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Parking Spot</TableCell>
              <TableCell>
                <Select
                  name="parkingSpotId"
                  value={formValues.parkingSpotId}
                  onChange={(e) =>
                    handleInputChange(
                      e as { target: { name: string; value: string } }
                    )
                  }
                  fullWidth
                >
                  {parkingSpots.map((spot) => (
                    <MenuItem key={spot.id} value={spot.id}>
                      {`${spot.location} - $${spot.pricePerHour}/hour`}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Manager</TableCell>
              <TableCell>
                <Select
                  name="parkingReservationManagerId"
                  value={formValues.parkingReservationManagerId}
                  onChange={(e) =>
                    handleInputChange(
                      e as { target: { name: string; value: string } }
                    )
                  }
                  fullWidth
                >
                  {managers.map((manager) => (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.managerName}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
            {reservationDetails && (
              <>
                <TableRow>
                  <TableCell>Created At</TableCell>
                  <TableCell>{reservationDetails.createdAt}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Updated At</TableCell>
                  <TableCell>{reservationDetails.updatedAt}</TableCell>
                </TableRow>
              </>
            )}
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Button
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding || !isFormValid()}
                  onClick={addNewReservation}
                >
                  {isAdding
                    ? "Adding new reservation..."
                    : "Add New Reservation"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddReservation;
