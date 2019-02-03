"use strict";

//Al cargarse la página se ejecutará el siguiente código
window.addEventListener("load",()=>{
	//En caso de estar logueado el usuario
	if (getCookie("logdata")) {
		//Actualizamos la cookie
		setCookie("logdata",getCookie("logdata"),10);
		//Actualizamos la cookie al mover el ratón (al mostrar actividad por parte del usuario)
		//Tal vez solo se deba hacer al actualizar la página
		window.addEventListener("mousemove",()=>{
			if (getCookie("logdata")) {
				setCookie("logdata",getCookie("logdata"),10);
			} else {
				//Si la sesión caduca se informa al usuario
				document.querySelector("body").innerHTML="";
				alert("La sesión ha caducado. Por favor, vuelva a iniciar sesión.");

				//Y entonces vamos al inicio de nuevo
				location.href="inicio.html";
			}
		});

		let usuario = getCookie("logdata");
		usuario = JSON.parse(usuario);
		mostrarLista(usuario.usuario,usuario.permiso,window.localStorage["lista"]);

	} else {
		location.href="inicio.html";
	}
});

//Muestra la página "lista" en función de la lista a ver, el usuario que la ve y los permisos que tiene
function mostrarLista(usuario,permiso,lista) {
	generarBotones(usuario,permiso,lista);
	generarLista(usuario,permiso,lista);
}

function generarBotones(usuario,permiso,lista){

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
					printLista({"lista":json},"#lista");
					//json=JSON.parse(data);
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
						printLista({"lista":json});
						//json=JSON.parse(data);
					}
				);
			} else {
				pideDatos("peticion","?estado_proceso="+lista,(data) => {
						//Convertimos a JSON los datos obtenidos
						let json = JSON.parse(data);
						//Colocamos cada permiso en su lugar
						console.log(json);
						printLista({"lista":json});
						//json=JSON.parse(data);
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
					printLista({"lista":json});
					//json=JSON.parse(data);
				}
			);
			break;
	}
}


