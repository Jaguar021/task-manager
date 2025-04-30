import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './Dashboard.css';

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [statusSummary, setStatusSummary] = useState({
    labels: [],
    datasets: []
  });
  
  const [prioritySummary, setPrioritySummary] = useState({
    labels: [],
    datasets: []
  });
  
  
  useEffect(() => {
    const fetchProjectSummary = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const userId = userData?.userId;

        if (!userId) {
          console.error('User ID not found in localStorage');
          return;
        }

        console.log(userId);
        const response = await fetch(`http://localhost:5000/api/projects/summary?userId=${userId}`);
        const data = await response.json();

        if (response.ok) {
          // Prepare the data for the pie chart (status summary)
          const statusData = {
            labels: ['Pending', 'Ongoing', 'Completed'],
            datasets: [{
              data: [0, 0, 0],  // Default data to prevent errors in case some statuses are missing
              backgroundColor: ['#F59E0B', '#3B82F6', '#10B981'],
              hoverOffset: 4
            }]
          };

          data.statusSummary.forEach(item => {
            if (item.status === 'Pending') statusData.datasets[0].data[0] = item.count;
            if (item.status === 'Ongoing') statusData.datasets[0].data[1] = item.count;
            if (item.status === 'Completed') statusData.datasets[0].data[2] = item.count;
          });

          setStatusSummary(statusData);

          // Prepare the data for the bar chart (priority summary)
          const priorityData = {
            labels: ['Low', 'Medium', 'High'],
            datasets: [
              {
                label: 'Low Priority',
                data: [0, 0, 0],
                backgroundColor: '#10B981',
              },
              {
                label: 'Medium Priority',
                data: [0, 0, 0],
                backgroundColor: '#F59E0B',
              },
              {
                label: 'High Priority',
                data: [0, 0, 0],
                backgroundColor: '#EF4444',
              },
            ]
          };

          data.prioritySummary.forEach(item => {
            if (item.priority === 'Low') priorityData.datasets[0].data[0] = item.count;
            if (item.priority === 'Medium') priorityData.datasets[1].data[1] = item.count;
            if (item.priority === 'High') priorityData.datasets[2].data[2] = item.count;
          });

          setPrioritySummary(priorityData);

        } else {
          console.error('Failed to fetch project summary data');
        }
      } catch (error) {
        console.error('Error fetching project summary:', error);
      }
    };

    fetchProjectSummary();
  }, []);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
        barThickness: 40
      },
      y: {
        beginAtZero: true,
        stacked: true
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="page-heading">Dashboard</h2>

      <div className="charts-container">
        {/* Pie Chart Tile */}
        <div className="chart-tile pie-tile">
          <h3 className="chart-title">Task Status</h3>
          <Pie data={statusSummary} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        {/* Bar Chart Tile */}
        <div className="chart-tile bar-tile">
          <h3 className="chart-title">Task Priority</h3>
          <Bar data={prioritySummary} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
