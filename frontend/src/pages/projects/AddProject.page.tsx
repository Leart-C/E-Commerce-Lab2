import { ChangeEvent, useState } from "react";
import { IProject } from "../../types/global.typing";
import { useNavigate } from "react-router-dom";
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
import axios from "axios";

const BASE_URL = "https://localhost:7149/api/Project/Create";

const AddProject = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState<Partial<IProject>>({
    projectName: "",
    projectManager: "",
    status: "",
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

  const addNewProject = async () => {
    try {
      setIsAdding(true);
      await axios.post(BASE_URL, formValues);
      setIsAdding(false);
      navigate("/projects");
    } catch (error) {
      console.log("Error adding new projects:", error);
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
                Add New Project
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>ProjectName</TableCell>
              <TableCell>
                <TextField
                  name="projectName"
                  onChange={handleInputChange}
                  placeholder="ProjectName"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ProjectManager</TableCell>
              <TableCell>
                <TextField
                  name="projectManager"
                  onChange={handleInputChange}
                  placeholder="ProjectManager"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>status</TableCell>
              <TableCell>
                <TextField
                  name="status"
                  onChange={handleInputChange}
                  placeholder="Status"
                  fullWidth
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2} align="center">
                <Button
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding}
                  onClick={addNewProject}
                >
                  {isAdding ? "Adding new Project..." : "Add new Project"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddProject;
