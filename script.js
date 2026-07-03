// CLAN Y BASE DE DATOS LOCAL S.C.L
let usuario = {
    alias: "Daniale Useche",
    rango: "E (Fledgling)",
    rol: "Luchador",
    gremio: "Ninguno",
    exp: 45
};

let cazadoresGremio = [
    { alias: "Daniale Useche", rango: "S (Monarca)", clase: "Invocador", gremio: "Gremio Colmillo Blanco" },
    { alias: "Daniel", rango: "A (Cazador Veterano)", clase: "Tipo Hechicero", gremio: "Gremio Cazadores de Almas" },
    { alias: "Grizzly_Marcial", rango: "B", clase: "Luchador", gremio: "Gremio Puño de Oro" }
];

let catalogoHistorias = [
    { id: 1, titulo: "Efecto Vexter", autor: "Daniale Useche", estilo: "Fantasía Oscura", lecturas: 124, contenido: "Las grietas temporales comenzaron a expandirse sobre los muros de la ciudad vieja. El efecto Vexter no era una simple anomalía, era una fuerza devoradora que transformaba el éter en cadenas físicas..." },
    { id: 2, titulo: "La Caída del Pulso de Oro", autor: "Daniel", estilo: "Acción / Marcial", lecturas: 98, contenido: "El maestro del templo miró sus puños por última vez. La energía dorada que una vez fluyó como un río ahora se apagaba. Frente a él, el ejército oscuro esperaba el colapso de la barrera." }
];

let mazmorrasActivadas = [
    { nombre: "Puerta de Rango A: El Vacío de Vexter", dificultad: "Alta", recompensa: "Núcleo de Sombra + 150 EXP" },
    { nombre: "Incursión Rango S: El Despertar del Pulso", dificultad: "Pesadilla", recompensa: "Título Legendario + Runa Divina" }
];

// INICIALIZACIÓN DE LA APLICACIÓN
document.addEventListener("DOMContentLoaded", () => {
    actualizarInterfazPerfil();
    cargarEstanteriaVisual();
    cargarDirectorioCazadores();
    cargarTablonMazmorras();

    document.getElementById("btnDespertar").addEventListener("click", ejecutarDespertar);
    document.getElementById("btnPublicar").addEventListener("click", publicarManuscrito);
});

// NAVEGACIÓN ENTRE PANELES
function navegarA(idSeccion) {
    document.querySelectorAll(".seccion-panel").forEach(panel => panel.classList.remove("activa"));
    document.querySelectorAll(".menu-btn").forEach(btn => btn.classList.remove("activo"));
    
    document.getElementById(idSeccion).classList.add("activa");
    event.currentTarget.classList.add("activo");
    logSistema(`Navegando a sector de control: ${idSeccion}`);
}

// LÓGICA DE PERFIL Y MEJORAS
function actualizarInterfazPerfil() {
    const contenedor = document.getElementById("datosPerfil");
    contenedor.innerHTML = `
        <div class="stats-cazador">
            <p><strong>Alias del Cazador:</strong> ${usuario.alias}</p>
            <p><strong>Rango de Energía:</strong> <span style="color:#ffaa00; font-weight:bold;">[Rango ${usuario.rango}]</span></p>
            <p><strong>Clase de Combate:</strong> ${usuario.rol}</p>
            <p><strong>Gremio Afiliado:</strong> ${usuario.gremio}</p>
            <p><strong>Puntos de EXP Acumulados:</strong> ${usuario.exp} PTS</p>
        </div>
    `;
}

function cambiarRol() {
    usuario.rol = document.getElementById("selectorRol").value;
    actualizarInterfazPerfil();
    logSistema(`Clase cambiada exitosamente a: ${usuario.rol}`);
}

function cambiarGremio() {
    usuario.gremio = document.getElementById("selectorGremio").value;
    const info = document.getElementById("infoGremioDetalle");
    if(usuario.gremio === "Ninguno") {
        info.innerHTML = "Operando como cazador independiente sin penalizaciones de facción.";
    } else {
        info.innerHTML = `Sincronizado con los cuarteles del **${usuario.gremio}**. Multiplicador estético activado.`;
    }
    actualizarInterfazPerfil();
    logSistema(`Afiliación actualizada: ${usuario.gremio}`);
}

function ejecutarDespertar() {
    const rangos = ["D (Explorador)", "C (Guerrero)", "B (Élite)", "A (Cazador Veterano)", "S (Monarca)"];
    const rangoAzar = rangos[Math.floor(Math.random() * rangos.length)];
    usuario.rango = rangoAzar;
    usuario.exp += 25;
    actualizarInterfazPerfil();
    logSistema(`¡ALERTA DE DESPERTAR! Nuevo rango asignado: Rango ${rangoAzar}. (+25 EXP)`);
}

