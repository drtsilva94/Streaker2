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





