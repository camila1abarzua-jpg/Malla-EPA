// Definición de los datos de la carrera
const mallaData = [
    {
        semestre: "Semestre 1",
        ramos: [
            "Fundamentos de la Educación",
            "Pedagogía en Contexto y Simulación I",
            "Ambientes para el Aprendizaje en Ed. Parvularia",
            "Bienestar Emocional y Salud Integral del Párvulo",
            "Desarrollo Personal y Social en Ed. Parvularia",
            "Taller de Habilidades Comunicativas para Educación"
        ]
    },
    {
        semestre: "Semestre 2",
        ramos: [
            "Aprendizaje y Ciclo Vital",
            "Fundamentos del Currículum y la Evaluación",
            "Pedagogía en Contexto y Simulación II",
            "Neuroeducación en el Aula",
            "Currículum y Modalidades de Educación Parvularia",
            "Psicomotricidad, Expresión Corporal y Juego",
            "Habilidades Cognitivas en la Primera Infancia",
            "Taller Competencias Digitales para Educación"
        ]
    },
    {
        semestre: "Semestre 3",
        ramos: [
            "Aprendizaje para la Diversidad",
            "Política Educativa para el Ejercicio Profesional",
            "Taller de Integración en Contexto I",
            "Transiciones Educativas en Educación Parvularia",
            "Pensamiento Lógico Matemático en Ed. Parvularia",
            "Lenguaje y Pensamiento en Ed. Parvularia",
            "Inglés I"
        ]
    },
    {
        semestre: "Semestre 4",
        ramos: [
            "Diseño de Aprendizajes en Contexto de Transf. Digital",
            "Taller de Integración en Contextos II",
            "Didáctica para la Literatura y Teatro Infantil",
            "Didáctica de la Comunicación en Ed. Parvularia (Verbal)",
            "Didáctica para el Pens. Lógico Matemático en Ed. Parvularia",
            "Taller Sostenibilidad para Educación",
            "Inglés II"
        ]
    },
    {
        semestre: "Semestre 5",
        ramos: [
            "Integración de Saberes Docentes I",
            "Gestión de Prácticas para la Enseñanza y el Aprendizaje I",
            "Tecnología del Aprendizaje en Educación Parvularia",
            "Didáctica para la Interacción y Comprensión del Entorno",
            "Didáctica de la Comunicación en Ed. Parvularia (Artístico)",
            "Trabajo Colaborativo, Familia y Comunidad",
            "Inglés III"
        ]
    },
    {
        semestre: "Semestre 6",
        ramos: [
            "Metodologías para la Indagación en Prácticas Pedagógicas",
            "Gestión de Prácticas para la Enseñanza y el Aprendizaje II",
            "Diseño e Implementación de Unidades Integradas STEAM",
            "Didáctica para la Interacción y Comprensión del Entorno Natural",
            "Didáctica de la Comunicación en Ed. Parvularia (Verbal)",
            "Liderazgo Pedagógico y Gestión Educacional",
            "Inglés IV"
        ]
    },
    {
        semestre: "Semestre 7",
        ramos: [
            "Integración de Saberes Docentes II",
            "Gestión de Prácticas Integradas",
            "Innovación Educativa",
            "Electivo de Especialidad 1",
            "Electivo de Especialidad 2"
        ]
    },
    {
        semestre: "Semestre 8",
        ramos: [
            "Trabajo de Título",
            "Práctica Profesional",
            "Electivo de Especialidad 3",
            "Electivo de Especialidad 4",
            "Electivo de Especialidad 5"
        ]
    }
];

// Clave para guardar en LocalStorage
const STORAGE_KEY = 'malla_parvularia_progreso';

// Estado inicial (conjunto de IDs de ramos aprobados)
let aprobados = new Set();

// Función principal de inicialización
function init() {
    cargarProgreso();
    renderizarMalla();
    actualizarBarraProgreso();
    
    // Configurar botón de reinicio
    document.getElementById('btn-reset').addEventListener('click', () => {
        if(confirm("¿Estás seguro de que quieres borrar todo tu progreso?")) {
            aprobados.clear();
            guardarProgreso();
            renderizarMalla();
            actualizarBarraProgreso();
        }
    });
}

// Renderiza la estructura HTML de la malla
function renderizarMalla() {
    const contenedor = document.getElementById('contenedor-malla');
    contenedor.innerHTML = ''; // Limpiar contenido previo

    mallaData.forEach((semestreData, i) => {
        // Crear columna del semestre
        const columna = document.createElement('div');
        columna.className = 'columna-semestre';

        // Título del semestre
        const titulo = document.createElement('div');
        titulo.className = 'titulo-semestre';
        titulo.textContent = semestreData.semestre;
        columna.appendChild(titulo);

        // Crear ramos
        semestreData.ramos.forEach((nombreRamo, j) => {
            const ramoDiv = document.createElement('div');
            ramoDiv.className = 'ramo';
            ramoDiv.textContent = nombreRamo;
            
            // Generar ID único para cada ramo: s(semestre)-r(ramo)
            const ramoID = `s${i}-r${j}`;
            ramoDiv.dataset.id = ramoID;

            // Verificar si está aprobado
            if (aprobados.has(ramoID)) {
                ramoDiv.classList.add('aprobado');
            }

            // Evento click
            ramoDiv.addEventListener('click', () => toggleRamo(ramoID));

            columna.appendChild(ramoDiv);
        });

        contenedor.appendChild(columna);
    });
}

// Alternar estado de aprobado/pendiente
function toggleRamo(id) {
    if (aprobados.has(id)) {
        aprobados.delete(id);
    } else {
        aprobados.add(id);
    }
    
    guardarProgreso();
    renderizarMalla(); // Re-renderizar para actualizar estilos
    actualizarBarraProgreso();
}

// Guardar en el navegador
function guardarProgreso() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...aprobados]));
}

// Cargar desde el navegador
function cargarProgreso() {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
        aprobados = new Set(JSON.parse(guardado));
    }
}

// Calcular y mostrar porcentaje
function actualizarBarraProgreso() {
    // Contar total de ramos
    let totalRamos = 0;
    mallaData.forEach(sem => totalRamos += sem.ramos.length);
    
    const aprobadosCount = aprobados.size;
    const porcentaje = Math.round((aprobadosCount / totalRamos) * 100);

    // Actualizar DOM
    document.getElementById('barra-progreso').style.width = `${porcentaje}%`;
    document.getElementById('porcentaje').textContent = `${porcentaje}%`;
}

// Iniciar app
document.addEventListener('DOMContentLoaded', init);

