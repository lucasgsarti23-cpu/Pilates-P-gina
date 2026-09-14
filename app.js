// ==========================================
// CONFIGURACIÓN Y ESTADO GLOBAL
// ==========================================
const coleccionEjercicios = db.collection('ejercicios');
const IMGBB_API_KEY = "1f537445826db544cbc96c9b55abe381";

let bibliotecaEjercicios = [];
let bloquesClase = JSON.parse(localStorage.getItem('pilates_bloques')) || {
    "Acondicionamiento": [],
    "Trabajo Central": [],
    "Cierre": []
};

// INICIALIZACIÓN AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    cargarBibliotecaDirecta(); // Carga inmediata asegurada
    cargarEncabezadoGuardado();
    actualizarEstructuraClase();
});

// ==========================================
// 1. CARGA DE BIBLIOTECA (VINCULACIÓN INDEX)
// ==========================================

// Intenta leer en tiempo real, pero si tarda, realiza una lectura directa
function cargarBibliotecaDirecta() {
    coleccionEjercicios.get().then((snapshot) => {
        if (snapshot.empty) {
            console.log("Biblioteca vacía en la nube. Cargando semilla inicial...");
            cargarSemillaInicial();
        } else {
            bibliotecaEjercicios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            cargarEjerciciosBiblioteca(bibliotecaEjercicios);
        }
    }).catch((error) => {
        console.error("Error al conectar con Firestore:", error);
    });

    // Escucha en tiempo real de respaldo
    coleccionEjercicios.onSnapshot((snapshot) => {
        if (!snapshot.empty) {
            bibliotecaEjercicios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            cargarEjerciciosBiblioteca(bibliotecaEjercicios);
        }
    }, (error) => console.warn("Aviso en tiempo real:", error));
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
    const opcionesBloquesHTML = Object.keys(bloquesClase).map(nombreBloque => 
        `<option value="${escapeHTML(nombreBloque)}">${escapeHTML(nombreBloque)}</option>`
    ).join('');

    ejercicios.forEach(ej => {
        const card = document.createElement("div");
        card.className = "exercise-card";

        const imgHTML = (ej.imagen && ej.imagen.trim() !== "")
            ? `<img src="${escapeHTML(ej.imagen)}" alt="${escapeHTML(ej.nombre)}">`
            : `<div class="placeholder-img" style="width:100%; height:100px; margin-bottom:8px; display:flex; align-items:center; justify-content:center; background:#eee; color:#888;">Sin Imagen</div>`;

        const tieneVariantes = Array.isArray(ej.variaciones) && ej.variaciones.length > 0;
        
        let variantesInlineHTML = '';
        if (tieneVariantes) {
            const listaItems = ej.variaciones.map(v => `
                <div style="background: #f8f9fa; border-left: 3px solid #6c5ce7; padding: 5px 8px; margin-top: 4px; border-radius: 3px; font-size: 0.78rem;">
                    <strong>🔹 ${escapeHTML(v.nombreVariacion)}</strong>
                    ${v.accion ? `<br><span style="color:#555;">${escapeHTML(v.accion)}</span>` : ''}
                    ${v.resortes ? `<br><small style="color:#7f8c8d;">⚙️ ${escapeHTML(v.resortes)}</small>` : ''}
                </div>
            `).join('');

            variantesInlineHTML = `
                <details style="margin-top: 6px; cursor: pointer; text-align: left;">
                    <summary style="font-size: 0.8rem; font-weight: bold; color: #6c5ce7;">
                        ✨ Ver Variantes (${ej.variaciones.length})
                    </summary>
                    <div style="margin-top: 4px; max-height: 150px; overflow-y: auto;">
                        ${listaItems}
                    </div>
                </details>
            `;
        }

        const btnModalVariantesHTML = tieneVariantes 
            ? `<button type="button" class="btn-variantes" onclick="abrirModalVariantes('${ej.id}')" style="margin-top: 6px; padding: 4px 8px; font-size: 0.8rem; background: #6c5ce7; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
                🔍 Seleccionar Variante
               </button>` 
            : '';

        card.innerHTML = `
            <div>
                ${imgHTML}
                <span class="badge">${escapeHTML(ej.aparato || 'Reformer')} - ${escapeHTML(ej.nivel || 'Inicial')}</span>
                <strong style="display:block; font-size:0.95rem; margin-top:4px;">${escapeHTML(ej.nombre || 'Ejercicio')}</strong>
                
                ${variantesInlineHTML}
                ${btnModalVariantesHTML}
            </div>
            <select class="select-bloque-dropdown" onchange="agregarABloque('${ej.id}', this.value); this.value='';" style="margin-top: 8px; width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #ccc;">
                <option value="">+ Sumar a la clase...</option>
                ${opcionesBloquesHTML}
            </select>
        `;
        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
}

// ==========================================
// 2. FILTROS Y SELECCIÓN DE EJERCICIOS
// ==========================================

function filtrarEjercicios() {
    const inputTexto = document.getElementById("inputBuscar");
    const aparato = document.getElementById("filterAparato")?.value || "todos";
    const nivel = document.getElementById("filterNivel")?.value || "todos";
    const inputBloque = document.getElementById("filterBloque");

    const texto = inputTexto ? inputTexto.value.toLowerCase().trim() : "";
    const bloque = inputBloque ? inputBloque.value : "todos";

    const filtrados = bibliotecaEjercicios.filter(ej => {
        const coincideNombre = (ej.nombre || "").toLowerCase().includes(texto);
        const coincideAparato = (aparato === "todos" || ej.aparato === aparato);
        const coincideNivel = (nivel === "todos" || ej.nivel === nivel);
        const coincideBloque = (bloque === "todos" || ej.bloque === bloque);

        return coincideNombre && coincideAparato && coincideNivel && coincideBloque;
    });

    cargarEjerciciosBiblioteca(filtrados);
}

function agregarABloque(idEjercicio, nombreBloque) {
    if (!nombreBloque) return;

    if (!bloquesClase[nombreBloque]) {
        bloquesClase[nombreBloque] = [];
    }

    const ejOriginal = bibliotecaEjercicios.find(e => String(e.id) === String(idEjercicio));
    if (!ejOriginal) return;

    const nuevoItem = {
        id: ejOriginal.id || "",
        nombre: ejOriginal.nombre || "",
        aparato: ejOriginal.aparato || "",
        nivel: ejOriginal.nivel || "",
        imagen: ejOriginal.imagen || "",
        uniqueId: generarIDUnico(),
        descripcionEditable: ejOriginal.descripcion || "",
        dosificacionEditable: ejOriginal.resortes ? `Carga: ${ejOriginal.resortes}` : "10-12 reps",
        transicionEditable: ejOriginal.transicion || ""
    };

    bloquesClase[nombreBloque].push(nuevoItem);
    guardarYActualizar();
}

// ==========================================
// 3. PLAN DE CLASE Y PERSISTENCIA
// ==========================================

function actualizarEstructuraClase() {
    const container = document.getElementById("bloquesContainer");
    if (!container) return;

    container.innerHTML = "";
    const fragment = document.createDocumentFragment();

    Object.keys(bloquesClase).forEach(nombreBloque => {
        const items = bloquesClase[nombreBloque];
        let htmlItems = "";

        if (items.length === 0) {
            htmlItems = `<p style="color: #888; font-style: italic; font-size: 0.8rem; margin: 5px 0; padding: 10px; background: #fafafa; border-radius: 4px; border: 1px dashed #ccc;">No hay ejercicios agregados a este bloque.</p>`;
        } else {
            items.forEach((item, index) => {
                const imgInner = item.imagen && item.imagen.trim() !== "" 
                    ? `<img src="${escapeHTML(item.imagen)}" alt="${escapeHTML(item.nombre)}">`
                    : `<div class="placeholder-img">Sin imagen</div>`;

                const esPrimero = index === 0;
                const esUltimo = index === items.length - 1;

                htmlItems += `
                    <div class="ejercicio-detalle-grid" style="display: grid; grid-template-columns: 110px 1fr 1fr 1fr 1fr auto; gap: 10px; align-items: center; background: white; padding: 10px; border-radius: 6px; margin-bottom: 8px; border: 1px solid #e0e0e0;">
                        <div>${imgInner}</div>
                        <div>
                            <strong style="color: #2d3436; font-size: 0.95rem;">${escapeHTML(item.nombre)}</strong>
                            <div style="margin-top:4px;"><span class="badge" style="background:#e0e0e0; padding:2px 6px; border-radius:4px; font-size:0.75rem;">${escapeHTML(item.aparato)}</span></div>
                        </div>
                        <div>
                            <strong style="font-size:0.8rem; display:block;">Explicación:</strong>
                            <textarea class="input-editable-clase" rows="2" style="width:100%; font-size:0.8rem;"
                                oninput="actualizarTextoItem('${nombreBloque}', '${item.uniqueId}', 'descripcionEditable', this.value)">${escapeHTML(item.descripcionEditable)}</textarea>
                        </div>
                        <div>
                            <strong style="font-size:0.8rem; display:block;">Dosificación:</strong>
                            <textarea class="input-editable-clase" rows="2" style="width:100%; font-size:0.8rem;"
                                oninput="actualizarTextoItem('${nombreBloque}', '${item.uniqueId}', 'dosificacionEditable', this.value)">${escapeHTML(item.dosificacionEditable)}</textarea>
                        </div>
                        <div>
                            <strong style="font-size:0.8rem; display:block;">Transición:</strong>
                            <textarea class="input-editable-clase" rows="2" style="width:100%; font-size:0.8rem;"
                                oninput="actualizarTextoItem('${nombreBloque}', '${item.uniqueId}', 'transicionEditable', this.value)">${escapeHTML(item.transicionEditable)}</textarea>
                        </div>
                        <div class="no-imprimir" style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
                            <button type="button" title="Subir" onclick="moverEjercicio('${nombreBloque}', ${index}, -1)" ${esPrimero ? 'disabled style="opacity:0.3; cursor:default;"' : 'style="cursor:pointer;"'} class="btn-orden">⬆️</button>
                            <button type="button" title="Bajar" onclick="moverEjercicio('${nombreBloque}', ${index}, 1)" ${esUltimo ? 'disabled style="opacity:0.3; cursor:default;"' : 'style="cursor:pointer;"'} class="btn-orden">⬇️</button>
                            <button type="button" title="Eliminar" onclick="eliminarDeBloque('${nombreBloque}', '${item.uniqueId}')" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; margin-top: 2px;">✕</button>
                        </div>
                    </div>
                `;
            });
        }

        const seccion = document.createElement("div");
        seccion.className = "bloque-section";
        seccion.style.marginBottom = "20px";
        seccion.innerHTML = `
            <div class="bloque-header" style="background: #2d3436; color: white; padding: 8px 12px; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <strong>Bloque: ${escapeHTML(nombreBloque)}</strong>
                <span style="font-size: 0.8rem; background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 10px;">${items.length} ej.</span>
            </div>
            <div class="bloque-body" style="background: #f8f9fa; padding: 10px; border-radius: 0 0 6px 6px; border: 1px solid #2d3436; border-top: none;">
                ${htmlItems}
            </div>
        `;
        fragment.appendChild(seccion);
    });

    container.appendChild(fragment);
}

// UTILIDADES AUXILIARES
function generarIDUnico() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function eliminarDeBloque(nombreBloque, uniqueId) {
    if (!bloquesClase[nombreBloque]) return;
    bloquesClase[nombreBloque] = bloquesClase[nombreBloque].filter(item => String(item.uniqueId) !== String(uniqueId));
    guardarYActualizar();
}

function actualizarTextoItem(nombreBloque, uniqueId, campo, valor) {
    if (!bloquesClase[nombreBloque]) return;
    const item = bloquesClase[nombreBloque].find(i => String(i.uniqueId) === String(uniqueId));
    if (item) {
        item[campo] = valor || "";
        localStorage.setItem('pilates_bloques', JSON.stringify(bloquesClase));
    }
}

function guardarYActualizar() {
    localStorage.setItem('pilates_bloques', JSON.stringify(bloquesClase));
    actualizarEstructuraClase();
}

function guardarEncabezado() {
    const encabezado = {
        turno: document.getElementById("inputTurno")?.value || "",
        nroClase: document.getElementById("inputNroClase")?.value || "",
        dia: document.getElementById("inputDia")?.value || ""
    };
    localStorage.setItem('pilates_encabezado', JSON.stringify(encabezado));
}

function cargarEncabezadoGuardado() {
    const guardado = JSON.parse(localStorage.getItem('pilates_encabezado'));
    if (guardado) {
        if (document.getElementById("inputTurno")) document.getElementById("inputTurno").value = guardado.turno || "";
        if (document.getElementById("inputNroClase")) document.getElementById("inputNroClase").value = guardado.nroClase || "";
        if (document.getElementById("inputDia")) document.getElementById("inputDia").value = guardado.dia || "";
    }
}

function limpiarPlanificacion() {
    if (confirm("¿Vaciar todos los ejercicios de la planificación actual?")) {
        bloquesClase = { "Acondicionamiento": [], "Trabajo Central": [], "Cierre": [] };
        guardarYActualizar();
    }
}

// CARGA INICIAL DE DATOS BASE
async function cargarSemillaInicial() {
    const ejerciciosBase = [
        { nombre: "Footwork", aparato: "Reformer", nivel: "Inicial", resortes: "2 Rojos, 1 Azul", descripcion: "Alineación de pies y piernas.", transicion: "Mantener carro cerrado", imagen: "", variaciones: [] },
        { nombre: "The Hundred", aparato: "Mat", nivel: "Inicial", resortes: "-", descripcion: "Bombeo de brazos y activación del centro.", transicion: "Rodar hacia arriba", imagen: "", variaciones: [] },
        { nombre: "Short Spine", aparato: "Reformer", nivel: "Intermedio", resortes: "2 Rojos", descripcion: "Articulación de columna.", transicion: "Quitar correas", imagen: "", variaciones: [] }
    ];

    try {
        const batch = db.batch();
        ejerciciosBase.forEach(ej => {
            const docRef = coleccionEjercicios.doc();
            batch.set(docRef, ej);
        });
        await batch.commit();
        cargarBibliotecaDirecta();
    } catch (e) {
        console.error("Error al cargar semilla:", e);
    }
}

// MODAL DE VARIANTES
function abrirModalVariantes(idEjercicio) {
    const ej = bibliotecaEjercicios.find(e => String(e.id) === String(idEjercicio));
    if (!ej || !ej.variaciones) return;

    const modal = document.getElementById("modalVariantes");
    const container = document.getElementById("contenidoVariantesModal");
    if (!modal || !container) return;

    const opcionesBloquesHTML = Object.keys(bloquesClase).map(nombreBloque => 
        `<option value="${escapeHTML(nombreBloque)}">${escapeHTML(nombreBloque)}</option>`
    ).join('');

    let htmlModal = `<h3>${escapeHTML(ej.nombre)} - Variantes</h3><hr>`;
    ej.variaciones.forEach((v, index) => {
        htmlModal += `
            <div style="background:#f9f9f9; padding:10px; margin-bottom:8px; border:1px solid #ddd; border-radius:4px;">
                <strong>🔹 ${escapeHTML(v.nombreVariacion)}</strong>
                <p style="font-size:0.85rem; margin:4px 0;">${escapeHTML(v.accion || '')}</p>
                <select onchange="agregarVarianteABloque('${ej.id}', ${index}, this.value); cerrarModalVariantes();" style="width:100%; padding:4px;">
                    <option value="">+ Seleccionar para bloque...</option>
                    ${opcionesBloquesHTML}
                </select>
            </div>
        `;
    });

    container.innerHTML = htmlModal;
    modal.style.display = "flex";
}

function cerrarModalVariantes() {
    const modal = document.getElementById("modalVariantes");
    if (modal) modal.style.display = "none";
}

function agregarVarianteABloque(idEjercicioPadre, indexVariacion, nombreBloque) {
    if (!nombreBloque) return;
    const ejPadre = bibliotecaEjercicios.find(e => String(e.id) === String(idEjercicioPadre));
    if (!ejPadre || !ejPadre.variaciones || !ejPadre.variaciones[indexVariacion]) return;

    const variante = ejPadre.variaciones[indexVariacion];
    const nuevoItem = {
        id: ejPadre.id || "",
        nombre: `${ejPadre.nombre} (${variante.nombreVariacion})`,
        aparato: ejPadre.aparato || "",
        nivel: ejPadre.nivel || "",
        imagen: variante.imagen || ejPadre.imagen || "",
        uniqueId: generarIDUnico(),
        descripcionEditable: variante.accion || ejPadre.descripcion || "",
        dosificacionEditable: variante.resortes ? `Carga: ${variante.resortes}` : (ejPadre.resortes ? `Carga: ${ejPadre.resortes}` : "10-12 reps"),
        transicionEditable: ejPadre.transicion || ""
    };

    if (!bloquesClase[nombreBloque]) bloquesClase[nombreBloque] = [];
    bloquesClase[nombreBloque].push(nuevoItem);
    guardarYActualizar();
}
// ==========================================
// FUNCIÓN PARA MOVER EJERCICIOS (SUBIR / BAJAR)
// ==========================================
window.moverEjercicio = function(nombreBloque, indexActual, direccion, event) {
    // 1. Detener cualquier otro comportamiento o recarga del navegador
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // 2. Convertir a número para asegurar la operación matemática
    const idx = parseInt(indexActual, 10);
    const dir = parseInt(direccion, 10);

    if (isNaN(idx) || isNaN(dir) || !bloquesClase || !bloquesClase[nombreBloque]) {
        console.error("Error al intentar mover el ejercicio:", nombreBloque, indexActual);
        return;
    }

    const lista = bloquesClase[nombreBloque];
    const nuevoIndex = idx + dir;

    // 3. Verificar que el movimiento esté dentro de los límites de la lista
    if (nuevoIndex < 0 || nuevoIndex >= lista.length) return;

    // 4. Intercambiar posiciones en el arreglo
    const ejercicioTemporal = lista[idx];
    lista[idx] = lista[nuevoIndex];
    lista[nuevoIndex] = ejercicioTemporal;

    // 5. Guardar en localStorage y actualizar la pantalla inmediatamente
    guardarYActualizar();
};