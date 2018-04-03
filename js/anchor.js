$(document).ready(function() {

	$('body').on('click', '.js-anchor', function () {
		var href = $(this).attr('href'),
		anch = '#'+ href.split('#')[1];

		if($(anch).length){
			var scrTo = ($(anch).attr('data-anchor-offset')) ? $(anch).offset().top : ($(anch).offset().top - $('.header').innerHeight() - 35);

			$('html, body').stop().animate({scrollTop: scrTo}, 1021, 'easeInOutQuart');

			return false;
		}

	});

	if (window.location.hash) {

		var anch = window.location.hash;

		if($(anch).length && !$(anch).hasClass('popup__window')){

			$('html, body').stop().animate({scrollTop: 0}, 1);

			window.onload = function() {
				var scrTo = ($(anch).attr('data-anchor-offset')) ? $(anch).offset().top : ($(anch).offset().top - $('.header').innerHeight() - 35);

				$('html, body').stop().animate({scrollTop: scrTo}, 1021, 'easeInOutQuart');
			}

		}

	}
	
});