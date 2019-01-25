"use strict";

function llamadaAjax(metodo,url,datos=undefined) {
	return  new Promise((resolve, reject) => {
		let request = new XMLHttpRequest();
	//	request.mode = "no-cors";//no-cors; //cors

		request.open(metodo, url,true);
		request.setRequestHeader("Content-type", "application/json");

		request.onload = () => {
			console.log(request.status);
			if (request.status >= 200 && request.status <= 300) {
				resolve(request.response); // we got data here, so resolve the Promise
			} else {
				reject(Error(request.statusText)); // status is not 200 OK, so reject
			}
		};
		request.onerror = () => {
			reject(Error('Error recuperando datos.')); // error occurred, reject the Promise
		};
		request.send((datos)); // send the request
	});
}
