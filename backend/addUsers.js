require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../backend/models/User");

const connectDB = async () => {
  await mongoose.connect(process.env.SRE_STRING);
  console.log("Connected to MongoDB");
};

const seedUsers = async () => {
  await connectDB();

  const users = [
    { username: "admin1", password: "admin123", role: "admin" },
    { username: "client1", password: "client123", role: "client" },
    { username: "leader1", password: "leader123", role: "team leader" },
    { username: "employee1", password: "employee123", role: "employee" }
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await User.create({
      username: user.username,
      password: hashedPassword,
      role: user.role
    });
    console.log(`Created user: ${user.username}`);
  }

  mongoose.connection.close();
};

seedUsers();
