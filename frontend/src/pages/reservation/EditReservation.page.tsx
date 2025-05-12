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
import { statuses } from "./AddReservation.page";
import { format } from "date-fns";
import "./edit-reservation.scss";

type Reservation = {
  id: string;
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
};

type ParkingReservationManager = {
  id: string;
  managerName: string;
  managerContact: string;
};

const EditReservation: React.FC = () => {
  const [reservation, setReservation] = useState<Partial<Reservation>>({
    startDate: "",
    endDate: "",
    status: "",
    totalAmount: 0,
    parkingSpotId: "",
    parkingReservationManagerId: "",
  });

  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [managers, setManagers] = useState<ParkingReservationManager[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const getReservationById = async () => {
    try {
      const response = await axios.get<Reservation>(
        `https://localhost:7024/api/Reservation/${id}`
      );
      const formattedStartDate = response.data.startDate
        ? format(new Date(response.data.startDate), "yyyy-MM-dd")
        : "";
      const formattedEndDate = response.data.endDate
        ? format(new Date(response.data.endDate), "yyyy-MM-dd")
        : "";
      setReservation({
        ...response.data,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
    } catch (error) {
      console.error("Error fetching reservation:", error);
    }
  };

  const fetchParkingSpots = async () => {
    try {
      const response = await axios.get<ParkingSpot[]>(
        "https://localhost:7024/api/ParkingSpot/Get"
      );
      setParkingSpots(response.data);
    } catch (error) {
      console.error("Error fetching parking spots:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get<ParkingReservationManager[]>(
        "https://localhost:7024/api/ParkingReservationManager/Get"
      );
      setManagers(response.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getReservationById();
      fetchParkingSpots();
      fetchManagers();
    }
  }, [id]);

  const handleChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;
    setReservation((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    setReservation((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (
        !reservation.startDate ||
        !reservation.endDate ||
        !reservation.status ||
        !reservation.totalAmount
      ) {
        alert("Please fill all required fields.");
        return;
      }

      await axios.put(
        `https://localhost:7024/api/Reservation/${id}`,
        reservation
      );
      navigate(PATH_DASHBOARD.reservations, {
        state: { message: "Reservation updated successfully!" },
      });
    } catch (error) {
      console.error("Error updating reservation:", error);
      alert("Error updating reservation.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="edit-reservation-container" style={{ padding: "20px" }}>
      <h2>Edit Reservation</h2>
      <div
        className="edit-reservation-form-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "400px",
        }}
      >
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          value={reservation.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="End Date"
          name="endDate"
          type="date"
          value={reservation.endDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <Select
          name="status"
          value={reservation.status}
          onChange={(e) =>
            handleChange(e as { target: { name: string; value: string } })
          }
          fullWidth
        >
          {statuses.map((status) => (
            <MenuItem key={status.value} value={status.value}>
              {status.label}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Total Amount"
          name="totalAmount"
          type="number"
          value={reservation.totalAmount}
          onChange={handleChange}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel id="parking-spot-select-label">Parking Spot</InputLabel>
          <Select
            labelId="parking-spot-select-label"
            name="parkingSpotId"
            value={reservation.parkingSpotId || ""}
            onChange={handleSelectChange}
          >
            {parkingSpots.map((spot) => (
              <MenuItem key={spot.id} value={spot.id}>
                {`${spot.location} - $${spot.pricePerHour}/hour`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="manager-select-label">Manager</InputLabel>
          <Select
            labelId="manager-select-label"
            name="parkingReservationManagerId"
            value={reservation.parkingReservationManagerId || ""}
            onChange={handleSelectChange}
          >
            {managers.map((manager) => (
              <MenuItem key={manager.id} value={manager.id}>
                {manager.managerName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div
          className="edit-reservation-button-container"
          style={{ display: "flex", gap: "10px" }}
        >
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

export default EditReservation;
