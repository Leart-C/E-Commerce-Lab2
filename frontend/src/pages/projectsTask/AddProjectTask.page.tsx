import { ChangeEvent, useEffect, useState } from "react";
import { IProject } from "../../types/global.typing";
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
  taskName: string;
  assignedTo: string;
  dueDate: string;
  status: string;
  description: string;
  projectId: string;
};

const AddProjectTask = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    taskName: "",
    assignedTo: "",
    dueDate: "",
    status: "",
    description: "",
    projectId: "",
  });
  const [projectList, setProjectList] = useState<IProject[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchProject = async () => {
    try {
      const res = await axios.get("https://localhost:7149/api/Project/Get");
      setProjectList(res.data);
    } catch (error) {
      console.log("Error fetching projects", error);
      setError("Error fetching projects. Please try again");
    }
  };

  useEffect(() => {
    fetchProject();
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

  const addNewProjectTask = async () => {
    try {
      setIsAdding(true);
      await axios.post(
        "https://localhost:7149/api/ProjectTask/Create",
        formValues
      );
      setIsAdding(false);
      navigate("/projectTasks");
    } catch (error) {
      console.log("Error adding new projectTask:", error);
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
                Add New ProjectTask
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>TaskName</TableCell>
              <TableCell>
                <TextField
                  name="taskName"
                  onChange={handleInputChange}
                  placeholder="TaskName"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>AssignedTo</TableCell>
              <TableCell>
                <TextField
                  name="assignedTo"
                  onChange={handleInputChange}
                  placeholder="AssignedTo"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>DueDate</TableCell>
              <TableCell>
                <TextField
                  name="dueDate"
                  onChange={handleInputChange}
                  placeholder="DueDate"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Status</TableCell>
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
              <TableCell>Description</TableCell>
              <TableCell>
                <TextField
                  name="description"
                  onChange={handleInputChange}
                  placeholder="Description"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Projects</TableCell>
              <TableCell>
                {error ? (
                  <div>{error}</div>
                ) : (
                  <Select
                    name="projectId"
                    value={formValues.projectId}
                    onChange={handleInputChange}
                    fullWidth
                  >
                    {projectList.map((project) => (
                      <MenuItem
                        key={project.projectId}
                        value={project.projectId}
                      >
                        {`${project.budget} - ${project.status}`}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Button
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding}
                  onClick={addNewProjectTask}
                >
                  {isAdding
                    ? "Adding new projectTask..."
                    : "Add new ProjectTask"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddProjectTask;
