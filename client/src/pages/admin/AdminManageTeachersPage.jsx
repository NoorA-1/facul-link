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
  Avatar,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { serverURL } from "../../utils/formData";
import { AdminTeacherForm, TeacherEditProfileForm } from "../../components";

export const loader = async () => {
  try {
    const { data } = await http.get("/admin/teachers");
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
  width: "55%",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

const AdminManageTeachersPage = () => {
  const navigate = useNavigate();
  const data = useLoaderData();
  const [open, setOpen] = useState({
    addModal: false,
    editModal: false,
    deleteModal: false,
  });
  const [currentTeacher, setCurrentTeacher] = useState(null);

  const handleOpen = (name, teacher) => {
    setCurrentTeacher(teacher);
    setOpen((prev) => ({ ...prev, [name]: true }));
  };

  const handleClose = (name) => {
    setOpen((prev) => ({ ...prev, [name]: false }));
    setCurrentTeacher(null);
  };
  const profileImage = (e) => {
    return serverURL + e?.profileImage?.split("public\\")[1];
  };

  const handleDelete = async () => {
    try {
      const response = await http.delete(
        `/admin/teacher/${currentTeacher.userId._id}`
      );
      console.log(response);
      if (response.status === 200) {
        navigate("/admin-dashboard/manage-teachers");
      }
      handleClose("deleteModal");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container my-3 bg-white py-3 px-5 rounded grey-border">
      <div className="d-flex justify-content-between my-3">
        <h3 className="fw-bold">Manage Teachers</h3>
        <Button
          variant="contained"
          onClick={() => handleOpen("addModal")}
          startIcon={<AddOutlinedIcon />}
        >
          Add Teacher
        </Button>
      </div>
      <hr className="mb-3" />
      <TableContainer
        sx={{ border: "1px solid #0A9396" }}
        className="mb-4"
        component={Paper}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell className="fw-bold">Name</TableCell>
              <TableCell className="fw-bold">Email</TableCell>
              <TableCell align="left" className="fw-bold">
                Gender
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((e, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    align="left"
                    className="d-flex align-items-center gap-2"
                  >
                    <Avatar
                      src={profileImage(e)}
                      sx={{
                        border: "1px solid #0A9396",
                        width: 40,
                        height: 40,
                      }}
                    >
                      {`${e.userId.firstname[0]}${e.userId.lastname[0]}`}
                    </Avatar>{" "}
                    {e.userId.firstname + " " + e.userId.lastname}
                  </TableCell>
                  <TableCell align="left">{e.userId.email}</TableCell>
                  <TableCell align="left" className="text-capitalize">
                    {e.userId.gender}
                  </TableCell>
                  <TableCell align="right">
                    <div className="d-flex justify-content-end">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(
                            `/admin-dashboard/teacher-profile/${e.userId._id}`
                          )
                        }
                      >
                        <VisibilityOutlinedIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleOpen("editModal", e)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton
                        color="danger"
                        onClick={() => handleOpen("deleteModal", e)}
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
                  colSpan="7"
                  style={{ textAlign: "center", padding: 35 }}
                >
                  <FolderOffOutlinedIcon color="disabled" fontSize="large" />
                  <p className="text-secondary">No teachers found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open.addModal} onClose={() => handleClose("addModal")}>
        <Box sx={style}>
          <AdminTeacherForm
            onSuccess={() => {
              handleClose("addModal");
              navigate("/admin-dashboard/manage-teachers");
            }}
          />
        </Box>
      </Modal>

      <Modal open={open.editModal} onClose={() => handleClose("editModal")}>
        <Box sx={style}>
          {currentTeacher && (
            <TeacherEditProfileForm
              userData={currentTeacher}
              setEditMode={() => handleClose("editModal")}
              updateUserData={() => {
                handleClose("editModal");
                navigate("/admin-dashboard/manage-teachers");
              }}
              role="admin"
            />
          )}
        </Box>
      </Modal>

      <Modal open={open.deleteModal} onClose={() => handleClose("deleteModal")}>
        <Box sx={style}>
          <h3 className="text-center">Are you sure?</h3>
          <p className="text-center mb-4">
            Do you want to delete this teacher? This will also delete any job
            applications of the teacher.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="contained"
              onClick={() => handleClose("deleteModal")}
              color="grey"
              sx={{ color: "#FFF" }}
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

export default AdminManageTeachersPage;
