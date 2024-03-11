import React, { useEffect, useState } from "react";
import {
  NavLink,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Button,
  IconButton,
  Paper,
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Chip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import http from "../../utils/http";
import dayjs from "dayjs";

export const loader = async () => {
  try {
    const { data } = await http.get("/employer/jobs");
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

const PostJobHome = () => {
  const navigate = useNavigate();
  const jobsData = useLoaderData();
  // console.log(jobsData);

  const [open, setOpen] = useState(false);

  const [deleteJobId, setDeleteJobId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status");

  const handleOpen = (id) => {
    setOpen(true);
    setDeleteJobId(id);
  };
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    try {
      const response = await http.delete(`employer/delete-job/${deleteJobId}`);
      if (response.status === 200) {
        navigate("/dashboard/post-job?status=deleted");
      }
      console.log(response);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const MessageBox = () => {
    return (
      <Alert variant="filled" severity="success">
        {status === "posted"
          ? "Job Posted successfully"
          : status === "updated"
          ? "Job updated successfully"
          : status === "deleted" && "Job deleted successfully"}
      </Alert>
    );
  };
  return (
    <div className="container my-3 bg-white py-3 px-5 rounded grey-border">
      <div className="d-flex justify-content-between my-3">
        <h3 className="fw-bold">Post Jobs</h3>
        <NavLink
          to="add"
          style={{ color: "unset", textDecoration: "unset" }}
          end
        >
          <Button variant="contained" startIcon={<AddOutlinedIcon />}>
            Add Job
          </Button>
        </NavLink>
      </div>
      {status && <MessageBox />}
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
                Location
              </TableCell>
              <TableCell align="right" className="fw-bold">
                Qualification
              </TableCell>
              <TableCell align="right" className="fw-bold">
                Experience
              </TableCell>
              <TableCell align="right" className="fw-bold">
                Hiring Test
              </TableCell>
              <TableCell align="right" className="fw-bold">
                Positions
              </TableCell>
              <TableCell align="center" className="fw-bold">
                End Date
              </TableCell>
              <TableCell align="center" className="fw-bold">
                Status
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobsData.length > 0 ? (
              jobsData.map((e, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {e.title}
                  </TableCell>
                  <TableCell align="right">{e.location}</TableCell>
                  <TableCell align="right">
                    {e.requiredQualification.degree}
                  </TableCell>
                  <TableCell align="right">
                    {e.requiredExperience > 1
                      ? `${e.requiredExperience} Years`
                      : `${e.requiredExperience} Year`}
                  </TableCell>
                  {e.hiringTest !== null ? (
                    <TableCell align="right">{e.hiringTest.title}</TableCell>
                  ) : (
                    <TableCell align="right" className="text-danger">
                      {"None"}
                    </TableCell>
                  )}
                  <TableCell align="right">{e.totalPositions}</TableCell>
                  <TableCell align="right">
                    {dayjs(e.endDate).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      className="fw-bold"
                      label={
                        dayjs()
                          .startOf("day")
                          .isAfter(dayjs(e.endDate).startOf("day"))
                          ? "Expired"
                          : "Active"
                      }
                      color={
                        dayjs()
                          .startOf("day")
                          .isAfter(dayjs(e.endDate).startOf("day"))
                          ? "error"
                          : "success"
                      }
                      variant="contained"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <div className="d-flex justify-content-end ">
                      <IconButton
                        type="submit"
                        color="secondary"
                        onClick={() => navigate(`edit/${e._id}`)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton
                        color="danger"
                        onClick={() => handleOpen(e._id)}
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
                  <p className="text-secondary">No jobs found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h3 className="text-center">Are you sure?</h3>
          <p className="text-center mb-4">Do you want to delete this job?</p>
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

export default PostJobHome;
