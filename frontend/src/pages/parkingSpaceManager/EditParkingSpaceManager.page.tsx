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
import "./edit-parkingSpaceManager.scss";

type ParkingSpaceManagerDto = {
  id: number;
  status: string;
  pagesa: number;
  kontakti: string;
  parkingSpaceId: number;
};

const EditParkingSpaceManager: React.FC = () => {
  const [parkingSpaceManager, setParkingSpaceManager] = useState<
    Partial<ParkingSpaceManagerDto>
  >({
    status: "",
    pagesa: 0,
    kontakti: "",
    parkingSpaceId: 0,
  });

  const [statusList, setStatusList] = useState<
    { label: string; value: string }[]
  >([
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ]);

  const [parkingSpaces, setParkingSpaces] = useState<
    { id: number; location: string }[]
  >([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const getParkingSpaceManagerById = async () => {
    try {
      const response = await axios.get<ParkingSpaceManagerDto>(
        `https://localhost:7024/api/ParkingSpaceManager/${id}`
      );
      setParkingSpaceManager(response.data);
    } catch (error) {
      console.error("Error fetching parking space manager:", error);
    }
  };

  const fetchParkingSpaces = async () => {
    try {
      const response = await axios.get<{ id: number; location: string }[]>(
        "https://localhost:7024/api/ParkingSpace/Get"
      );
      setParkingSpaces(response.data);
    } catch (error) {
      console.error("Error fetching parking spaces:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getParkingSpaceManagerById();
      fetchParkingSpaces();
    }
  }, [id]);

  const handleChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;
    setParkingSpaceManager((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (
        !parkingSpaceManager.status ||
        !parkingSpaceManager.kontakti ||
        !parkingSpaceManager.parkingSpaceId
      ) {
        alert("Please fill all required fields.");
        return;
      }

      // Ensure that parkingSpaceId is a number before sending to the API
      const updatedManager = {
        ...parkingSpaceManager,
        parkingSpaceId: Number(parkingSpaceManager.parkingSpaceId), // Convert to number
      };

      await axios.put(
        `https://localhost:7024/api/ParkingSpaceManager/${id}`,
        updatedManager
      );
      navigate(PATH_DASHBOARD.parkingSpaceManager, {
        state: { message: "Parking Space Manager updated successfully!" },
      });
    } catch (error) {
      console.error("Error updating parking space manager:", error);
      alert("Error updating parking space manager.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="edit-parking-space-container" style={{ padding: "20px" }}>
      <h2>Edit Parking Space Manager</h2>
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
          label="Kontakti"
          name="kontakti"
          value={parkingSpaceManager.kontakti || ""}
          onChange={handleChange}
          fullWidth
          className="text-field"
        />

        <TextField
          label="Pagesa"
          name="pagesa"
          type="number"
          value={parkingSpaceManager.pagesa || ""}
          onChange={handleChange}
          fullWidth
          className="text-field"
        />

        <FormControl className="select-field" fullWidth>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            name="status"
            value={parkingSpaceManager.status || ""}
            onChange={handleChange}
          >
            {statusList.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="select-field" fullWidth>
          <InputLabel id="parking-space-select-label">Parking Space</InputLabel>
          <Select
            labelId="parking-space-select-label"
            name="parkingSpaceId"
            value={String(parkingSpaceManager.parkingSpaceId) || ""} // Ensure parkingSpaceId is a string in the Select
            onChange={handleChange}
          >
            {parkingSpaces.map((space) => (
              <MenuItem key={space.id} value={String(space.id)}>
                {space.location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div
          className="button-container"
          style={{ display: "flex", gap: "10px" }}
        >
          <Button
            variant="contained"
            color="primary"
            className="save-button"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            className="back-button"
            onClick={handleBack}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditParkingSpaceManager;
