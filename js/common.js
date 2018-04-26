$(document).ready(function(){

	(function setFootPadding() {
		$('.wrapper, .wrapper__full-height').css('padding-bottom', $('.footer').innerHeight());

		//fixed block
		$('.fix-block').each(function() {
			var _$ = $(this);
			_$.css({width: 'auto', top: 'auto', left: 'auto'}).removeClass('fix-block_fixed');
			var ofsT = _$.offset().top,
			ofsL = _$.offset().left,
			wd = _$.innerWidth();
			_$.css({width: wd, top: ofsT, left: ofsL}).addClass('fix-block_fixed');
		});

		flexImg();
		coverImg();

		$(window).on('winResized', setFootPadding);
	})();

	$('#slider').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1
	});

	$('.scroll-pane').jScrollPane();

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

});

var arrLike = {length: 4, sirko: 'собака', 2: 'мій пес'}; 
var arr = Array.from(arrLike);