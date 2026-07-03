// CLAN Y BASE DE DATOS LOCAL
let usuario = JSON.parse(localStorage.getItem("SCL_UsuarioDatos")) || {
    alias: "Daniale Useche",
    correo: "",
    telefono: "",
    edad: "",
    rango: "E",
    rol: "Luchador",
    gremio: "Ninguno",
    exp: 45,
    despertado: false
};

let gremioPropio = JSON.parse(localStorage.getItem("SCL_GremioPropio")) || {
    creado: false,
    nombre: "",
    miembros: []
};

// MÚSICA BASE + APARTADO AMPLIADO
const canalesMusicaBase = [
    { id: 1, nombre: "🎧 Frecuencia Synthwave Alfa", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 2, nombre: "🎹 Orquesta de las Sombras", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { id: 3, nombre: "🥁 Ritmo de Combate Marcial", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" }
];

let miAuraMusica = JSON.parse(localStorage.getItem("SCL_AuraMusica")) || canalesMusicaBase;

const escalaRangos = { "E": 1, "D": 2, "C": 3, "B": 4, "A": 5, "S": 6, "MÍTICO": 7 };

const historiasBase = [
    { id: 1, titulo: "Efecto Vexter", autor: "Daniale Useche", estilo: "Fantasía Oscura", lecturas: 124, contenido: "Las grietas temporales comenzaron a expandirse sobre los muros de la ciudad vieja. El efecto Vexter no era una simple anomalía..." },
    { id: 2, titulo: "La Caída del Pulso de Oro", autor: "Daniel", estilo: "Acción / Marcial", lecturas: 98, contenido: "El maestro del templo miró sus puños por última vez. La energía dorada que una vez fluyó como un río ahora se apagaba..." }
];

let catalogoHistorias = JSON.parse(localStorage.getItem("SCL_BaulHistorias")) || historiasBase;

let mazmorrasActivadas = JSON.parse(localStorage.getItem("SCL_Mazmorras")) || [
    { id: 1, nombre: "Portal de Rango E: Sótano de las Sombras", rangoRequerido: "E", tiempoRestante: 600, estado: "activo", cronicas: [] },
    { id: 2, nombre: "Portal de Rango D: Catacumbas Olvidadas", rangoRequerido: "D", tiempoRestante: 500, estado: "activo", cronicas: [] },
    { id: 3, nombre: "Portal de Rango C: El Nido de los Vexters", rangoRequerido: "C", tiempoRestante: 400, estado: "activo", cronicas: [] },
    { id: 4, nombre: "Portal de Rango B: Guarida de la Luna Sangrienta", rangoRequerido: "B", tiempoRestante: 300, estado: "activo", cronicas: [] },
    { id: 5, nombre: "Portal de Rango A: Ruinas del Pulso Perdido", rangoRequerido: "A", tiempoRestante: 200, estado: "activo", cronicas: [] },
    { id: 6, nombre: "Portal de Rango S: El Trono del Monarca Sombra", rangoRequerido: "S", tiempoRestante: 150, estado: "activo", cronicas: [] },
    { id: 7, nombre: "Incursión Especial: Dimensión Mítica Prohibida", rangoRequerido: "MÍTICO", tiempoRestante: 90, estado: "activo", cronicas: [] }
];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("regAlias").value = usuario.alias;
    document.getElementById("regCorreo").value = usuario.correo || "";
    document.getElementById("regTelefono").value = usuario.telefono || "";
    document.getElementById("regEdad").value = usuario.edad || "";

    actualizarInterfazPerfil();
    cargarEstanteriaVisual(catalogoHistorias);
    cargarTablonMazmorras();
    iniciarTemporizadoresMazmorras();
    verificarEstadoGremioPropio();
    actualizarListaCanalesMusica();
    
    // Alerta inicial de mazmorra según rango
    comprobarMazmorrasDisponiblesPorRango(false);

    document.getElementById("btnDespertar").addEventListener("click", ejecutarDespertarUnico);
    document.getElementById("btnPublicar").addEventListener("click", publicarManuscrito);
});

function navegarA(idSeccion) {
    document.querySelectorAll(".seccion-panel").forEach(panel => panel.classList.remove("activa"));
    document.querySelectorAll(".menu-btn").forEach(btn => btn.classList.remove("activo"));
    document.getElementById(idSeccion).classList.add("activa");
    if(event) event.currentTarget.classList.add("activo");
}

