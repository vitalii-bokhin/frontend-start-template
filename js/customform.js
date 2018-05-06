//form custom placeholder
function CustomPlaceholder(el) {

	//init
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
			hidePlaceholder(_$, true);
		}

	});

	function hidePlaceholder(_inp, hide) {
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

	//events
	$('body').on('focus', el, function() {
		hidePlaceholder(this, true);
	});

	$('body').on('blur', el, function() {
		hidePlaceholder(this, false);
	});

}

//Form CustomSelect
function CustomSelect() {

	var _ = this;

	_.$field = null;
	
	//init
	$('select').each(function() {
		var $select = $(this),
		$options = $select.find('option'),
		$parent = $select.parent(),
		optionsList = '';

		for (var i = 0; i < $options.length; i++) {
			var $option = $($options[i]);
			optionsList += '<li><button type="button" class="custom-select__val" data-value="'+ $option.val() +'"'+ ( ($option.attr('data-target-elements') != undefined) ? ' data-target-elements="'+ $option.attr('data-target-elements') +'"' : '' ) +'>'+ $option.html() +'</button></li>';
		}

		$parent.html('<div class="custom-select'+ ( ($select.attr('multiple') != undefined) ? ' custom-select_multiple' : '' ) +'"><button type="button" data-placeholder="'+ $select.attr('data-placeholder') +'" class="custom-select__button">'+ $select.attr('data-placeholder') +'</button><ul class="custom-select__options">'+ optionsList +'</ul><input type="hidden" name="'+ $select.attr('name') +'" class="custom-select__input" value="">'+ ( ($select.attr('multiple') != undefined) ? '<div class="custom-select__multiple-inputs"></div>' : '' ) +'</div>');

		$select.remove();
	});

	function closeSelect() {
		_.$field.removeClass('custom-select_opened').find('.custom-select__options').slideUp(221);
	}

	function openSelect(_el) {
		_.$field = $(_el).closest('.custom-select');

		if (_.$field.hasClass('custom-select_opened')) {
			closeSelect();
		} else {
			_.$field.addClass('custom-select_opened').find('.custom-select__options').slideDown(221);
		}
	}

	function selectVal(_el) {
		var $valElem = $(_el);

		_.$field = $valElem.closest('.custom-select');

		var $button = _.$field.find('.custom-select__button'),
		$input = _.$field.find('.custom-select__input'),
		$searchInput = (_.$field.find('.custom-select__input_autocomplete').length) ? _.$field.find('.custom-select__input_autocomplete') : _.$field.find('.form__textarea_autocomplete');
		

		if (_.$field.hasClass('custom-select_multiple')) {

			var toButtonValue = [],
			toInputValue = [],
			$multInputs = _.$field.find('.custom-select__multiple-inputs');

			if ($valElem.hasClass('custom-select__val_checked')) {
				$valElem.removeClass('custom-select__val_checked');
			} else {
				$valElem.addClass('custom-select__val_checked');
			}

			_.$field.find('.custom-select__val_checked').each(function(i) {
				var $el = $(this);
				toButtonValue[i] = $el.html();
				toInputValue[i] = $el.attr('data-value');
			});

			if (toButtonValue.length) {
				$button.html(toButtonValue.join(', '));

				$input.val(toInputValue[0]);

				$multInputs.html('');

				if (toInputValue.length > 1) {

					for (var i = 1; i < toInputValue.length; i++) {
						$multInputs.append('<input type="hidden" name="'+ $input.attr('name') +'" value="'+ toInputValue[i] +'">');
					}
					
				}
				
			} else {
				$button.html($button.attr('data-placeholder'));
				$input.val('');
				closeSelect();
			}

		} else {
			var toButtonValue = $valElem.html(),
			toInputValue = $valElem.attr('data-value');

			_.$field.find('.custom-select__val').removeClass('custom-select__val_checked');
			$valElem.addClass('custom-select__val_checked');
			$button.html(toButtonValue);
			$searchInput.val(toButtonValue);

			if (toInputValue != undefined) {
				$input.val(toInputValue);
			} else {
				$input.val(toButtonValue);
			}

			closeSelect();
		}


		_.$field.find('.custom-select__val').each(function() {
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


		if ($searchInput.hasClass('form__textarea_var-h')) {
			setTextareaHeight($searchInput);
		}

		_.$field.addClass('custom-select_changed')

		ValidateForm().select($input);

		return false;
	}

	_.autocomplete = function(el) {
		var _ = this;
		_.getField(el);
		var inputValue = _._el.val(),
		opt = '', 
		match = false;

		if (_._el.attr('data-opt')) {
			opt = _._el.attr('data-opt');
		}

		if(inputValue.length > 0){

			/*if (opt == 'search-with-highlight') {

				var inpVal = inputValue,
				reg = new RegExp(inpVal, 'gi');

				console.log(reg);

				_._options.find('.custom-select__val').each(function() {

					var srcVal = $(this).attr('data-original');

					if(srcVal.match(_reg)){
						var newStr = srcVal.replace(reg, '<span>$&</span>');
						$(this).html(newStr);
						$(this).parent().removeClass('hidden');
						match = true;
					} else {
						$(this).parent().addClass('hidden');
					}

				});

			} else*/ if (opt == 'search-by-name') {

				var inpVal = inputValue,
				reg = new RegExp(inpVal, 'gi');

				_._options.find('.custom-select__val').each(function() {

					var srcVal = $(this).html();

					if(srcVal.match(reg)){

						$(this).parent().removeClass('hidden');
						match = true;
					} else {
						$(this).parent().addClass('hidden');
					}

				});


			} else if (opt == 'search-by-search-string') {
				var reg = function(str) {
					var str = str.trim(),
					reg = str.replace(/\s/g,'|%');
					return '%'+reg;
				}(inputValue);

				var wordsCount = reg.split('|').length,
				_reg = new RegExp(reg, 'gi');

				_._options.find('.custom-select__val').each(function() {

					var srcVal = $(this).attr('data-search');

					if(srcVal.match(_reg) && srcVal.match(_reg).length >= wordsCount){
						$(this).parent().removeClass('hidden');
						match = true;
					} else {
						$(this).parent().addClass('hidden');
					}

				});
			}

			if (match) {
				_.change(1);
			} else {
				_.change(0);
			}

		} else {
			_.change(0);
		}
	}

	//events
	$('body').on('click', '.custom-select__button', function() {
		openSelect(this);
		return false;
	});

	$('body').on('input', '.custom-select__input_autocomplete, .form__textarea_autocomplete', function() { 
		CustomSelect.autocomplete(this); 
	});

	$('body').on('click', '.custom-select__val', function() {
		selectVal(this);
		return false;
	});

	$(document).on('click', 'body', function(e) {
		if (!$(e.target).closest('.custom-select_opened').length) {
			$('.custom-select').removeClass('custom-select_opened');
			$('.custom-select__options').slideUp(221);
		}
	});

}


function CustomFile() {

	var _ = this;

	_.$field = null;

	function showPreview(file) {
		var $imgPreviewBlock = _.$field.find('.custom-file__preview');

		if (file) {
			if ($imgPreviewBlock.length && file.type.match('image')) {
				var reader = new FileReader();
				reader.onload = function(e) {
					$imgPreviewBlock.html('<img src="'+ e.target.result +'">');
				};
				reader.readAsDataURL(file);
			}
		} else {
			$imgPreviewBlock.empty();
		}

	}

	function showName(file) {
		var $nameBlock = _.$field.find('.custom-file__name');

		if (file) {
			if ($nameBlock) {
				$nameBlock.html(file.name);
			}
		} else {
			$nameBlock.empty();
		}

	}

	function changeInput(_inp) {
		var $input = $(_inp);

		_.$field = $input.closest('.custom-file');

		var file = $input[0].files[0];

		showPreview(file);
		showName(file);

	}

	//event
	$('body').on('change', 'input[type="file"]', function() {
		changeInput(this);
	});

}


$(document).ready(function() {
	CustomPlaceholder('input[type="text"], input[type="password"], textarea');
	CustomSelect();
	CustomFile();
});