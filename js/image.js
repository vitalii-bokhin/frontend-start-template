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

function overfrowImg(cnt) {

	var cnt = (cnt) ? cnt +' ' : '';
	
	$(cnt +'.overflow-img, '+ cnt +'.overflow-img-wrap').each(function() {

		var _$ = $(this);

		if (_$.hasClass('overflow-img-wrap')) {
			var Img = _$.find('img'),
			Block = _$;
			Img.addClass('overflow-img');
		} else if (_$.hasClass('overflow-img')) {
			var Img = _$,
			Block = Img.parent();
			Block.addClass('overflow-img-wrap');
		}

		Img.removeClass('overflow-img_w overflow-img_h');

		var imgProp = Img.width()/Img.height(),
		blockProp = Block.width()/Block.height();

		if (blockProp != Infinity && blockProp < 21) {
			if (imgProp <= blockProp) {
				var marg = Math.round(-(Block.width()/imgProp-Block.height())/2);
				Img.addClass('overflow-img_w').css({marginTop: marg});
			} else {
				var marg = Math.round(-(Block.height()*imgProp-Block.width())/2);
				Img.addClass('overflow-img_h').css({marginLeft: marg});
			}
		} else {
			Img.addClass('overflow-img_w');
		}

	});
}