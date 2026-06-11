/*// Đặt đoạn này ở đầu file js (ví dụ: index.js, group.js)
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
*/
// Chạy hàm kiểm tra ngay khi load file
checkAuth();
let draggedTask = null;

/* Open Modal */

function openModal(column) {

    document.getElementById("taskStatus").value =
        column;

    document.getElementById("taskModal")
        .style.display = "flex";
}

/* Close Modal */

function closeModal() {

    document.getElementById("taskModal")
        .style.display = "none";

    clearForm();
}

/* Clear Form */

function clearForm() {

    document.getElementById("taskTitle").value = "";

    document.getElementById("taskDescription").value = "";

    document.getElementById("taskType").value =
        "Cá nhân";

    document.getElementById("taskStatus").value =
        "todo";
}

/* Create Task */

function createTask() {

    const title =
        document.getElementById("taskTitle").value;

    const description =
        document.getElementById("taskDescription").value;

    const type =
        document.getElementById("taskType").value;

    const status =
        document.getElementById("taskStatus").value;

    if (title.trim() === "") {

        alert("Vui lòng nhập tiêu đề");

        return;
    }

    const task =
        document.createElement("div");

    task.dataset.type = type;

    task.className = "task";

    task.draggable = true;

    task.innerHTML = `

        <h4>${title}</h4>

        <p>${description}</p>

        <div class="task-type">

            ${type}

        </div>

        <div class="task-footer">

            <small>

                ${new Date().toLocaleDateString()}

            </small>

            <button class="delete-btn">

                Xóa

            </button>

        </div>
    `;

    /* Delete */

    task.querySelector(".delete-btn")
        .onclick = function () {

            task.remove();

            updateCount();

            saveAllTasks();
        };

    /* Drag */

    task.addEventListener("dragstart", () => {

        draggedTask = task;
    });

    task.addEventListener("dragend", () => {

        draggedTask = null;
    });

    document.getElementById(status)
        .appendChild(task);

    updateCount();

    saveAllTasks();

    closeModal();
}

/* Drag & Drop */

const lists =
    document.querySelectorAll(".task-list");

lists.forEach(list => {

    list.addEventListener("dragover", (e) => {

        e.preventDefault();
    });

    list.addEventListener("drop", () => {

        if (draggedTask) {

            list.appendChild(draggedTask);

            updateCount();

            saveAllTasks();
        }

    });

});

/* Count */

function updateCount() {

    document.getElementById("todo-count")
        .innerText =
        document.getElementById("todo")
            .children.length;

    document.getElementById("doing-count")
        .innerText =
        document.getElementById("doing")
            .children.length;

    document.getElementById("done-count")
        .innerText =
        document.getElementById("done")
            .children.length;
}

/* Save LocalStorage */

function saveData() {

    const data = {

        todo:
            document.getElementById("todo")
                .innerHTML,

        doing:
            document.getElementById("doing")
                .innerHTML,

        done:
            document.getElementById("done")
                .innerHTML
    };

    localStorage.setItem(
        "taskManagerData",
        JSON.stringify(data)
    );
}

function saveData() {

    const tasks = [];

    document.querySelectorAll(".task")
        .forEach(task => {

            tasks.push({

                title:
                    task.querySelector("h4").innerText,

                description:
                    task.querySelector("p").innerText,

                type:
                    task.dataset.type,

                status:
                    task.parentElement.id
            });
        });

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function saveAllTasks() {

    const tasks = [];

    document.querySelectorAll(".task")
        .forEach(task => {

            tasks.push({

                title:
                    task.querySelector("h4").innerText,

                description:
                    task.querySelector("p").innerText,

                type:
                    task.dataset.type,

                status:
                    task.parentElement.id
            });
        });

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

/* Load */

function loadData() {

    const tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];

    /* Xóa cũ */

    document.getElementById("todo")
        .innerHTML = "";

    document.getElementById("doing")
        .innerHTML = "";

    document.getElementById("done")
        .innerHTML = "";

    /* Render task */

    tasks.forEach(task => {

        const taskElement =
            document.createElement("div");

        taskElement.className = "task";

        taskElement.dataset.type = task.type;

        taskElement.draggable = true;

        taskElement.innerHTML = `

            <h4>${task.title}</h4>

            <p>${task.description}</p>

            <div class="task-type">

                ${task.type}

            </div>

            <div class="task-footer">

                <small>

                    ${task.status.toUpperCase()}

                </small>

                <button class="delete-btn">

                    Xóa

                </button>

            </div>
        `;

        /* Delete */

        taskElement.querySelector(".delete-btn")
            .onclick = function () {

                taskElement.remove();

                saveAllTasks();

                updateCount();
            };

        /* Drag */

        taskElement.addEventListener("dragstart", () => {

            draggedTask = taskElement;
        });

        taskElement.addEventListener("dragend", () => {

            draggedTask = null;
        });

        /* Add vào cột */

        document.getElementById(task.status)
            .appendChild(taskElement);
    });

    updateCount();
}
/* Reattach Events */

function reAttachEvents() {

    const tasks =
        document.querySelectorAll(".task");

    tasks.forEach(task => {

        task.draggable = true;

        task.addEventListener("dragstart", () => {

            draggedTask = task;
        });

        task.addEventListener("dragend", () => {

            draggedTask = null;
        });

        task.querySelector(".delete-btn")
            .onclick = function () {

                task.remove();

                updateCount();

                saveData();
            };

    });
}

/* Close when click outside */

window.onclick = function (e) {

    const modal =
        document.getElementById("taskModal");

    if (e.target == modal) {

        closeModal();
    }
};

/* Hiển thị user */

function loadCurrentUser() {

    const user =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

    if (user) {

        document.getElementById(
            "currentUserName"
        ).innerText = user.email;

        /* hoặc user.email */
    }
}

function loadCurrentUser() {

    const user =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

    if (user) {

        document.getElementById(
            "currentUserName"
        ).innerText = user.hoten;
    }

    /* Avatar */

    const avatar =
        localStorage.getItem("userAvatar");

    if (avatar) {

        document.getElementById(
            "navbarAvatar"
        ).src = avatar;
    }
}

loadCurrentUser();

loadData();

