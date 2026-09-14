/* ==========================================================================
   CONFIGURACIÓN Y VARIABLES GLOBALES
   ========================================================================== */
const coleccionEjercicios = db.collection('ejercicios');
let todosLosEjercicios = [];

// Catálogo semilla de ejercicios
const ejerciciosBase = [
    // --- REFORMER ---
    { 
        nombre: "Footwork: Toes / Arch / Heels", 
        aparato: "Reformer", 
        nivel: "Inicial", 
        resortes: "2 rojos, 1 azul", 
        bloqueSugerido: "Footwork",
        descripcion: "Mantén el neutro lumbar y las costillas cerradas al extender piernas.",
        imagen: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80"
    },
    { 
        nombre: "Footwork: Single Leg", 
        aparato: "Reformer", 
        nivel: "Intermedio", 
        resortes: "2 rojos", 
        bloqueSugerido: "Footwork",
        descripcion: "Asegúrate de que la pelvis no rote al flexionar la pierna libre en mesa.",
        imagen: ""
    },
    { 
        nombre: "Footwork: V-Position / Tendon Stretch", 
        aparato: "Reformer", 
        nivel: "Avanzado", 
        resortes: "2 rojos", 
        bloqueSugerido: "Footwork",
        descripcion: "Talones juntos en V pilates, trabajo articular profundo de tobillo.",
        imagen: ""
    },
    { 
        nombre: "Stomach Massage: Round / Flat", 
        aparato: "Reformer", 
        nivel: "Intermedio", 
        resortes: "2 rojos", 
        bloqueSugerido: "Miembro Inferior",
        descripcion: "Curva la columna desde el abdomen profundo, talones altos todo el tiempo.",
        imagen: ""
    },
    { 
        nombre: "Stomach Massage: Reach Up", 
        aparato: "Reformer", 
        nivel: "Avanzado", 
        resortes: "1 o 2 rojos", 
        bloqueSugerido: "Tronco",
        descripcion: "Extensión de brazos al techo manteniendo la columna erguida.",
        imagen: ""
    },
    { 
        nombre: "Elephant", 
        aparato: "Reformer", 
        nivel: "Intermedio", 
        resortes: "1 rojo", 
        bloqueSugerido: "Tronco",
        descripcion: "Bisagra de cadera manteniendo la columna en 'C', empuje de talones.",
        imagen: ""
    },
    { 
        nombre: "Knee Stretches: Round / Flat", 
        aparato: "Reformer", 
        nivel: "Intermedio", 
        resortes: "1 rojo", 
        bloqueSugerido: "Tronco",
        descripcion: "Estabilidad del torso mientras las piernas mueven el carro en flexión/extensión.",
        imagen: ""
    },
    { 
        nombre: "Running", 
        aparato: "Reformer", 
        nivel: "Inicial", 
        resortes: "2 rojos", 
        bloqueSugerido: "Footwork",
        descripcion: "Flexión alternada de tobillos y rodillas, manteniendo la pelvis estable.",
        imagen: ""
    },
    { 
        nombre: "Pelvic Lift / Short Spine", 
        aparato: "Reformer", 
        nivel: "Avanzado", 
        resortes: "2 rojos", 
        bloqueSugerido: "Tronco",
        descripcion: "Articulación de la columna vertebral en elevación con asistencia de correas.",
        imagen: ""
    },
    { 
        nombre: "Chest Expansion", 
        aparato: "Reformer", 
        nivel: "Inicial", 
        resortes: "1 azul o amarillo", 
        bloqueSugerido: "Miembro Superior",
        descripcion: "Apertura pectoral y fuerza de dorsales y tríceps en posición arrodillada.",
        imagen: ""
    },
    { 
        nombre: "Thigh Stretch", 
        aparato: "Reformer", 
        nivel: "Intermedio", 
        resortes: "1 rojo", 
        bloqueSugerido: "Miembro Inferior",
        descripcion: "Inclinación posterior en bloque desde rodillas, control excéntrico de cuádriceps.",
        imagen: ""
    },
    { 
        nombre: "Arm Springs: Pulling Straps", 
        aparato: "Reformer", 
        nivel: "Inicial", 
        resortes: "1 azul o amarillo", 
        bloqueSugerido: "Miembro Superior",
        descripcion: "Extensión de columna y tracción de correas en pronación sobre la caja.",
        imagen: ""
    },
    { 
        nombre: "Backstroke", 
        aparato: "Reformer", 
        nivel: "Intermedio", 
        resortes: "1 azul", 
        bloqueSugerido: "Miembro Superior",
        descripcion: "Coordinación de extremidades con flexión abodminal sobre la caja.",
        imagen: ""
    },
    { 
        nombre: "Mermaid", 
        aparato: "Reformer", 
        nivel: "Inicial", 
        resortes: "1 rojo", 
        bloqueSugerido: "Tronco",
        descripcion: "Flexión lateral de la columna con apertura intercostal.",
        imagen: ""
    },

    // --- MAT (SUELO) ---
    { 
        nombre: "Hundred", 
        aparato: "Mat", 
        nivel: "Inicial", 
        resortes: "Sin peso", 
        bloqueSugerido: "Tronco",
        descripcion: "Elevación escapular alta, bombeo enérgico de brazos desde los hombros.",
        imagen: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80"
    },
    { 
        nombre: "Roll Up", 
        aparato: "Mat", 
        nivel: "Inicial", 
        resortes: "Sin peso", 
        bloqueSugerido: "Tronco",
        descripcion: "Articulación vértebra por vértebra con control del centro.",
        imagen: ""
    },
    { 
        nombre: "Roll Over", 
        aparato: "Mat", 
        nivel: "Intermedio", 
        resortes: "Sin peso", 
        bloqueSugerido: "Tronco",
        descripcion: "Llevar piernas por detrás de la cabeza sin colapsar la zona cervical.",
        imagen: ""
    },
    { 
        nombre: "One Leg Circle", 
        aparato: "Mat", 
        nivel: "Inicial", 
        resortes: "Sin peso", 
        bloqueSugerido: "Miembro Inferior",
        descripcion: "Movilidad de cadera y disociación con pelvis completamente fija.",
        imagen: ""
    },
    { 
        nombre: "Rolling Like a Ball", 
        aparato: "Mat", 
        nivel: "Inicial", 
        resortes: "Sin peso", 
        bloqueSugerido: "Tronco",
        descripcion: "Masaje de columna conservando la flexión en C y el equilibrio.",
        imagen: ""
    },
    { 
        nombre: "Series de Abdominales (Single/Double Leg)", 
        aparato: "Mat", 
        nivel: "Intermedio", 
        resortes: "Sin peso", 
        bloqueSugerido: "Tronco",
        descripcion: "Secuencia continua de flexión de tronco y trabajo de piernas.",
        imagen: ""
    },
    { 
        nombre: "Spine Stretch Forward", 
        aparato: "Mat", 
        nivel: "Inicial", 
        resortes: "Sin peso", 
        bloqueSugerido: "Tronco",
        descripcion: "Flexión anterior de columna proyectando la coronilla hacia adelante.",
        imagen: ""
    },
    { 
        nombre: "Open Leg Balance", 
        aparato: "Mat", 
        nivel: "Intermedio", 
        resortes: "Sin peso", 
        bloqueSugerido: "Tronco",
        descripcion: "Equilibrio sobre isquiones sujetando los tobillos con piernas en V.",
        imagen: ""
    },
    { 
        nombre: "Corkscrew", 
        aparato: "Mat", 
        nivel: "Avanzado", 
        resortes: "Sin peso", 
        bloqueSugerido: "Tronco",
        descripcion: "Círculos de piernas en suspensión controlando la torsión del tronco.",
        imagen: ""
    },
    { 
        nombre: "Saw", 
        aparato: "Mat", 
        nivel: "Intermedio", 
        resortes: "Sin peso", 
        bloqueSugerido: "Tronco",
        descripcion: "Rotación y flexión de tronco alcanzando el meñique del pie opuesto.",
        imagen: ""
    },
    { 
        nombre: "Swan Dive", 
        aparato: "Mat", 
        nivel: "Avanzado", 
        resortes: "Sin peso", 
        bloqueSugerido: "Tronco",
        descripcion: "Extensión profunda de columna con balanceo sobre el abdomen.",
        imagen: ""
    },
    { 
        nombre: "Side Leg Series (Kicking)", 
        aparato: "Mat", 
        nivel: "Inicial", 
        resortes: "Sin peso", 
        bloqueSugerido: "Miembro Inferior",
        descripcion: "Trabajo en decúbito lateral para glúteos y estabilizadores de cadera.",
        imagen: ""
    },
    { 
        nombre: "Teaser", 
        aparato: "Mat", 
        nivel: "Avanzado", 
        resortes: "Sin peso", 
        bloqueSugerido: "Tronco",
        descripcion: "Equilibrio en V sobre el sacro levantando torso y piernas simétricamente.",
        imagen: ""
    },
    { 
        nombre: "Swimming", 
        aparato: "Mat", 
        nivel: "Intermedio", 
        resortes: "Sin peso", 
        bloqueSugerido: "Tronco",
        descripcion: "Extensión de la cadena posterior coordinando brazo y pierna opuestos.",
        imagen: ""
    },
    { 
        nombre: "Push Up", 
        aparato: "Mat", 
        nivel: "Intermedio", 
        resortes: "Sin peso", 
        bloqueSugerido: "Miembro Superior",
        descripcion: "Flexiones de brazos articulando desde la bipedestación hacia la plancha.",
        imagen: ""
    },

    // --- WUNDA CHAIR ---
    { 
        nombre: "Footwork on Chair (Pumping)", 
        aparato: "Chair", 
        nivel: "Inicial", 
        resortes: "2 resortes medios", 
        bloqueSugerido: "Footwork",
        descripcion: "Empuje de pedal sentado o alineado en bipedestación con control de centro.",
        imagen: ""
    },
    { 
        nombre: "Pump on 1 Leg", 
        aparato: "Chair", 
        nivel: "Intermedio", 
        resortes: "1 resorte medio", 
        bloqueSugerido: "Miembro Inferior",
        descripcion: "Unilateral de pierna para estabilidad pélvica y fuerza de cuadriceps.",
        imagen: ""
    },
    { 
        nombre: "Side Press / Mermaid", 
        aparato: "Chair", 
        nivel: "Intermedio", 
        resortes: "1 resorte medio", 
        bloqueSugerido: "Tronco",
        descripcion: "Flexión lateral arrodillado o sentado presionando el pedal.",
        imagen: ""
    },
    { 
        nombre: "Arm Press (Standing facing away)", 
        aparato: "Chair", 
        nivel: "Inicial", 
        resortes: "1 resorte liviano", 
        bloqueSugerido: "Miembro Superior",
        descripcion: "Empuje del pedal con extremidades superiores manteniendo postura erguida.",
        imagen: ""
    },
    { 
        nombre: "Teaser on Chair", 
        aparato: "Chair", 
        nivel: "Avanzado", 
        resortes: "1 resorte medio", 
        bloqueSugerido: "Tronco",
        descripcion: "Teaser sentado en el asiento con manos en el pedal para control del centro.",
        imagen: ""
    },
    { 
        nombre: "Mountain Climber / Press Down", 
        aparato: "Chair", 
        nivel: "Intermedio", 
        resortes: "2 resortes medios", 
        bloqueSugerido: "Miembro Superior",
        descripcion: "Trabajo dinámico de estabilización en plancha y empuje de piernas.",
        imagen: ""
    },

    // --- CADILLAC / TRAPEZE TABLE ---
    { 
        nombre: "Push Thru Bar: Monkey / Spring", 
        aparato: "Cadillac", 
        nivel: "Inicial", 
        resortes: "2 resortes bajos", 
        bloqueSugerido: "Tronco",
        descripcion: "Movilidad de columna y estiramiento de isquiotibiales sujetando la barra.",
        imagen: ""
    },
    { 
        nombre: "Leg Springs: Frog / Circles", 
        aparato: "Cadillac", 
        nivel: "Inicial", 
        resortes: "2 resortes largos", 
        bloqueSugerido: "Miembro Inferior",
        descripcion: "Alineación y fuerza articular de cadera con resistencia de resortes largos.",
        imagen: ""
    },
    { 
        nombre: "Arm Springs lying down", 
        aparato: "Cadillac", 
        nivel: "Inicial", 
        resortes: "2 resortes cortos", 
        bloqueSugerido: "Miembro Superior",
        descripcion: "Estabilización de cintura escapular y fuerza de brazos en supinación.",
        imagen: ""
    },
    { 
        nombre: "Tower / Half Cadillac Roll Back", 
        aparato: "Cadillac", 
        nivel: "Intermedio", 
        resortes: "2 resortes", 
        bloqueSugerido: "Tronco",
        descripcion: "Articulación de columna utilizando la barra Roll Back Bar.",
        imagen: ""
    },
    { 
        nombre: "Monkey / Hanging Exercises", 
        aparato: "Cadillac", 
        nivel: "Avanzado", 
        resortes: "Trapecio / Agarraderas", 
        bloqueSugerido: "Tronco",
        descripcion: "Suspensión acrobática y trabajo de fuerza total en el trapecio.",
        imagen: ""
    },

    // --- LADDER BARREL & SPINE CORRECTOR ---
    { 
        nombre: "Short Box Series: Round / Flat / Twist", 
        aparato: "Barrel", 
        nivel: "Intermedio", 
        resortes: "Sin resortes", 
        bloqueSugerido: "Tronco",
        descripcion: "Secuencia abdominal en el barril trabajando los planos de movimiento.",
        imagen: ""
    },
    { 
        nombre: "Flat Back / Side Bends on Barrel", 
        aparato: "Barrel", 
        nivel: "Intermedio", 
        resortes: "Sin resortes", 
        bloqueSugerido: "Tronco",
        descripcion: "Extensión lateral e inclinación de columna apoyando pelvis en el barril.",
        imagen: ""
    },
    { 
        nombre: "Spine Corrector: Swimming / Extensions", 
        aparato: "Barrel", 
        nivel: "Inicial", 
        resortes: "Sin resortes", 
        bloqueSugerido: "Tronco",
        descripcion: "Corrección postural y extensión pectoral sobre la arcada del corrector.",
        imagen: ""
    }
];

