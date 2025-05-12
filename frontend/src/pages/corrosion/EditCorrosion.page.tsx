import { useEffect, useState } from "react";
import { ICorrosion } from "../../types/global.typing";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import "./CorrosionStyle.scss";

const baseUrl = "https://localhost:7149/api/Corrosion/";

const EditCorrosion = () => {
  const [corrosion, setCorrosion] = useState<Partial<ICorrosion>>({
    materialName: "",
    environment: "",
    notes: "",
    corrosionRate: "",
    protectiveCoating: "",
  });

  const redirect = useNavigate();
  const { id } = useParams();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCorrosion({
      ...corrosion,
      [event.target.name]: event.target.value,
    });
  };

  const handleDefaultValues = (values: ICorrosion) => {
    setCorrosion({
      materialName: values.materialName,
      environment: values.environment,
      notes: values.notes,
      corrosionRate: values.corrosionRate,
      protectiveCoating: values.protectiveCoating,
    });
  };

  const getCorrosionById = async () => {
    await axios.get<ICorrosion>(`${baseUrl}${id}`).then((res) => {
      const { data } = res;
      handleDefaultValues(data);
    });
  };

  useEffect(() => {
    if (id) {
      getCorrosionById();
    }
  }, [id]);

  const handleSaveBtnClick = async () => {
    if (
      !corrosion.materialName ||
      !corrosion.environment ||
      !corrosion.notes ||
      !corrosion.protectiveCoating ||
      !corrosion.corrosionRate
    ) {
      alert("Please fill all fields");
      return;
    }
    try {
      await axios.put(`${baseUrl}${id}`, corrosion);
      redirect("/corrosions", {
        state: { message: "Corrosions updated successfully" },
      });
    } catch (error) {
      console.error("Failed to update Corrosion:", error);
      alert(
        "Failed to update Corrosion. Please check the console for details."
      );
    }
  };

  const handleBackBtnClick = () => {
    redirect("/corrosions");
  };
  return (
    <div className="edit-corrosion">
      <div className="edit-corrosion-content">
        <h2>Edit Corrosions</h2>
        <div className="form">
          <TextField
            autoComplete="off"
            label="Material Name"
            variant="outlined"
            name="materialName"
            value={corrosion.materialName}
            onChange={changeHandler}
            className="form-item"
          />
          <TextField
            autoComplete="off"
            label="Environment"
            variant="outlined"
            name="environment"
            value={corrosion.environment}
            onChange={changeHandler}
            className="form-item"
          />
          <TextField
            autoComplete="off"
            label="Notes"
            variant="outlined"
            name="notes"
            value={corrosion.notes}
            onChange={changeHandler}
            className="form-item"
          />
          <TextField
            autoComplete="off"
            label="Protective Coating"
            variant="outlined"
            name="protectiveCoating"
            value={corrosion.protectiveCoating}
            onChange={changeHandler}
            className="form-item"
          />
          <TextField
            autoComplete="off"
            label="Corrosion Rate"
            variant="outlined"
            name="corrosionRate"
            value={corrosion.corrosionRate}
            onChange={changeHandler}
            className="form-item"
          />
        </div>
        <div className="buttonContainer">
          <Button
            variant="outlined"
            color="primary"
            className="button"
            onClick={handleSaveBtnClick}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            className="button"
            onClick={handleBackBtnClick}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCorrosion;
