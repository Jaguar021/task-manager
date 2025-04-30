require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const clientRoutes = require("./routes/clientRoutes");
const authRoutes = require('./routes/auth');
const fetchusers = require('./routes/fetchuser');
const projectRoutes = require('./routes/projectRoute');
const PORT = 5000;

//Middleware to parse json
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.SRE_STRING)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/", authRoutes);
app.use("/", fetchusers);
app.use("/api",projectRoutes);

app.use("/api/clients", clientRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
