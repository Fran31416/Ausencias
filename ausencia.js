"use strict";


window.addEventListener("load",()=>{

	let caso = "";

	//Damos uso a los botones de agregar y quitar filas de profesores sustitutos
	let boton = document.querySelector("#nuevoSustituto");
	boton.addEventListener("click",()=>{
		let tabla = document.querySelector("#tablaSustitutos");
		let tr= document.createElement("tr");
		let num=tabla.childNodes.length-1;
		tr.setAttribute("id","sustituto"+num);
		tr.innerHTML=
			"<td><input id='diaSustituto"+num+"' type='date' name=''></td>" +
			"<td><input id='horaSustituto"+num+"' type='time' name=''></td>" +
			"<td><input id='cursoSustituto"+num+"' type='text' name=''></td>" +
			"<td><input id='asignaturaSustituto"+num+"' type='text' name=''></td>" +
			"<td><input id='profesorSustituto"+num+"' type='text' name=''></td>";
		tabla.appendChild(tr);
	});
	boton = document.querySelector("#quitarSustituto");
	boton.addEventListener("click",()=>{
		let tabla = document.querySelector("#tablaSustitutos");
		tabla.childNodes.length;
		if (tabla.childNodes.length>2){
			let tr= tabla.lastChild;
			tabla.removeChild(tr);
		}
	});
});




function recogerAusencia(estado){

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


	let jornada;
	//jornada del permiso
	let elem=document.getElementsByName('jornada');

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
		nuevo.desde_hora="00:00";
		nuevo.hasta_hora="24:00";

		nuevo.desde_dia=document.querySelector("#fecha_inicio").value;
		nuevo.hasta_dia=document.querySelector("#fecha_final").value;

	}else if(jornada==="incompleta"){
		//4 campos recojidos

		nuevo.desde_hora=document.querySelector("#hora_inicio").value;
		nuevo.hasta_hora=document.querySelector("#hora_final").value;

		nuevo.desde_dia=document.querySelector("#dia_inicio").value;
		nuevo.hasta_dia=document.querySelector("#dia_final").value;
	}




	let falta;
	elem=document.getElementsByName('falta');

	for(let i=0;i<elem.length;i++){
		if (elem[i].checked) {
			falta = elem[i].value;
		}
	}

	nuevo.falta=falta;

	nuevo.lectivas_clase=document.querySelector("#lectivas_clase");

	nuevo.lectivas_otras=document.querySelector("#lectivas_otras");

	nuevo.complementarias=document.querySelector("#complementarias");

	nuevo.complementarias_mensuales=document.querySelector("#complementarias_mensual");


	let motivo;
	//jornada del permiso
	elem=document.getElementsByName('motivo');

	for(let i=0;i<elem.length;i++){
		if (elem[i].checked) {
			motivo = elem[i].value;
		}
	}
	nuevo.motivo=motivo;

	nuevo.evaluacion=document.querySelector("#evaluacion");
	nuevo.claustro=document.querySelector("#claustro");
	nuevo.ccp=document.querySelector("#ccp");
	nuevo.consejo=document.querySelector("#consejo");
	nuevo.departamento=document.querySelector("#departamento");
	nuevo.tutores=document.querySelector("#tutores");


	let permiso_solicitado="";
	//repasa el radio button para ver cual esta marcado
	elem=document.getElementsByName('permiso');
	for(let i=0;i<elem.length;i++) {
		if (elem[i].checked) {
			permiso_solicitado = elem[i].value;
		}
	}
	nuevo.permiso_solicitado=permiso_solicitado;

	//se recoje directamente el texto de la observacion
	nuevo.observaciones = document.querySelector("#observacion").value;

	nuevo.fich=localStorage.getItem("fich");

	//Logs para ver que acaba
	console.log("final");
	console.log(nuevo);

	let url = "http://localhost:3000/peticion/";

	let promise = llamadaAjax("POST",url,JSON.stringify(nuevo));

	console.log('Petición asincrona iniciada.');
	promise.then((data) => {
		console.log('Obteniendo datos.');
		console.log(data);
		//  muestraDato(JSON.parse(data));
	}, (error) => {
		console.log('Promesa rechazada.');
		console.log(error.message);

	});

	localStorage.removeItem("fich");


}

