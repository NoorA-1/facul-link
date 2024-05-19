import React, { useState } from "react";
import http from "../../utils/http";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  IconButton,
  Modal,
  Box,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { serverURL } from "../../utils/formData";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import { AdminHiringTestForm } from "../../components";

export const loader = async () => {
  try {
    const { data } = await http.get("/admin/get-hiring-tests");
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: "80%",
  width: "75%",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const AdminManageHiringTestsPage = () => {
  const data = useLoaderData();
  console.log(data);
  const navigate = useNavigate();
  const [open, setOpen] = useState({
    editModal: false,
    deleteModal: false,
  });
  const [currentTestId, setCurrentTestId] = useState(null);

  const handleOpen = (name, id) => {
    setOpen((prev) => ({ ...prev, [name]: true }));
    setCurrentTestId(id);
  };
  const handleClose = (name) => {
    setOpen((prev) => ({ ...prev, [name]: false }));
    setCurrentTestId(null);
  };

  const handleDelete = async () => {
    try {
      const response = await http.delete(
        `admin/delete-hiring-test/${currentTestId}`
      );
      if (response.status === 200) {
        navigate("/admin-dashboard/manage-tests");
      }
      handleClose("deleteModal");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container my-3 bg-white py-3 px-5 rounded grey-border">
      <h3 className="fw-bold my-3">Manage Hiring Tests</h3>
      <hr className="mb-5" />
      <TableContainer
        sx={{ border: "1px solid #0A9396" }}
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
              <TableCell align="center" className="fw-bold">
                Total Questions
              </TableCell>
              <TableCell align="left" className="fw-bold">
                Created by
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
                  <TableCell align="center">{e.questions.length}</TableCell>
                  <TableCell align="left">
                    <span
                      role="button"
                      className="secondary-text fw-semibold"
                      onClick={() =>
                        navigate(
                          `/admin-dashboard/employer-profile/${e.createdBy.userId._id}`
                        )
                      }
                    >
                      {e.createdBy.userId.firstname +
                        " " +
                        e.createdBy.userId.lastname}
                    </span>
                    <p className="text-dark-emphasis fw-normal">
                      {e.createdBy.userId.email}
                    </p>
                  </TableCell>
                  <TableCell align="right">
                    <div className="d-flex justify-content-end ">
                      <IconButton
                        type="submit"
                        color="secondary"
                        onClick={() => handleOpen("editModal", e._id)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton
                        color="danger"
                        onClick={() => handleOpen("deleteModal", e._id)}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  colSpan="5"
                  style={{ textAlign: "center", padding: 35 }}
                >
                  <FolderOffOutlinedIcon color="disabled" fontSize="large" />
                  <p className="text-secondary">No tests found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open.editModal}
        onClose={() => handleClose("editModal")}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={style}>
          <AdminHiringTestForm
            testId={currentTestId}
            onClose={() => handleClose("editModal")}
            onSave={() => {
              handleClose("editModal");
              navigate("/admin-dashboard/manage-tests");
            }}
          />
        </Box>
      </Modal>

      <Modal open={open.deleteModal} onClose={handleClose}>
        <Box sx={style}>
          <h3 className="text-center">Are you sure?</h3>
          <p className="text-center mb-4">Do you want to delete this test?</p>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="contained"
              onClick={() => handleClose("deleteModal")}
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

export default AdminManageHiringTestsPage;
