// CLAN Y BASE DE DATOS LOCAL S.C.L
let usuario = {
    alias: "Daniale Useche",
    rango: "E", // Rangos puros: E, D, C, B, A, S
    rol: "Luchador",
    gremio: "Ninguno",
    exp: 45
};

// Escala de poder para el bloqueo de mazmorras
const escalaRangos = { "E": 1, "D": 2, "C": 3, "B": 4, "A": 5, "S": 6, "MÍTICO": 7 };

let cazadoresGremio = [
    { alias: "Daniale Useche", rango: "S", clase: "Invocador", gremio: "Gremio Colmillo Blanco" },
    { alias: "Daniel", rango: "A", clase: "Tipo Hechicero", gremio: "Gremio Cazadores de Almas" },
    { alias: "Grizzly_Marcial", rango: "B", clase: "Luchador", gremio: "Gremio Puño de Oro" }
];

let catalogoHistorias = [
    { id: 1, titulo: "Efecto Vexter", autor: "Daniale Useche", estilo: "Fantasía Oscura", lecturas: 124, contenido: "Las grietas temporales comenzaron a expandirse sobre los muros de la ciudad vieja. El efecto Vexter no era una simple anomalía, era una fuerza devoradora que transformaba el éter en cadenas físicas..." },
    { id: 2, titulo: "La Caída del Pulso de Oro", autor: "Daniel", estilo: "Acción / Marcial", lecturas: 98, contenido: "El maestro del templo miró sus puños por última vez. La energía dorada que una vez fluyó como un río ahora se apagaba. Frente a él, el ejército oscuro esperaba el colapso de la barrera." }
];

// LAS 7 MAZMORRAS DE RANGO EXCLUSIVO (CON CRÓNICAS PRIVADAS Y RELOJES EN SEGUNDOS)
let mazmorrasActivadas = [
    { id: 1, nombre: "Portal de Rango E: Sótano de las Sombras", rangoRequerido: "E", tiempoRestante: 600, estado: "activo", cronicas: [] },
    { id: 2, nombre: "Portal de Rango D: Catacumbas Olvidadas", rangoRequerido: "D", tiempoRestante: 500, estado: "activo", cronicas: [] },
    { id: 3, nombre: "Portal de Rango C: El Nido de los Vexters", rangoRequerido: "C", tiempoRestante: 400, estado: "activo", cronicas: [] },
    { id: 4, nombre: "Portal de Rango B: Guarida de la Luna Sangrienta", rangoRequerido: "B", tiempoRestante: 300, estado: "activo", cronicas: [] },
    { id: 5, nombre: "Portal de Rango A: Ruinas del Pulso Perdido", rangoRequerido: "A", tiempoRestante: 200, estado: "activo", cronicas: [] },
    { id: 6, nombre: "Portal de Rango S: El Trono del Monarca Sombra", rangoRequerido: "S", tiempoRestante: 150, estado: "activo", cronicas: [] },
    { id: 7, nombre: "Incursión Especial: Dimensión Mítica Prohibida", rangoRequerido: "MÍTICO", tiempoRestante: 90, estado: "activo", cronicas: [] }
];

// INICIALIZACIÓN DE LA APLICACIÓN
document.addEventListener("DOMContentLoaded", () => {
    actualizarInterfazPerfil();
    cargarEstanteriaVisual();
    cargarDirectorioCazadores();
    cargarTablonMazmorras();
    iniciarTemporizadoresMazmorras();

    document.getElementById("btnDespertar").addEventListener("click", ejecutarDespertar);
    document.getElementById("btnPublicar").addEventListener("click", publicarManuscrito);
});

// NAVEGACIÓN
function navegarA(idSeccion) {
    document.querySelectorAll(".seccion-panel").forEach(panel => panel.classList.remove("activa"));
    document.querySelectorAll(".menu-btn").forEach(btn => btn.classList.remove("activo"));
    
    document.getElementById(idSeccion).classList.add("activa");
    event.currentTarget.classList.add("activo");
    logSistema(`Navegando a sector de control: ${idSeccion}`);
}

// LÓGICA DE PERFIL
function actualizarInterfazPerfil() {
    const contenedor = document.getElementById("datosPerfil");
    contenedor.innerHTML = `
        <div class="stats-cazador">
            <p><strong>Alias del Cazador:</strong> ${usuario.alias}</p>
            <p><strong>Rango de Energía Actual:</strong> <span style="color:#ffaa00; font-weight:bold;">[Rango ${usuario.rango}]</span></p>
            <p><strong>Clase de Combate:</strong> ${usuario.rol}</p>
            <p><strong>Gremio Afiliado:</strong> ${usuario.gremio}</p>
            <p><strong>Puntos de EXP Acumulados:</strong> ${usuario.exp} PTS</p>
        </div>
    `;
    // Volver a renderizar las mazmorras por si el rango del cazador cambió al despertar
    if(document.getElementById("tablonMazmorras")) cargarTablonMazmorras();
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
        info.innerHTML = "Operando como cazador independiente sin penalizaciones.";
    } else {
        info.innerHTML = `Sincronizado con los cuarteles del **${usuario.gremio}**.`;
    }
    actualizarInterfazPerfil();
}