/* ==========================================================================
   INICIALIZACIÓN DE LA PÁGINA
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    inyectarEstilosImpresion();
    cargarBancoDesdeNube();
});

// Estilos de visualización e impresión
function inyectarEstilosImpresion() {
    if (document.getElementById("estilosPrint")) return;
    const style = document.createElement("style");
    style.id = "estilosPrint";
    style.innerHTML = `
        .drop-zona-imagen {
            position: relative;
            border: 2px dashed #ddd;
            border-radius: 8px;
            overflow: hidden;
            background: #fafafa;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 12px;
            height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .drop-zona-imagen:hover {
            border-color: #6c5ce7;
            background-color: #f8f5fc;
        }
        .img-ejercicio-banco {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .drop-indicador {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.6);
            color: white;
            font-size: 0.75rem;
            text-align: center;
            padding: 4px;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .drop-zona-imagen:hover .drop-indicador {
            opacity: 1;
        }

        @media print {
            body { background: white !important; color: black !important; }
            header, nav, .panel, button, .acciones-card, .drop-indicador { display: none !important; }
            #bancoGrid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 15px !important; }
            .card-ejercicio-banco { break-inside: avoid; page-break-inside: avoid; border: 1px solid #ddd !important; box-shadow: none !important; padding: 12px !important; }
            .drop-zona-imagen { border: none !important; height: 160px !important; }
            .img-ejercicio-banco { height: 100% !important; max-width: 100% !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
    `;
    document.head.appendChild(style);
}

/* ==========================================================================
   SINCRONIZACIÓN CON FIRESTORE
   ========================================================================== */
