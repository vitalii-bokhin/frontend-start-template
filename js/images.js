function flexImage(winW) {
	$('.flex-image').each(function() {
		var Img = $(this),
		data = Img.attr('data-images'),
		images,
		newImg;

		if (data) {
			images = data.split(',');

			for (var i = 0; i < images.length; i++) {
				var imgSpl = images[i].split(':');

				if (winW < imgSpl[0]) {
					if (imgSpl[1] == 'http' || imgSpl[1] == 'https') {
						newImg = imgSpl[1]+ ':'+ imgSpl[2];
					} else {
						newImg = imgSpl[1];
					}
				}

			}

		}

		if (newImg) {
			Img.attr('src', newImg);
		}
		
	});
}

function ovfImage(cnt) {

	var cnt = (cnt) ? cnt +' ' : '';
	
	$(cnt +'.ovf-image, '+ cnt +'.ovf-image-wrap').each(function() {

		var _$ = $(this);

		if (_$.hasClass('ovf-image-wrap')) {
			var Img = _$.find('img'),
			Block = _$;
			Img.addClass('ovf-image');
		} else if (_$.hasClass('ovf-image')) {
			var Img = _$,
			Block = Img.parent();
			Block.addClass('ovf-image-wrap');
		}

		Img.removeClass('ovf-image_w ovf-image_h');

		var imgProp = Img.width()/Img.height(),
		blockProp = Block.width()/Block.height();

		if (blockProp != Infinity && blockProp < 21) {
			if (imgProp <= blockProp) {
				var marg = Math.round(-(Block.width()/imgProp-Block.height())/2);
				Img.addClass('ovf-image_w').css({marginTop: marg});
			} else {
				var marg = Math.round(-(Block.height()*imgProp-Block.width())/2);
				Img.addClass('ovf-image_h').css({marginLeft: marg});
			}
		} else {
			Img.addClass('ovf-image_w');
		}

	});
}