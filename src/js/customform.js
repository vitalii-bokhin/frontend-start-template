//form custom placeholder
var CustomPlaceholder = {

	init: function(elementsStr) {

		var elements = document.querySelectorAll(elementsStr);

		elements.forEach(function(elem, i) {

			if (elem.placeholder) {

				var elemFor = (elem.id) ? elem.id : 'placeholder-index-'+ i,
				label = document.createElement('label');

				label.htmlFor = elemFor;
				label.className = 'custom-placeholder';
				label.innerHTML = elem.placeholder;

				elem.parentElement.insertBefore(label, elem);

				elem.removeAttribute('placeholder');
				
				if (!elem.id) {
					elem.id = elemFor;
				}

			}

			if (elem.value != '') {
				this.hidePlaceholder(elem, true);
			}

		});

		//events
		document.addEventListener('focus', function(e) {
			var elem = e.target.closest(elementsStr);

			if (elem) {
				this.hidePlaceholder(elem, true);
			}

		}.bind(this), true);


		document.addEventListener('blur', function(e) {
			var elem = e.target.closest(elementsStr);

			if (elem) {
				this.hidePlaceholder(elem, false);
			}

		}.bind(this), true);

	},
	
	hidePlaceholder: function(elem, hide) {

		var label = document.querySelector('label[for="'+ elem.id +'"]');

		if (!label) {
			return;
		}

		var lSt = label.style;

		if (hide) {

			lSt.textIndent = '-9999px';
			lSt.paddingLeft = '0';
			lSt.paddingRight = '0';

		} else {

			if (elem.value == '') {
				lSt.textIndent = '0';
				lSt.paddingLeft = '';
				lSt.paddingRight = '';
			}

		}
		
	}

};

