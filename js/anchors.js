$(document).ready(function() {

	$('body').on('click', '.js-anchor', function () {
		var anch = $(this).attr('href');

		if($(anch).length){

			var scrTo = $(anch).offset().top - $('#js-top-header').innerHeight() - 21;

			$('html, body').stop().animate({scrollTop: scrTo}, 1021, 'easeInOutQuart');

		}

		return false;
	});
	
});