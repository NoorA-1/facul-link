import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CasesOutlinedIcon from "@mui/icons-material/CasesOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { MenuItem, TextField } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HomePageCard } from "../../components";
import http from "../../utils/http";
import { useDashboardContext } from "./AdminDashboardLayout";

const AdminHomePage = () => {
  const { userData } = useDashboardContext();
  const [statsData, setStatsData] = useState({});
  const [totalStatsData, setTotalStatsData] = useState({
    totalUsers: null,
  });
  const [chartType, setChartType] = useState("User Chart");
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date().toLocaleDateString("en-US", options);

  const getStats = async () => {
    try {
      const { data } = await http.get("/admin/stats");
      const transformedData = data.userCount.map((item) => {
        const formattedMonth = dayjs(
          new Date(item._id.year, item._id.month - 1)
        ).format("MMMM YYYY");
        return {
          month: formattedMonth,
          count: item.count,
        };
      });
      const transformedTestData = data.testCount.map((item) => {
        const formattedMonth = dayjs(
          new Date(item._id.year, item._id.month - 1)
        ).format("MMMM YYYY");
        return {
          month: formattedMonth,
          count: item.count,
        };
      });
      setStatsData({
        userCount: transformedData,
        testCount: transformedTestData,
      });
      setTotalStatsData(() => {
        return {
          totalUsers: data.totalUsers,
          totalTests: data.totalTests,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <div className="mt-3">
      <h2 className="fw-bold mb-3">Welcome, {userData.user.firstname}</h2>
      <h6 className="ps-1 mb-5">{date}</h6>
      <div className="d-flex flex-column flex-md-row gap-5">
        <HomePageCard
          cardText="Total Users"
          digit={totalStatsData.totalUsers}
          color="#BB3E03"
        >
          <PersonOutlineOutlinedIcon
            className="mt-2 mb-3"
            sx={{ color: "#BB3E03" }}
          />
        </HomePageCard>
        <HomePageCard cardText="Total Jobs" digit={0} color="#005F73">
          <CasesOutlinedIcon className="mt-2 mb-3" sx={{ color: "#005F73" }} />
        </HomePageCard>
        <HomePageCard cardText="Total Applications" digit={0} color="#00733D">
          <AssignmentTurnedInOutlinedIcon
            className="mt-2 mb-3"
            sx={{ color: "#00733D" }}
          />
        </HomePageCard>
        <HomePageCard
          cardText="Total Hiring Tests"
          digit={totalStatsData.totalTests}
          color="#EE9B00"
        >
          <EditNoteOutlinedIcon
            className="mt-2 mb-3"
            sx={{ color: "#EE9B00" }}
          />
        </HomePageCard>
      </div>

      <div className="d-flex align-items-center justify-content-center mt-5">
        <h4 className="fw-bold text-center flex-grow-1">
          Monthly {chartType.split(" ")[0]} Count
        </h4>
        <TextField
          select
          label="Chart Type"
          value={chartType}
          onChange={handleChartTypeChange}
          variant="outlined"
          sx={{ backgroundColor: "#FFF" }}
        >
          <MenuItem value="User Chart">User Chart</MenuItem>
          <MenuItem value="Test Chart">Test Chart</MenuItem>
        </TextField>
      </div>
      <ResponsiveContainer width={"100%"} height={350}>
        <AreaChart
          data={statsData[chartType.split(" ")[0].toLowerCase() + "Count"]}
          margin={{ top: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#0A9396"
            fill="#0A9396"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminHomePage;
