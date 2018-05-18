//form custom placeholder
var CustomPlaceholder = {

	init: function(el) {
		var _ = this;

		$(el).each(function(i) {
			_$ = $(this),
			placeholder = _$.attr('placeholder'),
			inpId = _$.attr('id');

			if (placeholder != undefined) {
				var $parent = _$.parent(),
				inpFor = (inpId) ? inpId : 'placeholder-index-'+ i;

				$parent.prepend('<label for="'+ inpFor +'" class="custom-placeholder">'+ placeholder +'</label>');

				_$.removeAttr('placeholder').attr('id', inpFor);
			}

			if (_$.val() != '') {
				_.hidePlaceholder(_$, true);
			}

		});

		//events
		$('body').on('focus', el, function() {
			_.hidePlaceholder(this, true);
		});

		$('body').on('blur', el, function() {
			_.hidePlaceholder(this, false);
		});

	},
	
	hidePlaceholder: function(_inp, hide) {
		var $input = $(_inp),
		$placeholder = $('label[for="'+ $input.attr('id') +'"]');

		if ($placeholder.length) {
			if (hide) {
				$placeholder.css({textIndent: '-9999px', paddingLeft: 0, paddingRight: 0});
			} else {
				if ($input.val() == '') {
					$placeholder.css({textIndent: 0, paddingLeft: '', paddingRight: ''});
				}
			}
		}
	}

};

//Form CustomSelect
var CustomSelect = {

	$field: null,

	close: function() {
		$('.custom-select').removeClass('custom-select_opened');
		$('.custom-select__options').slideUp(221);
	},

	open: function(_el) {
		$(_el).closest('.custom-select').addClass('custom-select_opened').find('.custom-select__options').slideDown(221);
	},

	selectVal: function(_el) {
		var _ = this,
		$valElem = $(_el),
		$field = $valElem.closest('.custom-select'),
		$headBtn = $field.find('.custom-select__button'),
		$input = $field.find('.custom-select__input'),
		$headInp = $field.find('.custom-select__autocomplete');

		if ($field.hasClass('custom-select_multiple')) {
			var toButtonValue = [],
			toInputValue = [],
			$multInputs = $field.find('.custom-select__multiple-inputs');

			if ($valElem.hasClass('custom-select__val_checked')) {
				$valElem.removeClass('custom-select__val_checked');
			} else {
				$valElem.addClass('custom-select__val_checked');
			}

			$field.find('.custom-select__val_checked').each(function(i) {
				var $el = $(this);
				toButtonValue[i] = $el.html();
				toInputValue[i] = ($el.attr('data-value') != undefined) ? $el.attr('data-value') : $el.html();
			});

			if (toButtonValue.length) {
				$headBtn.html(toButtonValue.join(', '));

				$input.val(toInputValue[0]);

				$multInputs.empty();

				if (toInputValue.length > 1) {

					for (var i = 1; i < toInputValue.length; i++) {
						$multInputs.append('<input type="hidden" name="'+ $input.attr('name') +'" value="'+ toInputValue[i] +'">');
					}
					
				}
				
			} else {
				$headBtn.html($headBtn.attr('data-placeholder'));
				$input.val('');
				_.close();
			}

		} else {
			var toButtonValue = $valElem.html(),
			toInputValue = ($valElem.attr('data-value') != undefined) ? $valElem.attr('data-value') : $valElem.html();

			$field.find('.custom-select__val').removeClass('custom-select__val_checked');
			$valElem.addClass('custom-select__val_checked');
			$headBtn.html(toButtonValue);
			$input.val(toInputValue);

			if ($headInp) {
				$headInp.val(toButtonValue);
				CustomPlaceholder.hidePlaceholder($headInp, true);
			}
			
			_.close();
		}


		$field.find('.custom-select__val').each(function() {
			_$ = $(this),
			targetElements = _$.attr('data-target-elements');

			if (targetElements) {
				var $elem = $(targetElements);
				if (_$.hasClass('custom-select__val_checked')) {
					$elem.show();
				} else {
					$elem.hide();
				}
			}
		});

		if ($headInp.hasClass('var-height-textarea__textarea')) {
			varHeightTextarea.setHeight($headInp);
		}

		$field.addClass('custom-select_changed');

		ValidateForm.select($input);

	},

	autocomplete: function(_inp) {
		var $field = $(_inp).closest('.custom-select'),
		inpVal = $(_inp).val(),
		match = false;

		var reg = new RegExp(inpVal, 'gi');

		$field.find('.custom-select__val').each(function() {
			var $btn = $(this),
			val = $btn.html();

			if (val.match(reg)) {
				$btn.parent().removeClass('hidden');
				match = true;
			} else {
				$btn.parent().addClass('hidden');
			}
		});

		if (!match) {
			$field.find('.custom-select__options li').removeClass('hidden');
		}

	},

	setOptions: function(field, optObj, val, name) {
		var $options = $(field).find('.custom-select__options');

		for (var i = 0; i < optObj.length; i++) {
			$options.append('<li><button type="button" class="custom-select__val" data-value="'+ optObj[i][val] +'">'+ optObj[i][name] +'</button></li>');
		}
	},

	keyboard: function(_field, keyCode) {
		var $options = $(_field).find('.custom-select__options'),
		$hoverItem = $options.find('li.hover');

		switch (keyCode) {
			
			case 40:
			if ($hoverItem.length) {
				var $nextItem = $hoverItem.nextAll('li:visible').first();
				if ($nextItem.length) {
					$hoverItem.removeClass('hover');
					$nextItem.addClass('hover');
					$options.stop().animate({scrollTop: ($options.scrollTop() + $nextItem.position().top)}, 121);
				}
			} else {
				$options.find('li:visible').first().addClass('hover');
			}
			break;

			case 38:
			var $nextItem = $hoverItem.prevAll('li:visible').first();
			if ($nextItem.length) {
				$hoverItem.removeClass('hover');
				$nextItem.addClass('hover');
				$options.stop().animate({scrollTop: ($options.scrollTop() + $nextItem.position().top)}, 121);
			}
			break;

			case 13:
			this.selectVal($hoverItem.find('.custom-select__val'));
			break;

		}
		
	},

	fillAcHead: function() {
		var _ = this;
		$('.custom-select__autocomplete').each(function() {
			var _$ = $(this),
			$checkedVal = _$.closest('.custom-select').find('.custom-select__val_checked');
			if ($checkedVal.length) {
				_.selectVal($checkedVal);
			}
		});
	},

	init: function() {
		var _ = this;

		$('select').each(function() {
			var $select = $(this),
			$options = $select.find('option'),
			$parent = $select.parent(),
			optionsList = '',
			head = ($select.attr('data-type') == 'autocomplete') ? '<input type="text" placeholder="'+ $select.attr('data-placeholder') +'" class="custom-select__autocomplete form__text-input">' : '<button type="button" data-placeholder="'+ $select.attr('data-placeholder') +'" class="custom-select__button">'+ $select.attr('data-placeholder') +'</button>',
			require = ($select.attr('data-required') != undefined) ? ' data-required="'+ $select.attr('data-required') +'" ' : '',
			multiple = {
				class: ($select.attr('multiple') != undefined) ? ' custom-select_multiple' : '',
				inpDiv: ($select.attr('multiple') != undefined) ? '<div class="custom-select__multiple-inputs"></div>' : ''
			};

			for (var i = 0; i < $options.length; i++) {
				var $option = $($options[i]);
				optionsList += '<li><button type="button" class="custom-select__val"'+ ( ($option.val()) ? ' data-value="'+ $option.val() +'"' : '' ) + ( ($option.attr('data-target-elements') != undefined) ? ' data-target-elements="'+ $option.attr('data-target-elements') +'"' : '' ) +'>'+ $option.html() +'</button></li>';
			}

			$parent.prepend('<div class="custom-select'+ multiple.class +'">'+ head +'<ul class="custom-select__options">'+ optionsList +'</ul><input type="hidden" name="'+ $select.attr('name') +'"'+ require +'class="custom-select__input" value="">'+ multiple.inpDiv +'</div>');

			$select.remove();
		});

		$('body').on('click', '.custom-select__button', function() {

			if (!$(this).closest('.custom-select').hasClass('custom-select_opened')) {
				_.fillAcHead();
				_.close();
				_.open(this);
			} else {
				_.close();
			}

			return false;

		}).on('click', '.custom-select__val', function() {

			_.selectVal(this);

			return false;

		}).on('focus', '.custom-select__autocomplete', function() {

			if (!$(this).closest('.custom-select').hasClass('custom-select_opened')) {
				_.fillAcHead();
				_.close();
				_.open(this);
			}

		}).on('input', '.custom-select__autocomplete', function() {

			_.autocomplete(this);

		}).on('keydown', '.custom-select_opened', function(e) {

			if (e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13) {
				_.keyboard(this, e.keyCode);
				return false;
			}

		});

		$(document).on('click', 'body', function(e) {
			if (!$(e.target).closest('.custom-select_opened').length) {
				_.fillAcHead();
				_.close();
			}
		});

	}

};


