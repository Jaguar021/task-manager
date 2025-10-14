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
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/adminProjects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const total = projects.length;
  const accepted = projects.filter(p => p.status === "Ongoing" || p.status === "Completed").length;
  const pending = projects.filter(p => p.status === "Pending").length;

  const assigned = projects.filter(p => p.user).length;
  const unassigned = accepted - assigned;

  const low = projects.filter(p => p.priority === "Low").length;
  const medium = projects.filter(p => p.priority === "Medium").length;
  const high = projects.filter(p => p.priority === "High").length;

  const pieData1 = {
    labels: ["Total Projects", "Accepted", "Pending"],
    datasets: [
      {
        data: [total, accepted, pending],
        backgroundColor: ["#4B9EFB", "#10B981", "#F59E0B"],
        hoverOffset: 4,
      },
    ],
  };

  const pieData2 = {
    labels: ["Accepted Projects", "Assigned", "Unassigned"],
    datasets: [
      {
        data: [accepted, assigned, unassigned],
        backgroundColor: ["#10B981", "#3B82F6", "#EF4444"],
        hoverOffset: 4,
      },
    ],
  };

  const barData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Priority Distribution",
        data: [low, medium, high],
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
      <h2 className="dashboard-heading">Dashboard</h2>

      <div className="dashboard-charts">
        <div className="dashboard-chart-tile dashboard-pie-tile">
          <h3 className="dashboard-chart-title">Project Overview</h3>
          <Pie data={pieData1} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>

        <div className="dashboard-chart-tile dashboard-pie-tile">
          <h3 className="dashboard-chart-title">Project Assignment</h3>
          <Pie data={pieData2} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
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
