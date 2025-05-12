import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { PATH_DASHBOARD } from "../../routes/paths";
import "./edit-parkingReservationManager.scss";

type ParkingReservationManager = {
  id: string;
  managerName: string;
  managerContact: string;
};

const EditParkingReservationManager: React.FC = () => {
  const [manager, setManager] = useState<Partial<ParkingReservationManager>>({
    managerName: "",
    managerContact: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  // Function to handle input change
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManager({
      ...manager,
      [event.target.name]: event.target.value,
    });
  };

  // Function to fetch manager details by ID
  const getManagerById = async () => {
    try {
      const response = await axios.get<ParkingReservationManager>(
        `https://localhost:7024/api/ParkingReservationManager/${id}`
      );
      const { data } = response;
      setManager({
        managerName: data.managerName,
        managerContact: data.managerContact,
      });
    } catch (error) {
      console.error("Error fetching manager:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue fetching the manager details.",
        confirmButtonText: "OK",
      });
    }
  };

  // Fetch manager details when component is mounted
  useEffect(() => {
    if (id) {
      getManagerById();
    }
  }, [id]);

  // Function to handle saving the edited manager
  const handleSaveBtnClick = async () => {
    if (manager.managerName === "" || manager.managerContact === "") {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fill in all fields with valid data.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const data: Partial<ParkingReservationManager> = {
        managerName: manager.managerName,
        managerContact: manager.managerContact,
      };
      await axios.put(
        `https://localhost:7024/api/ParkingReservationManager/${id}`,
        data
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Parking reservation manager updated successfully.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(PATH_DASHBOARD.parkingReservationManagers, {
          state: { message: "Manager Updated Successfully" },
        });
      });
    } catch (error) {
      console.error("Error saving manager:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue updating the manager.",
        confirmButtonText: "OK",
      });
    }
  };

  // Function to navigate back
  const handleBackBtnClick = () => {
    navigate(PATH_DASHBOARD.parkingReservationManagers);
  };

  return (
    <div className="edit-parking-reservation-manager">
      <div className="edit-parking-reservation-manager-content">
        <h2>Edit Parking Reservation Manager</h2>
        <div className="form">
          <TextField
            autoComplete="off"
            label="Manager Name"
            variant="outlined"
            name="managerName"
            value={manager.managerName || ""}
            onChange={changeHandler}
            fullWidth
          />
          <TextField
            autoComplete="off"
            label="Manager Contact"
            variant="outlined"
            name="managerContact"
            value={manager.managerContact || ""}
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

export default EditParkingReservationManager;
