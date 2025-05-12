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

type AvailabilityMonitorValues = {
  parkingSpaceId: number;
  status: string;
  lastCheckedTime: string;
  upTime: string;
  downTime: string;
  checkInterval: string;
};

export const statuses = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const initialValues: AvailabilityMonitorValues = {
  parkingSpaceId: 0,
  status: "",
  lastCheckedTime: "",
  upTime: "",
  downTime: "",
  checkInterval: "",
};

export const AddAvailabilityMonitor = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] =
    useState<AvailabilityMonitorValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

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

  const handleDateInputChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;

    console.log(value ? new Date(value).toISOString() : "", value);

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    const { status, parkingSpaceId, lastCheckedTime, checkInterval } =
      formValues;

    return (
      status.trim() !== "" &&
      parkingSpaceId > 0 &&
      lastCheckedTime.trim() !== "" &&
      checkInterval.trim() !== ""
    );
  };

  // Add a new Availability Monitor
  const addNewAvailabilityMonitor = async () => {
    try {
      setIsAdding(true);
      setError(null);
      setSuccessMessage(null);

      const createPayload = {
        ...formValues,
        id: 0,
        parkingSpaceId: formValues.parkingSpaceId
          ? parseInt(formValues.parkingSpaceId, 10)
          : 0,
        checkInterval: new Date(formValues.checkInterval).toISOString(),
        lastCheckedTime: new Date(formValues.lastCheckedTime).toISOString(),
        upTime: new Date(formValues.upTime).toISOString(),
        downTime: new Date(formValues.downTime).toISOString(),
      };

      await axios.post(
        "https://localhost:7024/api/AvailabilityMonitor/Create",
        createPayload
      );

      setSuccessMessage("Availability Monitor added successfully!");
      setFormValues(initialValues);
      navigate(PATH_DASHBOARD.availabilityMonitor);
    } catch (error: any) {
      console.error("Error adding new Availability Monitor:", error);
      setError(
        error.response?.data?.message ||
          "Error adding new Availability Monitor. Please try again."
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
                Add New Availability Monitor
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
              <TableCell>Parking Space ID</TableCell>
              <TableCell>
                <TextField
                  name="parkingSpaceId"
                  type="number"
                  onChange={handleInputChange}
                  value={formValues.parkingSpaceId}
                  placeholder="Parking Space ID"
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
              <TableCell>Last Checked Time</TableCell>
              <TableCell>
                <TextField
                  name="lastCheckedTime"
                  type="datetime-local"
                  onChange={handleDateInputChange}
                  value={formValues.lastCheckedTime}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Up Time</TableCell>
              <TableCell>
                <TextField
                  name="upTime"
                  type="datetime-local"
                  onChange={handleDateInputChange}
                  value={formValues.upTime}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Down Time</TableCell>
              <TableCell>
                <TextField
                  name="downTime"
                  type="datetime-local"
                  onChange={handleDateInputChange}
                  value={formValues.downTime}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Check Interval</TableCell>
              <TableCell>
                <TextField
                  name="checkInterval"
                  type="datetime-local"
                  onChange={handleDateInputChange}
                  value={formValues.checkInterval}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Button
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding || !isFormValid()}
                  onClick={addNewAvailabilityMonitor}
                >
                  {isAdding
                    ? "Adding Availability Monitor..."
                    : "Add Availability Monitor"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddAvailabilityMonitor;
