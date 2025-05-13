import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { PATH_DASHBOARD } from "../../routes/paths";
import { format } from "date-fns";
import "./edit-parkingSpace.scss";

// Krijo llojin e të dhënave për ParkingSpace
type ParkingSpace = {
  id: string;
  location: string;
  size: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  pricePerHour: number;
};

const EditParkingSpace: React.FC = () => {
  const [parkingSpace, setParkingSpace] = useState<Partial<ParkingSpace>>({
    location: "",
    size: "",
    status: "",
    pricePerHour: 0,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  // Funksioni për të trajtuar ndryshimet në inpute
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParkingSpace({
      ...parkingSpace,
      [event.target.name]: event.target.value,
    });
  };

  // Funksioni për të marrë ParkingSpace nga ID
  const getParkingSpaceById = async () => {
    try {
      const response = await axios.get<ParkingSpace>(
        `https://localhost:7024/api/ParkingSpace/${id}`
      );
      const { data } = response;
      setParkingSpace({
        location: data.location,
        size: data.size,
        status: data.status,
        pricePerHour: data.pricePerHour,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    } catch (error) {
      console.error("Error fetching parking space:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue fetching the parking space details.",
        confirmButtonText: "OK",
      });
    }
  };

  // Merr ParkingSpace detajet kur komponenti ngarkohet
  useEffect(() => {
    if (id) {
      getParkingSpaceById();
    }
  }, [id]);

  // Funksioni për të ruajtur ndryshimet
  const handleSaveBtnClick = async () => {
    if (
      parkingSpace.location === "" ||
      parkingSpace.size === "" ||
      parkingSpace.status === "" ||
      parkingSpace.pricePerHour <= 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fill in all fields with valid data.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const data: Partial<ParkingSpace> = {
        location: parkingSpace.location,
        size: parkingSpace.size,
        status: parkingSpace.status,
        pricePerHour: parkingSpace.pricePerHour,
      };
      await axios.put(`https://localhost:7024/api/ParkingSpace/${id}`, data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Parking space updated successfully.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(PATH_DASHBOARD.parkingSpace, {
          state: { message: "Parking Space Updated Successfully" },
        });
      });
    } catch (error) {
      console.error("Error saving parking space:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue updating the parking space.",
        confirmButtonText: "OK",
      });
    }
  };

  // Funksioni për të kthehet prapa në listën e parking spaces
  const handleBackBtnClick = () => {
    navigate(PATH_DASHBOARD.parkingSpace);
  };

  return (
    <div className="edit-parking-space">
      <div className="edit-parking-space-content">
        <h2>Edit Parking Space</h2>
        <div className="form">
          <TextField
            autoComplete="off"
            label="Location"
            variant="outlined"
            name="location"
            value={parkingSpace.location}
            onChange={changeHandler}
            fullWidth
          />
          <TextField
            autoComplete="off"
            label="Size"
            variant="outlined"
            name="size"
            value={parkingSpace.size}
            onChange={changeHandler}
            fullWidth
          />
          <TextField
            autoComplete="off"
            label="Status"
            variant="outlined"
            name="status"
            value={parkingSpace.status}
            onChange={changeHandler}
            fullWidth
          />
          <TextField
            autoComplete="off"
            label="Price per Hour"
            variant="outlined"
            name="pricePerHour"
            type="number"
            value={parkingSpace.pricePerHour}
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

export default EditParkingSpace;
