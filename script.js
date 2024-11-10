function showScreen(screen) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
    
    document.querySelector(`.${screen}`).style.display = 'block';
}

function addHabit() {
    const habitName = prompt("Enter the name of the new habit:");
    if (habitName) {
        const toDoList = document.getElementById("to-do-list");

        // Cria um novo elemento de tarefa
        const task = document.createElement("div");
        task.className = "task todo";

        // Texto do nome do hábito
        const taskName = document.createElement("span");
        taskName.textContent = habitName;

        // Botão para marcar como completo
        const completeButton = document.createElement("button");
        completeButton.className = "complete";
        completeButton.textContent = "✔️";
        completeButton.onclick = () => markAsDone(task);

        // Adiciona o nome e o botão ao elemento da tarefa
        task.appendChild(taskName);
        task.appendChild(completeButton);

        // Adiciona a nova tarefa à lista To Do
        toDoList.appendChild(task);
    }
}

function markAsDone(task) {
    // Muda a cor e o estilo para Done
    task.classList.remove("todo");
    task.classList.add("done");

    // Remove o botão de completar
    const completeButton = task.querySelector("button");
    completeButton.remove();

    // Adiciona o botão de reversão
    const revertButton = document.createElement("button");
    revertButton.className = "revert";
    revertButton.textContent = "↩️";
    revertButton.onclick = () => revertToToDo(task);

    // Adiciona o botão de reversão à tarefa
    task.appendChild(revertButton);

    // Move a tarefa para a lista Done
    const doneList = document.getElementById("done-list");
    doneList.appendChild(task);
}

function revertToToDo(task) {
    // Muda a cor e o estilo para To Do
    task.classList.remove("done");
    task.classList.add("todo");

    // Remove o botão de reversão
    const revertButton = task.querySelector("button");
    revertButton.remove();

    // Adiciona novamente o botão de completar
    const completeButton = document.createElement("button");
    completeButton.className = "complete";
    completeButton.textContent = "✔️";
    completeButton.onclick = () => markAsDone(task);

    // Adiciona o botão de completar à tarefa
    task.appendChild(completeButton);

    // Move a tarefa de volta para a lista To Do
    const toDoList = document.getElementById("to-do-list");
    toDoList.appendChild(task);
}

// Função para exibir a data atual
function displayCurrentDate() {
    const dateElement = document.getElementById("current-date");
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", displayCurrentDate);