function ejecutarDespertar() {
    const rangos = ["E", "D", "C", "B", "A", "S", "MÍTICO"];
    const rangoAzar = rangos[Math.floor(Math.random() * rangos.length)];
    usuario.rango = rangoAzar;
    usuario.exp += 25;
    actualizarInterfazPerfil();
    logSistema(`¡DESPERTAR EJECUTADO! Rango de energía actual reconfigurado a: ${rangoAzar}.`);
}

// CARGAR LAS 7 MAZMORRAS CON RESTRICCIONES
function cargarTablonMazmorras() {
    const panel = document.getElementById("tablonMazmorras");
    if (!panel) return;
    panel.innerHTML = "";

    const poderCazador = escalaRangos[usuario.rango] || 1;

    mazmorrasActivadas.forEach(m => {
        const poderRequerido = escalaRangos[m.rangoRequerido];
        let claseEstado = "desbloqueada";
        let deshabilitadoHtml = "";
        let textoBoton = "⚔️ Entrar a la Incursión";

        if (m.estado === "cerrado") {
            claseEstado = "cerrada";
            textoBoton = "🔒 PORTAL COLAPSADO (CERRADO)";
            deshabilitadoHtml = "disabled";
        } else if (poderCazador < poderRequerido) {
            claseEstado = "bloqueada";
            textoBoton = `🔒 Rango ${m.rangoRequerido} Obligatorio`;
            deshabilitadoHtml = "disabled";
        }

        // Convertir segundos del reloj a formato bonito (MM:SS)
        const min = Math.floor(m.tiempoRestante / 60);
        const seg = m.tiempoRestante % 60;
        const textoTimer = m.estado === "activo" ? `⏳ Cierre en: ${min}:${seg < 10 ? '0' : ''}${seg}` : "⌛ Tiempo Expirado";

        const tarjeta = document.createElement("div");
        tarjeta.id = `maz-${m.id}`;
        tarjeta.className = `tarjeta-mazmorra ${claseEstado}`;
        
        // Generar lista de manuscritos guardados dentro de esta mazmorra
        let cronicasHtml = "";
        if (m.cronicas.length === 0) {
            cronicasHtml = `<p style="color:#6b7280; font-size:0.85em;">No hay registros literarios en esta incursión aún.</p>`;
        } else {
            m.cronicas.forEach((cro, idx) => {
                cronicasHtml += `
                    <div style="background:#1f2937; padding:8px; border-radius:4px; margin-bottom:5px; border-left:2px solid #00d2ff; cursor:pointer;" onclick="event.stopPropagation(); verCronicaMazmorra(${m.id}, ${idx})">
                        📖 <strong>${cro.titulo}</strong> <span style="font-size:0.75em; color:#9ca3af;">(por ${cro.autor})</span>
                    </div>
                `;
            });
        }

        tarjeta.innerHTML = `
            <span class="timer-mazmorra" id="timer-val-${m.id}">${textoTimer}</span>
            <p style="font-weight:bold; color: ${m.estado === 'activo' ? '#ffaa00' : '#ff0055'}; font-size:1.1em;">
                <span class="badge-rango">RANGO ${m.rangoRequerido}</span> ${m.nombre}
            </p>
            <div class="menu-separador" style="margin:10px 0;"></div>
            
            <button class="action-btn" style="padding:6px 12px; font-size:0.8em; width:auto; margin-bottom:10px;" ${deshabilitadoHtml} onclick="alternarDetallesMazmorra(${m.id})">
                ${textoBoton}
            </button>

            <!-- PANEL INTERNO EXCLUSIVO DE LA MAZMORRA -->
            <div class="cronicas-contenedor">
                <h4 style="font-size:0.9em; color:#00d2ff; margin-bottom:8px;">📜 Crónicas Selladas en este Portal:</h4>
                <div id="lista-cronicas-${m.id}">${cronicasHtml}</div>
                
                <div class="menu-separador" style="margin:10px 0;"></div>
                
                <h4 style="font-size:0.9em; color:#ffaa00; margin-bottom:8px;">✍️ Sellar Nuevo Registro en la Incursión:</h4>
                <input type="text" id="tit-maz-${m.id}" placeholder="Título de la crónica de combate..." style="padding:6px; font-size:0.85em; margin-bottom:8px;">
                <textarea id="txt-maz-${m.id}" rows="3" placeholder="Escribe el manuscrito que se quedará resguardado en este portal..." style="padding:6px; font-size:0.85em; margin-bottom:8px;"></textarea>
                <button class="action-btn" style="padding:5px 10px; font-size:0.8em;" onclick="publicarEnMazmorra(${m.id})">🚀 Inyectar a este Portal (+20 EXP)</button>
            </div>
        `;
        panel.appendChild(tarjeta);
    });
}

