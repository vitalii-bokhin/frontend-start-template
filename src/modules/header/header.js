(function() {
	"use strict";

	//fix header
	var headerElem = document.querySelector('.header');

	document.addEventListener('scroll', function() {
		if (window.pageYOffset > 21) {
			headerElem.classList.add('header_fixed');
		} else {
			headerElem.classList.remove('header_fixed');
		}
	});

}());