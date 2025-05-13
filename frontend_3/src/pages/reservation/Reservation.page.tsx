import React, { useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { PATH_DASHBOARD } from "../../routes/paths";
import "./reservation.scss";

const API_BASE_URL = "https://localhost:7024/api";

// Define the Reservation type
export type Reservation = {
  id: string;
  startDate: string; // ISO format date
  endDate: string; // ISO format date
  status: string; // Reservation status
  totalAmount: number; // Total cost of the reservation
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last update timestamp
  parkingSpotId: string; // Foreign key to ParkingSpot
  parkingReservationManagerId: string; // Foreign key to ParkingReservationManager
};

// Define the ParkingSpot type
export type ParkingSpot = {
  id: string;
  location: string;
  size: string; // E.g., "small", "medium", "large"
  status: string; // E.g., "available", "occupied"
  pricePerHour: number;
};

// Define the ParkingReservationManager type
export type ParkingReservationManager = {
  id: string;
  managerName: string;
  managerContact: string;
};

const Reservation = () => {
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [managers, setManagers] = useState<ParkingReservationManager[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  const redirect = useNavigate();

  // Fetch data from APIs
  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Reservation/Get`);
      setReservations(res.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const fetchParkingSpots = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/ParkingSpot/Get`);
      setParkingSpots(res.data);
    } catch (error) {
      console.error("Error fetching parking spots:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/ParkingReservationManager/Get`
      );
      setManagers(res.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  // Delete reservation
  const handleDeleteClick = (id: string) => {
    setSelectedReservationId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReservationId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedReservationId) {
      try {
        await axios.delete(
          `${API_BASE_URL}/Reservation/${selectedReservationId}`
        );
        setReservations(
          (prev) => prev?.filter((r) => r.id !== selectedReservationId) || null
        );
      } catch (error) {
        console.error("Error deleting reservation:", error);
      } finally {
        handleClose();
      }
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchParkingSpots();
    fetchManagers();
  }, []);

  return (
    <Box className="reservation-container" sx={{ padding: 2 }}>
      <Stack direction="column" spacing={2}>
        <Button
          variant="outlined"
          onClick={() => redirect(`${PATH_DASHBOARD.reservations}/add`)}
        >
          Add New Reservation
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Parking Spot</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations?.map((reservation) => {
                const parkingSpot = parkingSpots.find(
                  (spot) => spot.id === reservation.parkingSpotId
                );
                const manager = managers.find(
                  (m) => m.id === reservation.parkingReservationManagerId
                );

                return (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.id}</TableCell>
                    <TableCell>
                      {reservation.startDate
                        ? format(new Date(reservation.startDate), "dd-MM-yyyy")
                        : ""}
                    </TableCell>
                    <TableCell>
                      {reservation.endDate
                        ? format(new Date(reservation.endDate), "dd-MM-yyyy")
                        : ""}
                    </TableCell>
                    <TableCell>{reservation.status}</TableCell>
                    <TableCell>{reservation.totalAmount}</TableCell>
                    <TableCell>
                      {reservation.createdAt
                        ? format(
                            new Date(reservation.createdAt),
                            "dd-MM-yyyy HH:mm"
                          )
                        : "Unknown"}
                    </TableCell>
                    <TableCell>
                      {reservation.updatedAt
                        ? format(
                            new Date(reservation.updatedAt),
                            "dd-MM-yyyy HH:mm"
                          )
                        : "Unknown"}
                    </TableCell>
                    <TableCell>{parkingSpot?.location || "Unknown"}</TableCell>
                    <TableCell>{manager?.managerName || "Unknown"}</TableCell>
                    <TableCell>
                      <Link
                        to={`${PATH_DASHBOARD.reservations}/edit/${reservation.id}`}
                      >
                        <Button size="small">Edit</Button>
                      </Link>
                      <Button
                        size="small"
                        onClick={() => handleDeleteClick(reservation.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Reservation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this reservation? This action
              cannot be undone.
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

export default Reservation;
