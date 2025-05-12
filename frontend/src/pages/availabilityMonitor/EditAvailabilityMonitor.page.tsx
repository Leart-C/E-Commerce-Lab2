import React, { useEffect, useState, ChangeEvent } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { PATH_DASHBOARD } from "../../routes/paths";
import "./edit-availabilityMonitor.scss";

type AvailabilityMonitor = {
  id: number;
  status: string;
  lastCheckedTime: string;
  upTime: string;
  downTime: string;
  checkInterval: string;
  parkingSpaceId: number;
};

type ParkingSpace = {
  id: number;
  name: string;
  location: string;
};

const statuses = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const EditAvailabilityMonitor: React.FC = () => {
  const [monitor, setMonitor] = useState<AvailabilityMonitor>({
    id: 0,
    status: "",
    lastCheckedTime: "",
    upTime: "",
    downTime: "",
    checkInterval: "",
    parkingSpaceId: 0,
  });

  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const getMonitorById = async () => {
    try {
      const response = await axios.get<AvailabilityMonitor>(
        `https://localhost:7024/api/AvailabilityMonitor/${id}`
      );
      setMonitor(response.data);
    } catch (error) {
      console.error("Error fetching availability monitor:", error);
    }
  };

  const fetchParkingSpaces = async () => {
    try {
      const response = await axios.get<ParkingSpace[]>(
        "https://localhost:7024/api/ParkingSpace/Get"
      );
      setParkingSpaces(response.data);
    } catch (error) {
      console.error("Error fetching parking spaces:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getMonitorById();
      fetchParkingSpaces();
    }
  }, [id]);

  const handleChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;

    setMonitor((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    setMonitor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (!monitor.status || !monitor.lastCheckedTime) {
        alert("Please fill all required fields.");
        return;
      }

      await axios.put(
        `https://localhost:7024/api/AvailabilityMonitor/${id}`,
        monitor
      );
      navigate(PATH_DASHBOARD.availabilityMonitor, {
        state: { message: "Availability Monitor updated successfully!" },
      });
    } catch (error) {
      console.error("Error updating availability monitor:", error);
      alert("Error updating availability monitor.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="edit-availability-monitor" style={{ padding: "20px" }}>
      <h2>Edit Availability Monitor</h2>
      <div
        className="form-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "400px",
        }}
      >
        <TextField
          label="Status"
          name="status"
          value={monitor.status}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Last Checked Time"
          name="lastCheckedTime"
          type="datetime-local"
          value={monitor.lastCheckedTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="Up Time"
          name="upTime"
          type="datetime-local"
          value={monitor.upTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="Down Time"
          name="downTime"
          type="datetime-local"
          value={monitor.downTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="Check Interval"
          name="checkInterval"
          type="text"
          value={monitor.checkInterval}
          onChange={handleChange}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel id="parking-space-select-label">Parking Space</InputLabel>
          <Select
            labelId="parking-space-select-label"
            name="parkingSpaceId"
            value={monitor.parkingSpaceId || ""}
            onChange={handleSelectChange}
          >
            {parkingSpaces.map((space) => (
              <MenuItem key={space.id} value={space.id}>
                {`${space.name} - ${space.location}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="button-group" style={{ display: "flex", gap: "10px" }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleBack}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditAvailabilityMonitor;
