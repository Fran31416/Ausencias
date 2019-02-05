"use strict";

let permisoActualAModificar;

window.addEventListener("load",()=>{
	let caso="";
	if (window.localStorage.getItem("verDocumento").length>5){
		caso = JSON.parse(window.localStorage.getItem("verDocumento"));
	}

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
				permisoActualAModificar=data;
				rellenarPermiso(data,modificable);
			}
			,
			(error) => {
				console.log(error.message);
				document.querySelector("#salida").textContent = "No existe.";
			});



		if (caso.estado==1){
			let botones = document.querySelector("#caso1");
			botones.setAttribute("class","");
		}

		if (caso.estado==4 && getDatosUsuario().permiso!="Profesor"){
			let botones = document.querySelector("#caso4");
			botones.setAttribute("class","");
		}

	} else {
		let botones = document.querySelector("#caso1");
		botones.setAttribute("class","");
	}

});




function recogerAusencia(estado){

	let nuevo =  {};
	nuevo.estado_proceso=estado;
	nuevo.comentarios=[];
	nuevo.tipo="ausencia";
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
	if (jornada==="0") {
		//2 campos recojidos 2 insertados

		//Introducir manualmente el formato para las 00:00 y 24:00
		nuevo.desde_hora="00:00";
		nuevo.hasta_hora="24:00";

		nuevo.desde_dia=document.querySelector("#fecha_inicio").value;
		nuevo.hasta_dia=document.querySelector("#fecha_final").value;

	}else if(jornada==="1"){
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

