const form = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo")
const todoList = document.querySelector(".list-group")
const firstCardBody = document.querySelectorAll(".card-body")[0]
const secondCardBody = document.querySelectorAll(".card-body")[1]
const filter = document.querySelector("#filter")
const clearButton = document.querySelector("#clear-todos")

eventListeners();

function eventListeners() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

//all todos clear
function clearAllTodos(e) {
    if (confirm("Are you sure you want all task removed?")) {
        todoList.innerHTML = ""; // daha yavaş çalışan bir yöntem localden silmez

        while (todoList.firstElementChild != null) { //inner html den daha hızlı bir yöntem local den silmez
            todoList.removeChild(todoList.firstChild);
        }
        localStorage.clear();// başka bir yöntem
    }

}


//search todo
function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            //bulamayınca
            listItem.setAttribute("style", "display: none !important");
        }
        else {
            listItem.setAttribute("style", "display: block !important");
        }
    })

}
//delete todo
function deleteTodo(e) {
    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success", "Todo removed.");
    }
}

function deleteTodoFromStorage(deletetodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo, index) {
        if (todo === deletetodo) {
            todos.splice(index, 1); // var ise sildirdik
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo) {
        addTodoToUI(todo);
    })

}

function addTodo(e) {
    const newTodo = todoInput.value.trim();
    const todos = getTodosFromStorage();

    if (newTodo === "") {
        showAlert("danger", "Please enter a todo.");
    }
    else if (todos.indexOf(newTodo) != -1) {
        showAlert("warning", "Todo already added.");
    }
    else {
        addTodoToUI(newTodo); //arayüze ekle
        addTodoToStorage(newTodo);
        showAlert("success", "Todo added.");
    }

    e.preventDefault();
}

function getTodosFromStorage() { // todos keyi varmı yokmu yoksa oluştur
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));

    }
    return todos;
}

function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();
    todos.push(newTodo)

    localStorage.setItem("todos", JSON.stringify(todos));
}


function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert)

    //1 sn sonra silinsin
    setTimeout(function () {
        alert.remove();
    }, 1000)
}

function addTodoToUI(newTodo) { //aldığı değeri listeye ekleme
    const listItem = document.createElement("li");

    const link = document.createElement("a");
    link.href = "#"
    link.className = "delete-item"
    link.innerHTML = "<i style='float: right;' class = 'fa fa-remove'></i>"

    listItem.className = "list-group-item d-flex justify-content-between"

    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    todoList.appendChild(listItem);
    todoInput.value = "";
}