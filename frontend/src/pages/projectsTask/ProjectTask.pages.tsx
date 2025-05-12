import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PROJECTTASK_LIST = "https://localhost:7149/api/ProjectTask/Get";
const DELETE_PROJECTTASK = "https://localhost:7149/api/ProjectTask"; // Adjust this URL if necessary

type Project = {
  projectId: number;
  projectName: string;
  startDate: string;
  endDate: string;
  projectManager: string;
  budget: number;
  status: string;
};

export type ProjectTask = {
  projectTaskId: number;
  projectId: number;
  taskName: string;
  assignedTo: string;
  dueDate: string;
  status: string;
  description: string;
};

const ProjectTask = () => {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [projectTask, setProjectTask] = useState<ProjectTask[] | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedProjectTaskID, setSelectedProjectTaskId] = useState<
    string | null
  >(null);

  const navigate = useNavigate();

  const fetchProject = async () => {
    try {
      const res = await axios.get("https://localhost:7149/api/Project/Get");
      setProjectList(res.data);
    } catch (error) {
      console.error("Error fetching Projects:", error);
    }
  };

  const getProjectTask = async () => {
    try {
      const res = await axios.get(PROJECTTASK_LIST);
      console.log("projectsTask :", res);
      setProjectTask(res.data);
    } catch (error) {
      console.error("Failed to fetch projectTask:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedProjectTaskId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProjectTaskId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProjectTaskID) {
      try {
        await axios.delete(`${DELETE_PROJECTTASK}/${selectedProjectTaskID}`);
        setProjectTask(
          (prevProjectTask) =>
            prevProjectTask?.filter(
              (projectTask) =>
                projectTask.projectTaskId !== Number(selectedProjectTaskID)
            ) || null
        );
      } catch (error) {
        console.error("Failed to delete projectTask:", error);
      } finally {
        handleClose();
      }
    }
  };

  useEffect(() => {
    getProjectTask();
    fetchProject();
  }, []);

  const redirectToEditPage = (id: string) => {
    navigate(`/projectTasks/edit/${id}`);
  };

  console.log("project :", projectList);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      <Stack direction="column" spacing={2} width="100%" maxWidth="1200px">
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => navigate("/projectTasks/add")}
          sx={{ alignSelf: "flex-end" }}
        >
          Add new ProjectTask
        </Button>
        <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ProjectTaskId</TableCell>
                <TableCell>ProjectId</TableCell>
                <TableCell>TaskName</TableCell>
                <TableCell>AssignedTo</TableCell>
                <TableCell>DueDate</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectTask?.map((projectTask) => (
                <TableRow key={projectTask.projectTaskId}>
                  <TableCell>{projectTask.projectTaskId}</TableCell>
                  <TableCell>{projectTask.projectId}</TableCell>
                  <TableCell>{projectTask.taskName}</TableCell>
                  <TableCell>{projectTask.assignedTo}</TableCell>
                  <TableCell>{projectTask.dueDate}</TableCell>
                  <TableCell>{projectTask.status}</TableCell>
                  <TableCell>{projectTask.description}</TableCell>
                  <TableCell>
                    {projectTask.projectId
                      ? projectList?.find(
                          (p) => Number(p.projectId) === projectTask?.projectId
                        )?.projectManager
                      : "No Project"}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      onClick={() =>
                        redirectToEditPage(projectTask.projectTaskId.toString())
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        handleDeleteClick(projectTask.projectTaskId.toString())
                      }
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete ProjectTask</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this projectTask? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default ProjectTask;