// DESPLEGAR O CERRAR EL EDITOR INTERNO DE LA MAZMORRA
function alternarDetallesMazmorra(id) {
    const el = document.getElementById(`maz-${id}`);
    el.classList.toggle("abierta-detalles");
}

// PUBLICAR EXCLUSIVAMENTE ADENTRO DE UNA MAZMORRA
function publicarEnMazmorra(id) {
    const m = mazmorrasActivadas.find(maz => maz.id === id);
    if (!m || m.estado === "cerrado") return;

    const titulo = document.getElementById(`tit-maz-${id}`).value;
    const contenido = document.getElementById(`txt-maz-${id}`).value;

    if (!titulo || !contenido) {
        alert("⚠️ No puedes sellar una crónica vacía.");
        return;
    }

    m.cronicas.push({
        titulo: titulo,
        autor: usuario.alias,
        contenido: contenido
    });

    usuario.exp += 20;
    actualizarInterfazPerfil();
    logSistema(`Crónica "${titulo}" guardada de forma exclusiva en: ${m.nombre}. (+20 EXP)`);
    alert(`⚡ Manuscrito resguardado dentro del portal. No aparecerá en la estantería general.`);
}

// LEER CRÓNICA INTERNA
function verCronicaMazmorra(mazId, cronicaIdx) {
    const m = mazmorrasActivadas.find(maz => maz.id === mazId);
    if (!m) return;
    const cro = m.cronicas[cronicaIdx];
    if (cro) {
        document.getElementById("lecturaTitulo").innerText = cro.titulo;
        document.getElementById("lecturaAutor").innerText = cro.autor;
        document.getElementById("lecturaEstilo").innerText = "Crónica de Combate Privada";
        document.getElementById("lecturaContenido").innerText = cro.contenido;
        document.getElementById("modalLectura").classList.add("abierto");
    }
}

// RECURSOS COMPLEMENTARIOS DE REPERTORIO GENERAL
function cargarEstanteriaVisual() {
    const estanteria = document.getElementById("estanteriaVisual");
    if(!estanteria) return;
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
            <div class="portada-historia ${claseDiseño}"><h3>${obra.titulo}</h3></div>
            <div class="info-historia">
                <p>Por: <strong>${obra.autor}</strong></p>
                <p>Lecturas: <strong id="cont-${obra.id}">${obra.lecturas}</strong> 👀</p>
            </div>
        `;
        estanteria.appendChild(tarjeta);
    });
}

function abrirManuscritoParaLeer(idObra) {
    const obra = catalogoHistorias.find(h => h.id === idObra);
    if(obra) {
        obra.lecturas++;
        document.getElementById(`cont-${idObra}`).innerText = obra.lecturas;
        document.getElementById("lecturaTitulo").innerText = obra.titulo;
        document.getElementById("lecturaAutor").innerText = obra.autor;
        document.getElementById("lecturaEstilo").innerText = obra.style || obra.estilo;
        document.getElementById("lecturaContenido").innerText = obra.contenido;
        document.getElementById("modalLectura").classList.add("abierto");
    }
}

function cerrarLectura() { document.getElementById("modalLectura").classList.remove("abierto"); }
function publicarManuscrito() {
    const titulo = document.getElementById("tituloHistoria").value;
    const estilo = document.getElementById("estiloHistoria").value;
    const contenido = document.getElementById("contenidoHistoria").value;
    if(!titulo || !contenido) return alert("Rellena los campos.");
    catalogoHistorias.push({ id: catalogoHistorias.length + 1, titulo, autor: usuario.alias, estilo, lecturas: 0, contenido });
    usuario.exp += 15;
    document.getElementById("tituloHistoria").value = "";
    document.getElementById("contenidoHistoria").value = "";
    actualizarInterfazPerfil(); cargarEstanteriaVisual();
}
function filtrarHistorias() {}
function cargarDirectorioCazadores() {}
function buscarCazadores() {}

// RELOJ DE CONTROL PARA LAS MAZMORRAS DE TIEMPO REAL
function iniciarTemporizadoresMazmorras() {
    setInterval(() => {
        mazmorrasActivadas.forEach(m => {
            if (m.estado === "activo") {
                m.tiempoRestante--;
                
                // Actualizar el numerito en pantalla de inmediato sin parpadeos
                const labelTimer = document.getElementById(`timer-val-${m.id}`);
                if (labelTimer) {
                    const min = Math.floor(m.tiempoRestante / 60);
                    const seg = m.tiempoRestante % 60;
                    labelTimer.innerText = `⏳ Cierre en: ${min}:${seg < 10 ? '0' : ''}${seg}`;
                }

                if (m.tiempoRestante <= 0) {
                    m.estado = "cerrado";
                    logSistema(`🚨 EL PORTAL HA COLAPSADO: "${m.nombre}" se ha cerrado.`);
                    cargarTablonMazmorras(); // Redibujar con candados rojos
                }
            }
        });
    }, 1000);
}

function logSistema(mensaje) {
    if(document.getElementById("pantallaLogs")) document.getElementById("pantallaLogs").innerText = `⚡ [SISTEMA] ${mensaje}`;
}
