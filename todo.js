// todo.js

document.addEventListener('DOMContentLoaded', function() {
    const todoBody = document.getElementById('todoBody');
    const taskInput = document.getElementById('todoTaskInput');
    const dueDateInput = document.getElementById('todoDueDateInput');
    const priorityInput = document.getElementById('todoPriorityInput');
    const statusInput = document.getElementById('todoStatusInput');
    const notesInput = document.getElementById('todoNotesInput');
    const addTodoButton = document.getElementById('addTodoButton');
    const saveTodoLocallyButton = document.getElementById('saveTodoLocallyButton');
    const downloadTodoCSVButton = document.getElementById('downloadTodoCSVButton');
    const activateTodoList = document.getElementById('activateTodoList');
    const todoListContainer = document.getElementById('todoListContainer');

    let todos = [];

    // Load todo list state
    activateTodoList.checked = localStorage.getItem('todoListActive') === 'true';
    todoListContainer.style.display = activateTodoList.checked ? 'block' : 'none';

    // Toggle todo list visibility
    activateTodoList.addEventListener('change', function() {
        todoListContainer.style.display = this.checked ? 'block' : 'none';
        localStorage.setItem('todoListActive', this.checked);
    });

    function loadTodos() {
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
            todos = JSON.parse(storedTodos);
            renderTodos();
        }
    }

    function addTodo() {
        const task = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;
        const status = statusInput.value;
        const notes = notesInput.value.trim();

        if (task) {
            todos.push({ task, dueDate, priority, status, notes });
            saveTodos();
            renderTodos();
            resetInputs();
        }
    }

    function resetInputs() {
        taskInput.value = '';
        dueDateInput.value = 'this week';
        priorityInput.value = '1';
        statusInput.value = 'in progress';
        notesInput.value = '';
    }

    function renderTodos() {
        todoBody.innerHTML = '';
        todos.forEach((todo, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${todo.task}</td>
                <td>${todo.dueDate}</td>
                <td>${todo.priority}</td>
                <td>${todo.status}</td>
                <td>${todo.notes}</td>
                <td>
                    <button onclick="editTodo(${index})">Edit</button>
                    <button onclick="deleteTodo(${index})">Delete</button>
                </td>
            `;
            todoBody.appendChild(row);
        });
    }

    function editTodo(index) {
        const todo = todos[index];
        taskInput.value = todo.task;
        dueDateInput.value = todo.dueDate;
        priorityInput.value = todo.priority;
        statusInput.value = todo.status;
        notesInput.value = todo.notes;
        
        todos.splice(index, 1);
        renderTodos();
        
        taskInput.focus();
    }

    function deleteTodo(index) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function saveLocally() {
        saveTodos();
        alert("Todos have been saved locally.");
    }

    function downloadCSV() {
        if (todos.length === 0) {
            alert("There are no todos to download. Please add some todos first.");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Task,Due Date,Priority,Status,Notes\n";
        todos.forEach(todo => {
            csvContent += `"${todo.task}","${todo.dueDate}","${todo.priority}","${todo.status}","${todo.notes}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "todo_list.csv");
        document.body.appendChild(link);

        try {
            link.click();
            alert("CSV file has been successfully downloaded!");
        } catch (error) {
            alert("An error occurred while downloading the CSV file. Please try again.");
            console.error("Error downloading CSV:", error);
        } finally {
            document.body.removeChild(link);
        }
    }

    addTodoButton.addEventListener('click', addTodo);
    saveTodoLocallyButton.addEventListener('click', saveLocally);
    downloadTodoCSVButton.addEventListener('click', downloadCSV);

    // Make deleteTodo and editTodo functions globally accessible
    window.deleteTodo = deleteTodo;
    window.editTodo = editTodo;

    // Load and display existing todos when the page loads
    loadTodos();
});