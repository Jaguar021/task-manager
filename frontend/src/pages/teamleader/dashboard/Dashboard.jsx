import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/teamleaderProjects");
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) return <div>Loading dashboard...</div>;

  const { total, statusCounts, priorityCounts } = dashboardData;

  const pieData = {
    labels: ["Total", "Ongoing", "Completed"],
    datasets: [
      {
        data: [
          total || 0,
          statusCounts?.ongoing || 0,
          statusCounts?.completed || 0,
        ],
        backgroundColor: ["#4B9EFB", "#F59E0B", "#10B981"],
        hoverOffset: 4,
      },
    ],
  };

  const barData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Priority Distribution",
        data: [
          priorityCounts?.low || 0,
          priorityCounts?.medium || 0,
          priorityCounts?.high || 0,
        ],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
        barThickness: 40,
      },
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
  };

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-heading">Team Leader Dashboard</h2>

      <div className="dashboard-charts">
        <div className="dashboard-chart-tile dashboard-pie-tile">
          <h3 className="dashboard-chart-title">Project Overview</h3>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>

        <div className="dashboard-chart-tile dashboard-bar-tile">
          <h3 className="dashboard-chart-title">Project Priority</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