// ALERTA DE MAZMORRAS DISPONIBLES
function comprobarMazmorrasDisponiblesPorRango(esPorDespertar = false) {
    const portalesDeMiRango = mazmorrasActivadas.filter(m => m.rangoRequerido === usuario.rango && m.estado === "activo");
    
    if (portalesDeMiRango.length > 0) {
        const nombresPortales = portalesDeMiRango.map(p => p.nombre).join(", ");
        setTimeout(() => {
            alert(`🚨 [ALERTA DEL SISTEMA]\n\nCazador ${usuario.alias}, un portal compatible con tu poder [Rango ${usuario.rango}] ha sido detectado y se encuentra completamente disponible:\n\n⚔️ "${nombresPortales}"\n\n¡Ve al apartado de Mazmorras antes de que colapse!`);
        }, 800);
    }
}

// GUARDAR CREDENCIALES
function guardarDatosRegistro() {
    usuario.alias = document.getElementById("regAlias").value || "Cazador";
    usuario.correo = document.getElementById("regCorreo").value;
    usuario.telefono = document.getElementById("regTelefono").value;
    usuario.edad = document.getElementById("regEdad").value;

    localStorage.setItem("SCL_UsuarioDatos", JSON.stringify(usuario));
    actualizarInterfazPerfil();
    alert("💾 ¡Credenciales registradas con éxito en los registros del Gremio!");
}

function actualizarInterfazPerfil() {
    const contenedor = document.getElementById("datosPerfil");
    if(!contenedor) return;
    contenedor.innerHTML = `
        <div class="stats-cazador">
            <p><strong>Cazador:</strong> ${usuario.alias} (${usuario.edad ? usuario.edad + ' años' : 'Edad sin registrar'})</p>
            <p><strong>Contacto:</strong> ${usuario.correo || 'S/C'} | Tel: ${usuario.telefono || 'S/T'}</p>
            <p><strong>Rango Rúnico:</strong> <span style="color:#ffaa00; font-weight:bold;">[Rango ${usuario.rango}]</span></p>
            <p><strong>Clase de Combate:</strong> ${usuario.rol}</p>
            <p><strong>Gremio Afiliado:</strong> ${usuario.gremio}</p>
            <p><strong>Puntos de EXP:</strong> ${usuario.exp} PTS</p>
        </div>
    `;
    
    const btn = document.getElementById("btnDespertar");
    if (usuario.despertado) {
        btn.innerText = `🔒 DESPERTAR CONCLUIDO (RANGO SELLADO: ${usuario.rango})`;
        btn.disabled = true;
    }
}

// DESPERTAR ÚNICO
function ejecutarDespertarUnico() {
    if (usuario.despertado) return;

    const rangos = ["E", "D", "C", "B", "A", "S", "MÍTICO"];
    usuario.rango = rangos[Math.floor(Math.random() * rangos.length)];
    usuario.exp += 50;
    usuario.despertado = true;

    localStorage.setItem("SCL_UsuarioDatos", JSON.stringify(usuario));
    actualizarInterfazPerfil();
    if(document.getElementById("tablonMazmorras")) cargarTablonMazmorras();
    
    alert(`⚡ ¡Has despertado tu poder rúnico latente! Tu rango ha sido sellado para siempre en: RANGO ${usuario.rango}`);
    
    // Alerta inmediata de mazmorra recién desbloqueada
    comprobarMazmorrasDisponiblesPorRango(true);
}

function cambiarRol() {
    usuario.rol = document.getElementById("selectorRol").value;
    localStorage.setItem("SCL_UsuarioDatos", JSON.stringify(usuario));
    actualizarInterfazPerfil();
}

// GESTIÓN DE GREMIOS
function cambiarGremio() {
    usuario.gremio = document.getElementById("selectorGremio").value;
    const info = document.getElementById("infoGremioDetalle");
    if(info) info.innerHTML = usuario.gremio === "Ninguno" ? "Operando de forma independiente." : `Sincronizado oficialmente con el **${usuario.gremio}**.`;
    localStorage.setItem("SCL_UsuarioDatos", JSON.stringify(usuario));
    actualizarInterfazPerfil();
}

function fundarGremioPropio() {
    const nombre = document.getElementById("nombreGremioPropio").value;
    if(!nombre) return alert("Debes asignarle un nombre místico a tu gremio.");

    gremioPropio.creado = true;
    gremioPropio.nombre = nombre;
    if(!gremioPropio.miembros.includes(usuario.alias)) {
        gremioPropio.miembros.push(usuario.alias);
    }

    usuario.gremio = `Gremio Propio: ${nombre}`;
    localStorage.setItem("SCL_GremioPropio", JSON.stringify(gremioPropio));
    localStorage.setItem("SCL_UsuarioDatos", JSON.stringify(usuario));

    actualizarInterfazPerfil();
    verificarEstadoGremioPropio();
    alert(`🔨 ¡Has forjado el gremio "${nombre}" con éxito!`);
}

