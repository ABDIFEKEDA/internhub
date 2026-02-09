require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/dbConnection.js");
const authRoutes = require("./routes/authRouter");
const applicationRoutes = require("./routes/application");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/applications", applicationRoutes);


app.use("/api/auth", authRoutes);

// Example protected route
const { protect, restrictTo } = require("./middleware/authmidlleware");
app.get("/api/protected", protect, restrictTo("admin"), (req, res) => {
  res.json({ message: `Hello ${req.user.email}, you are ${req.user.role}` });
});


app.use((req, res) => res.status(404).json({ message: "Endpoint not found" }));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