function cargarBancoDesdeNube() {
    coleccionEjercicios.onSnapshot((snapshot) => {
        todosLosEjercicios = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        if (todosLosEjercicios.length === 0) {
            cargarEjerciciosSemilla();
        } else {
            filtrarBanco();
        }
    }, (error) => {
        console.error("Error al obtener los ejercicios del banco:", error);
        const grid = document.getElementById("bancoGrid");
        if (grid) {
            grid.innerHTML = `<p style="grid-column: 1/-1; color: red; text-align: center;">Error al conectar con la base de datos: ${escapeHtml(error.message)}</p>`;
        }
    });
}

// Carga inicial masiva con batch para optimizar operaciones
async function cargarEjerciciosSemilla() {
    const grid = document.getElementById("bancoGrid");
    if (grid) grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6c5ce7;">Cargando catálogo completo de ejercicios en la nube...</p>`;

    try {
        const batch = db.batch();
        ejerciciosBase.forEach(ej => {
            const docRef = coleccionEjercicios.doc();
            batch.set(docRef, ej);
        });
        await batch.commit();
    } catch (error) {
        console.error("Error al cargar semilla:", error);
    }
}

/* ==========================================================================
   GESTIÓN DE IMÁGENES (DRAG & DROP Y PROMPT)
   ========================================================================== */
