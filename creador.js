// Referencia a la colección en Firebase Firestore
const coleccionEjercicios = db.collection('ejercicios');

// Configuración de Drag & Drop para imágenes
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("nuevaImagenFile");
const dropZoneText = document.getElementById("dropZoneText");
let archivoSeleccionado = null;

if (dropZone && fileInput) {
    dropZone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
            archivoSeleccionado = e.target.files[0];
            dropZoneText.innerHTML = `✅ Archivo seleccionado: <strong>${archivoSeleccionado.name}</strong>`;
        }
    });

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
        dropZone.addEventListener("dragenter", () => {
            dropZone.style.backgroundColor = "#e6f0fa";
            dropZone.style.borderColor = "#007bff";
        }, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
        dropZone.addEventListener(eventName, () => {
            dropZone.style.backgroundColor = "#fafafa";
            dropZone.style.borderColor = "#ccc";
        }, false);
    });

    dropZone.addEventListener("drop", (e) => {
        const dt = e.dataTransfer;
        if (dt.files && dt.files[0]) {
            const file = dt.files[0];
            if (file.type.startsWith("image/")) {
                archivoSeleccionado = file;
                dropZoneText.innerHTML = `✅ Imagen cargada: <strong>${file.name}</strong>`;
            } else {
                alert("Por favor, sube únicamente archivos de imagen.");
            }
        }
    });
}

// Envío y procesado del formulario con Firebase
document.getElementById("formEjercicio").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nuevoNombre").value.trim();
    const aparato = document.getElementById("nuevoAparato").value;
    const nivel = document.getElementById("nuevoNivel").value;
    const resortes = document.getElementById("nuevoResortes").value.trim();
    const bloqueSugerido = document.getElementById("nuevoBloque").value;
    const descripcion = document.getElementById("nuevaDescripcion").value.trim();

    const guardarEnFirebase = async (imagenBase64) => {
        try {
            const nuevoEj = {
                nombre,
                aparato,
                nivel,
                resortes,
                bloqueSugerido,
                descripcion,
                imagen: imagenBase64 || "",
                creadoEn: firebase.firestore.FieldValue.serverTimestamp()
            };

            await coleccionEjercicios.add(nuevoEj);

            alert("¡Ejercicio guardado con éxito en la biblioteca!");
            document.getElementById("formEjercicio").reset();
            
            archivoSeleccionado = null;
            if (dropZoneText) {
                dropZoneText.innerHTML = '📷 Arrastra tu imagen aquí o <span style="color: #007bff; text-decoration: underline;">haz clic para seleccionar</span>';
            }
        } catch (error) {
            console.error("Error al guardar en Firebase:", error);
            alert("Ocurrió un error al guardar el ejercicio en Firebase.");
        }
    };

    if (archivoSeleccionado) {
        const reader = new FileReader();
        reader.onload = function (event) {
            guardarEnFirebase(event.target.result);
        };
        reader.readAsDataURL(archivoSeleccionado);
    } else {
        guardarEnFirebase("");
    }
});

// Renderizar la lista de ejercicios personalizados en tiempo real desde Firebase
function escucharEjerciciosCreados() {
    const contenedor = document.getElementById("listaPersonalizados");
    if (!contenedor) return;

    coleccionEjercicios.orderBy("creadoEn", "desc").onSnapshot((snapshot) => {
        contenedor.innerHTML = "";

        if (snapshot.empty) {
            contenedor.innerHTML = "<p style='color: #888; font-style: italic; font-size: 0.9rem;'>Aún no has creado ningún ejercicio personalizado.</p>";
            return;
        }

        snapshot.forEach((doc) => {
            const ex = doc.data();
            const docId = doc.id;

            const div = document.createElement("div");
            div.className = "bloque-item";
            div.style.alignItems = "flex-start";
            div.innerHTML = `
                <div style="flex: 1;">
                    <span class="badge">${ex.aparato || ''} • ${ex.nivel || ''}</span>
                    <strong>${ex.nombre || 'Sin nombre'}</strong><br>
                    <small style="color: #666;">Carga: ${ex.resortes || 'N/A'} | Bloque: ${ex.bloqueSugerido || 'N/A'}</small><br>
                    <p style="font-size: 0.8rem; color: #444; margin: 4px 0 0 0;"><em>${ex.descripcion || ''}</em></p>
                </div>
                <button class="delete-btn" onclick="eliminarEjercicio('${docId}')" title="Eliminar ejercicio">×</button>
            `;
            contenedor.appendChild(div);
        });
    }, (error) => {
        console.error("Error al cargar lista de ejercicios:", error);
    });
}

// Eliminar ejercicio de Firebase por su ID
async function eliminarEjercicio(docId) {
    if (confirm("¿Estás seguro de que deseas eliminar este ejercicio de Firebase?")) {
        try {
            await coleccionEjercicios.doc(docId).delete();
        } catch (error) {
            console.error("Error al eliminar el ejercicio:", error);
            alert("No se pudo eliminar el ejercicio.");
        }
    }
}

