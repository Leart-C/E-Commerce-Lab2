import { useEffect, useState } from "react";
import { IHeatTreatment } from "../../types/global.typing";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import Swal from "sweetalert2";
import "./heatTreatment.scss";

const EditHeatTreatments = () => {
  const [heatTreatment, setHeatTreatment] = useState<Partial<IHeatTreatment>>({
    processName: "",
    temperature: "",
    timeDuration: "",
    coolingMethod: "",
    purpose: "",
  });

  const redirect = useNavigate();
  const { id } = useParams();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeatTreatment({
      ...heatTreatment,
      [event.target.name]: event.target.value,
    });
  };

  const getHeatTreatmentById = async () => {
    await axios
      .get<IHeatTreatment>(`https://localhost:7149/api/HeatTreatment/${id}`)
      .then((res) => {
        const { data } = res;
        setHeatTreatment({
          processName: data.processName,
          temperature: data.temperature,
          timeDuration: data.timeDuration,
          coolingMethod: data.coolingMethod,
          purpose: data.purpose,
        });
      });
  };

  useEffect(() => {
    if (id) {
      getHeatTreatmentById();
    }
  }, [id]);

  const handleSaveBtnClick = () => {
    if (
      heatTreatment.processName === "" ||
      heatTreatment.temperature === "" ||
      heatTreatment.timeDuration === "" ||
      heatTreatment.coolingMethod === "" ||
      heatTreatment.purpose === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Enter Values",
        text: "Please fill in all fields",
      });
      return;
    }
    const data: Partial<IHeatTreatment> = {
      processName: heatTreatment.processName,
      temperature: heatTreatment.temperature,
      timeDuration: heatTreatment.timeDuration,
      coolingMethod: heatTreatment.coolingMethod,
      purpose: heatTreatment.purpose,
    };
    axios
      .put(`https://localhost:7149/api/HeatTreatment/${id}`, data)
      .then(() =>
        redirect("/heatTreatments", {
          state: { message: "HeatTreatments Updated Successfully" },
        })
      )
      .catch(() => alert("Error"));
  };

  const handleBackBtnClick = () => {
    redirect("/heatTreatments");
  };

  return (
    <div className="edit-heat-treatments">
      <h2>Edit Heat Treatments</h2>

      <TextField
        autoComplete="off"
        label="Process Name"
        variant="outlined"
        name="processName"
        value={heatTreatment.processName}
        onChange={changeHandler}
        fullWidth
        className="form-item"
      />
      <TextField
        autoComplete="off"
        label="Temperature"
        variant="outlined"
        name="temperature"
        value={heatTreatment.temperature}
        onChange={changeHandler}
        fullWidth
        className="form-item"
      />
      <TextField
        autoComplete="off"
        label="Time Duration"
        variant="outlined"
        name="timeDuration"
        value={heatTreatment.timeDuration}
        onChange={changeHandler}
        fullWidth
        className="form-item"
      />
      <TextField
        autoComplete="off"
        label="Cooling Method"
        variant="outlined"
        name="coolingMethod"
        value={heatTreatment.coolingMethod}
        onChange={changeHandler}
        fullWidth
        className="form-item"
      />
      <TextField
        autoComplete="off"
        label="Purpose"
        variant="outlined"
        name="purpose"
        value={heatTreatment.purpose}
        onChange={changeHandler}
        fullWidth
        className="form-item"
      />

      <div className="button-container">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSaveBtnClick}
          className="button"
        >
          Save
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleBackBtnClick}
          className="button"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default EditHeatTreatments;
