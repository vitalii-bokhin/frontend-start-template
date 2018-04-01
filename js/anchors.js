$(document).ready(function() {

	$('body').on('click', '.js-anchor', function () {
		var anch = $(this).attr('href');

		if($(anch).length){

			var scrTo = $(anch).offset().top - $('#js-top-header').innerHeight() - 21;

			$('html, body').stop().animate({scrollTop: scrTo}, 1021, 'easeInOutQuart');

		}

		return false;
	});

	if (window.location.hash) {

		var anch = window.location.hash;

		if($(anch).length && !$(anch).hasClass('popup__window')){

			$('html, body').stop().animate({scrollTop: 0}, 1);

			window.onload = function() {
				var scrTo = $(anch).offset().top - $('.header').innerHeight() - 21;
				$('html, body').stop().animate({scrollTop: scrTo}, 1021, 'easeInOutQuart');
			}

		}

	}
	
});

