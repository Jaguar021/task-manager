import React, { useEffect, useState } from 'react';
import './Task.css';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/employee/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await fetch(`/api/employee/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading) return <div className="task-loading">Loading tasks...</div>;

  return (
    <div className="task-wrapper">
      <h2 className="task-title">Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks assigned.</p>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <div key={task._id} className="task-card">
              <div className="task-details">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
              </div>
              <div className="task-status">
                <label htmlFor={`status-${task._id}`}>Status:</label>
                <select
                  id={`status-${task._id}`}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Task;