function verificarEstadoGremioPropio() {
    const panel = document.getElementById("panelReclutamiento");
    if(!panel) return;
    if(gremioPropio.creado) {
        panel.style.display = "block";
        document.getElementById("nombreGremioPropio").value = gremioPropio.nombre;
        document.getElementById("btnCrearGremio").innerText = "⚡ Gremio Forjado";
        document.getElementById("btnCrearGremio").disabled = true;
        renderizarMiembros();
    }
}

function reclutarMiembro() {
    const recluta = document.getElementById("nombreRecluta").value;
    if(!recluta) return alert("Ingresa el nombre del cazador.");

    if(gremioPropio.miembros.includes(recluta)) {
        alert("Ese cazador ya pertenece a tus filas.");
        return;
    }

    gremioPropio.miembros.push(recluta);
    localStorage.setItem("SCL_GremioPropio", JSON.stringify(gremioPropio));
    renderizarMiembros();
    document.getElementById("nombreRecluta").value = "";
}

function renderizarMiembros() {
    const lista = document.getElementById("listaMiembrosGremio");
    if(!lista) return;
    lista.innerHTML = "";
    gremioPropio.miembros.forEach(m => {
        const li = document.createElement("li");
        li.innerText = m === usuario.alias ? `👑 ${m} (Fundador)` : `⚔️ ${m} (Recluta Activo)`;
        lista.appendChild(li);
    });
}

// BUSCADOR Y ESTANTERÍA
function filtrarYBuscarHistorias() {
    const textoBusqueda = document.getElementById("buscadorObrasInput").value.toLowerCase();
    const generoFiltrado = document.getElementById("filtroEstilo").value;

    const historiasFiltradas = catalogoHistorias.filter(obra => {
        const coincideTexto = obra.titulo.toLowerCase().includes(textoBusqueda) || obra.autor.toLowerCase().includes(textoBusqueda);
        const coincideGenero = (generoFiltrado === "Todos" || obra.estilo === generoFiltrado);
        return coincideTexto && coincideGenero;
    });
    cargarEstanteriaVisual(historiasFiltradas);
}

function cargarEstanteriaVisual(listaDeObras) {
    const estanteria = document.getElementById("estanteriaVisual");
    if(!estanteria) return;
    estanteria.innerHTML = "";

    listaDeObras.forEach(obra => {
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
        localStorage.setItem("SCL_BaulHistorias", JSON.stringify(catalogoHistorias));

        document.getElementById("lecturaTitulo").innerText = obra.titulo;
        document.getElementById("lecturaAutor").innerText = obra.autor;
        document.getElementById("lecturaEstilo").innerText = obra.estilo;
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

    const nuevaObra = { id: Date.now(), titulo, autor: usuario.alias, estilo, lecturas: 0, contenido };
    catalogoHistorias.push(nuevaObra);
    localStorage.setItem("SCL_BaulHistorias", JSON.stringify(catalogoHistorias));

    usuario.exp += 15;
    localStorage.setItem("SCL_UsuarioDatos", JSON.stringify(usuario));
    document.getElementById("tituloHistoria").value = "";
    document.getElementById("contenidoHistoria").value = "";
    
    actualizarInterfazPerfil(); 
    filtrarYBuscarHistorias();
    alert("⚡ ¡Manuscrito guardado!");
}

// MAZMORRAS
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
            claseEstado = "cerrada"; textoBoton = "🔒 PORTAL COLAPSADO"; deshabilitadoHtml = "disabled";
        } else if (poderCazador < poderRequerido) {
            claseEstado = "bloqueada"; textoBoton = `🔒 Rango ${m.rangoRequerido} Requerido`; deshabilitadoHtml = "disabled";
        }

        const min = Math.floor(m.tiempoRestante / 60);
        const seg = m.tiempoRestante % 60;

        const tarjeta = document.createElement("div");
        tarjeta.id = `maz-${m.id}`;
        tarjeta.className = `tarjeta-mazmorra ${claseEstado}`;
        tarjeta.innerHTML = `
            <span class="timer-mazmorra" id="timer-val-${m.id}">⏳ Cierre en: ${min}:${seg < 10 ? '0' : ''}${seg}</span>
            <p style="font-weight:bold; color: #ffaa00;"><span class="badge-rango">RANGO ${m.rangoRequerido}</span> ${m.nombre}</p>
            <button class="action-btn" style="padding:6px 12px; font-size:0.8em; width:auto; margin-top:10px;" ${deshabilitadoHtml} onclick="alternarDetallesMazmorra(${m.id})">${textoBoton}</button>
            <div class="cronicas-contenedor">
                <input type="text" id="tit-maz-${m.id}" placeholder="Título...">
                <textarea id="txt-maz-${m.id}" rows="2" placeholder="Crónica..."></textarea>
                <button class="action-btn" style="padding:5px 10px; font-size:0.8em;" onclick="publicarEnMazmorra(${m.id})">🚀 Guardar Crónica</button>
            </div>
        `;
        panel.appendChild(tarjeta);
    });
}

