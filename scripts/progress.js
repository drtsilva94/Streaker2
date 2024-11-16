function generateCalendar() {
    const monthLabel = document.getElementById("month-label");
    const calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = ''; // Limpa o grid do calendário

    const options = { year: 'numeric', month: 'long' };
    monthLabel.textContent = currentDate.toLocaleDateString('en-US', options); // Exibe o mês e ano atual

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Adiciona as iniciais dos dias da semana
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement("span");
        dayElement.textContent = day;
        dayElement.style.fontWeight = "bold";
        calendarGrid.appendChild(dayElement);
    });

    // Calcula o primeiro e último dia do mês
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Dia da semana do primeiro dia do mês
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total de dias no mês

    // Obtém os dias de check-in para o hábito atual no mês e ano atuais
    const checkinDays = checkinData[currentHabitName]?.filter(date =>
        date.month === month && date.year === year
    ).map(date => date.day) || [];

    // Preenche os dias em branco antes do início do mês
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyElement = document.createElement("span");
        calendarGrid.appendChild(emptyElement);
    }

    // Preenche os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("span");
        dayElement.textContent = day;
        dayElement.classList.add("calendar-day");

        // Destaca o dia atual
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayElement.classList.add("active-day");
        }

        // Destaca os dias com check-in
        if (checkinDays.includes(day)) {
            dayElement.classList.add("checkin-day");
        }

        calendarGrid.appendChild(dayElement);
    }
}


// Função para editar o nome de um hábito
function editHabitName() {
    const newHabitName = prompt("Enter the new name for the habit:", currentHabitName);
    if (newHabitName && newHabitName !== currentHabitName) {
        if (!checkinData[newHabitName]) {
            checkinData[newHabitName] = checkinData[currentHabitName]; // Renomeia o hábito transferindo seus dados
            delete checkinData[currentHabitName]; // Remove o hábito antigo
            currentHabitName = newHabitName;
            document.getElementById('habit-name').textContent = currentHabitName;
            updateHomeScreen(); // Atualiza a tela inicial
        } else {
            alert("A habit with this name already exists. Please choose a different name.");
        }
    }
}

// Função para renderizar um hábito com base no estado de check-in
function renderHabit(habitName, isDone) {
    const task = document.createElement("div");
    task.className = isDone ? "task done" : "task todo"; // Define o estado da tarefa
    task.onclick = () => openProgress(habitName); // Abre o progresso do hábito ao clicar

    const taskName = document.createElement("span");
    taskName.textContent = habitName;

    if (isDone) {
        const revertButton = document.createElement("button");
        revertButton.className = "revert";
        revertButton.textContent = "↩️";
        revertButton.onclick = (e) => {
            e.stopPropagation();
            revertToToDo(task, habitName); // Reverte o hábito para "To Do"
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
            markAsDone(task, habitName); // Marca o hábito como concluído
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

// Atualiza a exibição da data atual ao carregar o conteúdo da página
document.addEventListener("DOMContentLoaded", displayCurrentDate);

// Função para excluir o hábito atual
function deleteHabit() {
    // Solicita confirmação do usuário antes de excluir
    if (confirm("Are you sure you want to delete this habit?")) {
        // Encontra o elemento da streak atual pelo ID ou classe do elemento
        const habitElement = document.querySelector('.screen.progress-screen');

        // Remove o elemento da página
        if (habitElement) {
            habitElement.style.display = 'none'; // Ou habitElement.remove() para remover totalmente
            alert("Habit deleted successfully!");
        } else {
            alert("No habit found to delete.");
        }
    }
}