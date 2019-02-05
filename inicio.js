"use strict";

//Al cargarse la página se ejecutará el siguiente código
window.addEventListener("load",()=>{
	//En caso de estar logueado el usuario
	let cookie = getCookie("token");
	let usuario = getDatosUsuario();
	if (cookie) {
		//Comprobamos la cookie
		checkCookie(cookie,usuario,(data)=>{
			data=JSON.parse(data);
			if (data[0].token===cookie && data[0].estado){
				console.log("la cookie es igual");
				//Actualizamos la cookie
				setCookie("token",cookie,10);
				//No mostramos la parte de login.
				let elem = document.querySelector("#notLogged");
				console.log("borramos los botones");
				elem.outerHTML="";
				//Actualizamos la cookie al mover el ratón (al mostrar actividad por parte del usuario)
				//Tal vez solo se deba hacer al actualizar la página
				window.addEventListener("mousemove",()=>{
					if (getCookie("token")) {
						setCookie("token",getCookie("token"),10);
					} else {
						//Si la sesión caduca se informa al usuario
						document.querySelector("body").innerHTML="";
						alert("La sesión ha caducado. Por favor, vuelva a iniciar sesión.");

						//Y entonces vamos al inicio de nuevo
						location.href="inicio.html";
					}
				});
				console.log("mostramos el inicio de "+ usuario.usuario);

				mostrarInicio(usuario.usuario,usuario.permiso);

			} else {
				//Eliminamos la cookie
				setCookie("token"," ",0);
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


//Se ejecuta al presionar el botón de login
function login(){
	//Recogemos usuario y contraseña
	let usuario = document.querySelector("#usuario").value;
	let pass = document.querySelector("#pass").value;


	let url = "http://localhost:3000/usuario?usuario="+usuario;

	let promise = llamadaAjax("GET",url);

	console.log('Obtenemos al usuario para comprobar el login.');
	promise.then((data) => {
		console.log('Obtenemos los datos.');
		//Comprobamos que el json tenga contenido
		if(data!=="[]"){
			//Comprobamos que el usuario y la contraseña estén bien. En caso contrario mostrar un mensaje
			let json_temp=JSON.parse(data)[0];
			if(usuario===json_temp.usuario && window.btoa(pass)===json_temp.pass){
				//Creamos la cookie de nombre token
				let fecha = new Date();
				let token = window.btoa(json_temp.usuario+"#"+json_temp.pass+"#"+fecha.toUTCString());
				setCookie("token",token,10);
				window.localStorage.setItem("datos",JSON.stringify({"usuario":json_temp.usuario,"permiso":json_temp.permiso}));
				//Vamos a la página principal del usuario
				modificarUsuario(json_temp,"token",token,()=>{location.href="inicio.html";});
			}else{
				//Informacion incorrecta
				document.querySelector("#salida").textContent="Información Incorrecta";
			}
		}else{
			//Usuario no existe
			document.querySelector("#salida").textContent="Información Incorrecta";
		}

	}, (error) => {
		console.log('Promesa rechazada.');
		console.log(error.message);
		document.querySelector("#salida").textContent = "Se ha producido un error";
	});

}


//Muestra el inicio a cierto usuario con cierto permiso
function mostrarInicio(usuario,permiso) {
	console.log('Mostramos Inicio');

	let url = "http://localhost:3000/usuario?usuario="+usuario;

	let promise = llamadaAjax("GET",url);

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
	console.log("generamos cola");
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