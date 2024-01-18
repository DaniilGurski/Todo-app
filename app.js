const taskItemTemplate = document.querySelector(".task-item-template");
const taskListElem = document.querySelector(".task-list");
const taskAmount = document.getElementById("task-amount");

const addTaskBtn = document.getElementById("add-task-btn");
const removeCompleatedBtn = document.getElementById("remove-compleated");
const filterBtns = document.querySelectorAll(".filter-btn");


function getListData() {
    try {
        return JSON.parse(localStorage.getItem("task-list")) || [];
    } catch (error) {
        console.error("Failed to parse task data from Localstorage: ", error)
        return [];
    }
}


let taskListData = getListData();

// Used instead of just taskListData.length because it can lead to unexpected repeated id situation when deleating some of the tasks. 
let uniqueTaskId = JSON.parse(localStorage.getItem("total-tasks-created")) || 0;

console.log(uniqueTaskId);


function updateTaskAmount() {
    const taskItems = document.querySelectorAll(".task-item");
    taskAmount.textContent = taskItems.length;
}


function removeTaskFromStorage(taskId, taskObjectIndex) {
    taskListData = taskListData.filter((taskObject) => {
        for (let key in taskObject) {
            return taskObject[key].id !== taskId
        }
    })

    localStorage.setItem("task-list", JSON.stringify(taskListData));
    updateTaskAmount()
}


function removeAllCompleated() {
    const checkedTasks = taskListElem.querySelectorAll("input[type='checkbox']:checked")

    checkedTasks.forEach((checkbox) => {
        const taskItem = checkbox.closest(".task-item");
        const taskId = checkbox.id * 1;

        taskListElem.removeChild(taskItem);
        removeTaskFromStorage(taskId);
    })
}


function appendTask(taskObject, taskKey) {
    // HTML set up
    const taskItem = taskItemTemplate.content.cloneNode(true);
    const taskCheckbox = taskItem.querySelector("input[type='checkbox']");
    const taskLabel = taskItem.querySelector("label");
    const removeBtn = taskItem.querySelector("button");
    const uniqueId = taskObject[taskKey].id;

    taskCheckbox.setAttribute("id", uniqueId);
    taskLabel.setAttribute("for", uniqueId);
    taskLabel.textContent = taskKey; 
    taskCheckbox.checked = taskObject[taskKey].checked;
    taskListElem.appendChild(taskItem);


    // Actual task element inside list (taskItem is not directly added there)
    const actualTaskItem = document.getElementById(uniqueId).closest(".task-item");


    // Remove task both from HTML and storage if cross button is pressed. 
    removeBtn.addEventListener("click", () => {
        taskListElem.removeChild(actualTaskItem);
        removeTaskFromStorage(uniqueId, taskListData.indexOf(taskObject));
    });


    // Updating the local storage value based on checkbox state.
    taskCheckbox.addEventListener("change", () => {
        checkdState = actualTaskItem.querySelector("input[type='checkbox']:checked") ? true: false;

        taskObject[taskKey].checked = checkdState;
        removeBtn.classList.toggle("displayed");

        // Replacing taskObject with modifed one. 
        taskListData.splice(taskListData.indexOf(taskObject), 1, taskObject);
        localStorage.setItem("task-list", JSON.stringify(taskListData))
    })
        
    updateTaskAmount()
}


function createTask() {
    const inputValue = document.getElementById("task-input").value.trim();
    
    if (inputValue === "") {
        return
    }

    const newTask = {[inputValue]: {
        id: uniqueTaskId += 1,
        checked: false
    }}
    
    taskListData.push(newTask);
    localStorage.setItem("total-tasks-created", uniqueTaskId);
    localStorage.setItem("task-list", JSON.stringify(taskListData)) 

    appendTask(newTask, inputValue);
}


function appendTasksBasedOn(taskList) {
    taskList.forEach((taskObject) => {
        appendTask(taskObject, Object.keys(taskObject)[0]);
    });
}


function filterTasksByChecked(checkedState) {
    return taskListData.filter((taskObject) => {
        for (let key in taskObject) {
            return taskObject[key].checked === checkedState;
        }
    })
}


function filterTasks(button) {
    // Removing all tasks from DOM.
    while (taskListElem.firstChild) {  
        taskListElem.removeChild(taskListElem.firstChild);
    }

    // Filtered tasks
    const compleatedTasks = filterTasksByChecked(true);
    const activeTasks = filterTasksByChecked(false);

    const taskListMap = {
        "all": taskListData,
        "active": activeTasks,
        "completed": compleatedTasks,
    }

    appendTasksBasedOn(taskListMap[button.dataset.filter])
    updateTaskAmount();
}


// When page loads, append all existing tasks
appendTasksBasedOn(taskListData);

addTaskBtn.addEventListener("click", createTask);
removeCompleatedBtn.addEventListener("click", removeAllCompleated);

filterBtns.forEach((filterBtn) => {
    filterBtn.addEventListener("click", (event) => {
        const target = event.target;

        for (const btn of filterBtns) {
            btn.classList.toggle("button--selected", btn === target);
        }

        filterTasks(filterBtn);
    });
})