//Form CustomSelect
var CustomSelect = {

	field: null,

	close: function() {
		var fields = document.querySelectorAll('.custom-select');

		fields.forEach(function(field) {
			field.classList.remove('custom-select_opened');
		});

		var listItems = document.querySelectorAll('.custom-select__options li');

		listItems.forEach(function(item) {
			item.classList.remove('hover');
		});

	},

	open: function() {

		this.field.classList.add('custom-select_opened');

		this.field.querySelector('.custom-select__options').scrollTop = 0;

	},

	selectMultipleVal: function(elem, button, input) {
		var toButtonValue = [],
		toInputValue = [],
		inputsBlock = this.field.querySelector('.custom-select__multiple-inputs');

		elem.classList.toggle('custom-select__val_checked');

		var checkedElements = this.field.querySelectorAll('.custom-select__val_checked');

		checkedElements.forEach(function(elem, i) {
			toButtonValue[i] = elem.innerHTML;
			toInputValue[i] = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;
		});

		if (toButtonValue.length) {
			button.innerHTML = toButtonValue.join(', ');

			input.value = toInputValue[0];

			inputsBlock.innerHTML = '';

			if (toInputValue.length > 1) {

				for (var i = 1; i < toInputValue.length; i++) {
					var yetInput = document.createElement('input');

					yetInput.type = 'hidden';
					yetInput.name = input.name;
					yetInput.value = toInputValue[i];

					inputsBlock.appendChild(yetInput);
				}

			}

		} else {
			button.innerHTML = button.getAttribute('data-placeholder');
			input.value = '';
			this.close();
		}

	},

	targetAction: function() {
		var elements = this.field.querySelectorAll('.custom-select__val');

		elements.forEach(function(elem) {
			if (!elem.hasAttribute('data-target-elements')) {
				return;
			}

			var targetElem = document.querySelector(elem.getAttribute('data-target-elements'));
			targetElem.style.display = (elem.classList.contains('custom-select__val_checked')) ? 'block' : 'none';
		});

	},

	selectVal: function(elem) {
		var button = this.field.querySelector('.custom-select__button'),
		input = this.field.querySelector('.custom-select__input');

		if (this.field.classList.contains('custom-select_multiple')) {
			
			this.selectMultipleVal(elem, button, input);

		} else {
			var toButtonValue = elem.innerHTML,
			toInputValue = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;

			this.field.querySelectorAll('.custom-select__val').forEach(function(elem) {
				elem.classList.remove('custom-select__val_checked');
			});

			elem.classList.add('custom-select__val_checked');

			if (button) {
				button.innerHTML = toButtonValue;
			}

			input.value = toInputValue;
			
			this.close();
		}

		this.targetAction();

		/*if ($input.hasClass('var-height-textarea__textarea')) {
			varHeightTextarea.setHeight($input);
		}*/

		this.field.classList.add('custom-select_changed');

		ValidateForm.select(input);
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
		var self = this,
		elements = document.querySelectorAll('.custom-select__autocomplete');


		elements.forEach(function(elem) {
			var checkedValues = elem.closest('.custom-select').querySelectorAll('.custom-select__val_checked');

			if (!checkedValues) {
				return;
			}

			checkedValues.forEach(function(elem) {

				self.selectVal(elem);

			});

		});
	},

	init: function(el) {
		var _ = this;

		$(el).each(function() {
			var $select = $(this),
			$options = $select.find('option'),
			$parent = $select.parent(),
			optionsList = '',
			require = ($select.attr('data-required') != undefined) ? ' data-required="'+ $select.attr('data-required') +'" ' : '',
			head = ($select.attr('data-type') == 'autocomplete') ? '<input type="text" name="'+ $select.attr('name') +'"'+ require +'placeholder="'+ $select.attr('data-placeholder') +'" class="custom-select__input custom-select__autocomplete form__text-input" value="">' : '<button type="button" data-placeholder="'+ $select.attr('data-placeholder') +'" class="custom-select__button">'+ $select.attr('data-placeholder') +'</button>',
			multiple = {
				class: ($select.attr('multiple') != undefined) ? ' custom-select_multiple' : '',
				inpDiv: ($select.attr('multiple') != undefined) ? '<div class="custom-select__multiple-inputs"></div>' : ''
			},
			hiddenInp = ($select.attr('data-type') != 'autocomplete') ? '<input type="hidden" name="'+ $select.attr('name') +'"'+ require +'class="custom-select__input" value="">' : '';

			for (var i = 0; i < $options.length; i++) {
				var $option = $($options[i]);
				optionsList += '<li><button type="button" class="custom-select__val"'+ ( ($option.attr('value') != undefined) ? ' data-value="'+ $option.attr('value') +'"' : '' ) + ( ($option.attr('data-target-elements') != undefined) ? ' data-target-elements="'+ $option.attr('data-target-elements') +'"' : '' ) +'>'+ $option.html() +'</button></li>';
			}

			$parent.prepend('<div class="custom-select'+ multiple.class +'">'+ head +'<ul class="custom-select__options">'+ optionsList +'</ul>'+ hiddenInp + multiple.inpDiv +'</div>');

			$select.remove();
		});

		//click on select button event
		document.addEventListener('click', function(e) {
			var elem = e.target.closest('.custom-select__button');

			if (!elem) {
				return;
			}

			this.field = elem.closest('.custom-select');

			if (this.field.classList.contains('custom-select_opened')) {
				this.close();
			} else {
				this.fillAcHead();
				this.close();
				this.open();
			}

		}.bind(this));

		//click on value button event
		document.addEventListener('click', function(e) {
			var elem = e.target.closest('.custom-select__val');

			if (!elem) {
				return;
			}

			this.field = elem.closest('.custom-select');

			this.selectVal(elem);

		}.bind(this));

		//focus autocomplete
		document.addEventListener('focus', function(e) {
			var elem = e.target.closest('.custom-select__autocomplete');

			if (!elem) {
				return;
			}

			this.field = elem.closest('.custom-select');

			if (!this.field.classList.contains('custom-select_opened')) {
				this.fillAcHead();
				this.close();
				this.open();
			}

		}.bind(this), true);

		//input autocomplete
		document.addEventListener('input', function(e) {
			var elem = e.target.closest('.custom-select__autocomplete');

			if (!elem) {
				return;
			}

			this.field = elem.closest('.custom-select');

			this.autocomplete(elem);

			if (!this.field.classList.contains('custom-select_opened')) {
				this.open();
			}

		}.bind(this));


		$('body').on('keydown', '.custom-select_opened', function(e) {

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

//custom file
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
	CustomPlaceholder.init('input[type="text"], input[type="password"], textarea');
	CustomSelect.init('select');
	CustomFile();
	varHeightTextarea.init();
});