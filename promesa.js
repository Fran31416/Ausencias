"use strict"
//codigicar
//let enc= window.btoa(string);
//dedocificar
//let dec=window.atob(string);


//////////////////////////////////
//	CODE BY: FLH aka Gabriel	//
//////////////////////////////////
//
//		printJSON
//
// json: El json con los datos a imprimir
// tableLocation: Dónde se adjuntará la tabla
// showID: Si la función muestra o no el campo ID
//
//Imprime cualquier json de la forma
//	{"nombre_lista":[
// 		{
// 			"id":"valor",
//			"tag1":"valor1",
//			...
// 		},
//		...
//	]}
//
//	Imprimiéndolo en la siguiente estructura:
//
//		nombre_lista
//
//	id		|tag1		|tag2		|...
//	--------|-----------|-----------|-----
//	valor	|valor1		|valor2		|...
//	valorb	|valor1b	|valor2b	|...
//
function printJSON(json,tableLocation,showID=false,showTitle=true) {
	//Creamos los elementos de la tabla donde se mostrarán los datos
	let exit = document.querySelector(tableLocation);
	exit.innerHTML = "";
	let table = document.createElement("table");
	table.setAttribute("border",1);
	let th,tr,td;
	let tableName = Object.keys(json);
	if (showTitle) {
		exit.innerHTML = "<h3>" + tableName +"</h3>";		
	}
	let headers=[];
	if (json[Object.keys(json)][0]) {
		headers = Object.keys(json[tableName][0]);
		tr = document.createElement("tr");
		if (showID){
			th=document.createElement("th");
			th.innerHTML="ID";
			tr.appendChild(th);
		}
		for (let header of headers){
			if (header!=="id"){
				th=document.createElement("th");
				th.innerHTML=header;
				tr.appendChild(th);
			}
		}
		//Aquí se pueden crear más columnas

		th=document.createElement("th");
		th.innerHTML="header";
		tr.appendChild(th);

		//Fin de columnas

		table.appendChild(tr);
		//Para cada elemento del json vamos a ir añadiendo los datos en la tabla
		for (let elem of json[tableName]){
			tr = document.createElement("tr");
			if (showID){
				td = document.createElement("td");
				td.innerHTML=elem["id"];
				tr.appendChild(td);
			}
			for (let header of headers){
				if (header!=="id"){
					td = document.createElement("td");
					td.innerHTML=elem[header];
					tr.appendChild(td);
				}
			}
			//Aquí se pueden rellenar más columnas

			td=document.createElement("td");
			td.innerHTML="<button onclick='modificarUsuario("+ JSON.stringify(elem) +")'>Modificar</button>";
			tr.appendChild(td);

			//Fin de columnas
			table.appendChild(tr);
		}
	}
	exit.appendChild(table);
}

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
		"id": usuario,
		"pass": pass,
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


//No se usa de momento, hay que modificarlo
function sustituyeDato() {

	let usuario = document.querySelector("#usuario").value;

	let modifica = {
		"id": "Profesor",
		"apellidos": "DWEC",
		"fec_nac": "01/01/1970",
		"direccion": "IES Severo Ochoa",
	};

	let url = "http://localhost:3000/ususario/" + usuario.trim();

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
function pideUnDato() {
	//usuario no se usa ahora
	let memory={"usuario":[]};
	let usuario = document.querySelector("#id").value;

	let url = "http://localhost:3000/usuario/";

	let promise = llamadaAjax("GET",url);

	console.log('Petición asincrona iniciada.');
	promise.then((data) => {
		console.log('Obteniendo datos.');
		//Convertimos a JSON los datos obtenidos
		let json = JSON.parse(data);
		//Obtenemos cada una de las salas y guardamos sus datos en memoria
		for(let dato of json){
			memory["usuario"].push(dato);
		}
		printJSON(memory,"#salida",true)
		//json=JSON.parse(data);
	}, (error) => {
		console.log('Promesa rechazada.');
		console.log(error.message);
		document.querySelector("#salida").textContent = "Ese usuario no existe.";
	});
}


function muestraDato(dato) {

	let texto="";

	let salida=document.querySelector("#salida");
	let indices = Object.keys(dato);
	//crear tabla para mostrar datos
	for(let json of indices) {

		if (json != "attach") {
			let tr = document.createElement("tr");
			texto += json + " Usuario " + dato[json].id +"<br/>";
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