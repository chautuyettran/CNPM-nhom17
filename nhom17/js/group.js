function checkAuth() {

    const role = localStorage.getItem("role");

    const user = localStorage.getItem("user");

    if (!role || !user) {

        alert("Bạn cần đăng nhập!");

        window.location.href = "login.html";

        return;
    }
}

checkAuth();

// Chạy hàm kiểm tra ngay khi load file
checkAuth();
function loadGroupTasks() {

    const tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];

    const taskList =
        document.getElementById("taskList");

    const groupTasks =
        tasks.filter(task =>
            task.type === "Nhóm"
        );

    groupTasks.forEach(task => {

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

loadGroupTasks();