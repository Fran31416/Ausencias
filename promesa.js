"use strict";




//codigicar
//let enc= window.btoa(string);
//dedocificar
//let dec=window.atob(string);




/*

function modificarUsuario (json) {
	console.log(json.id);
}

//introduce un dato nuevo
function nuevoDato() {
	let usuario = document.querySelector("#usuario").value;
	let pass = document.querySelector("#pass").value;
	let permiso = document.querySelector("#permiso").value;
	let nombre = document.querySelector("#nom").value;
	let apellido1 = document.querySelector("#apell1").value;
	let apellido2 = document.querySelector("#apell2").value;
	let departamento = document.querySelector("#dep").value;
	let enc= window.btoa(pass);
	pass=enc;
	let nuevo = {
		"usuario": usuario,
		"pass": enc,
		"permiso": permiso,
		"nombre": nombre,
		"apellido1": apellido1,
		"apellido2": apellido2,
		"departamento": departamento,
		"estado":"0"
	};
	let url = "http://localhost:3000/usuario/";

	let promise = llamadaAjax("POST",url,JSON.stringify(nuevo));

	console.log('Petición asincrona iniciada.');
	promise.then((data) => {
		console.log('Obteniendo datos.');
		console.log(data);
		data = JSON.parse(data);
		document.querySelector("#salida").textContent = "El usuario es: "+data.id;
	}, (error) => {
		console.log('Promesa rechazada.');
		console.log(error.message);
		document.querySelector("#salida").textContent = "Ese usuario ya existe.";
	});

}
*/


//No se usa de momento, hay que modificarlo
function modificarUsuario (json,campo="estado",valor="") {

	let usuario = json.id;

	switch (campo) {
		case "estado":
		if(json.estado==="0"){
			json.estado="1";
		}else if(json.estado==="1"){
			json.estado="0";
		}
		break;
		case "token":
			json.token=valor;
	}

	let modifica = {
		"id": json.id,
		"usuario": json.usuario,
		"pass": json.pass,
		"permiso": json.permiso,
		"nombre": json.nombre,
		"apellido1": json.apellido1,
		"apellido2": json.apellido2,
		"departamento": json.departamento,
		"estado":json.estado,
		"token":json.token
	};
	console.log(typeof modifica);
	console.log(modifica);
	let url = "http://localhost:3000/usuario/" + usuario.trim();

	let promise = llamadaAjax("PUT",url,JSON.stringify(modifica));

	console.log('Petición asincrona iniciada.');
	promise.then((data) => {
		console.log('Obteniendo datos.');
		console.log(data);
		//	muestraDato(JSON.parse(data));
	}, (error) => {
		console.log('Promesa rechazada.');
		console.log(error.message);
		document.querySelector("#salida").textContent = "Ese cliente no existe.";
	});


}

//esta funcion pide todos los datos y usa la funcion muestradato
function buscarDatos(){

	//Coje todos los campos del formulario

	let id = document.querySelector("#id").value;
	let usuario = document.querySelector("#usuario").value;
	let nombre = document.querySelector("#nombre").value;
	let apellido1 = document.querySelector("#apellido1").value;
	let apellido2 = document.querySelector("#apellido2").value;
	let departamento = document.querySelector("#departamento").value;
	let permiso = document.querySelector("#permiso").value;
	let estado="";
	//repasa el radio button para ver cual esta marcado
	let elem=document.getElementsByName('estado');
	for(let i=0;i<elem.length;i++){
		if (elem[i].checked) {
			estado = elem[i].value;
		}
	}
	//Genera la cadena según los campos rellenados

	//Acepta todos los campos vacíos y por defecto está el radio vacío marcado para mostrar _todo

	let busqueda="?";

	if (id) {
		busqueda+="id="+id;
	}
	if (usuario!=="") {
		busqueda+="&usuario="+usuario;
	}
	if (nombre!=="") {
		busqueda+="&nombre="+nombre;
	}
	if (apellido1!=="") {
		busqueda+="&apellido1="+apellido1;
	}
	if (apellido2!=="") {
		busqueda+="&apellido2="+apellido2;
	}
	if (permiso!=="") {
		busqueda+="&permiso="+permiso;
	}
	if (departamento!=="") {
		busqueda+="&departamento="+departamento;
	}
	if (estado!=="") {
		busqueda+="&estado="+estado;
	}

	printUsuarios(pideDatos("log",busqueda),"#salida",true,false);

}

