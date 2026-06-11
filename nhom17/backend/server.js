require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
});

// Chạy server
const PORT = process.env.PORT || 5000;

const path = require("path");

app.use(express.static(path.join(__dirname, "../"), {
    index: false 
}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../welcome.html"));
});

app.use(
    "/auth",
    require("./routes/auth")
);

app.use(
    "/tasks",
    require("./routes/task")
);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