function CustomFile() {

	var _ = this;

	_.$field = null;

	function loadPreview(file, i) {
		var $imgPreviewBlock = _.$field.find('.custom-file__preview').eq(i);

		if (file.type.match('image')) {
			var reader = new FileReader();

			reader.onload = function(e) {
				$imgPreviewBlock.html('<img src="'+ e.target.result +'" class="cover-img">');

				setTimeout(function() {
					coverImg('.custom-file__item');
				}, 721);

			}

			reader.readAsDataURL(file);
		} else {
			$imgPreviewBlock.html('<img src="images/preview.svg" class="full-width-img">');
		}

	}


	function changeInput(_inp) {
		var $input = $(_inp),
		filesArr = $input[0].files,
		$fileItems = $input.siblings('.custom-file__items'),
		prevObj = [];

		_.$field = $input.closest('.custom-file');

		$fileItems.empty();

		for (var i = 0; i < filesArr.length; i++) {
			$fileItems.append('<div class="custom-file__item"><div class="custom-file__preview cover-img-wrap"></div><div class="custom-file__name">'+ filesArr[i].name +'</div></div>');
			loadPreview(filesArr[i], i);
		}

	}

	//event
	$('body').on('change', 'input[type="file"]', function() {
		changeInput(this);
	});

}

var varHeightTextarea = {
	setHeight: function(_ta) {
		var $tAr = $(_ta),
		value = $tAr.val(),
		$mirror = $tAr.parent().find('.var-height-textarea__mirror');
		newValue = value.replace(/\n/g, '<br>');
		$mirror.html(newValue +'&nbsp;');
	},
	init: function() {
		var _ = this;
		$('body').on('input', '.var-height-textarea__textarea', function() {
			_.setHeight(this);
		});
	}
};

$(document).ready(function() {
	CustomSelect.init();
	CustomPlaceholder.init('input[type="text"], input[type="password"], textarea');
	CustomFile();
	varHeightTextarea.init();
});