function permitirDrop(e) {
    e.preventDefault();
    e.stopPropagation();
}

async function procesarDropImagen(e, id) {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
        const file = files[0];

        if (!file.type.startsWith('image/')) {
            alert("Por favor, arrastra un archivo de imagen válido (JPG, PNG, WebP).");
            return;
        }

        const reader = new FileReader();
        reader.onload = async function(event) {
            const base64Image = event.target.result;
            try {
                await coleccionEjercicios.doc(id).update({ imagen: base64Image });
            } catch (error) {
                console.error("Error al actualizar imagen:", error);
                alert("No se pudo guardar la imagen.");
            }
        };
        reader.readAsDataURL(file);
    }
}

async function cambiarImagen(id, urlActual) {
    const nuevaUrl = prompt("Pega la dirección URL de la nueva imagen (o arrastra una foto desde tu PC sobre la caja):", urlActual || "");
    if (nuevaUrl !== null) {
        try {
            await coleccionEjercicios.doc(id).update({ imagen: nuevaUrl.trim() });
        } catch (error) {
            console.error("Error al actualizar la imagen:", error);
            alert("No se pudo actualizar la imagen.");
        }
    }
}

/* ==========================================================================
   FILTRADO Y BÚSQUEDA
   ========================================================================== */
function filtrarBanco() {
    const inputTexto = document.getElementById("inputBuscar");
    const inputAparato = document.getElementById("filterAparato");
    const inputNivel = document.getElementById("filterNivel");
    const inputBloque = document.getElementById("filterBloque");

    const texto = inputTexto ? inputTexto.value.toLowerCase() : "";
    const aparato = inputAparato ? inputAparato.value : "todos";
    const nivel = inputNivel ? inputNivel.value : "todos";
    const bloque = inputBloque ? inputBloque.value : "todos";

    const filtrados = todosLosEjercicios.filter(ej => {
        const coincideNombre = (ej.nombre || "").toLowerCase().includes(texto);
        const coincideAparato = (aparato === "todos" || ej.aparato === aparato);
        const coincideNivel = (nivel === "todos" || ej.nivel === nivel);
        const coincideBloque = (bloque === "todos" || ej.bloqueSugerido === bloque);

        return coincideNombre && coincideAparato && coincideNivel && coincideBloque;
    });

    renderizarBanco(filtrados);
}

