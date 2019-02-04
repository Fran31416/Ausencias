"use strict";

//Al cargarse la página se ejecutará el siguiente código
window.addEventListener("load",()=>{
	//En caso de estar logueado el usuario
	let cookie = getCookie("token");
	if (cookie) {
		//Comprobamos la cookie
		if(checkCookie(cookie,getDatosUsuario())){
			//Actualizamos la cookie
			setCookie("token",cookie,10);
			//No mostramos la parte de login.
			let elem = document.querySelector("#notLogged");
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

			let usuario = getDatosUsuario();
			mostrarInicio(usuario.usuario,usuario.permiso);
		} else {
			setCookie("token","",-1);
		}
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

	let usuario = document.querySelector("#usuario").value;
	let pass = document.querySelector("#pass").value;


	let url = "http://localhost:3000/usuario?usuario="+usuario;

	let promise = llamadaAjax("GET",url);

	console.log('Petición asincrona iniciada.');
	promise.then((data) => {
		console.log('Obteniendo datos.');

		//Comprobamos que el json tenga contenido
		if(data!=="[]"){
			console.log(data);
			//Comprobamos que el usuario y la contraseña estén bien. En caso contrario mostrar un mensaje
			let json_temp=JSON.parse(data)[0];
			if(usuario===json_temp.usuario && window.btoa(pass)===json_temp.pass){
				//Creamos la cookie de nombre token
				let fecha = new Date();
				let token = (json_temp.usuario+"#"+json_temp.pass.atob()+"#"+fecha.toUTCString()).btoa();
				console.log(token);
				setCookie("token",token,10);
				window.localStorage.setItem("","");
				modificarUsuario (json_temp,"token",token);
				//Vamos a la página principal del usuario
				location.href="inicio.html";
			}else{
				//console.log("informacion incorrecta");
				document.querySelector("#salida").textContent="Información Incorrecta";
			}
		}else{
			//console.log("usuario no existe");
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