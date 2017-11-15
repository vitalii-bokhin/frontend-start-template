$(document).ready(function(){

	var winW = $(window).width();
	var winH = $(window).height();

	$('.wrapper, .wrapper__full-height').css('padding-bottom', $('.footer').innerHeight());

	$('#slider').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1
	});

	$('.scroll-pane').jScrollPane();

	/*Toggle*/
	$('body').on('click', '.js-toggle', function() {
		var _ = $(this),
		_target = $('#'+ _.attr('data-target-id'));
		
		if (!_.hasClass('toggled')) {
			_target.addClass('toggled');
			_.addClass('toggled');
		} else {
			_target.removeClass('toggled');
			_.removeClass('toggled');
		}
		return false;
	});


	flexImage(winW);

	ovfImage();

});