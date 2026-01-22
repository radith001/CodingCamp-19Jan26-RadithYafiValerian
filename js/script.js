document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const errorMsg = document.getElementById('error-message');
    const todoTbody = document.getElementById('todo-tbody');
    const filterSelect = document.getElementById('filter-select');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const emptyState = document.getElementById('empty-state');

    // --- NEW: DATE RESTRICTION LOGIC ---
    // Sets the minimum selectable date to "Today"
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    // -----------------------------------

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const saveToLocalStorage = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const renderTodos = (filter = 'all') => {
        todoTbody.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (filter === 'completed') return todo.completed;
            if (filter === 'pending') return !todo.completed;
            return true;
        });

        if (filteredTodos.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            filteredTodos.forEach((todo) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="${todo.completed ? 'task-completed' : ''}">${todo.task}</td>
                    <td>${todo.date}</td>
                    <td>
                        <span class="status-badge ${todo.completed ? 'status-completed' : 'status-pending'}">
                            ${todo.completed ? 'Completed' : 'Pending'}
                        </span>
                    </td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn btn-check" onclick="toggleTodo(${todo.id})">
                                <i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i>
                            </button>
                            <button class="action-btn btn-delete" onclick="deleteTodo(${todo.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                todoTbody.appendChild(tr);
            });
        }
    };

    // Add Todo
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const taskValue = taskInput.value.trim();
        const dateValue = dateInput.value;

        // Validation: Check empty fields OR if date is in the past
        if (taskValue === '' || dateValue === '') {
            errorMsg.textContent = "Please fill in both fields.";
            errorMsg.style.display = 'block';
            return;
        }

        if (dateValue < today) {
            errorMsg.textContent = "You cannot select a date in the past.";
            errorMsg.style.display = 'block';
            return;
        }

        errorMsg.style.display = 'none';

        const newTodo = {
            id: Date.now(),
            task: taskValue,
            date: dateValue,
            completed: false
        };

        todos.push(newTodo);
        saveToLocalStorage();
        renderTodos(filterSelect.value);
        
        todoForm.reset();
    });

    window.toggleTodo = (id) => {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveToLocalStorage();
        renderTodos(filterSelect.value);
    };

    window.deleteTodo = (id) => {
        todos = todos.filter(todo => todo.id !== id);
        saveToLocalStorage();
        renderTodos(filterSelect.value);
    };

    deleteAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all tasks?')) {
            todos = [];
            saveToLocalStorage();
            renderTodos();
        }
    });

    filterSelect.addEventListener('change', (e) => {
        renderTodos(e.target.value);
    });

    renderTodos();
});