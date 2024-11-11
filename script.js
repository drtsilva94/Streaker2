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
    } else if (screen === 'today-screen') {
        updateHomeScreen();
    }
}

function addHabit() {
    const habitName = prompt("Enter the name of the new habit:");
    if (habitName) {
        checkinData[habitName] = checkinData[habitName] || [];

        renderHabit(habitName, false); // Renderiza o hábito como "não feito" inicialmente
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

    if (!checkinData[habitName].some(date => 
        date.day === checkinDate.day && 
        date.month === checkinDate.month && 
        date.year === checkinDate.year)) {
        checkinData[habitName].push(checkinDate);
        generateCalendar();
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

    const today = new Date();
    checkinData[habitName] = checkinData[habitName].filter(date =>
        !(date.day === today.getDate() && date.month === today.getMonth() && date.year === today.getFullYear())
    );
}

function openProgress(habitName) {
    currentHabitName = habitName;
    showScreen('progress-screen');
}

function editHabitName() {
    const newHabitName = prompt("Enter the new name for the habit:", currentHabitName);
    if (newHabitName && newHabitName !== currentHabitName) {
        if (!checkinData[newHabitName]) {
            checkinData[newHabitName] = checkinData[currentHabitName];
            delete checkinData[currentHabitName];
            currentHabitName = newHabitName;
            document.getElementById('habit-name').textContent = currentHabitName;
            updateHomeScreen();
        } else {
            alert("A habit with this name already exists. Please choose a different name.");
        }
    }
}

function displayCurrentDate() {
    const dateElement = document.getElementById("current-date");
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    generateCalendar();
}

function generateCalendar() {
    const monthLabel = document.getElementById("month-label");
    const calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = '';

    const options = { year: 'numeric', month: 'long' };
    monthLabel.textContent = currentDate.toLocaleDateString('en-US', options);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const checkinDays = checkinData[currentHabitName]?.filter(date =>
        date.month === month && date.year === year
    ).map(date => date.day) || [];

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("span");
        dayElement.textContent = day;

        if (checkinDays.includes(day)) {
            dayElement.classList.add("checkin-day");
        }

        calendarGrid.appendChild(dayElement);
    }
}

// Função para renderizar um hábito com base no estado de check-in
function renderHabit(habitName, isDone) {
    const task = document.createElement("div");
    task.className = isDone ? "task done" : "task todo";
    task.onclick = () => openProgress(habitName);

    const taskName = document.createElement("span");
    taskName.textContent = habitName;

    if (isDone) {
        const revertButton = document.createElement("button");
        revertButton.className = "revert";
        revertButton.textContent = "↩️";
        revertButton.onclick = (e) => {
            e.stopPropagation();
            revertToToDo(task, habitName);
        };
        task.appendChild(taskName);
        task.appendChild(revertButton);
        document.getElementById("done-list").appendChild(task);
    } else {
        const completeButton = document.createElement("button");
        completeButton.className = "complete";
        completeButton.textContent = "✔️";
        completeButton.onclick = (e) => {
            e.stopPropagation();
            markAsDone(task, habitName);
        };
        task.appendChild(taskName);
        task.appendChild(completeButton);
        document.getElementById("to-do-list").appendChild(task);
    }
}

// Função para atualizar a tela inicial com o estado atual de cada hábito
function updateHomeScreen() {
    const toDoList = document.getElementById("to-do-list");
    const doneList = document.getElementById("done-list");
    toDoList.innerHTML = ''; // Limpa a lista para reexibir os itens
    doneList.innerHTML = ''; // Limpa a lista para reexibir os itens

    Object.keys(checkinData).forEach(habitName => {
        const today = new Date();
        const hasCheckinToday = checkinData[habitName].some(date =>
            date.day === today.getDate() && 
            date.month === today.getMonth() && 
            date.year === today.getFullYear()
        );

        renderHabit(habitName, hasCheckinToday); // Renderiza com base no estado de check-in de hoje
    });
}

document.addEventListener("DOMContentLoaded", displayCurrentDate);
