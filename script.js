let currentHabitName = '';
let checkinData = {}; // Objeto para armazenar dias de check-in específicos (ano, mês, dia) para cada hábito
let currentDate = new Date(); // Data atual para controle do mês e ano

function showScreen(screen) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
    
    document.querySelector(`.${screen}`).style.display = 'block';

    if (screen === 'progress-screen') {
        document.getElementById('habit-name').textContent = currentHabitName;
        generateCalendar();
    }
}

function addHabit() {
    const habitName = prompt("Enter the name of the new habit:");
    if (habitName) {
        // Inicializa o array de check-ins para o novo hábito
        checkinData[habitName] = checkinData[habitName] || [];

        const toDoList = document.getElementById("to-do-list");

        const task = document.createElement("div");
        task.className = "task todo";
        task.onclick = () => openProgress(habitName);

        const taskName = document.createElement("span");
        taskName.textContent = habitName;

        const completeButton = document.createElement("button");
        completeButton.className = "complete";
        completeButton.textContent = "✔️";
        completeButton.onclick = (e) => {
            e.stopPropagation();
            markAsDone(task, habitName);
        };

        task.appendChild(taskName);
        task.appendChild(completeButton);

        toDoList.appendChild(task);
    }
}

function markAsDone(task, habitName) {
    task.classList.remove("todo");
    task.classList.add("done");

    const completeButton = task.querySelector("button");
    completeButton.remove();

    const revertButton = document.createElement("button");
    revertButton.className = "revert";
    revertButton.textContent = "↩️";
    revertButton.onclick = (e) => {
        e.stopPropagation();
        revertToToDo(task, habitName);
    };

    task.appendChild(revertButton);
    document.getElementById("done-list").appendChild(task);

    const today = new Date();
    const checkinDate = { 
        day: today.getDate(), 
        month: today.getMonth(), 
        year: today.getFullYear() 
    };

    // Adiciona o check-in específico para o hábito atual, se ainda não existir
    if (!checkinData[habitName].some(date => 
        date.day === checkinDate.day && 
        date.month === checkinDate.month && 
        date.year === checkinDate.year)) {
        checkinData[habitName].push(checkinDate);
        generateCalendar(); // Atualiza o calendário
    }
}

function revertToToDo(task, habitName) {
    task.classList.remove("done");
    task.classList.add("todo");

    const revertButton = task.querySelector("button");
    revertButton.remove();

    const completeButton = document.createElement("button");
    completeButton.className = "complete";
    completeButton.textContent = "✔️";
    completeButton.onclick = (e) => {
        e.stopPropagation();
        markAsDone(task, habitName);
    };

    task.appendChild(completeButton);
    document.getElementById("to-do-list").appendChild(task);
}

function openProgress(habitName) {
    currentHabitName = habitName;
    showScreen('progress-screen');
}

function displayCurrentDate() {
    const dateElement = document.getElementById("current-date");
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// Função para mudar o mês
function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset); // Altera o mês conforme o offset
    generateCalendar(); // Atualiza o calendário
}

// Função para gerar o calendário e marcar os dias de check-in
function generateCalendar() {
    const monthLabel = document.getElementById("month-label");
    const calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = ''; // Limpa o calendário anterior

    // Atualiza o rótulo do mês
    const options = { year: 'numeric', month: 'long' };
    monthLabel.textContent = currentDate.toLocaleDateString('en-US', options);

    // Obtém o primeiro dia e o último dia do mês
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Obtém os dias de check-in específicos para o hábito atual no mês e ano exibidos
    const checkinDays = checkinData[currentHabitName]?.filter(date =>
        date.month === month && date.year === year
    ).map(date => date.day) || [];

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("span");
        dayElement.textContent = day;

        // Adiciona a classe de check-in somente se o dia estiver no array de check-in do hábito atual
        if (checkinDays.includes(day)) {
            dayElement.classList.add("checkin-day");
        }

        calendarGrid.appendChild(dayElement);
    }
}

function editHabitName() {
    const newHabitName = prompt("Enter the new name for the habit:", currentHabitName);
    if (newHabitName) {
        checkinData[newHabitName] = checkinData[currentHabitName];
        delete checkinData[currentHabitName];
        currentHabitName = newHabitName;
        document.getElementById('habit-name').textContent = currentHabitName;
    }
}

document.addEventListener("DOMContentLoaded", displayCurrentDate);
