import { useEffect, useState } from "react";
import { ICorrosion } from "../../types/global.typing";
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

const baseUrl = "https://localhost:7149/api/Corrosion/Get";
const deleteURL = "https://localhost:7149/api/Corrosion";

const Corrosion = () => {
  const [corrosion, setCorrosion] = useState<ICorrosion[]>([]);
  const [selectedCorrosionId, setSelectedCorrosionId] = useState<string | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const redirect = useNavigate();

  const fetchCorrosionList = async () => {
    try {
      const response = await axios.get<ICorrosion[]>(baseUrl);
      setCorrosion(response.data);
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
    fetchCorrosionList();
  }, []);

  const redirectToEditPage = (id: string) => {
    redirect(`/corrosions/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedCorrosionId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCorrosionId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCorrosionId) {
      try {
        await axios.delete(`${deleteURL}/${selectedCorrosionId}`);
        setCorrosion(
          (prevCorrosion) =>
            prevCorrosion?.filter(
              (corrosion) => corrosion.id !== selectedCorrosionId
            ) || null
        );
      } catch (error) {
        console.error("Failed to delete Corrosion:", error);
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
          onClick={() => redirect("/corrosions/add")}
          sx={{ alignSelf: "flex-end" }}
        >
          Add new Corrosion
        </Button>
        <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>MaterialName</TableCell>
                <TableCell>Environment</TableCell>
                <TableCell>CorrosionRate</TableCell>
                <TableCell>ProtectiveCoating</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {corrosion?.map((corrosion) => (
                <TableRow key={corrosion.id}>
                  <TableCell>{corrosion.id}</TableCell>
                  <TableCell>{corrosion.materialName}</TableCell>
                  <TableCell>{corrosion.environment}</TableCell>
                  <TableCell>{corrosion.corrosionRate}</TableCell>
                  <TableCell>{corrosion.protectiveCoating}</TableCell>
                  <TableCell>{corrosion.notes}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => redirectToEditPage(corrosion.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleDeleteClick(corrosion.id)}
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
              Are you sure you want to delete this Corrosion? This action cannot
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

export default Corrosion;
