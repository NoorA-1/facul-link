import React, { useState } from "react";
import { NavLink, useLoaderData, useNavigate } from "react-router-dom";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Button,
  Paper,
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import http from "../../utils/http";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";

export const loader = async () => {
  try {
    const { data } = await http.get("/employer/get-hiring-tests");
    return data;
  } catch (error) {
    return null;
  }
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const HiringTests = () => {
  const data = useLoaderData();
  console.log(data);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = (id) => {
    setOpen(true);
    setDeleteTestId(id);
  };
  const handleClose = () => setOpen(false);
  const [deleteTestId, setDeleteTestId] = useState(null);

  const handleDelete = async () => {
    try {
      const response = await http.delete(
        `employer/delete-hiring-test/${deleteTestId}`
      );
      if (response.status === 200) {
        navigate("/dashboard/hiring-tests");
      }
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container my-3 bg-white py-3 px-5 rounded grey-border">
      <div className="d-flex justify-content-between my-3">
        <h3 className="fw-bold">Hiring Tests</h3>
        <NavLink
          to="add"
          style={{ color: "unset", textDecoration: "unset" }}
          end
        >
          <Button variant="contained" startIcon={<AddOutlinedIcon />}>
            Add Test
          </Button>
        </NavLink>
      </div>
      <hr className="mb-5" />
      <TableContainer
        sx={{ border: "2px solid #0A9396" }}
        className="mb-4"
        component={Paper}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell className="fw-bold">Title</TableCell>
              <TableCell align="right" className="fw-bold">
                Duration
              </TableCell>
              <TableCell align="right" className="fw-bold">
                Shuffle Questions
              </TableCell>
              <TableCell align="right" className="fw-bold">
                Total Questions
              </TableCell>
              <TableCell align="right" className="fw-bold"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((e, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {e.title}
                  </TableCell>
                  <TableCell align="right">{e.duration} Minutes</TableCell>
                  <TableCell align="right">
                    {e.shuffleQuestions === true ? "Yes" : "No"}
                  </TableCell>
                  <TableCell align="right">{e.questions.length}</TableCell>
                  <TableCell align="right">
                    <div className="d-flex justify-content-end gap-3">
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => navigate(`edit/${e._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="danger"
                        sx={{ color: "#FFF" }}
                        startIcon={<DeleteOutlinedIcon />}
                        onClick={() => handleOpen(e._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  colspan="5"
                  style={{ "text-align": "center", padding: 35 }}
                >
                  <FolderOffOutlinedIcon color="disabled" fontSize="large" />
                  <p className="text-secondary">No tests found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h3 className="text-center">Are you sure?</h3>
          <p className="text-center mb-4">Do you want to delete this test?</p>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{ backgroundColor: "#737373" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="danger"
              sx={{ color: "#FFF" }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default HiringTests;
