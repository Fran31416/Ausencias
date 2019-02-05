"use strict";

window.addEventListener("load",()=>{

	let caso = JSON.parse(window.localStorage.getItem("verDocumento"));

	if (caso){

		let url = "http://localhost:3000/peticion?id="+caso.id;

		let promise = llamadaAjax("GET",url);

		console.log('Petición asincrona iniciada.');
		promise.then(
			(data)=>{
				data=JSON.parse(data)[0];
				let modificable;
				if (caso.estado==1){
					modificable=true
				} else modificable=false;
				rellenarPermiso(data,modificable);
			},
			(error) => {
				console.log(error.message);
				document.querySelector("#salida").textContent = "No existe.";
			});

		if (caso.estado==2 || caso.estado==4){



		}

	} else {

		//Damos uso a los botones de agregar y quitar filas de profesores sustitutos
		let boton = document.querySelector("#nuevoSustituto");
		boton.addEventListener("click", () => {
			let tabla = document.querySelector("#tablaSustitutos");
			let tr = document.createElement("tr");
			let num = tabla.childNodes.length - 1;
			tr.setAttribute("id", "sustituto" + num);
			tr.innerHTML =
				"<td><input id='diaSustituto" + num + "' type='date' name=''></td>" +
				"<td><input id='horaSustituto" + num + "' type='time' name=''></td>" +
				"<td><input id='cursoSustituto" + num + "' type='text' name=''></td>" +
				"<td><input id='asignaturaSustituto" + num + "' type='text' name=''></td>" +
				"<td><input id='profesorSustituto" + num + "' type='text' name=''></td>";
			tabla.appendChild(tr);
		});
		boton = document.querySelector("#quitarSustituto");
		boton.addEventListener("click", () => {
			let tabla = document.querySelector("#tablaSustitutos");
			tabla.childNodes.length;
			if (tabla.childNodes.length > 2) {
				let tr = tabla.lastChild;
				tabla.removeChild(tr);
			}
		});
	}
});


function recogerPermiso(estado){

	let nuevo =  {};
	nuevo.estado_proceso=estado;
	nuevo.comentarios=[];
	nuevo.creado=new Date().toJSON();
	nuevo.enviado=new Date().toJSON();
	nuevo.usuario=getDatosUsuario().usuario;
	//nombre
	nuevo.nombre = document.querySelector("#nombre").value;
	//apellidos
	nuevo.apellido1 = document.querySelector("#apellido1").value;
	nuevo.apellido2 = document.querySelector("#apellido2").value;
	//motivo del permiso
	nuevo.tipo="permiso";
	let permiso_solicitado="";
	//repasa el radio button para ver cual esta marcado
	let elem=document.getElementsByName('permiso');
	for(let i=0;i<elem.length;i++)
		if (elem[i].checked) {
			permiso_solicitado = elem[i].value;
		}
	nuevo.permiso_solicitado=permiso_solicitado;
	let jornada;
	//jornada del permiso
	elem=document.getElementsByName('jornada');

	for(let i=0;i<elem.length;i++){
		if (elem[i].checked) {
			jornada = elem[i].value;
		}
	}
	nuevo.jornada=jornada;

	//recojida de fecha
	if (jornada==="completa") {
		//2 campos recojidos 2 insertados

		//Introducir manualmente el formato para las 00:00 y 24:00
		nuevo.hora_inicio="00:00";
		nuevo.hora_final="24:00";


		nuevo.dia_inicio=document.querySelector("#fecha_inicio").value;
		nuevo.dia_final=document.querySelector("#fecha_final").value;

	}else if(jornada==="incompleta"){
		//4 campos recogidos

		nuevo.hora_inicio=document.querySelector("#hora_inicio").value;
		nuevo.hora_final=document.querySelector("#hora_final").value;

		nuevo.dia_inicio=document.querySelector("#dia_inicio").value;
		nuevo.dia_final=document.querySelector("#dia_final").value;
	}

	let fila=1;
	nuevo.sustituto=[];
	while(document.querySelector("#sustituto"+fila)){
		nuevo.sustituto.push({
			"diaSustituto":document.querySelector("#diaSustituto"+fila).value,
			"horaSustituto":document.querySelector("#horaSustituto"+fila).value,
			"cursoSustituto":document.querySelector("#cursoSustituto"+fila).value,
			"asignaturaSustituto":document.querySelector("#asignaturaSustituto"+fila).value,
			"profesorSustituto":document.querySelector("#profesorSustituto"+fila).value
		});
		fila++;
	}

	//se recoge directamente el texto de la observacion
	nuevo.observaciones = document.querySelector("#observacion").value;

	nuevo.file=localStorage.getItem("fich");

	//Logs para ver que acaba
	console.log("final");
	console.log(nuevo);


	let url = "http://localhost:3000/peticion/";

	let promise = llamadaAjax("POST",url,JSON.stringify(nuevo));

	console.log('Petición asincrona iniciada.');
	promise.then((data) => {
		console.log('Obteniendo datos.');
		console.log(data);
		//	muestraDato(JSON.parse(data));
	}, (error) => {
		console.log('Promesa rechazada.');
		console.log(error.message);
	});

	localStorage.removeItem("fich");

}

