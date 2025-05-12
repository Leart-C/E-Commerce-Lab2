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

const HT_LIST = "https://localhost:7149/api/HeatTreatment/Get";
const DELETE_HT = "https://localhost:7149/api/HeatTreatment";

type Corrosion = {
  id: string;
  materialName: string;
  environment: string;
  corrosionRate: string;
  protectiveCoating: string;
  notes: string;
};

export type HeatTreatment = {
  id: string;
  processName: string;
  temperature: string;
  timeDuration: string;
  coolingMethod: string;
  purpose: string;
  corrosionId: string;
};

const HeatTreatment = () => {
  const [corrosionList, setCorrosionList] = useState<Corrosion[]>([]);
  const [heatTreatment, setHeatTreatment] = useState<HeatTreatment[] | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [selectedHeatTreatmentId, setSelectedHeatTreatmentId] = useState<
    string | null
  >(null);

  const navigate = useNavigate();

  const fetchCorrosion = async () => {
    try {
      const res = await axios.get("https://localhost:7149/api/Corrosion/Get");
      setCorrosionList(res.data);
    } catch (error) {
      console.error("Error fetching corrosion:", error);
    }
  };

  const getHeatTreatment = async () => {
    try {
      const res = await axios.get(HT_LIST);
      console.log("ht :", res);
      setHeatTreatment(res.data);
    } catch (error) {
      console.error("Failed to fetch ht:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedHeatTreatmentId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedHeatTreatmentId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedHeatTreatmentId) {
      try {
        await axios.delete(`${DELETE_HT}/${selectedHeatTreatmentId}`);
        setHeatTreatment(
          (prevHeatTreatment) =>
            prevHeatTreatment?.filter(
              (heatTreatment) => heatTreatment.id !== selectedHeatTreatmentId
            ) || null
        );
      } catch (error) {
        console.error("Failed to delete heatTreatment:", error);
      } finally {
        handleClose();
      }
    }
  };

  useEffect(() => {
    getHeatTreatment();
    fetchCorrosion();
  }, []);

  const redirectToEditPage = (id: string) => {
    navigate(`/heatTreatments/edit/${id}`);
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
          onClick={() => navigate("/heatTreatments/add")}
          sx={{ alignSelf: "flex-end" }}
        >
          Add new Heat Treatment
        </Button>
        <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ProcessName</TableCell>
                <TableCell>Temperature</TableCell>
                <TableCell>TimeDuration</TableCell>
                <TableCell>CoolingMethod</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Corrosion</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {heatTreatment?.map((heatTreatment) => (
                <TableRow key={heatTreatment.id}>
                  <TableCell>{heatTreatment.id}</TableCell>
                  <TableCell>{heatTreatment.processName}</TableCell>
                  <TableCell>{heatTreatment.temperature}</TableCell>
                  <TableCell>{heatTreatment.timeDuration}</TableCell>
                  <TableCell>{heatTreatment.coolingMethod}</TableCell>
                  <TableCell>{heatTreatment.purpose}</TableCell>

                  <TableCell>
                    {heatTreatment.corrosionId
                      ? corrosionList?.find(
                          (c) =>
                            Number(c.id) === Number(heatTreatment?.corrosionId)
                        )?.protectiveCoating
                      : "No Corrosion"}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => redirectToEditPage(heatTreatment.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleDeleteClick(heatTreatment.id)}
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
              Are you sure you want to delete this material? This action cannot
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

export default HeatTreatment;
