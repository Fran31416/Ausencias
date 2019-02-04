"use strict";


window.addEventListener("load",()=>{

	//Damos uso a los botones de agregar y quitar filas de profesores sustitutos
	let boton = document.querySelector("#nuevoSustituto");
	boton.addEventListener("click",()=>{
		let tabla = document.querySelector("#tablaSustitutos");
		let tr= document.createElement("tr");
		tr.setAttribute("id","sustituto"+tabla.childNodes.length);
		tr.innerHTML= "<td><input id='dia' type='date' name=''></td><td><input type='time' name=''></td><td><input type='text' name=''></td> <td><input type='text' name=''></td> <td><input type='text' name=''></td>"
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

