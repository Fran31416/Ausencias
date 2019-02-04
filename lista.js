"use strict";

"use strict";

//Al cargarse la página se ejecutará el siguiente código
window.addEventListener("load",()=> {
	//En caso de estar logueado el usuario
	let cookie = getCookie("token");
	let usuario = getDatosUsuario();
	if (cookie) {
		//Comprobamos la cookie
		checkCookie(cookie, usuario, (data) => {
			data = JSON.parse(data);
			if (data[0].token === cookie) {
				console.log("la cookie es igual");
				//Actualizamos la cookie
				setCookie("token", cookie, 10);

				//Actualizamos la cookie al mover el ratón (al mostrar actividad por parte del usuario)
				//Tal vez solo se deba hacer al actualizar la página
				window.addEventListener("mousemove", () => {
					if (getCookie("token")) {
						setCookie("token", getCookie("token"), 10);
					} else {
						//Si la sesión caduca se informa al usuario
						document.querySelector("body").innerHTML = "";
						alert("La sesión ha caducado. Por favor, vuelva a iniciar sesión.");

						//Y entonces vamos al inicio de nuevo
						location.href = "inicio.html";
					}
				});

				mostrarLista(usuario.usuario, usuario.permiso, window.localStorage["lista"]);

			} else {
				//Eliminamos la cookie y vamos a inicio
				setCookie("token", " ", 0);
				location.href = "inicio.html";
			}
		});
	} else {
		location.href = "inicio.html";
	}
});

//Muestra la página "lista" en función de la lista a ver, el usuario que la ve y los permisos que tiene
function mostrarLista(usuario,permiso,lista) {
	generarBotones(usuario,permiso,lista);
	generarLista(usuario,permiso,lista);
}

function generarBotones(usuario,permiso,lista){
	switch (permiso) {
		case "Profesor":
			if (lista==1){
				let botonPermiso = document.createElement("button");
				botonPermiso.innerHTML="Generar Permiso Dirección";
				botonPermiso.addEventListener("click",()=>{
					nuevoPermiso();
				});
				let botonAusencia = document.createElement("button");
				botonAusencia.innerHTML="Generar Ausencia Profesorado";
				botonAusencia.addEventListener("click",()=>{
					nuevaAusencia();
				});
				let salida = document.querySelector("#botones");
				salida.appendChild(botonPermiso);
				salida.appendChild(botonAusencia);
			}
			break;
		case "Directivo":
			break;
		case "Admin":
			break;
	}
}


//Muestra la lista de documentos que cierto usuario con cierto permiso puede ver
function generarLista(usuario,permiso,lista){
	switch (permiso) {
		case "Profesor":
			pideDatos("peticion","?estado_proceso="+lista+"&usuario="+usuario,(data) => {
					//Convertimos a JSON los datos obtenidos
					let json = JSON.parse(data);
					//Colocamos cada permiso en su lugar
					console.log(json);
					printLista({"lista":json},lista,"#lista");
				}
			);
			break;
		case "Directivo":
			if (lista==="1" || lista==="3"){
				pideDatos("peticion","?estado_proceso="+lista+"&usuario="+usuario,(data) => {
						//Convertimos a JSON los datos obtenidos
						let json = JSON.parse(data);
						//Colocamos cada permiso en su lugar
						console.log(json);
						printLista({"lista":json},lista,"#lista");
					}
				);
			} else {
				pideDatos("peticion","?estado_proceso="+lista,(data) => {
						//Convertimos a JSON los datos obtenidos
						let json = JSON.parse(data);
						//Colocamos cada permiso en su lugar
						console.log(json);
						printLista({"lista":json},lista,"#lista");
					}
				);
			}
			break;
		case "Admin":
			pideDatos("peticion","?estado_proceso="+lista,(data) => {
					//Convertimos a JSON los datos obtenidos
					let json = JSON.parse(data);
					//Colocamos cada permiso en su lugar
					console.log(json);
					printLista({"lista":json},lista,"#lista");
				}
			);
			break;
	}
}


function nuevoPermiso() {
	window.open("www.google.es","nuevo");
}

function nuevaAusencia() {
	window.open("www.google.es","nuevo");
}


