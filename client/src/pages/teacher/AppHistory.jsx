import React, { Fragment, useState, useEffect } from "react";
import http from "../../utils/http";
import { useLoaderData, useParams } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Paper,
  IconButton,
  Collapse,
} from "@mui/material";
import dayjs from "dayjs";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const loader = async () => {
  try {
    const { data } = await http.get("/teacher/job-applications");
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const AppHistory = () => {
  const data = useLoaderData();
  const [open, setOpen] = useState({});
  const params = useParams();
  const jobIdParam = params.jobId;

  useEffect(() => {
    if (jobIdParam) {
      setOpen({ [jobIdParam]: true });
    }
  }, [jobIdParam]);

  const statusColors = {
    rejected: "error",
    shortlisted: "success",
    pending: "warning",
    default: "info",
  };

  const handleClick = (id) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-auto mt-5 mb-3">
      <div className="bg-white py-5 mt-5 rounded grey-border px-5">
        <h5 className="fw-bold">My Job Applications</h5>
        <hr />
        <TableContainer
          sx={{ border: "1px solid #0A9396" }}
          className="mb-4"
          component={Paper}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell className="fw-bold">Job Title</TableCell>
                <TableCell align="left" className="fw-bold">
                  University Name
                </TableCell>
                <TableCell align="left" className="fw-bold">
                  Applied On
                </TableCell>
                <TableCell align="center" className="fw-bold">
                  Status
                </TableCell>
                <TableCell align="center" className="fw-bold">
                  Comments
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data.map((e, index) => (
                  <Fragment key={e.jobId._id}>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {e.jobId.title}
                      </TableCell>

                      <TableCell align="left">
                        {e.jobId.createdBy.universityName}
                      </TableCell>

                      <TableCell align="left">
                        {dayjs(e.applicationDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="center" className="text-capitalize">
                        <Chip
                          className="fw-bold"
                          label={e.status}
                          color={statusColors[e.status] || statusColors.default}
                          variant="contained"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {Boolean(e.text) ? (
                          <IconButton
                            size="small"
                            onClick={() =>
                              Boolean(e.text) && handleClick(e._id)
                            }
                          >
                            {open[e._id] ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        ) : (
                          "None"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                        sx={{
                          backgroundColor: "#EEEE",
                        }}
                      >
                        <Collapse in={open[e._id]} timeout="auto" unmountOnExit>
                          <div style={{ margin: 16, whiteSpace: "pre-wrap" }}>
                            <p>{e.text}</p>
                          </div>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))
              ) : (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    colSpan="8"
                    style={{ textAlign: "center", padding: 35 }}
                  >
                    <FolderOffOutlinedIcon color="disabled" fontSize="large" />
                    <p className="text-secondary">No applications found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AppHistory;
