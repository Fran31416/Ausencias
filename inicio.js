"use strict";

//Al cargarse la página se ejecutará el siguiente código
window.addEventListener("load",()=>{
	//En caso de estar logueado el usuario
	if (getCookie("logdata")) {
		//Actualizamos la cookie
		setCookie("logdata",getCookie("logdata"),10);
		//No mostramos la parte de login.
		let elem = document.querySelector("#notLogged");
		elem.outerHTML="";
		//Actualizamos la cookie al mover el ratón (al mostrar actividad por parte del usuario)
		//Tal vez solo se deba hacer al actualizar la página
		window.addEventListener("mousemove",()=>{
			if (getCookie("logdata")) {
				setCookie("logdata",getCookie("logdata"),10);
			} else {
				//Si la sesión caduca se informa al usuario
				document.querySelector("body").innerHTML="";
				alert("La sesión ha caducado. Por favor, vuelva a iniciar sesión.");

				//Y entonces vamos al inicio de nuevo
				location.href="inicio.html";
			}
		});

		let usuario = getCookie("logdata");
		usuario = JSON.parse(usuario);
		mostrarInicio(usuario.usuario,usuario.permiso);
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