// SISTEMA DE LA ESTANTERÍA VISUAL (CON LECTURA REAL)
function cargarEstanteriaVisual() {
    const estanteria = document.getElementById("estanteriaVisual");
    estanteria.innerHTML = "";

    catalogoHistorias.forEach(obra => {
        let claseDiseño = "portada-fantasia";
        if(obra.estilo === "Terror / Horror") claseDiseño = "portada-terror";
        if(obra.estilo === "Acción / Marcial") claseDiseño = "portada-accion";
        if(obra.estilo === "Fanfiction") claseDiseño = "portada-fanfiction";

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-historia";
        tarjeta.setAttribute("onclick", `abrirManuscritoParaLeer(${obra.id})`);

        tarjeta.innerHTML = `
            <div class="portada-historia ${claseDiseño}">
                <h3>${obra.titulo}</h3>
            </div>
            <div class="info-historia">
                <p>Por: <strong>${obra.autor}</strong></p>
                <p>Lecturas: <strong id="cont-${obra.id}">${obra.lecturas}</strong> 👀</p>
            </div>
        `;
        estanteria.appendChild(tarjeta);
    });
}

// FUNCIONES NUEVAS PARA LA LECTURA REAL
function abrirManuscritoParaLeer(idObra) {
    const obra = catalogoHistorias.find(h => h.id === idObra);
    if(obra) {
        // Subir contador de lecturas de mentira y actualizar visual
        obra.lecturas++;
        document.getElementById(`cont-${idObra}`).innerText = obra.lecturas;

        // Inyectar datos en la pantalla flotante
        document.getElementById("lecturaTitulo").innerText = obra.titulo;
        document.getElementById("lecturaAutor").innerText = obra.autor;
        document.getElementById("lecturaEstilo").innerText = obra.estilo;
        document.getElementById("lecturaContenido").innerText = obra.contenido;

        // Mostrar la pantalla flotante
        document.getElementById("modalLectura").classList.add("abierto");
        logSistema(`Abriendo pergamino: "${obra.titulo}" para lectura completa.`);
    }
}

function cerrarLectura() {
    document.getElementById("modalLectura").classList.remove("abierto");
}

function filtrarHistorias() {
    const filtro = document.getElementById("filtroEstilo").value;
    logSistema(`Filtrando repertorio por categoría: ${filtro}`);
    // En versiones futuras aplicaremos la ocultación de nodos, por ahora confirma el log rúnico.
}

// PUBLICAR MANUSCRITOS EN TIEMPO REAL
function publicarManuscrito() {
    const titulo = document.getElementById("tituloHistoria").value;
    const estilo = document.getElementById("estiloHistoria").value;
    const contenido = document.getElementById("contenidoHistoria").value;

    if(!titulo || !contenido) {
        alert("⚠️ Error de inyección: El título y las líneas del manuscrito no pueden estar vacías.");
        return;
    }

    const nuevaObra = {
        id: catalogoHistorias.length + 1,
        titulo: titulo,
        autor: usuario.alias,
        estilo: estilo,
        lecturas: 0,
        contenido: contenido
    };

    catalogoHistorias.push(nuevaObra);
    usuario.exp += 15;
    
    // Limpiar entradas
    document.getElementById("tituloHistoria").value = "";
    document.getElementById("contenidoHistoria").value = "";

    actualizarInterfazPerfil();
    cargarEstanteriaVisual();
    logSistema(`Éxito: "${titulo}" inyectado al Tablón de la Estantería. (+15 EXP)`);
    alert(`⚡ ¡Manuscrito publicado con éxito en el gremio! Ganaste +15 de EXP.`);
}

// COMPONENTES SECUNDARIOS
function cargarDirectorioCazadores() {
    const lista = document.getElementById("listaCazadores");
    lista.innerHTML = "";
    cazadoresGremio.forEach(c => {
        lista.innerHTML += `
            <div style="background:#111827; padding:10px; margin-bottom:8px; border-left:2px solid #d946ef; font-size:0.85em;">
                ⚔️ <strong>${c.alias}</strong> — Rango: <span style="color:#00d2ff">${c.rango}</span> | Gremio: ${c.gremio}
            </div>
        `;
    });
}

function buscarCazadores() {
    logSistema("Rastreando firmas de energía en el radar...");
}

function cargarTablonMazmorras() {
    const panel = document.getElementById("tablonMazmorras");
    panel.innerHTML = "";
    mazmorrasActivadas.forEach(m => {
        panel.innerHTML += `
            <div style="border: 1px dashed #ffaa00; background:#05070b; padding:15px; margin-bottom:12px; border-radius:4px;">
                <p style="color:#ffaa00; font-weight:bold;">${m.nombre}</p>
                <p style="font-size:0.8em; color:#9ca3af;">Dificultad: ${m.dificultad} | Botín esperado: ${m.recompensa}</p>
            </div>
        `;
    });
}

function logSistema(mensaje) {
    document.getElementById("pantallaLogs").innerText = `⚡ [SISTEMA] ${mensaje}`;
}
