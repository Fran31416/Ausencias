"use strict";


window.addEventListener("load",()=>{

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
