// Đặt đoạn này ở đầu file js (ví dụ: index.js, group.js)
function checkAuth() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    // 1. Nếu chưa đăng nhập -> Đẩy về trang Login
    if (!token) {
        alert("Bạn cần đăng nhập để truy cập trang này!");
        window.location.href = "login.html";
        return;
    }

    // 2. (Tuỳ chọn) Phân quyền chuyên sâu: Nếu là trang group.html mà role chỉ là 'user' (không có quyền xem nhóm)
    const currentPage = window.location.pathname;
    if (currentPage.includes("group.html") && role !== "admin" && role !== "manager") {
        alert("Bạn không có quyền truy cập trang Quản lý Nhóm!");
        window.location.href = "index.html";
    }
}

// Chạy hàm kiểm tra ngay khi load file
checkAuth();
function loadPersonalTasks() {

    const tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];

    const taskList =
        document.getElementById("taskList");

    const personalTasks =
        tasks.filter(task =>
            task.type === "Cá nhân"
        );

    personalTasks.forEach(task => {

        taskList.innerHTML += `

            <div class="task">

                <h3>${task.title}</h3>

                <p>${task.description}</p>

                <small>

                    ${task.status.toUpperCase()}

                </small>

            </div>
        `;
    });
}

function goBack() {

    window.location.href = "index.html";
}

loadPersonalTasks();