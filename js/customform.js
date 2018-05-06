//Form CustomSelect
var CustomSelect = {
	_el: null,
	_field: null,
	_options: null,
	init: function() {
		$('select').each(function() {
			var $select = $(this),
			$options = $select.find('option'),
			$parent = $select.parent(),
			optionsList = '';

			for (var i = 0; i < $options.length; i++) {
				var $option = $($options[i]);
				optionsList += '<li><button type="button" class="custom-select__val" data-value="'+ $option.val() +'">'+ $option.html() +'</button></li>';
			}

			$parent.html('<div class="custom-select'+ ( ($select.attr('multiple') != undefined) ? ' custom-select_multiple' : '' ) +'"><button type="button" data-placeholder="'+ $select.attr('data-placeholder') +'" class="custom-select__button">'+ $select.attr('data-placeholder') +'</button><ul class="custom-select__options">'+ optionsList +'</ul><input type="hidden" name="'+ $select.attr('name') +'" class="custom-select__input" value="">'+ ( ($select.attr('multiple') != undefined) ? '<div class="custom-select__multiple-inputs"></div>' : '' ) +'</div>');

			$select.remove();
		});
	},
	getField: function(el) {
		var _ = this;
		_._el = $(el);
		_._field = _._el.closest('.custom-select');
		_._options = _._field.find('.custom-select__options');
	},
	change: function(state) {
		var _ = this;
		if (state) {
			if (!_._field.hasClass('custom-select_autocomplete')) {
				$('.custom-select').removeClass('custom-select_opened');
				$('.custom-select__options').slideUp(221);
			}
			_._field.addClass('custom-select_opened');
			_._options.slideDown(221);
		} else {
			_._field.removeClass('custom-select_opened');
			_._options.slideUp(221);
		}
	},
	open: function(el) {
		var _ = this;
		_.getField(el);
		if (!_._field.hasClass('custom-select_opened')) {
			_.change(1);
		} else {
			_.change(0);
		}
		return false;
	},
	select: function(el) {
		var _ = this;
		_.getField(el);
		var _f = _._field,
		_button = _f.find('.custom-select__button'),
		_srcInput = (_f.find('.custom-select__input_autocomplete').length) ? _f.find('.custom-select__input_autocomplete') : _f.find('.form__textarea_autocomplete'),
		_input = _f.find('.custom-select__input');
		

		if (_f.hasClass('custom-select_multiple')) {

			if (!_._el.hasClass('custom-select__val_checked')) {
				_._el.addClass('custom-select__val_checked');
			} else {
				_._el.removeClass('custom-select__val_checked');
			}

			var toButtonValue = [],
			toInputValue = [],
			$multInputs = _f.find('.custom-select__multiple-inputs');

			_._options.find('.custom-select__val_checked').each(function(i) {
				var el = $(this);
				toButtonValue[i] = el.html();
				toInputValue[i] = el.attr('data-value');
			});

			if (toButtonValue.length) {
				_button.html(toButtonValue.join(', '));

				_input.val(toInputValue[0]);

				$multInputs.html('');

				if (toInputValue.length > 1) {

					for (var i = 1; i < toInputValue.length; i++) {
						$multInputs.append('<input type="hidden" name="'+ _input.attr('name') +'" value="'+ toInputValue[i] +'">');
					}
					
				}
				
			} else {
				_.change(0);
				_button.html(_button.attr('data-placeholder'));
				_input.val('');
			}

		} else {
			var toButtonValue = _._el.html(),
			toInputValue = _._el.attr('data-value');

			_.change(0);

			_button.html(toButtonValue);
			_srcInput.val(toButtonValue);

			if (toInputValue != undefined) {
				_input.val(toInputValue);
			} else {
				_input.val(toButtonValue);
			}
		}

		if (_._el.attr('data-show-hidden')) {
			var opt = _._el.attr('data-show-hidden'),
			_$ = $(opt);

			if (_$.hasClass('form__field')) {
				_$.closest('.form__field-wrap').find('.form__field').addClass('form__field_hidden');
				_$.removeClass('form__field_hidden');
			} else if (_$.hasClass('form__fieldset')) {
				_$.closest('.form__fieldset-wrap').find('.form__fieldset').addClass('form__fieldset_hidden');
				_$.removeClass('form__fieldset_hidden');
			}
		}

		if (_srcInput.hasClass('form__textarea_var-h')) {
			setTextareaHeight(_srcInput);
		}

		_f.addClass('custom-select_changed')

		ValidateForm().select(_input);

		return false;
	},
	autocomplete: function(el) {
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
};


function CustomFile(_inp) {

	var $input = $(_inp),
	$imgPreviewBlock = $input.siblings('.custom-file__preview'),
	$nameBlock = $input.siblings('.custom-file__name'),
	file = $input[0].files[0];

	if (file) {
		var fileName = file.name,
		fileSize = (file.size / 1024 / 1024).toFixed(2),
		fileExt = (function(fileName){
			var arr = fileName.split('.');
			return arr[arr.length-1];
		})(fileName);

		$nameBlock.html(fileName);

		if ($imgPreviewBlock.length && file.type.match('image')) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$imgPreviewBlock.html('<img src="'+ e.target.result +'">');
			};
			reader.readAsDataURL(file);
		}
	} else {
		$imgPreviewBlock.empty();
		$nameBlock.empty();
	}

}


$(document).ready(function() {

	CustomSelect.init();

	$('body').on('click', '.custom-select__button', function() { 
		CustomSelect.open(this); 
	});

	$('body').on('input', '.custom-select__input_autocomplete, .form__textarea_autocomplete', function() { 
		CustomSelect.autocomplete(this); 
	});

	$('body').on('click', '.custom-select__val', function() { 
		CustomSelect.select(this);
	});

	$(document).on('click', 'body', function(e) {
		if (!$(e.target).closest('.custom-select_opened').length) {
			$('.custom-select').removeClass('custom-select_opened');
			$('.custom-select__options').slideUp(221);
		}
	});

	$('body').on('change', 'input[type="file"]', function() {
		CustomFile(this);
	});

});