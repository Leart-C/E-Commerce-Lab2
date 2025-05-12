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
import { PATH_DASHBOARD } from "../../routes/paths";

const API_BASE_URL = "https://localhost:7024/api";

// Define the types
export type ParkingReservationManager = {
  id: number;
  managerName: string;
  managerContact: string;
};

const ParkingReservationManager: React.FC = () => {
  const [managers, setManagers] = useState<ParkingReservationManager[] | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState<number | null>(
    null
  );

  const redirect = useNavigate();

  // Fetch data from APIs
  const fetchManagers = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/ParkingReservationManager/Get`
      );
      setManagers(res.data);
    } catch (error) {
      console.error("Error fetching parking reservation managers:", error);
    }
  };

  // Delete parking reservation manager
  const handleDeleteClick = (id: number) => {
    setSelectedManagerId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedManagerId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedManagerId) {
      try {
        await axios.delete(
          `${API_BASE_URL}/ParkingReservationManager/${selectedManagerId}`
        );
        setManagers(
          (prev) =>
            prev?.filter((manager) => manager.id !== selectedManagerId) || null
        );
      } catch (error) {
        console.error("Error deleting parking reservation manager:", error);
      } finally {
        handleClose();
      }
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  return (
    <Box className="parking-reservation-manager-container" sx={{ padding: 2 }}>
      <Stack direction="column" spacing={2}>
        <Button
          className="parking-reservation-manager-button"
          variant="outlined"
          onClick={() =>
            redirect(`${PATH_DASHBOARD.parkingReservationManagers}/add`)
          }
        >
          Add New Parking Reservation Manager
        </Button>
        <TableContainer
          className="parking-reservation-manager-table"
          component={Paper}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Manager Name</TableCell>
                <TableCell>Manager Contact</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {managers?.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell>{manager.id}</TableCell>
                  <TableCell>{manager.managerName}</TableCell>
                  <TableCell>{manager.managerContact}</TableCell>
                  <TableCell className="parking-reservation-manager-actions">
                    <Link
                      to={`${PATH_DASHBOARD.parkingReservationManagers}/edit/${manager.id}`}
                    >
                      <Button size="small">Edit</Button>
                    </Link>
                    <Button
                      size="small"
                      onClick={() => handleDeleteClick(manager.id)}
                      className="parking-reservation-manager-dialog-title"
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
          <DialogTitle>Delete Parking Reservation Manager</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this manager? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions className="parking-reservation-manager-dialog-actions">
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

export default ParkingReservationManager;