/* ==========================================================================
   RENDERIZADO DE INTERFAZ (TARJETAS)
   ========================================================================== */
function renderizarBanco(ejercicios) {
    const grid = document.getElementById("bancoGrid");
    if (!grid) return;
    
    grid.innerHTML = "";

    if (!ejercicios || ejercicios.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; color: #888; font-style: italic; text-align: center; padding: 40px;">No se encontraron ejercicios en la biblioteca.</p>`;
        return;
    }

    ejercicios.forEach(ej => {
        const card = document.createElement("div");
        card.className = "card-ejercicio-banco";

        const tieneImagen = ej.imagen && ej.imagen.trim() !== "";
        const imgContenido = tieneImagen 
            ? `<img src="${escapeHtml(ej.imagen)}" alt="${escapeHtml(ej.nombre)}" class="img-ejercicio-banco">`
            : `<div style="color: #aaa; font-size: 0.85rem;">📁 Arrastra una foto aquí</div>`;

        card.innerHTML = `
            <div>
                <div class="drop-zona-imagen"
                     ondragover="permitirDrop(event)"
                     ondrop="procesarDropImagen(event, '${ej.id}')"
                     onclick="cambiarImagen('${ej.id}', '${escapeHtml(ej.imagen || '')}')"
                     title="Haz clic para cambiar URL o arrastra una imagen desde tu equipo">
                    ${imgContenido}
                    <span class="drop-indicador">📷 Cambiar / Soltar foto</span>
                </div>

                <div style="display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap;">
                    <span style="background: #e2d9f3; color: #4a2b7b; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">${escapeHtml(ej.aparato || 'Gral')}</span>
                    <span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">${escapeHtml(ej.nivel || 'General')}</span>
                    ${ej.bloqueSugerido ? `<span style="background: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">${escapeHtml(ej.bloqueSugerido)}</span>` : ''}
                </div>
                
                <h3 style="margin: 0 0 8px 0; color: #4a2b7b; font-size: 1.15rem;">${escapeHtml(ej.nombre || 'Sin título')}</h3>
                
                <div class="card-info" style="font-size: 0.85rem; color: #555; line-height: 1.4;">
                    <p style="margin: 4px 0;"><strong>Explicación:</strong> ${escapeHtml(ej.descripcion || 'Sin descripción')}</p>
                    <p style="margin: 4px 0;"><strong>Resortes/Carga:</strong> ${escapeHtml(ej.resortes || '-')}</p>
                </div>
            </div>

            <div class="acciones-card" style="margin-top: 14px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f0f0f0; padding-top: 10px; gap: 8px;">
                <button style="background: #6c5ce7; color: white; border: none; border-radius: 4px; padding: 6px 10px; font-size: 0.8rem; cursor: pointer;" onclick="cambiarImagen('${ej.id}', '${escapeHtml(ej.imagen || '')}')">📷 Cambiar Foto</button>
                <button style="background: #ff4d4f; color: white; border: none; border-radius: 4px; padding: 6px 10px; font-size: 0.8rem; cursor: pointer;" onclick="eliminarEjercicio('${ej.id}', '${escapeHtml(ej.nombre)}')">🗑️ Eliminar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

/* ==========================================================================
   OPERACIONES
   ========================================================================== */
async function eliminarEjercicio(id, nombre) {
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente "${nombre}" de la biblioteca?`)) {
        try {
            await coleccionEjercicios.doc(id).delete();
        } catch (error) {
            console.error("Error al eliminar el ejercicio:", error);
            alert("Ocurrió un error al intentar eliminar el ejercicio.");
        }
    }
}

