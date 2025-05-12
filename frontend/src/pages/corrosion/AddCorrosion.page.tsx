import {
  Box,
  Button,
  Paper,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { ICorrosion } from "../../types/global.typing";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BASE_URL = "https://localhost:7149/api/Corrosion/Create";

const AddCorrosion = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState<Partial<ICorrosion>>({
    materialName: "",
    environment: "",
    corrosionRate: "",
    protectiveCoating: "",
    notes: "",
  });

  const navigate = useNavigate();

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

  const addNewCorrosion = async () => {
    try {
      setIsAdding(true);
      await axios.post(BASE_URL, formValues);
      setIsAdding(false);
      navigate("/corrosions");
    } catch (error) {
      console.log("Error adding new corrosion:", error);
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
                Add New Corrosion
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>MaterialName</TableCell>
              <TableCell>
                <TextField
                  name="materialName"
                  onChange={handleInputChange}
                  placeholder="materialName"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Environment</TableCell>
              <TableCell>
                <TextField
                  name="environment"
                  onChange={handleInputChange}
                  placeholder="environment"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CorrosionRate</TableCell>
              <TableCell>
                <TextField
                  name="corrosionRate"
                  onChange={handleInputChange}
                  placeholder="corrosionRate"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Notes</TableCell>
              <TableCell>
                <TextField
                  name="notes"
                  onChange={handleInputChange}
                  placeholder="notes"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ProtectiveCoating</TableCell>
              <TableCell>
                <TextField
                  name="protectiveCoating"
                  onChange={handleInputChange}
                  placeholder="protectiveCoating"
                  fullWidth
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2} align="center">
                <Button
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding}
                  onClick={addNewCorrosion}
                >
                  {isAdding ? "Adding new corrosion..." : "Add new corrosion"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddCorrosion;
