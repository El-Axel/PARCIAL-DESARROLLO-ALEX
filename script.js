// ================= MENÚ HAMBURGUESA =================
 
const menuToggle = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');
 
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Cambia entre ícono "menu" y "close" de Material Symbols
    menuToggle.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
});
 
// Cierra el menú al tocar cualquier enlace
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.textContent = 'menu';
    });
});
 
// Cierra el menú si se agranda la ventana a desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
        navLinks.classList.remove('active');
        menuToggle.textContent = 'menu';
    }
});

// ==========================================
// 1. BASE DE DATOS DEL TEST (Array de Objetos)
// ==========================================
const quizData = [
    {
        question: "1. Choose the correct option: 'I _____ to the cinema yesterday.'",
        options: [
            { text: "A) go", value: "wrong" },
            { text: "B) went", value: "correct" }, // Pasado simple
            { text: "C) gone", value: "wrong" },
            { text: "D) going", value: "wrong" }
        ]
    },
    {
        question: "2. 'She _____ English for three years.'",
        options: [
            { text: "A) is studying", value: "wrong" },
            { text: "B) has been studying", value: "correct" }, // Presente perfecto continuo
            { text: "C) studies", value: "wrong" },
            { text: "D) studied", value: "wrong" }
        ]
    },
    {
        question: "3. 'If I _____ rich, I would travel the world.'",
        options: [
            { text: "A) am", value: "wrong" },
            { text: "B) was", value: "wrong" },
            { text: "C) were", value: "correct" }, // Segundo condicional
            { text: "D) will be", value: "wrong" }
        ]
    },
    {
        question: "4. 'By next year, I _____ my degree.'",
        options: [
            { text: "A) will finish", value: "wrong" },
            { text: "B) will have finished", value: "correct" }, // Futuro perfecto
            { text: "C) finish", value: "wrong" },
            { text: "D) am finishing", value: "wrong" }
        ]
    },
    {
        question: "5. 'The letter _____ by the manager yesterday.'",
        options: [
            { text: "A) signed", value: "wrong" },
            { text: "B) was signed", value: "correct" }, // Voz pasiva
            { text: "C) is signed", value: "wrong" },
            { text: "D) has signed", value: "wrong" }
        ]
    }
];

// ==========================================
// 2. VARIABLES DE ESTADO
// ==========================================
let currentQuestionIndex = 0;
let score = 0;

// ==========================================
// 3. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================
const questionText = document.getElementById('questionText');
const optionsArea = document.getElementById('optionsArea');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const quizCard = document.getElementById('quizCard');

// ==========================================
// 4. FUNCIONES PRINCIPALES
// ==========================================

// Función para cargar una pregunta en pantalla
function loadQuestion() {
    // Obtenemos los datos de la pregunta actual
    const currentQuizData = quizData[currentQuestionIndex];
    
    // Actualizamos el texto de la pregunta
    questionText.innerText = currentQuizData.question;
    
    // Limpiamos las opciones anteriores
    optionsArea.innerHTML = '';
    
    // Generamos las nuevas opciones dinámicamente
    currentQuizData.options.forEach(option => {
        // Creamos la estructura HTML que definimos en el CSS
        const label = document.createElement('label');
        label.className = 'option-label';
        
        label.innerHTML = `
            <input type="radio" name="answer" value="${option.value}">
            <span class="option-text">${option.text}</span>
        `;
        
        // Lo inyectamos en el DOM
        optionsArea.appendChild(label);
    });

    // Actualizamos la barra de progreso
    updateProgress();
    
    // Deshabilitamos el botón hasta que seleccione una opción
    nextBtn.disabled = true;
    nextBtn.style.opacity = "0.5";
    nextBtn.style.cursor = "not-allowed";

    // Agregamos un "escuchador" para habilitar el botón cuando elija algo
    const radioButtons = document.querySelectorAll('input[name="answer"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            nextBtn.disabled = false;
            nextBtn.style.opacity = "1";
            nextBtn.style.cursor = "pointer";
        });
    });
}

// Función para actualizar la barra de progreso
function updateProgress() {
    const questionNumber = currentQuestionIndex + 1;
    const totalQuestions = quizData.length;
    
    // Cálculo matemático para el porcentaje de la barra
    const progressPercentage = (questionNumber / totalQuestions) * 100;
    
    progressBar.style.width = `${progressPercentage}%`;
    progressText.innerText = `Pregunta ${questionNumber} de ${totalQuestions}`;
}

// Función para leer qué respondió el usuario
function getSelectedAnswer() {
    const answerElements = document.querySelectorAll('input[name="answer"]');
    let answer = undefined;
    
    answerElements.forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.value;
        }
    });
    
    return answer;
}

// Función para calcular y mostrar el nivel final
function showResults() {
    let finalLevel = "";
    let recommendation = "";

    // Lógica condicional para definir el nivel
    if (score <= 1) {
        finalLevel = "A1 (Principiante)";
        recommendation = "Te recomendamos nuestro plan 'Explorador' para construir unas bases sólidas.";
    } else if (score <= 3) {
        finalLevel = "B1 (Intermedio)";
        recommendation = "Tienes buenas bases. Nuestro plan 'Nómada PRO' te llevará a la fluidez.";
    } else {
        finalLevel = "C1 (Avanzado)";
        recommendation = "¡Excelente nivel! El plan 'Inmersión Total' es perfecto para pulir tu acento y perfeccionar modismos.";
    }

    // Uso de LocalStorage (Puntos extra en la rúbrica)
    localStorage.setItem('userLanguageLevel', finalLevel);

    // Reemplazamos el contenido de la tarjeta manipulando el DOM
    quizCard.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <span class="material-symbols-outlined" style="font-size: 4rem; color: #d67b54;">military_tech</span>
            <h2 style="font-family: 'Manrope', sans-serif; font-size: 2.5rem; margin: 20px 0;">¡Test Completado!</h2>
            <p style="font-size: 1.2rem; color: #4d5f7e; margin-bottom: 10px;">Tu puntuación: <strong>${score}/${quizData.length}</strong></p>
            <h3 style="font-size: 2rem; color: #1a1c1d; margin-bottom: 20px;">Tu nivel estimado es: <span style="color: #d67b54;">${finalLevel}</span></h3>
            <p style="font-size: 1.1rem; color: #4d5f7e; margin-bottom: 30px;">${recommendation}</p>
            <button onclick="location.reload()" class="btn-secondary dark-text">Volver a intentar</button>
            <a href="cursos.html" class="btn-primary" style="margin-left: 10px;">Ver mis cursos</a>
        </div>
    `;
}

// ==========================================
// 5. EVENTOS (Interacción del usuario)
// ==========================================

// Evento click del botón "Siguiente"
nextBtn.addEventListener('click', () => {
    const answer = getSelectedAnswer();
    
    if (answer) {
        // Operación matemática: si es correcta, sumamos 1 punto
        if (answer === "correct") {
            score++;
        }
        
        currentQuestionIndex++; // Pasamos a la siguiente pregunta
        
        // Condicional: ¿Quedan preguntas?
        if (currentQuestionIndex < quizData.length) {
            loadQuestion(); // Cargamos la siguiente
        } else {
            showResults(); // Mostramos el resultado final
        }
    }
});

// ==========================================
// 6. INICIALIZACIÓN
// ==========================================
// Arrancamos el quiz cuando carga el script
loadQuestion();