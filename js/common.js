$(document).ready(function(){

	(function setFootPadding() {
		$('.wrapper, .wrapper__full-height').css('padding-bottom', $('.footer').innerHeight());
		$(window).on('winResized', setFootPadding);
	})();

	$('#slider').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1
	});

	$('.scroll-pane').jScrollPane();

	flexImg();
	coverImg();

	$(window).on('winResized', function() {
		flexImg();
		coverImg();
	});

	//headerFix
	$(window).scroll(function () {
		if (!$('body').hasClass('is-popup-opened')) {
			var winScrTop = $(window).scrollTop();
			if (winScrTop > 21) {
				$('.header').addClass('header_fixed');
			} else {
				$('.header').removeClass('header_fixed');
			}
		}
	});

	//fixed block
	$('.fix-block').each(function() {
		var _$ = $(this),
		ofsT = _$.offset().top,
		ofsL = _$.offset().left,
		wd = _$.width();
		_$.css({width: wd, top: ofsT, left: ofsL}).addClass('fix-block_fixed');
	});

	


	$(window).on('winResized', function() {
		console.log('window resized: '+ winW +'x'+ winH);
	});

});