// Auxiliar para evitar problemas de comillas e inyección de HTML
function escapeHtml(texto) {
    if (!texto) return '';
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function cargarEjerciciosBiblioteca(ejercicios) {
    const grid = document.getElementById("exerciseGrid");
    if (!grid) return;

    grid.innerHTML = "";

    if (!ejercicios || ejercicios.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; color: #777; font-style: italic;">No hay ejercicios guardados.</p>`;
        return;
    }

    const fragment = document.createDocumentFragment();
    const opcionesBloquesHTML = (typeof bloquesClase !== 'undefined' ? Object.keys(bloquesClase) : []).map(nombreBloque => 
        `<option value="${escapeHtml(nombreBloque)}">${escapeHtml(nombreBloque)}</option>`
    ).join('');

    ejercicios.forEach(ej => {
        const card = document.createElement("div");
        card.className = "exercise-card";
        card.style.cssText = "background:#fff; border:1px solid #e0e0e0; border-radius:8px; padding:12px; margin-bottom:12px; box-shadow:0 2px 5px rgba(0,0,0,0.05);";

        const imgHTML = (ej.imagen && ej.imagen.trim() !== "")
            ? `<img src="${escapeHtml(ej.imagen)}" alt="${escapeHtml(ej.nombre)}" style="width:100%; height:120px; object-fit:cover; border-radius:6px; margin-bottom:8px;">`
            : `<div class="placeholder-img" style="width:100%; height:100px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; color:#888; border-radius:6px; margin-bottom:8px;">Sin Imagen</div>`;

        const tieneVariantes = Array.isArray(ej.variaciones) && ej.variaciones.length > 0;

        // Construir sub-lista de variantes si existen
        let variantesHTML = "";
        if (tieneVariantes) {
            let listaItemsVariantes = "";
            ej.variaciones.forEach((v, idx) => {
                listaItemsVariantes += `
                    <div style="background:#ffffff; border:1px solid #dcdde1; border-radius:6px; padding:8px; margin-top:6px;">
                        <strong style="color:var(--primary-dark, #2d3436); font-size:0.85rem; display:block;">🔹 ${escapeHtml(v.nombreVariacion)}</strong>
                        <p style="font-size:0.8rem; color:#555; margin:3px 0;">${escapeHtml(v.accion || '')}</p>
                        <small style="color:#7f8c8d; display:block; margin-bottom:4px;">Carga: ${escapeHtml(v.resortes || ej.resortes || '-')}</small>
                        
                        <select onchange="agregarVarianteABloque('${ej.id}', ${idx}, this.value); this.value='';" style="width:100%; font-size:0.8rem; padding:4px;">
                            <option value="">+ Agregar variante a bloque...</option>
                            ${opcionesBloquesHTML}
                        </select>
                    </div>
                `;
            });

            variantesHTML = `
                <details style="margin-top:12px; background:#f8f9fa; border:1px dashed #b2bec3; border-radius:6px; padding:8px;">
                    <summary style="cursor:pointer; font-weight:bold; font-size:0.85rem; color:#2c3e50;">
                        ✨ Variantes de este movimiento (${ej.variaciones.length})
                    </summary>
                    <div style="margin-top:6px;">
                        ${listaItemsVariantes}
                    </div>
                </details>
            `;
        }

        card.innerHTML = `
            <!-- SECCIÓN 1: EJERCICIO PRINCIPAL / BASE -->
            <div>
                ${imgHTML}
                <span class="badge" style="background:#eef2f5; color:#333; padding:2px 6px; border-radius:4px; font-size:0.75rem;">${escapeHtml(ej.aparato || 'Reformer')} - ${escapeHtml(ej.nivel || 'Inicial')}</span>
                <strong style="display:block; font-size:1rem; margin-top:4px; color:#2d3436;">${escapeHtml(ej.nombre || 'Ejercicio Base')}</strong>
                ${ej.posicionInicial ? `<small style="display:block; color:#636e72; font-size:0.8rem; margin-top:2px;">📍 ${escapeHtml(ej.posicionInicial)}</small>` : ''}
            </div>

            <div style="margin-top:10px;">
                <select class="select-bloque-dropdown" onchange="agregarABloque('${ej.id}', this.value); this.value='';" style="width:100%; padding:6px; font-size:0.85rem;">
                    <option value="">+ Agregar Ejercicio Base a bloque...</option>
                    ${opcionesBloquesHTML}
                </select>
            </div>

            <!-- SECCIÓN 2: SUBDIVISIÓN DE VARIANTES -->
            ${variantesHTML}
        `;

        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
}