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

	keyboard: function(key) {
		var options = this.field.querySelector('.custom-select__options'),
		hoverItem = options.querySelector('li.hover');

		switch (key) {
			
			case 40:

			if (hoverItem) {
				var nextItem = function(item) {

					var elem = item.nextElementSibling;

					while (elem) {

						if (!elem) {
							break;
						}

						if (!elementIsHidden(elem)) {
							return elem;
						} else {
							elem = elem.nextElementSibling;
						}

					}

				}(hoverItem);

				if (nextItem) {
					hoverItem.classList.remove('hover');
					nextItem.classList.add('hover');

					options.scrollTop = options.scrollTop + (nextItem.getBoundingClientRect().top - options.getBoundingClientRect().top);
				}

			} else {

				var elem = options.firstElementChild;

				while (elem) {

					if (!elem) {
						break;
					}

					if (!elementIsHidden(elem)) {
						elem.classList.add('hover');
						break;
					} else {
						elem = elem.nextElementSibling;
					}

				}

			}

			break;

			case 38:

			if (hoverItem) {
				var nextItem = function(item) {

					var elem = item.previousElementSibling;

					while (elem) {

						if (!elem) {
							break;
						}

						if (!elementIsHidden(elem)) {
							return elem;
						} else {
							elem = elem.previousElementSibling;
						}

					}

				}(hoverItem);

				if (nextItem) {
					hoverItem.classList.remove('hover');
					nextItem.classList.add('hover');

					options.scrollTop = options.scrollTop + (nextItem.getBoundingClientRect().top - options.getBoundingClientRect().top);
				}

			} else {

				var elem = options.lastElementChild;

				while (elem) {

					if (!elem) {
						break;
					}

					if (!elementIsHidden(elem)) {
						elem.classList.add('hover');
						options.scrollTop = 9999;
						break;
					} else {
						elem = elem.previousElementSibling;
					}

				}

			}

			break;

			case 13:
			this.selectVal(hoverItem.querySelector('.custom-select__val'));
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

	build: function(elementStr) {

		var elements = document.querySelectorAll(elementStr);

		if (!elements) {
			return;
		}

		elements.forEach(function(elem) {

			var options = elem.querySelectorAll('option'),
			parent = elem.parentElement,
			optionsList = '',
			require = (elem.hasAttribute('data-required')) ? ' data-required="'+ elem.getAttribute('data-required') +'" ' : '',
			head = (elem.getAttribute('data-type') == 'autocomplete') ? '<input type="text" name="'+ elem.name +'"'+ require +'placeholder="'+ elem.getAttribute('data-placeholder') +'" class="custom-select__input custom-select__autocomplete form__text-input" value="">' : '<button type="button" data-placeholder="'+ elem.getAttribute('data-placeholder') +'" class="custom-select__button">'+ elem.getAttribute('data-placeholder') +'</button>',
			multiple = {
				class: (elem.multiple) ? ' custom-select_multiple' : '',
				inpDiv: (elem.multiple) ? '<div class="custom-select__multiple-inputs"></div>' : ''
			},
			hiddenInp = (elem.getAttribute('data-type') != 'autocomplete') ? '<input type="hidden" name="'+ elem.name +'"'+ require +'class="custom-select__input" value="">' : '';

			//option list
			options.forEach(function(opt) {
				optionsList += '<li><button type="button" class="custom-select__val"'+ ( (opt.hasAttribute('value')) ? ' data-value="'+ opt.value +'"' : '' ) + ( (opt.hasAttribute('data-target-elements')) ? ' data-target-elements="'+ opt.getAttribute('data-target-elements') +'"' : '' ) +'>'+ opt.innerHTML +'</button></li>';
			});

			//output select
			parent.innerHTML = '<div class="custom-select'+ multiple.class +'">'+ head +'<ul class="custom-select__options">'+ optionsList +'</ul>'+ hiddenInp + multiple.inpDiv +'</div>';

		});

	},

	init: function(elementStr) {

		this.build(elementStr);

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

		//keyboard events
		document.addEventListener('keydown', function(e) {
			var elem = e.target.closest('.custom-select_opened');

			if (!elem) {
				return;
			}

			this.field = elem.closest('.custom-select');

			var key = e.which || e.keyCode || 0;

			if (key == 40 || key == 38 || key == 13) {
				e.preventDefault();
				this.keyboard(e.keyCode);
			}

		}.bind(this));

		//close all
		document.addEventListener('click', function(e) {
			if (!e.target.closest('.custom-select_opened')) {
				this.fillAcHead();
				this.close();
			}
		}.bind(this));

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