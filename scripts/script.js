let currentHabitName = ''; // Armazena o nome do hábito atualmente em exibição
let checkinData = {}; // Objeto para armazenar dias de check-in específicos (ano, mês, dia) para cada hábito
let currentDate = new Date(); // Data atual para controle do mês e ano

document.addEventListener("DOMContentLoaded", () => {
    displayCurrentDate(); // Exibe a data atual no cabeçalho
    setActiveDayOfWeek(); // Define o dia da semana ativo
});


// Função para exibir a data atual no formato "Month Day, Year"
function displayCurrentDate() {
    const dateElement = document.getElementById("current-date");
    const today = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
    const currentDate = new Date(today);

    const options = { month: "long", day: "numeric", year: "numeric" };
    dateElement.textContent = currentDate.toLocaleDateString("en-US", options);
}

// Função para definir o dia da semana ativo com base no horário de Brasília
function setActiveDayOfWeek() {
    const daysOfWeek = document.querySelectorAll('.calendar .day'); // Seleciona todos os elementos de dia na div calendar

    // Usa o horário de Brasília (GMT-3) para definir o dia da semana atual
    const today = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
    const currentDate = new Date(today);
    const brasiliaDayIndex = currentDate.getDay(); // Obtém o índice do dia da semana (0 = Domingo, 1 = Segunda, etc.)

    // Remove a classe 'active' de todos os dias da semana
    daysOfWeek.forEach(day => day.classList.remove('active'));

    // Adiciona a classe 'active' ao dia da semana atual, verificando se existe o índice
    if (daysOfWeek[brasiliaDayIndex]) {
        daysOfWeek[brasiliaDayIndex].classList.add('active');
    }
}



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
