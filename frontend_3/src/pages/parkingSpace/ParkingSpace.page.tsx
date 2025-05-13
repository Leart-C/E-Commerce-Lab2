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

type ParkingSpace = {
  id: string;
  location: string;
  size: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  pricePerHour: number;
};

const ParkingSpace: React.FC = () => {
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[] | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [selectedParkingSpaceId, setSelectedParkingSpaceId] = useState<
    string | null
  >(null);

  const navigate = useNavigate();

  // Fetch parking spaces from API
  const fetchParkingSpaces = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ParkingSpace/Get`);
      setParkingSpaces(response.data);
    } catch (error) {
      console.error("Error fetching parking spaces:", error);
    }
  };

  // Handle delete actions
  const handleDeleteClick = (id: string) => {
    setSelectedParkingSpaceId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedParkingSpaceId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedParkingSpaceId) {
      try {
        await axios.delete(
          `${API_BASE_URL}/ParkingSpace/${selectedParkingSpaceId}`
        );
        setParkingSpaces(
          (prev) =>
            prev?.filter((space) => space.id !== selectedParkingSpaceId) || null
        );
      } catch (error) {
        console.error("Error deleting parking space:", error);
      } finally {
        handleClose();
      }
    }
  };

  useEffect(() => {
    fetchParkingSpaces();
  }, []);

  return (
    <Box className="parking-space-container" sx={{ padding: 2 }}>
      <Stack direction="column" spacing={2}>
        <Button
          variant="outlined"
          onClick={() => navigate(`${PATH_DASHBOARD.parkingSpace}/add`)}
          className="parking-space-button"
        >
          Add New Parking Space
        </Button>
        <TableContainer
          className="parking-space-table-container"
          component={Paper}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="parking-space-table-header">ID</TableCell>
                <TableCell className="parking-space-table-header">
                  Location
                </TableCell>
                <TableCell className="parking-space-table-header">
                  Size
                </TableCell>
                <TableCell className="parking-space-table-header">
                  Status
                </TableCell>
                <TableCell className="parking-space-table-header">
                  Price/Hour
                </TableCell>
                <TableCell className="parking-space-table-header">
                  Created At
                </TableCell>
                <TableCell className="parking-space-table-header">
                  Updated At
                </TableCell>
                <TableCell className="parking-space-table-header">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parkingSpaces?.map((space) => (
                <TableRow key={space.id}>
                  <TableCell className="parking-space-table-cell">
                    {space.id}
                  </TableCell>
                  <TableCell className="parking-space-table-cell">
                    {space.location}
                  </TableCell>
                  <TableCell className="parking-space-table-cell">
                    {space.size}
                  </TableCell>
                  <TableCell className="parking-space-table-cell">
                    {space.status}
                  </TableCell>
                  <TableCell className="parking-space-table-cell">
                    {space.pricePerHour} $
                  </TableCell>
                  <TableCell className="parking-space-table-cell">
                    {new Date(space.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(space.updatedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`${PATH_DASHBOARD.parkingSpace}/edit/${space.id}`}
                    >
                      <Button className="parking-space-button" size="small">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="small"
                      onClick={() => handleDeleteClick(space.id)}
                      className="parking-space-button"
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
          <DialogTitle>Delete Parking Space</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this parking space? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              className="parking-space-dialog-cancel-button"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="parking-space-dialog-button"
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

export default ParkingSpace;
