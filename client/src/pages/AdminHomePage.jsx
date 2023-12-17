import React, { useEffect, useState } from "react";
import { useDashboardContext } from "./AdminDashboardLayout";
import { HomePageCard } from "../components";
import CasesOutlinedIcon from "@mui/icons-material/CasesOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import http from "../utils/http";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Area,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
} from "recharts";
import dayjs from "dayjs";

const AdminHomePage = () => {
  const { userData } = useDashboardContext();
  const [statsData, setStatsData] = useState({});
  const [totalStatsData, setTotalStatsData] = useState({
    userCount: null,
  });
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
      console.log(data.totalUsers);
      const transformedData = data.userCount.map((item) => {
        const formattedMonth = dayjs(
          new Date(item._id.year, item._id.month - 1)
        ).format("MMMM YYYY");
        return {
          month: formattedMonth,
          count: item.count,
        };
      });
      setStatsData(transformedData);
      setTotalStatsData(() => {
        return {
          userCount: data.totalUsers,
        };
      });
    } catch (error) {
      console.log(error);
    }
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
          digit={totalStatsData.userCount}
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
        <HomePageCard cardText="Total Hiring Tests" digit={0} color="#EE9B00">
          <EditNoteOutlinedIcon
            className="mt-2 mb-3"
            sx={{ color: "#EE9B00" }}
          />
        </HomePageCard>
      </div>
      <h4 className="fw-bold text-center mt-5">Monthly User Count</h4>
      <ResponsiveContainer width={"100%"} height={350}>
        <AreaChart data={statsData} margin={{ top: 20 }}>
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
