const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

console.log("AUTH ROUTE LOADED");

/**
 * Đăng ký
 */
router.post("/register", async (req, res) => {

    console.log("REGISTER API CALLED");
    console.log(req.body);

    try {

        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin"
            });
        }

        const exist = await User.findOne({
            email
        });

        if (exist) {
            return res.status(400).json({
                message: "Email đã tồn tại"
            });
        }

        const hash = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name,
            email,
            password: hash,
            role: "member"
        });

        res.status(201).json({
            message: "Đăng ký thành công",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }

});

/**
 * Đăng nhập
 */
router.post("/login", async (req, res) => {

    console.log("LOGIN API CALLED");
    console.log(req.body);

    try {

        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(400).json({
                message: "Sai email"
            });
        }

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {
            return res.status(400).json({
                message: "Sai mật khẩu"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }

});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // --- KIỂM TRA ADMIN CỨNG ---
    if (email === "admin" && password === "admin") {
        return res.status(200).json({
            token: "admin-jwt-token-hardcoded", // Tạo 1 token giả định cho admin
            user: { name: "Administrator", email: "admin", role: "admin" }
        });
    }

    // --- XỬ LÝ ĐĂNG NHẬP NGƯỜI DÙNG THƯỜNG ---
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại" });
    
    // ... kiểm tra mật khẩu user thường ở đây ...
});

module.exports = router;