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