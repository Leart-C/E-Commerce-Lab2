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
export type ParkingSpaceManager = {
  id: string;
  status: string;
  pagesa: number;
  kontakti: string;
  parkingSpaceId: string;
};

export type ParkingSpace = {
  id: string;
  location: string;
  size: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  pricePerHour: number;
};

const ParkingSpaceManager = () => {
  const [managers, setManagers] = useState<ParkingSpaceManager[] | null>(null);
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(
    null
  );

  const redirect = useNavigate();

  // Fetch data from APIs
  const fetchManagers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/ParkingSpaceManager/Get`);
      setManagers(res.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const fetchParkingSpaces = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/ParkingSpace/Get`);
      setParkingSpaces(res.data);
    } catch (error) {
      console.error("Error fetching parking spaces:", error);
    }
  };

  // Delete manager
  const handleDeleteClick = (id: string) => {
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
          `${API_BASE_URL}/ParkingSpaceManager/${selectedManagerId}`
        );
        setManagers(
          (prev) => prev?.filter((m) => m.id !== selectedManagerId) || null
        );
      } catch (error) {
        console.error("Error deleting manager:", error);
      } finally {
        handleClose();
      }
    }
  };

  useEffect(() => {
    fetchManagers();
    fetchParkingSpaces();
  }, []);

  return (
    <Box className="parking-space-manager" sx={{ padding: 2 }}>
      <Stack direction="column" spacing={2}>
        <Button
          variant="outlined"
          onClick={() => redirect(`${PATH_DASHBOARD.parkingSpaceManager}/add`)}
        >
          Add New Manager
        </Button>
        <TableContainer className="table-container" component={Paper}>
          <Table>
            <TableHead className="table-head">
              <TableRow className="table-row">
                <TableCell className="table-cell">ID</TableCell>
                <TableCell className="table-cell">Status</TableCell>
                <TableCell className="table-cell">Pagesa</TableCell>
                <TableCell className="table-cell">Kontakti</TableCell>
                <TableCell className="table-cell">Parking Space</TableCell>
                <TableCell className="table-cell">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {managers?.map((manager) => {
                const parkingSpace = parkingSpaces.find(
                  (space) => space.id === manager.parkingSpaceId
                );

                return (
                  <TableRow key={manager.id}>
                    <TableCell>{manager.id}</TableCell>
                    <TableCell>{manager.status}</TableCell>
                    <TableCell>{manager.pagesa}</TableCell>
                    <TableCell>{manager.kontakti}</TableCell>
                    <TableCell>
                      {parkingSpace
                        ? `${parkingSpace.location} (${parkingSpace.size})`
                        : "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`${PATH_DASHBOARD.parkingSpaceManager}/edit/${manager.id}`}
                      >
                        <Button className="edit-button" size="small">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        className="delete-button"
                        size="small"
                        onClick={() => handleDeleteClick(manager.id)}
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
        <Dialog className="delete-dialog" open={open} onClose={handleClose}>
          <DialogTitle className="dialog-title">Delete Manager</DialogTitle>
          <DialogContent>
            <DialogContentText className="dialog-content-text">
              Are you sure you want to delete this manager? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button className="dialog-button" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="dialog-button"
              onClick={handleDeleteConfirm}
              color="secondary"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default ParkingSpaceManager;
