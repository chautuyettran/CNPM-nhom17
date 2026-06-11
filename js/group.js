let editIndex = -1;

function loadGroupTasks() {

    const tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    document.getElementById("todo").innerHTML = "";
    document.getElementById("doing").innerHTML = "";
    document.getElementById("done").innerHTML = "";

    const groupTasks =
        tasks.filter(task =>
            task.type === "Nhóm"
        );

    groupTasks.forEach((task, index) => {

        let actionButtons = "";

        if (task.status === "todo") {

            actionButtons = `
                <button onclick="moveTask(${index}, 'doing')">
                    ➜ Đang làm
                </button>
            `;

        } else if (task.status === "doing") {

            actionButtons = `
                <button onclick="moveTask(${index}, 'todo')">
                    
                </button>

                <button onclick="moveTask(${index}, 'done')">
                    
                </button>
            `;

        } else {

            actionButtons = `
                <button onclick="moveTask(${index}, 'doing')">
                    
                </button>
            `;
        }

        const card = `
            <div class="task">

                <h4>${task.title}</h4>

                <p>${task.description}</p>

                <div class="task-footer">

                    ${actionButtons}

                    <button class="submit-btn"
                        onclick="editTask(${index})">
                        Sửa
                    </button>

                    <button class="delete-btn"
                        onclick="deleteTask(${index})">
                        Xóa
                    </button>

                </div>

            </div>
        `;

        document
            .getElementById(task.status)
            .innerHTML += card;
    });

    updateCounts();
}

function updateCounts() {

    document.getElementById("todo-count")
        .textContent =
        document.getElementById("todo").children.length;

    document.getElementById("doing-count")
        .textContent =
        document.getElementById("doing").children.length;

    document.getElementById("done-count")
        .textContent =
        document.getElementById("done").children.length;
}

function openModal(status) {

    document.getElementById("taskModal")
        .style.display = "flex";

    document.getElementById("status").value =
        status;
}

function closeModal() {

    document.getElementById("taskModal")
        .style.display = "none";

    document.getElementById("title").value = "";

    document.getElementById("description").value = "";

    editIndex = -1;
}

function saveTask() {

    const title =
        document.getElementById("title").value.trim();

    const description =
        document.getElementById("description").value.trim();

    const status =
        document.getElementById("status").value;

    if (!title) {

        alert("Vui lòng nhập tiêu đề!");

        return;
    }

    const tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    if (editIndex >= 0) {

        const groupIndexes =
            tasks
                .map((task, index) =>
                    task.type === "Nhóm"
                        ? index
                        : -1
                )
                .filter(index => index !== -1);

        tasks[
            groupIndexes[editIndex]
        ].title = title;

        tasks[
            groupIndexes[editIndex]
        ].description = description;

    } else {

        tasks.push({
            title,
            description,
            type: "Nhóm",
            status
        });
    }

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    closeModal();

    loadGroupTasks();
}

function editTask(index) {

    const tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    const groupTasks =
        tasks.filter(task =>
            task.type === "Nhóm"
        );

    document.getElementById("title").value =
        groupTasks[index].title;

    document.getElementById("description").value =
        groupTasks[index].description;

    document.getElementById("status").value =
        groupTasks[index].status;

    editIndex = index;

    document.getElementById("taskModal")
        .style.display = "flex";
}

function deleteTask(index) {

    if (!confirm("Bạn có chắc muốn xóa?")) {
        return;
    }

    const tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    const groupIndexes =
        tasks
            .map((task, index) =>
                task.type === "Nhóm"
                    ? index
                    : -1
            )
            .filter(index => index !== -1);

    tasks.splice(
        groupIndexes[index],
        1
    );

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    loadGroupTasks();
}

function moveTask(index, newStatus) {

    const tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    const groupIndexes =
        tasks
            .map((task, index) =>
                task.type === "Nhóm"
                    ? index
                    : -1
            )
            .filter(index => index !== -1);

    tasks[
        groupIndexes[index]
    ].status = newStatus;

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    loadGroupTasks();
}

window.onclick = function (event) {

    const modal =
        document.getElementById("taskModal");

    if (event.target === modal) {

        closeModal();
    }
};

loadGroupTasks();