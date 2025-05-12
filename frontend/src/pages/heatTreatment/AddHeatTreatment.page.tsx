import { ChangeEvent, useEffect, useState } from "react";
import { ICorrosion } from "../../types/global.typing";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

type FormValues = {
  processName: string;
  temperature: string;
  timeDuration: string;
  coolingMethod: string;
  purpose: string;
  corrosionId: string;
};

const AddHeatTreatment = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    processName: "",
    temperature: "",
    timeDuration: "",
    coolingMethod: "",
    purpose: "",
    corrosionId: "",
  });

  const [corrosionList, setCorrosionList] = useState<ICorrosion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchCorrosion = async () => {
    try {
      const res = await axios.get("https://localhost:7149/api/Corrosion/Get");
      setCorrosionList(res.data);
    } catch (error) {
      console.error("Error fetching corrosion:", error);
      setError("Error fetching corrosion. Please try again.");
    }
  };

  useEffect(() => {
    fetchCorrosion();
  }, []);

  const handleInputChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<unknown>
  ) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const addNewHeatTreatMent = async () => {
    try {
      setIsAdding(true);
      await axios.post(
        "https://localhost:7149/api/HeatTreatment/Create",
        formValues
      );
      setIsAdding(false);
      navigate("/heatTreatments");
    } catch (error) {
      console.log("Error adding new heatTreatments:", error);
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
      <Paper
        sx={{
          maxWidth: 600,
          margin: "auto",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h1>Add New HeatTreatment</h1>
        <div className="form-item">
          <TextField
            name="processName"
            onChange={handleInputChange}
            placeholder="Process Name"
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
        </div>
        <div className="form-item">
          <TextField
            name="temperature"
            onChange={handleInputChange}
            placeholder="Temperature"
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
        </div>
        <div className="form-item">
          <TextField
            name="timeDuration"
            onChange={handleInputChange}
            placeholder="Time Duration"
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
        </div>
        <div className="form-item">
          <TextField
            name="coolingMethod"
            onChange={handleInputChange}
            placeholder="Cooling Method"
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
        </div>
        <div className="form-item">
          <TextField
            name="purpose"
            onChange={handleInputChange}
            placeholder="Purpose"
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
        </div>
        <div className="form-item">
          {error ? (
            <div>{error}</div>
          ) : (
            <Select
              name="corrosionId"
              value={formValues.corrosionId}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: "16px" }}
            >
              {corrosionList.map((corrosion) => (
                <MenuItem key={corrosion.id} value={corrosion.id}>
                  {`${corrosion.corrosionRate} - ${corrosion.environment}`}
                </MenuItem>
              ))}
            </Select>
          )}
        </div>
        <div className="form-item">
          <Button
            variant={isAdding ? "outlined" : "contained"}
            disabled={isAdding}
            onClick={addNewHeatTreatMent}
            sx={{ padding: "10px 20px" }}
          >
            {isAdding ? "Adding new HeatTreatment..." : "Add new HeatTreatment"}
          </Button>
        </div>
      </Paper>
    </Box>
  );
};

export default AddHeatTreatment;
