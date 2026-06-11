const express = require("express");

const Task = require("../models/Task");

const auth = require("../middleware/auth");

const role = require("../middleware/role");

const router = express.Router();



/*
    Tạo công việc
    Admin + Leader
*/
router.post(
    "/",
    auth,
    role("admin", "leader"),
    async (req, res) => {

        try {

            const {
                title,
                description,
                assignedTo,
                priority,
                deadline
            } = req.body;

            const task = await Task.create({

                title,
                description,

                assignedTo,

                priority,

                deadline,

                createdBy:
                    req.user.id

            });

            res.status(201).json({
                message:
                    "Tạo công việc thành công",
                task
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Lỗi server"
            });

        }

    }
);



/*
    Xem tất cả công việc
*/
router.get(
    "/",
    auth,
    async (req, res) => {

        try {

            let tasks;

            if (
                req.user.role === "admin" ||
                req.user.role === "leader"
            ) {

                tasks =
                    await Task.find()
                    .populate(
                        "assignedTo",
                        "name email role"
                    )
                    .populate(
                        "createdBy",
                        "name email"
                    );

            } else {

                tasks =
                    await Task.find({
                        assignedTo:
                            req.user.id
                    })
                    .populate(
                        "assignedTo",
                        "name email role"
                    )
                    .populate(
                        "createdBy",
                        "name email"
                    );

            }

            res.json(tasks);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Lỗi server"
            });

        }

    }
);



/*
    Xem chi tiết công việc
*/
router.get(
    "/:id",
    auth,
    async (req, res) => {

        try {

            const task =
                await Task.findById(
                    req.params.id
                );

            if (!task) {

                return res.status(404)
                .json({
                    message:
                    "Không tìm thấy công việc"
                });

            }

            res.json(task);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Lỗi server"
            });

        }

    }
);



/*
    Cập nhật trạng thái
*/
router.put(
    "/:id/status",
    auth,
    async (req, res) => {

        try {

            const {
                status
            } = req.body;

            const task =
                await Task.findById(
                    req.params.id
                );

            if (!task) {

                return res.status(404)
                .json({
                    message:
                    "Không tìm thấy công việc"
                });

            }

            task.status = status;

            await task.save();

            res.json({
                message:
                    "Cập nhật thành công",
                task
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Lỗi server"
            });

        }

    }
);



/*
    Sửa công việc
    Admin + Leader
*/
router.put(
    "/:id",
    auth,
    role("admin", "leader"),
    async (req, res) => {

        try {

            const task =
                await Task.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        new: true
                    }
                );

            res.json({
                message:
                    "Cập nhật thành công",
                task
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Lỗi server"
            });

        }

    }
);



/*
    Xóa công việc
    Admin + Leader
*/
router.delete(
    "/:id",
    auth,
    role("admin", "leader"),
    async (req, res) => {

        try {

            await Task.findByIdAndDelete(
                req.params.id
            );

            res.json({
                message:
                    "Xóa công việc thành công"
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Lỗi server"
            });

        }

    }
);



module.exports = router;