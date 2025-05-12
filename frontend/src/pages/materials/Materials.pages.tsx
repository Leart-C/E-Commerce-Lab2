import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MATERIALS_LIST = "https://localhost:7149/api/Material/Get";
const DELETE_MATERIAL = "https://localhost:7149/api/Material"; // Adjust this URL if necessary

type Supplier = {
  id: string;
  name: string;
  info: string;
};

export type Material = {
  id: string;
  name: string;
  description: string;
  supplierId: number;
};

const Materials = () => {
  const [suppliersList, setSuppliersList] = useState<Supplier[]>([]);
  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null
  );

  const navigate = useNavigate();

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("https://localhost:7149/api/Supplier/Get");
      setSuppliersList(res.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const getMaterials = async () => {
    try {
      const res = await axios.get(MATERIALS_LIST);
      console.log("materials :", res);
      setMaterials(res.data);
    } catch (error) {
      console.error("Failed to fetch materials:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedMaterialId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMaterialId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedMaterialId) {
      try {
        await axios.delete(`${DELETE_MATERIAL}/${selectedMaterialId}`);
        setMaterials(
          (prevMaterials) =>
            prevMaterials?.filter(
              (material) => material.id !== selectedMaterialId
            ) || null
        );
      } catch (error) {
        console.error("Failed to delete material:", error);
      } finally {
        handleClose();
      }
    }
  };

  useEffect(() => {
    getMaterials();
    fetchSuppliers();
  }, []);

  const redirectToEditPage = (id: string) => {
    navigate(`/materials/edit/${id}`);
  };

  console.log("sup :", suppliersList);

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
          onClick={() => navigate("/materials/add")}
          sx={{ alignSelf: "flex-end" }}
        >
          Add new material
        </Button>
        <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials?.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>{material.id}</TableCell>
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.description}</TableCell>
                  <TableCell>
                    {material.supplierId
                      ? suppliersList?.find(
                          (s) => Number(s.id) === material?.supplierId
                        )?.name
                      : "No Supplier"}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => redirectToEditPage(material.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleDeleteClick(material.id)}
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

export default Materials;