//Pide datos de la base de datos según una búsqueda en un lugar y realiza unas acciones con el resultado según la
// función introducida. Por defecto guarda los datos en un array de JSONs y lo devuelve.
function pideDatos (lugar, busqueda="",
					funcion = (data) => {
						let memory={};
						console.log('Obteniendo datos.');
						//Convertimos a JSON los datos obtenidos
						let json = JSON.parse(data);
						//Obtenemos cada una de las salas y guardamos sus datos en memoria
						for(let dato of json){
							memory[lugar].push(dato);
						}
						console.log("antes");
						console.log(memory);
						console.log("despues");
						return memory;
						//json=JSON.parse(data);
					}) {
	//usuario no se usa ahora
	let memory={};
	memory[lugar]=[];

	let url = "http://localhost:3000/"+lugar+"/"+busqueda;

	let promise = llamadaAjax("GET",url);

	console.log('Petición asincrona iniciada.');
	promise.then(funcion,
		(error) => {
			console.log(error.message);
			document.querySelector("#salida").textContent = "No existe.";
		});
}

/*
function muestraDato(dato) {

	let texto="";

	let salida=document.querySelector("#salida");
	let indices = Object.keys(dato);
	//crear tabla para mostrar datos
	for(let json of indices) {

		if (json !== "attach") {
			//let tr = document.createElement("tr");
			texto += json + " Id " + dato[json].id +"<br/>";
			texto += json + " Usuario " + dato[json].usuario +"<br/>";
			texto += json + " Password " + dato[json].pass +"<br/>";
			texto += json + " Permiso " + dato[json].permiso +"<br/>";
			texto += json + " Nombre " + dato[json].nombre +"<br/>";
			texto += json + " Apellido 1> " + dato[json].apellido1 +"<br/>";
			texto += json + " Apellido 2 " + dato[json].apellido2 +"<br/>";
			texto += json + " Departamento " + dato[json].departamento +"<br/>";
			texto += json + " Estado " + dato[json].estado +"<br/><br/>";

		}

	}

	//introducir un select para eleguir el usuario de sus opciones y seleccionando
	// ese pulsar un boton para cambiar su estado de 0 a 1 o 1 a 0
	salida.innerHTML = texto;

	//attach se pude ignorar para las pruebas
	document.querySelector("#attach").innerHTML = "<embed height='800' width='1000' src='" + dato.attach + "' >";

}
*/


function nuevoDato() {
	let usuario = document.querySelector("#usuario").value;
	let pass = document.querySelector("#pass").value;
	let permiso = document.querySelector("#permiso").value;
	let nombre = document.querySelector("#nom").value;
	let apellido1 = document.querySelector("#apell1").value;
	let apellido2 = document.querySelector("#apell2").value;
	let departamento = document.querySelector("#dep").value;
	let enc= window.btoa(pass);
	let nuevo = {
		"usuario": usuario,
		"pass": enc,
		"permiso": permiso,
		"nombre": nombre,
		"apellido1": apellido1,
		"apellido2": apellido2,
		"departamento": departamento,
		"estado":"0"
	};

	let url = "http://localhost:3000/usuario?usuario="+usuario;

	let promise = llamadaAjax("GET",url);

	console.log('Petición asincrona iniciada.');
	promise.then((data) => {
		console.log('Obteniendo datos.');
		//Convertimos a JSON los datos obtenidos
		console.log(data);
		if(data==="[]"){
			console.log('dentro datos.');

			let url = "http://localhost:3000/usuario/";

			let promise = llamadaAjax("POST",url,JSON.stringify(nuevo));

			console.log('Petición asincrona iniciada.');
			promise.then((data) => {
				console.log('Obteniendo datos.');
				console.log(data);
				data = JSON.parse(data);
				document.querySelector("#salida").textContent = "El usuario es: "+data.id;
			}, (error) => {
				console.log('Promesa rechazada.');
				console.log(error.message);
				document.querySelector("#salida").textContent = "Ese usuario ya existe.";
			});

		}else{
			console.log("el usuario ya existe");
		}

	}, (error) => {
		console.log('Promesa rechazada.');
		console.log(error.message);
		document.querySelector("#salida").textContent = "Ese usuario no existe.";
	});

}

/*
function crearLog(id_usuario,id_peticion,estado_actual,estado_nuevo){

	let fecha = new Date();

	let nuevo = {
		"peticion": id_peticion,
		"fecha": fecha.toUTCString(),
		"modificado_por": id_usuario,
		"proceso_origen": estado_actual,
		"proceso_destino": estado_nuevo
	}

}
*/


