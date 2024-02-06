import React from "react";
import { NavLink, useLoaderData } from "react-router-dom";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Button,
  Paper,
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

export const loader = async () => {
  try {
    const { data } = await http.get("/employer/get-hiring-tests");
    return data;
  } catch (error) {
    return null;
  }
};

const HiringTests = () => {
  const data = useLoaderData();

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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
            {data.length > 0 &&
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
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="danger"
                        sx={{ color: "#FFF" }}
                        startIcon={<DeleteOutlinedIcon />}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default HiringTests;