function alternarDetallesMazmorra(id) { document.getElementById(`maz-${id}`).classList.toggle("abierta-detalles"); }

function publicarEnMazmorra(id) {
    const m = mazmorrasActivadas.find(maz => maz.id === id);
    if (!m) return;
    const titulo = document.getElementById(`tit-maz-${id}`).value;
    const contenido = document.getElementById(`txt-maz-${id}`).value;
    if (!titulo || !contenido) return alert("Campos vacíos.");
    m.cronicas.push({ titulo, autor: usuario.alias, contenido });
    localStorage.setItem("SCL_Mazmorras", JSON.stringify(mazmorrasActivadas));
    usuario.exp += 20;
    localStorage.setItem("SCL_UsuarioDatos", JSON.stringify(usuario));
    actualizarInterfazPerfil();
    alert("⚡ Crónica guardada.");
}

function iniciarTemporizadoresMazmorras() {
    setInterval(() => {
        mazmorrasActivadas.forEach(m => {
            if (m.estado === "activo") {
                m.tiempoRestante--;
                const lbl = document.getElementById(`timer-val-${m.id}`);
                if (lbl) {
                    const min = Math.floor(m.tiempoRestante / 60);
                    const seg = m.tiempoRestante % 60;
                    lbl.innerText = `⏳ Cierre en: ${min}:${seg < 10 ? '0' : ''}${seg}`;
                }
                if (m.tiempoRestante <= 0) m.estado = "cerrado";
            }
        });
    }, 1000);
}

// MOTOR DE MÚSICA EXPANDIDO: CARGAR Y AGREGAR AUDIO CUSTOM
function actualizarListaCanalesMusica() {
    const contenedor = document.getElementById("listaCanalesMusica");
    if(!contenedor) return;
    contenedor.innerHTML = "";

    miAuraMusica.forEach(track => {
        const item = document.createElement("div");
        item.className = "item-cancion";
        item.id = `track-item-${track.id}`;
        item.innerHTML = `
            <span style="font-size: 0.85em; max-width:70%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${track.nombre}</span>
            <button class="action-btn" style="padding: 4px 8px; font-size:0.75em; width:auto; margin:0;" onclick="sintonizarCanalAudio(${track.id})">▶️ Sintonizar</button>
        `;
        contenedor.appendChild(item);
    });
}

function sintonizarCanalAudio(idTrack) {
    const track = miAuraMusica.find(t => t.id === idTrack);
    const reproductor = document.getElementById("reproductorAura");
    const infoText = document.getElementById("trackActualInfo");

    if(track && reproductor) {
        document.querySelectorAll(".item-cancion").forEach(i => i.classList.remove("sonando"));
        const itemActivo = document.getElementById(`track-item-${idTrack}`);
        if(itemActivo) itemActivo.classList.add("sonando");

        reproductor.src = track.url;
        reproductor.play().catch(e => console.log("Audio en espera de interacción del usuario"));
        if(infoText) infoText.innerText = `🔊 Sintonizando: ${track.nombre}`;
    }
}

function agregarMusicaPersonalizada() {
    const nombre = document.getElementById("nuevoTrackNombre").value;
    const url = document.getElementById("nuevoTrackUrl").value;

    if(!nombre || !url) return alert("Por favor inyecta el nombre y el enlace de audio rúnico válido.");

    const nuevoTrack = {
        id: Date.now(),
        nombre: `🎵 ${nombre} (Frecuencia Externa)`,
        url: url
    };

    miAuraMusica.push(nuevoTrack);
    localStorage.setItem("SCL_AuraMusica", JSON.stringify(miAuraMusica));
    
    document.getElementById("nuevoTrackNombre").value = "";
    document.getElementById("nuevoTrackUrl").value = "";

    actualizarListaCanalesMusica();
    alert(`📻 ¡Frecuencia rúnica "${nombre}" acoplada con éxito al sistema de aura!`);
}
