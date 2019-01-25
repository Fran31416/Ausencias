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
			td.innerHTML="<button onclick='javascript:modificarUsuario("+ JSON.stringify(elem) +");buscarDatos()'>Modificar</button>";
			tr.appendChild(td);

			//Fin de columnas
			table.appendChild(tr);
		}
	}
	exit.appendChild(table);
}

/*function modificarUsuario (json) {
	console.log(json.id);
}*/


//introduce un dato nuevo
/*function nuevoDato() {
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

}*/


//No se usa de momento, hay que modificarlo
function modificarUsuario (json) {

	let usuario = json.id;
	if(json.estado=="0"){
		json.estado="1";
	}else if(json.estado=="1"){
		json.estado="0";
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
		"estado":json.estado
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
    for(let i=0;i<elem.length;i++) 
        if (elem[i].checked) { 
            estado = elem[i].value;   
        } 

    //Genera la cadena segun los campos rellenados

	//Acepta todos los campos vacios y por defecto esta el radio vacio marcado para mostrar todo
	
    let busqueda="?";

	if (id!="") {
		busqueda+="id="+id;
	}
	if (usuario!="") {
		busqueda+="&usuario="+usuario;
	}
	if (nombre!="") {
		busqueda+="&nombre="+nombre;
	}
	if (apellido1!="") {
		busqueda+="&apellido1="+apellido1;
	}
	if (apellido2!="") {
		busqueda+="&apellido2="+apellido2;
	}
	if (permiso!="") {
		busqueda+="&permiso="+permiso;
	}
	if (departamento!="") {
		busqueda+="&departamento="+departamento;
	}
	if (estado!="") {
		busqueda+="&estado="+estado;
	}

	pideDatos("usuario",busqueda);


}


function pideDatos(lugar,busqueda) {
	//usuario no se usa ahora
	let memory={"usuario":[]};

	let url = "http://localhost:3000/"+lugar+"/"+busqueda;

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



let url = "http://localhost:3000/usuario?usuario="+usuario;

	let promise = llamadaAjax("GET",url);

	console.log('Petición asincrona iniciada.');
	promise.then((data) => {
		console.log('Obteniendo datos.');
		//Convertimos a JSON los datos obtenidos
		console.log(data);
		if(data=="[]"){
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

function login(){
	
	let usuario = document.querySelector("#usuario").value;
	let pass = document.querySelector("#pass").value;


	let url = "http://localhost:3000/usuario?usuario="+usuario;

	let promise = llamadaAjax("GET",url);

	console.log('Petición asincrona iniciada.');
	promise.then((data) => {
		console.log('Obteniendo datos.');
		
		console.log(data);
		//Comprobamos que el json tenga contenido
		if(data!="[]"){
			console.log(data);
			//Comprobamos que el usuario y la contraseña esten bien en caso contrario mostrar un mensaje
			let json_temp=JSON.parse(data);
			if(usuario==json_temp[0].usuario && window.btoa(pass)==json_temp[0].pass){
				console.log("te has logeado");
				//crear el cookie desde aqui
				document.querySelector("#salida").textContent="Informacion Correcta"
			}else{
				console.log("informacion incorrecta");
				document.querySelector("#salida").textContent="Informacion Incorrecta"
			}
		}else{
			console.log("usuario no existe")
			document.querySelector("#salida").textContent="Informacion Incorrecta"
		}

	}, (error) => {
		console.log('Promesa rechazada.');
		console.log(error.message);
		document.querySelector("#salida").textContent = "Ese usuario no existe.";
	});

}


function log(id_usuario,id_peticion,estado_actual,estado_nuevo){

	let fecha = new Date();
	

	nuevo={
		"peticion": id_peticion,
    	"fecha": "",
     	"hora": "",
      	"modificado_por": id_usuario,
      	"proceso_origen": estado_actual,
      	"proceso_destino": estado_nuevo
	}

}










