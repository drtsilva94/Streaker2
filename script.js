let currentHabitName = ''; // Armazena o nome do hábito atualmente em exibição
let checkinData = {}; // Objeto para armazenar dias de check-in específicos (ano, mês, dia) para cada hábito
let currentDate = new Date(); // Data atual para controle do mês e ano

// Função para alternar entre telas (por exemplo, tela de progresso e tela de tarefas do dia)
function showScreen(screen) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none'); // Oculta todas as telas
    
    document.querySelector(`.${screen}`).style.display = 'block'; // Exibe a tela selecionada

    if (screen === 'progress-screen') {
        document.getElementById('habit-name').textContent = currentHabitName; // Exibe o nome do hábito
        generateCalendar(); // Gera o calendário
    } else if (screen === 'today-screen') {
        updateHomeScreen(); // Atualiza a tela inicial de tarefas de hoje
    }
}

// Função para adicionar um novo hábito
function addHabit() {
    const habitName = prompt("Enter the name of the new habit:"); // Solicita o nome do hábito
    if (habitName) {
        checkinData[habitName] = checkinData[habitName] || []; // Inicializa a lista de check-ins para o hábito
        renderHabit(habitName, false); // Renderiza o hábito como "não feito" inicialmente
    }
}

// Função para marcar uma tarefa como feita e adicioná-la ao histórico de check-ins
function markAsDone(task, habitName) {
    task.classList.remove("todo");
    task.classList.add("done"); // Define o status da tarefa como concluída

    const completeButton = task.querySelector("button");
    completeButton.remove(); // Remove o botão de completar

    const revertButton = document.createElement("button");
    revertButton.className = "revert";
    revertButton.textContent = "↩️"; // Botão para reverter o status da tarefa para "To Do"
    revertButton.onclick = (e) => {
        e.stopPropagation();
        revertToToDo(task, habitName); // Reverte a tarefa ao estado "To Do"
    };

    task.appendChild(revertButton); // Adiciona o botão de reverter
    document.getElementById("done-list").appendChild(task); // Move a tarefa para a lista de "Done"

    const today = new Date();
    const checkinDate = { 
        day: today.getDate(), 
        month: today.getMonth(), 
        year: today.getFullYear() 
    };

    // Adiciona o check-in apenas se ainda não existir para o dia
    if (!checkinData[habitName].some(date => 
        date.day === checkinDate.day && 
        date.month === checkinDate.month && 
        date.year === checkinDate.year)) {
        checkinData[habitName].push(checkinDate); // Registra o check-in
        generateCalendar(); // Atualiza o calendário
    }
}

// Função para reverter uma tarefa concluída para "To Do"
function revertToToDo(task, habitName) {
    task.classList.remove("done");
    task.classList.add("todo"); // Define o estado da tarefa como "To Do"

    const revertButton = task.querySelector("button");
    revertButton.remove(); // Remove o botão de reverter

    const completeButton = document.createElement("button");
    completeButton.className = "complete";
    completeButton.textContent = "✔️"; // Cria o botão de conclusão
    completeButton.onclick = (e) => {
        e.stopPropagation();
        markAsDone(task, habitName); // Marca a tarefa como concluída
    };

    task.appendChild(completeButton); // Adiciona o botão de conclusão
    document.getElementById("to-do-list").appendChild(task); // Move a tarefa para a lista "To Do"

    const today = new Date();
    checkinData[habitName] = checkinData[habitName].filter(date =>
        !(date.day === today.getDate() && date.month === today.getMonth() && date.year === today.getFullYear())
    ); // Remove o check-in do dia atual para o hábito
}

// Abre a tela de progresso para o hábito selecionado
function openProgress(habitName) {
    currentHabitName = habitName;
    showScreen('progress-screen'); // Exibe a tela de progresso
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

// Exibe a data atual na tela inicial
function displayCurrentDate() {
    const dateElement = document.getElementById("current-date");
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('en-US', options); // Formata a data para exibição
}

// Função para navegar entre os meses no calendário
function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset); // Ajusta o mês atual
    generateCalendar(); // Atualiza o calendário
}

// Função para gerar o calendário com base nos check-ins do hábito atual
function generateCalendar() {
    const monthLabel = document.getElementById("month-label");
    const calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = ''; // Limpa o grid do calendário

    const options = { year: 'numeric', month: 'long' };
    monthLabel.textContent = currentDate.toLocaleDateString('en-US', options); // Exibe o mês e ano atual

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total de dias no mês

    const checkinDays = checkinData[currentHabitName]?.filter(date =>
        date.month === month && date.year === year
    ).map(date => date.day) || []; // Filtra os dias de check-in para o mês e ano atuais

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("span");
        dayElement.textContent = day;

        if (checkinDays.includes(day)) {
            dayElement.classList.add("checkin-day"); // Marca o dia com check-in
        }

        calendarGrid.appendChild(dayElement); // Adiciona o dia ao calendário
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
