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
import { format } from "date-fns";

const API_BASE_URL = "https://localhost:7024/api";

// Define the types
export type AvailabilityMonitor = {
  id: number;
  status: string;
  lastCheckedTime: string;
  upTime: string;
  downTime: string;
  checkInterval: string;
  parkingSpaceId: number;
};

export type ParkingSpace = {
  id: number;
  location: string;
};

const AvailabilityMonitors = () => {
  const [availabilityMonitors, setAvailabilityMonitors] = useState<
    AvailabilityMonitor[] | null
  >(null);
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMonitorId, setSelectedMonitorId] = useState<number | null>(
    null
  );

  const redirect = useNavigate();

  // Fetch data from APIs
  const fetchAvailabilityMonitors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/AvailabilityMonitor/Get`);
      setAvailabilityMonitors(res.data);
    } catch (error) {
      console.error("Error fetching availability monitors:", error);
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

  // Delete availability monitor
  const handleDeleteClick = (id: number) => {
    setSelectedMonitorId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMonitorId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedMonitorId) {
      try {
        await axios.delete(
          `${API_BASE_URL}/AvailabilityMonitor/${selectedMonitorId}`
        );
        setAvailabilityMonitors(
          (prev) =>
            prev?.filter((monitor) => monitor.id !== selectedMonitorId) || null
        );
      } catch (error) {
        console.error("Error deleting availability monitor:", error);
      } finally {
        handleClose();
      }
    }
  };

  useEffect(() => {
    fetchAvailabilityMonitors();
    fetchParkingSpaces();
  }, []);

  return (
    <Box className="availability-monitors-container" sx={{ padding: 2 }}>
      <Stack direction="column" spacing={2}>
        <Button
          className="add-monitor-button"
          variant="outlined"
          onClick={() => redirect(`${PATH_DASHBOARD.availabilityMonitor}/add`)}
        >
          Add New Monitor
        </Button>
        <TableContainer className="table-container" component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="table-header">ID</TableCell>
                <TableCell className="table-header">Status</TableCell>
                <TableCell className="table-header">Last Checked</TableCell>
                <TableCell className="table-header">Up Time</TableCell>
                <TableCell className="table-header">Down Time</TableCell>
                <TableCell className="table-header">Check Interval</TableCell>
                <TableCell className="table-header">Parking Space</TableCell>
                <TableCell className="table-header">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availabilityMonitors?.map((monitor) => {
                const parkingSpace = parkingSpaces.find(
                  (space) => space.id === monitor.parkingSpaceId
                );

                return (
                  <TableRow className="table-row" key={monitor.id}>
                    <TableCell>{monitor.id}</TableCell>
                    <TableCell>{monitor.status}</TableCell>
                    <TableCell>
                      {monitor.lastCheckedTime
                        ? format(
                            new Date(monitor.lastCheckedTime),
                            "dd-MM-yyyy HH:mm"
                          )
                        : ""}
                    </TableCell>
                    <TableCell>
                      {monitor.upTime
                        ? format(new Date(monitor.upTime), "dd-MM-yyyy HH:mm")
                        : ""}
                    </TableCell>
                    <TableCell>
                      {monitor.downTime
                        ? format(new Date(monitor.downTime), "dd-MM-yyyy HH:mm")
                        : ""}
                    </TableCell>
                    <TableCell>{monitor.checkInterval}</TableCell>
                    <TableCell>{parkingSpace?.location || "Unknown"}</TableCell>
                    <TableCell className="actions-buttons">
                      <Link
                        to={`${PATH_DASHBOARD.availabilityMonitor}/edit/${monitor.id}`}
                      >
                        <Button className="edit-button" size="small">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="small"
                        onClick={() => handleDeleteClick(monitor.id)}
                        className="delete-button"
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
          <DialogTitle>Delete Availability Monitor</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this availability monitor? This
              action cannot be undone.
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

export default AvailabilityMonitors;
