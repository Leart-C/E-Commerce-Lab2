import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
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
  DialogTitle,
  DialogContentText,
  Stack,
} from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { PATH_DASHBOARD } from "../../routes/paths";

type ParkingSpot = {
  id: number;
  location: string;
  size: string;
  status: string;
  pricePerHour: number;
};

const ParkingSpot: React.FC = () => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [selectedParkingSpotID, setSelectedParkingSpotID] = useState<
    number | null
  >(null);
  const [openDialog, setOpenDialog] = useState(false);

  const baseUrl = "https://localhost:7024/api/ParkingSpot"; // Replace with your actual URL
  const location = useLocation();
  const redirect = useNavigate();

  const fetchParkingSpots = async () => {
    try {
      const response = await axios.get<ParkingSpot[]>(`${baseUrl}/Get`);
      setParkingSpots(response.data);
      if (location?.state) {
        Swal.fire({
          icon: "success",
          title: location?.state?.message,
        });
        redirect(location.pathname, { replace: true });
      }
    } catch (error) {
      alert("An error occurred while fetching parking spots.");
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedParkingSpotID(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedParkingSpotID(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedParkingSpotID !== null) {
      try {
        await axios.delete(`${baseUrl}/${selectedParkingSpotID}`);
        setParkingSpots((prevSpots) =>
          prevSpots.filter((spot) => spot.id !== selectedParkingSpotID)
        );
        Swal.fire({
          icon: "success",
          title: "Parking Spot deleted successfully!",
        });
      } catch (error) {
        console.error("Failed to delete parking spot:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to delete parking spot.",
        });
      } finally {
        handleCloseDialog();
      }
    }
  };

  useEffect(() => {
    fetchParkingSpots();
  }, []);

  return (
    <Box className={"parking-spot-container"} sx={{ padding: 2 }}>
      <Stack direction="column" spacing={2}>
        <Button
          className={"add-button"}
          fullWidth
          variant="outlined"
          onClick={() => redirect(`${PATH_DASHBOARD.parkingSpot}/add`)}
          sx={{ alignSelf: "flex-end" }}
        >
          Add New Parking Spot
        </Button>

        <TableContainer className={"table-container"} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Price Per Hour</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parkingSpots.map((spot) => (
                <TableRow key={spot.id}>
                  <TableCell>{spot.id}</TableCell>
                  <TableCell>{spot.location}</TableCell>
                  <TableCell>{spot.size}</TableCell>
                  <TableCell>{spot.status}</TableCell>
                  <TableCell>{spot.pricePerHour.toFixed(2)} €</TableCell>
                  <TableCell>
                    <Link to={`${PATH_DASHBOARD.parkingSpot}/edit/${spot.id}`}>
                      <Button size="small">Edit</Button>
                    </Link>
                    <Button
                      size="small"
                      onClick={() => handleDeleteClick(spot.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          className="dialog"
          open={openDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Delete Parking Spot</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this parking spot? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default ParkingSpot;
