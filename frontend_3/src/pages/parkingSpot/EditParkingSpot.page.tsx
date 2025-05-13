import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import "./edit-parkingSpot.scss";

type ParkingSpot = {
  id: number;
  location: string;
  size: string;
  status: string;
  pricePerHour: number;
};

const EditParkingSpot: React.FC = () => {
  const [parkingSpot, setParkingSpot] = useState<Partial<ParkingSpot>>({
    location: "",
    size: "",
    status: "",
    pricePerHour: 0,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  // Function to handle input change
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setParkingSpot({
      ...parkingSpot,
      [name]: name === "pricePerHour" ? parseFloat(value) : value,
    });
  };

  // Function to fetch parking spot by ID
  const getParkingSpotById = async () => {
    try {
      const response = await axios.get<ParkingSpot>(
        `https://localhost:7024/api/ParkingSpot/${id}`
      );
      const { data } = response;
      setParkingSpot({
        location: data.location,
        size: data.size,
        status: data.status,
        pricePerHour: data.pricePerHour,
      });
    } catch (error) {
      console.error("Error fetching parking spot:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue fetching the parking spot details.",
        confirmButtonText: "OK",
      });
    }
  };

  // Fetch parking spot details when component is mounted
  useEffect(() => {
    if (id) {
      getParkingSpotById();
    }
  }, [id]);

  // Function to handle saving the edited parking spot
  const handleSaveBtnClick = async () => {
    if (
      parkingSpot.location === "" ||
      parkingSpot.size === "" ||
      parkingSpot.status === "" ||
      parkingSpot.pricePerHour === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fill in all fields.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const data: Partial<ParkingSpot> = {
        location: parkingSpot.location,
        size: parkingSpot.size,
        status: parkingSpot.status,
        pricePerHour: parkingSpot.pricePerHour,
      };
      await axios.put(`https://localhost:7024/api/ParkingSpot/${id}`, data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Parking spot updated successfully.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error("Error saving parking spot:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue updating the parking spot.",
        confirmButtonText: "OK",
      });
    }
  };

  // Function to navigate back
  const handleBackBtnClick = () => {
    navigate(-1);
  };

  return (
    <div className="edit-parking-spot">
      <div className="edit-parking-spot-content">
        <h2>Edit Parking Spot</h2>
        <div className="form">
          <TextField
            autoComplete="off"
            label="Location"
            variant="outlined"
            name="location"
            value={parkingSpot.location || ""}
            onChange={changeHandler}
            fullWidth
          />
          <TextField
            autoComplete="off"
            label="Size"
            variant="outlined"
            name="size"
            value={parkingSpot.size || ""}
            onChange={changeHandler}
            fullWidth
          />
          <TextField
            autoComplete="off"
            label="Status"
            variant="outlined"
            name="status"
            value={parkingSpot.status || ""}
            onChange={changeHandler}
            fullWidth
          />
          <TextField
            autoComplete="off"
            label="Price Per Hour"
            variant="outlined"
            name="pricePerHour"
            type="number"
            value={parkingSpot.pricePerHour || ""}
            onChange={changeHandler}
            fullWidth
          />
        </div>

        <div className="button-container">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSaveBtnClick}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleBackBtnClick}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditParkingSpot;
