"use strict";

//Al cargarse la página se ejecutará el siguiente código
window.addEventListener("load",()=>{
	//En caso de estar logueado el usuario
	if (getCookie("logdata")) {
		//Actualizamos la cookie
		setCookie("logdata",getCookie("logdata"),10);
		//No mostramos la parte de login.
		let elem = document.querySelector("#notLogged");
		elem.outerHTML="";
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
		mostrarInicio(usuario.usuario,usuario.permiso);
	} else {
		//Al no estar logueado se mostrarán las opciones de login. Estos son los disparadores para los botones login y registro
		let elem = document.querySelector("#login");
		elem.addEventListener("click",()=>{
			login();
		});

		elem = document.querySelector("#registro");
		elem.addEventListener("click",()=>{
			//Ir a registro
			location.href="registro.html";
		});
	}
});



//Muestra el inicio a cierto usuario con cierto permiso
function mostrarInicio(usuario,permiso) {
	let url = "http://localhost:3000/usuario?usuario="+usuario;

	let promise = llamadaAjax("GET",url);

	console.log('Petición asincrona iniciada.');
	promise.then((data) => {
		console.log('Obteniendo datos.');

		console.log(data);
		//let json_temp={"User Data":JSON.parse(data)};
		//printUsuarios(json_temp,"#logged");

		generarCola(usuario,permiso);

	}, (error) => {
		console.log('Promesa rechazada.');
		console.log(error.message);
		document.querySelector("#salida").textContent = "Se ha producido un error";
	});

}

//Genera la cola del usuario "usuario" con permiso "permiso"
function generarCola(usuario,permiso) {
	let tabla = {
		"datos":[
			{
				"Estado":"Genera permiso",
				"Contador":0
			},
			{
				"Estado":"Pdte. Autoriz. Permiso",
				"Contador":0
			},
			{
				"Estado":"Pdtes. Justificante",
				"Contador":0
			},
			{
				"Estado":"Pdte. Autoriz. Justificante",
				"Contador":0
			},
			{
				"Estado":"Ausencia finalizada",
				"Contador":0
			}
		]
	};
	switch (permiso) {
		case "Profesor":
			pideDatos("peticion","?usuario="+usuario,(data) => {
					//Convertimos a JSON los datos obtenidos
					let json = JSON.parse(data);
					//Colocamos cada permiso en su lugar
					for(let dato of json){
						tabla.datos[dato["estado_proceso"]-1].Contador++;
					}
					printDatos(tabla,"#cola");
					//json=JSON.parse(data);
				}
			);

			break;
		case "Directivo":
			pideDatos("peticion","?",
				(data) => {
					//Convertimos a JSON los datos obtenidos
					let json = JSON.parse(data);
					//Colocamos cada permiso en su lugar
					for(let dato of json){
						if (dato["estado_proceso"]===1 || dato["estado_proceso"]===3){
							if (dato.usuario===usuario){
								tabla.datos[dato["estado_proceso"]-1].Contador++;
							}
						} else {
							tabla.datos[dato["estado_proceso"]-1].Contador++;
						}
					}
					printDatos(tabla,"#cola");
					//json=JSON.parse(data);
				}
			);


			break;
		case "Admin":
			pideDatos("peticion","?",
				(data) => {
					//Convertimos a JSON los datos obtenidos
					let json = JSON.parse(data);
					//Colocamos cada permiso en su lugar
					for(let dato of json){
						tabla.datos[dato["estado_proceso"]-1].Contador++;
					}
					printDatos(tabla,"#cola");
					//json=JSON.parse(data);
				}
			);
			break;
	}
}