import { useEffect, useState } from "react";
import { IProject } from "../../types/global.typing";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
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
import { Add } from "@mui/icons-material";

const BASE_URL = "https://localhost:7149/api/Project/Get";
const DELETE_URL = "https://localhost:7149/api/Project";

const Project = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const redirect = useNavigate();

  const fetchProjectList = async () => {
    try {
      const res = await axios.get<IProject[]>(BASE_URL);
      setProjects(res.data);
      if (location?.state) {
        Swal.fire({
          icon: "success",
          title: location?.state?.message,
        });
        redirect(location.pathname, { replace: true });
      }
    } catch (error) {
      alert("An Error Happened");
    }
  };
  useEffect(() => {
    fetchProjectList();
  }, []);

  const redirectToEditPage = (id: string) => {
    redirect(`/projects/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedProjectId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProjectId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProjectId) {
      try {
        await axios.delete(`${DELETE_URL}/${selectedProjectId}`);
        setProjects(
          (prevProject) =>
            prevProject?.filter(
              (projects) => projects.projectId !== Number(selectedProjectId)
            ) || null
        );
      } catch (error) {
        console.error("Failed to delete projects:", error);
      } finally {
        handleClose();
      }
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
        boxSizing: "border-box",
      }}
    >
      <Stack direction="column" spacing={2} width="100%" maxWidth="1200px">
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => redirect("/projects/add")}
          sx={{ alignSelf: "flex-end" }}
        >
          Add new Project
        </Button>
        <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ProjectName</TableCell>
                <TableCell>StartDate</TableCell>
                <TableCell>EndDate</TableCell>
                <TableCell>ProjectManager</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects?.map((project) => (
                <TableRow key={project.projectId}>
                  <TableCell>{project.projectId}</TableCell>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>{project.startDate}</TableCell>
                  <TableCell>{project.endDate}</TableCell>
                  <TableCell>{project.projectManager}</TableCell>
                  <TableCell>{project.budget}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() =>
                        redirectToEditPage(project.projectId.toString())
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        handleDeleteClick(project.projectId.toString())
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
          <DialogTitle>Delete Material</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this supplier? This action cannot
              be undone.
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

export default Project;
