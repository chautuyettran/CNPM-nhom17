const mongoose = require("mongoose");

const connectDB = async () => {
    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("✅ MongoDB Connected");

    } catch (error) {

        console.log(
            "❌ MongoDB Error:",
            error.message
        );

        process.exit(1);
    }
};

const mysql = require('mysql2');

// Cấu hình kết nối sử dụng các biến môi trường
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost', // 'db' nếu chạy trong Docker
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'task_management'
});

connection.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối database: ' + err.stack);
    return;
  }
  console.log('Đã kết nối thành công tới Database với ID: ' + connection.threadId);
});

module.exports = connection;

module.exports = connectDB;