// Iniciar la escucha en tiempo real
escucharEjerciciosCreados();
document.getElementById('btnAgregarVariante').addEventListener('click', () => {
    const contenedor = document.getElementById('contenedor-variantes');
    const index = contenedor.children.length + 1;

    const div = document.createElement('div');
    div.className = 'bloque-variante';
    div.style.cssText = 'background: #f8f9fa; border: 1px solid #dfe6e9; border-radius: 6px; padding: 12px; margin-bottom: 10px; position: relative;';

    div.innerHTML = `
        <button type="button" onclick="this.parentElement.remove()" class="delete-btn" style="position: absolute; top: 8px; right: 8px;">✕</button>
        <span class="badge">Variante #${index}</span>
        
        <div style="margin-top: 8px;">
            <input type="text" class="var-nombre" placeholder="Nombre de la variante (Ej: Toes - Metatarsos)" required style="width: 100%; padding: 8px; margin-bottom: 6px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
            <input type="text" class="var-accion" placeholder="Acción / Indicación específica" style="width: 100%; padding: 8px; margin-bottom: 6px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
            <input type="text" class="var-resortes" placeholder="Resortes específicos (opcional)" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        </div>
    `;

    contenedor.appendChild(div);
});
// Obtener variantes
const bloquesVariantes = document.querySelectorAll('.bloque-variante');
const variaciones = [];

bloquesVariantes.forEach(bloque => {
    const nombreVar = bloque.querySelector('.var-nombre').value.trim();
    const accionVar = bloque.querySelector('.var-accion').value.trim();
    const resortesVar = bloque.querySelector('.var-resortes').value.trim();

    if (nombreVar) {
        variaciones.push({
            nombreVariacion: nombreVar,
            accion: accionVar,
            resortes: resortesVar
        });
    }
});

// Función para celular

let urlImagenSubida = "";

// 1. Mostrar vista previa al tomar la foto
function previsualizarFoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const imgPreview = document.getElementById("imgPreview");
    const contenedorPreview = document.getElementById("contenedorPreview");

    // Crear una URL temporal local para mostrarla de inmediato en la pantalla
    imgPreview.src = URL.createObjectURL(file);
    contenedorPreview.style.display = "block";
}

// 2. Función para subir la foto a ImgBB
async function subirFotoAImgBB(archivoImagen) {
    const IMGBB_API_KEY = "1f537445826db544cbc96c9b55abe381";
    const formData = new FormData();
    formData.append("image", archivoImagen);

    try {
        const respuesta = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData
        });

        const resultado = await respuesta.json();
        if (resultado.success) {
            return resultado.data.url; // Devuelve la URL de la foto pública
        } else {
            console.error("Error ImgBB:", resultado);
            return null;
        }
    } catch (error) {
        console.error("Error al subir imagen:", error);
        return null;
    }
}

// 3. Guardar el Ejercicio con la foto tomada
async function guardarEjercicioCreado(event) {
    if (event) event.preventDefault();

    const nombre = document.getElementById("inputNombre")?.value || "";
    const aparato = document.getElementById("inputAparato")?.value || "Reformer";
    const nivel = document.getElementById("inputNivel")?.value || "Inicial";
    const descripcion = document.getElementById("inputDescripcion")?.value || "";
    const fileInput = document.getElementById("inputImagenFile");

    if (!nombre.trim()) {
        alert("Por favor ingresa un nombre para el ejercicio.");
        return;
    }

    let urlFinalFoto = "";

    // Si el usuario tomó o seleccionó una foto
    if (fileInput && fileInput.files.length > 0) {
        const fotoTomada = fileInput.files[0];
        // Mostrar aviso visual de carga
        const btnGuardar = document.getElementById("btnGuardarEjercicio");
        if (btnGuardar) {
            btnGuardar.disabled = true;
            btnGuardar.innerText = "Subiendo foto y guardando...";
        }

        urlFinalFoto = await subirFotoAImgBB(fotoTomada);
        
        if (!urlFinalFoto) {
            alert("No se pudo subir la foto. Se guardará sin imagen.");
            urlFinalFoto = "";
        }
    }

    // Objeto del nuevo ejercicio
    const nuevoEjercicio = {
        nombre: nombre,
        aparato: aparato,
        nivel: nivel,
        descripcion: descripcion,
        imagen: urlFinalFoto, // Guarda la URL de la foto sacada desde el celular
        variaciones: []
    };

    try {
        await db.collection("ejercicios").add(nuevoEjercicio);
        alert("¡Ejercicio creado con éxito!");
        window.location.href = "index.html"; // Regresar al planificador
    } catch (error) {
        console.error("Error guardando en Firestore:", error);
        alert("Ocurrió un error al guardar el ejercicio.");
    }
}
