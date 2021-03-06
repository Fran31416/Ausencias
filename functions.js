"use strict";

//Crea la cookie de nombre cookieName, valor cookieValue y que expirará en expirationMinutes minutos.
function setCookie(cookieName, cookieValue, expirationMinutes) {
	let d = new Date();
	d.setTime(d.getTime() + (expirationMinutes*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

//Recoge la cookie de nombre cookieName. En caso de no existir devuelve "".
function getCookie(cookieName) {
	let name = cookieName + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

//Comprueba la cookie
function checkCookie(cookie,userData,funcion=() => {}) {
	if (cookie && userData){
		pideDatos("usuario","?usuario="+userData.usuario,funcion);
	}
}


//Imprime la lista de usuarios para que el admin los pueda dar de alta
function printUsuarios(json,tableLocation="body",showID=false,showTitle=true) {
	//Creamos los elementos de la tabla donde se mostrarán los datos
	let exit = document.querySelector(tableLocation);
	exit.innerHTML = "";
	let table = document.createElement("table");
	table.setAttribute("border","1");
	let th,tr,td;
	let tableName = Object.keys(json);
	if (showTitle) {
		exit.innerHTML = "<h3>USUARIOS</h3>";
	}
	let headers=[];
	if (json[Object.keys(json)][0]) {
		headers=["Usuario","Permiso","Nombre","Apellido","Departamento","Estado"];
		tr = document.createElement("tr");
		if (showID){
			th=document.createElement("th");
			th.innerHTML="ID";
			tr.appendChild(th);
		}
		for (let header of headers){
			th=document.createElement("th");
			th.innerHTML=header;
			tr.appendChild(th);
		}

		th=document.createElement("th");
		th.innerHTML="Alta";
		tr.appendChild(th);

		table.appendChild(tr);
		//Para cada elemento del json vamos a ir añadiendo los datos en la tabla
		headers=["usuario","permiso","nombre","apellido1","departamento","estado"];
		for (let elem of json[tableName]){
			tr = document.createElement("tr");

			for (let header of headers){
				if (header==="estado"){
					td = document.createElement("td");
					if(elem[header]==1){
						td.innerHTML="Dado de Alta";
					}else{
						td.innerHTML="Dado de Baja";
					}
					tr.appendChild(td);
				} else {
					td = document.createElement("td");
					td.innerHTML=elem[header];
					tr.appendChild(td);
				}

			}

			td=document.createElement("td");
			let boton=document.createElement("button");
			boton.innerHTML="Modificar";
			boton.addEventListener("click",()=>{
				modificarUsuario(elem,"estado","",()=>{
					location.href="inicio.html";
				});
			});
			td.appendChild(boton);
			tr.appendChild(td);
			tr.appendChild(td);
			table.appendChild(tr);
		}
	}
	exit.appendChild(table);
}

//
function printDatos(json,tableLocation="body",showID=false,showTitle=true) {
	console.log("imprimimos datos");
	//Creamos los elementos de la tabla donde se mostrarán los datos
	let exit = document.querySelector(tableLocation);
	exit.innerHTML = "";
	let table = document.createElement("table");
	table.setAttribute("border","1");
	let th,tr,td;
	let tableName = Object.keys(json);
	if (showTitle) {
		exit.innerHTML = "<h3>PERMISOS</h3>";
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

		table.appendChild(tr);
		//Para cada elemento del json vamos a ir añadiendo los datos en la tabla
		let aux=1;
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
			let lista = aux;
			//Al dar click ocurrirá esto
			tr.addEventListener("click", ()=>{

				//Guardaremos la lista que queremos ver e iremos a la vista de la lista.
				window.localStorage["lista"]=lista;
				location.href="lista.html";

			});
			aux++;
			table.appendChild(tr);
		}
	}
	exit.appendChild(table);
}


function printLista(json,lista,tableLocation="#lista") {
	console.log("imprimimos la lista "+lista);
	//Creamos los elementos de la tabla donde se mostrarán los datos
	let exit = document.querySelector(tableLocation);
	exit.innerHTML = "";
	let table = document.createElement("table");
	table.setAttribute("border","1");
	let th,tr,td;
	let tableName = Object.keys(json);
	let headers;
	if (lista==1){
		headers=["Nombre","Fecha","Comentarios","Borrado"];
	} else {
		headers=["Nombre","Fecha creación","Fecha llegada","Comentarios"];
	}
	if (json[Object.keys(json)][0]) {
		tr = document.createElement("tr");
		for (let header of headers){
			th=document.createElement("th");
			th.innerHTML=header;
			tr.appendChild(th);
		}


		table.appendChild(tr);
		//Para cada elemento del json vamos a ir añadiendo los datos en la tabla
		for (let elem of json[tableName]){
			tr = document.createElement("tr");
			if (lista==1){
				headers = ["usuario","creado","comentarios","borrado"];
			}else{
				headers = ["usuario","creado","enviado","comentarios"];
			}
			for (let header of headers){
				switch (header) {
					case "usuario":

						td = document.createElement("td");
						td.innerHTML=elem[header];
						td.addEventListener("click",()=>{

							window.localStorage.setItem("verDocumento", JSON.stringify({"id":elem["id"],"estado":elem["estado_proceso"]}));
							if (elem["tipo"]=="permiso"){
								nuevoPermiso(1);
							} else {
								nuevaAusencia(1);
							}

						});
						tr.appendChild(td);

						break;

					case "borrado":
						td = document.createElement("td");
						td.innerHTML="X";
						td.addEventListener("click",()=>{
							//Borrar elem[id]
						});
						tr.appendChild(td);
						break;
					case "comentarios":
						td = document.createElement("td");
						td.innerHTML=elem[header].length;
						if (elem[header].length){
							td.addEventListener("click",e=>{
								for(let element of e.srcElement.parentElement.parentElement.childNodes){
									element.setAttribute("class","");
								}
								e.srcElement.parentElement.setAttribute("class","selected");
								verComentarios(elem[header]);
							});
						}
						tr.appendChild(td);

						break;
					case "creado":
						td = document.createElement("td");
						td.innerHTML=visualizarFecha(elem[header]);
						tr.appendChild(td);
						break;
					case "enviado":
						td = document.createElement("td");
						td.innerHTML=visualizarFecha(elem[header]);
						tr.appendChild(td);
						break;
					default:
						td = document.createElement("td");
						td.innerHTML=elem[header];
						tr.appendChild(td);
				}
			}

			table.appendChild(tr);
		}
	}
	exit.appendChild(table);
}

//Devuelve los datos del usuario (nick y permisos)
function getDatosUsuario() {
	if (window.localStorage.getItem("datos")){
		return JSON.parse(window.localStorage.getItem("datos"));
	} else {
		return null;
	}
}

//Muestra los comentarios en una ventana nueva
function verComentarios(comentarios) {
	let exit = document.querySelector("#comentarios");
	let tabla = document.createElement("table");
	tabla.setAttribute("border","1");
	tabla.innerHTML="";
	for(let comentario of comentarios){
		tabla.innerHTML+="<tr><th>Mensaje de " + comentario.from + "</th><td>"+visualizarFecha(comentario.date)+"</td></tr>" +
			"<tr><td colspan='2'>"+comentario.message+"</td> </tr>";
	}
	exit.innerHTML="";
	exit.appendChild(tabla);
}

function visualizarFecha(date) {
	let fecha = new Date(date);
	return fecha.getDate() + " de " + ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"][fecha.getMonth()]+ " de " + fecha.getFullYear();

}





function salir(){
	localStorage.removeItem("fich");
	localStorage.removeItem("json");
	setCookie("token"," ",0);
	location.href="inicio.html";
}

function retroceder(){
	localStorage.removeItem("fich");
	localStorage.removeItem("json");
}