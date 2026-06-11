let editIndex = -1;

function loadPersonalTasks() {

    const tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    const taskList =
        document.getElementById("taskList");

    taskList.innerHTML = "";

    const personalTasks =
        tasks.filter(task =>
            task.type === "Cá nhân"
        );

    personalTasks.forEach((task, index) => {

        taskList.innerHTML += `
        <div class="task">

            <h4>${task.title}</h4>

            <p>${task.description}</p>

            <div class="task-type">
                ${task.status.toUpperCase()}
            </div>

            <div class="task-footer">

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
    });
}

function openModal() {

    document.getElementById("taskModal")
        .style.display = "flex";
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
        document.getElementById("title").value;

    const description =
        document.getElementById("description").value;

    const tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    if (editIndex >= 0) {

        const personalIndexes =
            tasks
                .map((t, i) =>
                    t.type === "Cá nhân"
                        ? i
                        : -1
                )
                .filter(i => i !== -1);

        tasks[
            personalIndexes[editIndex]
        ].title = title;

        tasks[
            personalIndexes[editIndex]
        ].description = description;

    } else {

        tasks.push({
            title,
            description,
            type: "Cá nhân",
            status: "todo"
        });
    }

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    closeModal();

    loadPersonalTasks();
}

function editTask(index) {

    const tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    const personalTasks =
        tasks.filter(task =>
            task.type === "Cá nhân"
        );

    document.getElementById("title").value =
        personalTasks[index].title;

    document.getElementById("description").value =
        personalTasks[index].description;

    editIndex = index;

    openModal();
}

function deleteTask(index) {

    const tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    const personalIndexes =
        tasks
            .map((t, i) =>
                t.type === "Cá nhân"
                    ? i
                    : -1
            )
            .filter(i => i !== -1);

    tasks.splice(
        personalIndexes[index],
        1
    );

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    loadPersonalTasks();
}

loadPersonalTasks();