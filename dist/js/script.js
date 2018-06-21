//global variables
var browser;

(function() {
	"use strict";

//get useragent
document.documentElement.setAttribute('data-useragent', navigator.userAgent);

//browser identify
browser = (function(userAgent) {

	userAgent = userAgent.toLowerCase();

	if (/(msie|rv:11\.0)/.test(userAgent)) {
		return 'ie';
	}

}(navigator.userAgent));

//add support CustomEvent constructor for IE
try {
	new CustomEvent("IE has CustomEvent, but doesn't support constructor");
} catch (e) {

	window.CustomEvent = function(event, params) {
		var evt;

		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined
		};

		evt = document.createEvent("CustomEvent");

		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

		return evt;
	}

	CustomEvent.prototype = Object.create(window.Event.prototype);
}

//window Resized Event
var winResizedEvent = new CustomEvent('winResized');
var rsz = true;

window.addEventListener('resize', function() {

	if (rsz) {

		rsz = false;
		setTimeout(function() {
			window.dispatchEvent(winResizedEvent);
			rsz = true;
		}, 1021);

	}

});

//closest polyfill
if (!Element.prototype.closest) {
	(function(ElProto) {
		ElProto.matches = ElProto.matches || ElProto.mozMatchesSelector || ElProto.msMatchesSelector || ElProto.oMatchesSelector || ElProto.webkitMatchesSelector;
		ElProto.closest = ElProto.closest || function closest(selector) {
			if (!this) {
				return null;
			}
			if (this.matches(selector)) {
				return this;
			}
			if (!this.parentElement) {
				return null;
			} else {
				return this.parentElement.closest(selector);
			}
		};
	}(Element.prototype));
}

//check element for hidden
Element.prototype.elementIsHidden = function() {

	var elem = this;

	while (elem) {

		if (!elem) {
			break;
		}

		var compStyles = getComputedStyle(elem);

		if (compStyles.display == 'none' || compStyles.visibility == 'hidden' || compStyles.opacity == '0') {
			return true;
		}

		elem = elem.parentElement;

	}

	return false;
}

}());
$(document).ready(function() {

	$('body').on('click', '.accord__button', function() {
		var _$ = $(this),
		Content = _$.closest('.accord__item').find('.accord__content');

		if (!_$.hasClass('accord__button_active')) {
			_$.closest('.accord').find('.accord__content').slideUp(321);
			_$.closest('.accord').find('.accord__button').removeClass('accord__button_active');
			Content.slideDown(321, function() {
				$('body,html').animate({scrollTop: (_$.offset().top - $('.header').innerHeight())}, 900, 'easeOutExpo');
			});
			_$.addClass('accord__button_active');
		} else {
			Content.slideUp(321);
			_$.removeClass('accord__button_active');
		}

		return false;
	});
});
var Ajax = {
	take: function(url,data,id,fun) {
		var _ = this;

		$.ajax({
			url: url,
			type:"POST",
			dataType:"html",
			data: data,
			success: function(response){
				if (response) {
					_.put(response, id);
					setTimeout(fun, 721);
				}
			},
			error: function() {
				alert('Send Error');
			}
		});
	},
	put: function(resp,id) {
		var Block = $(id);
		if (Block.hasClass('popup__window')) {
			Block.find('.popup__inner').html(resp);
			Popup.show(id);
		} else {
			Block.append(resp);
			coverImg();
		}
	}

};

$(document).ready(function() {

	$('body').on('click', '.js-ajax', function () {
		var _$ = $(this);

		if (!_$.hasClass('lock')) {
			_$.addClass('lock');

			var id = _$.attr('href') || '#'+ _$.attr('data-id'),
			url = _$.attr('data-url'),
			data = _$.attr('data-data');

			if (_$.attr('data-page')) {
				var page = +_$.attr('data-page');

				data += '&page='+ page;

				Ajax.take(url, data, id, function() {
					page++;
					_$.attr('data-page', page).removeClass('lock');
				});

			} else {
				Ajax.take(url, data, id, function() {
					_$.removeClass('lock');
				});
			}
		}

		return false;
	});

	if ($('.js-ajax-scroll').length && $(window).width() > 1000) {
		var i = 0;

		$(window).scroll(function() {
			var winScrTop = $(window).scrollTop(),
			Point = $('.js-ajax-scroll');

			if (Point.offset().top < window.innerHeight && !Point.hasClass('lock')) {
				Point.addClass('lock');

				var id = '#'+ Point.attr('data-id'),
				url = Point.attr('data-url'),
				data = Point.attr('data-data'),
				page = +Point.attr('data-page');

				data += '&page='+ page;

				Ajax.take(url, data, id, function() {
					page++;
					Point.attr('data-page', page).removeClass('lock');
				});

			}

		});

	}

	

});
$(document).ready(function() {

	$('body').on('click', '.js-anchor', function () {
		var href = $(this).attr('href'),
		anch = '#'+ href.split('#')[1];

		if($(anch).length){
			var scrTo = ($(anch).attr('data-anchor-offset')) ? $(anch).offset().top : ($(anch).offset().top - $('.header').innerHeight() - 35);

			$('html, body').stop().animate({scrollTop: scrTo}, 1021, 'easeInOutQuart');

			return false;
		}

	});

	if (window.location.hash) {

		var anch = window.location.hash;

		if($(anch).length && !$(anch).hasClass('popup__window')){

			$('html, body').stop().animate({scrollTop: 0}, 1);

			window.onload = function() {
				var scrTo = ($(anch).attr('data-anchor-offset')) ? $(anch).offset().top : ($(anch).offset().top - $('.header').innerHeight() - 35);

				$('html, body').stop().animate({scrollTop: scrTo}, 1021, 'easeInOutQuart');
			}

		}

	}
	
});
$(document).ready(function() {

	/*Toggle*/
	$('body').on('click', '.js-toggle', function() {
		var _$ = $(this),
		targetElements = _$.attr('data-target-elements'),
		initClickOnElements = _$.attr('data-init-click-on-elements');

		if (initClickOnElements) {
			$(initClickOnElements).not(this).click();
		}

		function openMenu(st) {
			if (st) {
				var pos = $(window).scrollTop();
				$('body').css('top', -pos).attr('data-position', pos).addClass('is-menu-opened');
			} else {
				$('body').removeClass('is-menu-opened').removeAttr('style');
				$('html,body').scrollTop($('body').attr('data-position'));
			}
		}

		function actElements(st) {
			if (targetElements) {

				var $elem = $(targetElements),
				role = _$.attr('data-role');

				if (st) {
					$elem.addClass('toggled');
				} else {
					$elem.removeClass('toggled');
				}
				
				if (role && role == 'menu') {
					openMenu(st);
				}
				
			}
		}
		
		if (!_$.hasClass('toggled')) {
			actElements(1);
			_$.addClass('toggled');
			var secTxt = _$.attr('data-second-button-text');
			if (secTxt) {
				if (!_$.attr('data-first-button-text')) {
					_$.attr('data-first-button-text', _$.html());
				}
				_$.html(secTxt);
			}
		} else {
			actElements(0);
			_$.removeClass('toggled');
			var fstTxt = _$.attr('data-first-button-text');
			if (fstTxt) {
				_$.html(fstTxt);
			}
		}

		

		return false;
	});

});
var CustomPlaceholder, CustomSelect;

(function() {
	"use strict";

	//bind labels
	function BindLabels(elementsStr) {
		var elements = document.querySelectorAll(elementsStr);

		for (var i = 0; i < elements.length; i++) {
			var elem = elements[i],
			label = elem.parentElement.querySelector('label'),
			forID = (elem.hasAttribute('id')) ? elem.id : 'keylabel-'+ i;

			if (!label.hasAttribute('for')) {
				label.htmlFor = forID;
				elem.id = forID;
			}

		}

	}

	//show element on checkbox change
	var ChangeCheckbox = {

		change: function(elem) {

			var targetElements = (elem.hasAttribute('data-target-elements')) ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : {};

			if (!targetElements.length) {
				return;
			}

			for (var i = 0; i < targetElements.length; i++) {
				targetElements[i].style.display = (elem.checked) ? 'block' : 'none';
			}

		},

		init: function() {

			document.addEventListener('change', (e) => {

				var elem = e.target.closest('input[type="checkbox"]');

				if (elem) {
					this.change(elem);
				}

			});

		}

	};

	//show element on radio button change
	var ChangeRadio = {

		change: function(checkedElem) {

			var elements = document.querySelectorAll('input[type="radio"][name="'+ checkedElem.name +'"]');

			if (!elements.length) {
				return;
			}

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i],
				targetElements = (elem.hasAttribute('data-target-elements')) ? document.querySelectorAll(elem.getAttribute('data-target-elements')) : {};

				if (!targetElements.length) {
					continue;
				}

				for (var j = 0; j < targetElements.length; j++) {
					targetElements[j].style.display = (elem.checked) ? 'block' : 'none';
				}

			}

		},

		init: function() {

			document.addEventListener('change', (e) => {

				var elem = e.target.closest('input[type="radio"]');

				if (elem) {
					this.change(elem);
				}

			});

		}

	};

	//form custom placeholder
	CustomPlaceholder = {

		init: function(elementsStr) {
			var elements = document.querySelectorAll(elementsStr);

			if (!elements.length) {
				return;
			}

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

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

				if (elem.value.length) {
					this.hidePlaceholder(elem, true);
				}

			}

			//events
			document.addEventListener('focus', (e) => {
				var elem = e.target.closest(elementsStr);

				if (elem) {
					this.hidePlaceholder(elem, true);
				}

			}, true);


			document.addEventListener('blur', (e) => {

				var elem = e.target.closest(elementsStr);

				if (elem) {
					this.hidePlaceholder(elem, false);
				}

			}, true);

		},
		
		hidePlaceholder: function(elem, hide) {

			var label = document.querySelector('label[for="'+ elem.id +'"]');

			if (!label) {
				return;
			}

			var lSt = label.style;

			if (hide) {

				lSt.textIndent = '-9999px';
				lSt.paddingLeft = '0px';
				lSt.paddingRight = '0px';

			} else {

				if (!elem.value.length) {
					lSt.textIndent = '';
					lSt.paddingLeft = '';
					lSt.paddingRight = '';
				}

			}
			
		}

	};

	//Form CustomSelect
	CustomSelect = {

		field: null,

		close: function() {
			var fields = document.querySelectorAll('.custom-select');

			for (var i = 0; i < fields.length; i++) {
				fields[i].classList.remove('custom-select_opened');
			}

			var listItems = document.querySelectorAll('.custom-select__options li');

			for (var i = 0; i < listItems.length; i++) {
				listItems[i].classList.remove('hover');
			}

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

			for (var i = 0; i < checkedElements.length; i++) {
				var elem = checkedElements[i];

				toButtonValue[i] = elem.innerHTML;
				toInputValue[i] = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;

			}

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

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (!elem.hasAttribute('data-target-elements')) {
					return;
				}

				var targetElem = document.querySelector(elem.getAttribute('data-target-elements'));
				targetElem.style.display = (elem.classList.contains('custom-select__val_checked')) ? 'block' : 'none';

			}

		},

		selectVal: function(elem) {
			var button = this.field.querySelector('.custom-select__button'),
			input = this.field.querySelector('.custom-select__input');

			if (this.field.classList.contains('custom-select_multiple')) {
				
				this.selectMultipleVal(elem, button, input);

			} else {
				var toButtonValue = elem.innerHTML,
				toInputValue = (elem.hasAttribute('data-value')) ? elem.getAttribute('data-value') : elem.innerHTML;

				var lalueElements = this.field.querySelectorAll('.custom-select__val');

				for (var i = 0; i < lalueElements.length; i++) {
					lalueElements[i].classList.remove('custom-select__val_checked');
				}

				elem.classList.add('custom-select__val_checked');

				if (button) {
					button.innerHTML = toButtonValue;
				}

				input.value = toInputValue;
				
				this.close();

				CustomPlaceholder.hidePlaceholder(input, true);

			}

			this.targetAction();

			if (input.classList.contains('var-height-textarea__textarea')) {
				varHeightTextarea.setHeight(input);
			}

			this.field.classList.add('custom-select_changed');

			ValidateForm.select(input);

		},

		autocomplete: function(elem) {
			var match = false,
			reg = new RegExp(elem.value, 'gi'),
			valueElements = this.field.querySelectorAll('.custom-select__val');

			for (var i = 0; i < valueElements.length; i++) {
				var valueElem = valueElements[i];

				if (!elem.value.length) {
					valueElem.classList.remove('custom-select__val_checked');
					continue;
				}

				if (valueElem.innerHTML.match(reg)) {
					valueElem.parentElement.classList.remove('hidden');
					match = true;
				} else {
					valueElem.parentElement.classList.add('hidden');
				}

			}

			if (!match) {
				for (var i = 0; i < valueElements.length; i++) {
					valueElements[i].parentElement.classList.remove('hidden');
				}
			}

		},

		setOptions: function(fieldStr, optObj, val, name) {
			var fields = document.querySelectorAll(fieldStr);

			for (var i = 0; i < fields.length; i++) {
				var options = fields[i].querySelector('.custom-select__options');

				for (var i = 0; i < optObj.length; i++) {
					var li = document.createElement('li');

					li.innerHTML = '<button type="button" class="custom-select__val" data-value="'+ optObj[i][val] +'">'+ optObj[i][name] +'</button>';

					options.appendChild(li);
				}
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

							if (!elem.elementIsHidden()) {
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

						if (!elem.elementIsHidden()) {
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

							if (!elem.elementIsHidden()) {
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

						if (!elem.elementIsHidden()) {
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
			var elements = document.querySelectorAll('.custom-select__autocomplete');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i],
				checkedValues = elem.closest('.custom-select').querySelectorAll('.custom-select__val_checked');

				if (!checkedValues) {
					return;
				}

				if (elem.value.length) {

					for (var j = 0; j < checkedValues.length; j++) {
						this.selectVal(checkedValues[j]);
					}

				} else {

					for (var j = 0; j < checkedValues.length; j++) {
						checkedValues[j].classList.remove('custom-select__val_checked');
					}

				}
			}

		},

		build: function(elementStr) {
			var elements = document.querySelectorAll(elementStr);

			if (!elements.length) {
				return;
			}

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i],
				options = elem.querySelectorAll('option'),
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
				for (var j = 0; j < options.length; j++) {
					var opt = options[j];

					optionsList += '<li><button type="button" class="custom-select__val"'+ ( (opt.hasAttribute('value')) ? ' data-value="'+ opt.value +'"' : '' ) + ( (opt.hasAttribute('data-target-elements')) ? ' data-target-elements="'+ opt.getAttribute('data-target-elements') +'"' : '' ) +'>'+ opt.innerHTML +'</button></li>';
				}

				//output select
				parent.innerHTML = '<div class="custom-select'+ multiple.class +'">'+ head +'<ul class="custom-select__options">'+ optionsList +'</ul>'+ hiddenInp + multiple.inpDiv +'</div>';
			}

		},

		init: function(elementStr) {

			this.build(elementStr);

			//click on select button event
			document.addEventListener('click', (e) => {
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

			});

			//click on value button event
			document.addEventListener('click', (e) => {
				var elem = e.target.closest('.custom-select__val');

				if (!elem) {
					return;
				}

				this.field = elem.closest('.custom-select');

				this.selectVal(elem);

			});

			//focus autocomplete
			document.addEventListener('focus', (e) => {
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

			}, true);

			//input autocomplete
			document.addEventListener('input', (e) => {
				var elem = e.target.closest('.custom-select__autocomplete');

				if (!elem) {
					return;
				}

				this.field = elem.closest('.custom-select');

				this.autocomplete(elem);

				if (!this.field.classList.contains('custom-select_opened')) {
					this.open();
				}

			});

			//keyboard events
			document.addEventListener('keydown', (e) => {
				var elem = e.target.closest('.custom-select_opened');

				if (!elem) {
					return;
				}

				this.field = elem.closest('.custom-select');

				var key = e.which || e.keyCode || 0;

				if (key == 40 || key == 38 || key == 13) {
					e.preventDefault();
					this.keyboard(key);
				}

			});

			//close all
			document.addEventListener('click', (e) => {
				if (!e.target.closest('.custom-select_opened')) {
					this.fillAcHead();
					this.close();
				}
			});

		}

	};

	//custom file
	var CustomFile = {

		field: null,

		loadPreview: function(file, i) {
			var imgPreviewBlock = this.field.querySelectorAll('.custom-file__preview')[i];

			if (file.type.match('image')) {
				var reader = new FileReader();

				reader.onload = function(e) {
					imgPreviewBlock.innerHTML = '<img src="'+ e.target.result +'" class="cover-img">';

					setTimeout(function() {
						coverImg('.custom-file__item');
					}, 721);

				}

				reader.readAsDataURL(file);
			} else {
				imgPreviewBlock.innerHTML = '<img src="images/preview.svg" class="full-width-img">';
			}

		},

		changeInput: function(elem) {

			this.field = elem.closest('.custom-file');

			var self = this,
			fileItems = this.field.querySelector('.custom-file__items');

			fileItems.innerHTML = '';

			console.log(elem.files);

			for (var i = 0; i < elem.files.length; i++) {
				var file = elem.files[i],
				fileItem = document.createElement('div');

				fileItem.className = 'custom-file__item';
				fileItem.innerHTML = '<div class="custom-file__preview cover-img-wrap"></div><div class="custom-file__name">'+ file.name +'</div>';

				fileItems.appendChild(fileItem);

				self.loadPreview(file, i);
			}

		},

		init: function() {

			document.addEventListener('change', (e) => {
				var elem = e.target.closest('input[type="file"]');

				if (!elem) {
					return;
				}

				this.changeInput(elem);

			});

		}

	};

	//variable height textarea
	var varHeightTextarea = {

		setHeight: function(elem) {
			var mirror = elem.parentElement.querySelector('.var-height-textarea__mirror'),
			mirrorOutput = elem.value.replace(/\n/g, '<br>');

			mirror.innerHTML = mirrorOutput +'&nbsp;';
		},

		init: function() {

			document.addEventListener('input', (e) => {
				var elem = e.target.closest('.var-height-textarea__textarea');

				if (!elem) {
					return;
				}

				this.setHeight(elem);

			});

		}

	};

	//init scripts
	document.addEventListener("DOMContentLoaded", function() {
		CustomSelect.init('select');
		CustomFile.init();
		varHeightTextarea.init();
		CustomPlaceholder.init('input[type="text"], input[type="password"], textarea');
		BindLabels('input[type="checkbox"], input[type="radio"]');
		ChangeCheckbox.init();
		ChangeRadio.init();
	});

}());
function Diagram(id,values,set) {

	var _ = this;

	_.maxVal = 0;
	_.context = null;
	_.startingAngle = 1.5*Math.PI;
	_.centerX = 80;
	_.centerY = 80;

	_.set = set || {};

	_.init = function(id,values) {

		var canvas = document.getElementById(id);

		if (canvas && values) {
			_.context = canvas.getContext('2d');

			if (_.set.type) {
				_.centerX = 70;
				_.centerY = 70;

				if (_.set.type == 'percent') {
					_.maxVal = 100;
					var val = Math.round(values[1]/(values[0]/100));
					_.draw(val, _.set.color, true, _.set.pid);
				} 

			} else {
				for (var i = 0; i < values.length; i++) {
					_.maxVal += values[i];
				}

				if (_.set.animate) {
					_.animate(values);
				} else {
					for (var i = 0; i < values.length; i++) {
						_.draw(values[i],i);
					}
				}

			}

		}

	}

	_.draw = function(val,i,once,pid) {

		var endingAngle = _.calcPath(val),
		style = _.pathStyle(i);

		if (once) {
			style.r = 63;
		}

		if (pid) {
			$('#'+ pid).html(val);
		}

		
		_.context.beginPath();
		_.context.arc(_.centerX, _.centerY, style.r, _.startingAngle, endingAngle);
		_.context.lineWidth = 11;
		_.context.strokeStyle = style.c;
		_.context.stroke();

	}

	_.calcPath = function(val) {
		var pi2 = 2*Math.PI;
		return (pi2*val/_.maxVal+_.startingAngle);
	}

	_.pathStyle = function(i) {
		var style = {};
		switch (i) {
			case 0:
			style = {r: 69, c: '#fd8d40'}
			break;
			case 1:
			style = {r: 57, c: '#d0295e'}
			break;
			case 2:
			style = {r: 45, c: '#78c574'}
			break;
			case 3:
			style = {r: 33, c: '#5195cb'}
			break;
		}
		return style;
	}

	_.animate = function(values) {

		
		var newVal = new Array(values.length);
		
		for (var i = 0; i < newVal.length; i++) {
			newVal[i] = 0;
		}

		setTimeout(function anim(st) {

			_.context.clearRect(0,0,(_.centerX*2),(_.centerY*2));

			var c = 0;
			for (var i = 0; i < values.length; i++) {
				if (newVal[i] < values[i]) {
					newVal[i] = newVal[i] + 2;
					c++;
				}
				_.draw(newVal[i],i);
				$('#'+ _.set.numId + i).html(newVal[i]);
			}

			if (c) {
				setTimeout(anim, 1);
			} else {
				_.context.clearRect(0,0,(_.centerX*2),(_.centerY*2));
				for (var i = 0; i < values.length; i++) {
					_.draw(values[i],i);
					$('#'+ _.set.numId + i).html(values[i]);
				}
			}

		}, 1);

	}

	_.init(id,values,set);
	
}

var diagramObject = [];
function diagram(id,values,set) {
	if (!(diagramObject[id] instanceof Diagram)) {
		diagramObject[id] = new Diagram(id,values,set);
	}
}
var FlSlider = {

	animation: false,
	count: 0,
	isLine: false,
	t: null,

	init: function() {
		var _ = this;

		_.count = $('.float-slider__float-item').length;

		$('.float-slider__float-item').first().addClass('float-slider__float-item_curr');
		$('.float-slider__fade-item').first().addClass('float-slider__fade-item_curr');


		if (_.count > 1) {

			$('.float-slider__float-item').last().addClass('float-slider__float-item_prev');

			$('.float-slider__float-item').first().next('.float-slider__float-item').removeClass('float-slider__float-item_prev').addClass('float-slider__float-item_next');

			var dots = '';
			for (var i = 0; i < _.count; i++) {
				dots += '<li'+ ((i == 0) ? ' class="float-slider__dots-active"' : '') +'><button type="button" data-index="'+ i +'"></button></li>';
			}

			$('.float-slider__float').append('<ul class="float-slider__dots">'+ dots +'</ul>');

			if ($('.float-slider').attr('data-line')) {
				_.isLine = true;
			}

		} else {
			$('.float-slider__arrow').remove();
		}

	},

	dots: function(ind) {
		var _ = this;
		function dotC() {
			if (!$('.float-slider__float-item[data-index="'+ ind +'"]').hasClass('float-slider__float-item_curr')) {

				if (_.count == 2 && ind === 0) {
					_.change('prev');
				} else {
					_.change('next');
				}

				setTimeout(dotC, 1121);
			}
		}
		dotC();
	},

	activeDot: function() {
		var _ = this;
		var ind = $('.float-slider__float-item_curr').attr('data-index');
		$('.float-slider__dots li').removeClass('float-slider__dots-active');
		$('.float-slider__dots').find('button[data-index="'+ ind +'"]').parent().addClass('float-slider__dots-active');
		$('.float-slider-control__btn').removeClass('float-slider-control__btn_active');
		$('#float-sl-cont-'+ ind).addClass('float-slider-control__btn_active');
		if (_.isLine) {
			clearTimeout(_.t);
			_.line();
		}
	},

	line: function() {
		var _ = this;
		$('.float-slider-control__line span').removeClass('crawl');
		$('.float-slider-control__btn_active .float-slider-control__line span').addClass('crawl');
		_.t = setTimeout(function() {
			_.change('next');
		}, 5000);
	},

	change: function(dir) {

		var _ = this,
		Curr = $('.float-slider__float-item_curr'),
		Next = $('.float-slider__float-item_next'),
		Prev = $('.float-slider__float-item_prev'),
		ToNext,
		ToPrev;

		if (_.count > 3) {
			ToNext = (Next.next('.float-slider__float-item').length) ? Next.next('.float-slider__float-item') : $('.float-slider__float-item').first();
			ToPrev = (Prev.prev('.float-slider__float-item').length) ? Prev.prev('.float-slider__float-item') : $('.float-slider__float-item').last();
		}

		if (_.count == 2) {
			if (Next.attr('data-index') === '1') {
				if (dir == 'prev') {
					return false;
				}
			} else if (Prev.attr('data-index') === '0') {
				if (dir == 'next') {
					return false;
				}
			}
		} else if (_.count == 1) {
			return false;
		}
		
		if (!_.animation) {

			if (dir == 'next') {
				_.animation = true;

				Next.addClass('next-to-curr');
				Curr.addClass('curr-to-prev');

				if (_.count > 3) {
					ToNext.addClass('to-next');
					Prev.addClass('from-prev');
				} else {
					Prev.addClass('prev-to-next');
				}

				$('.float-slider__fade-item').removeClass('float-slider__fade-item_curr');

				setTimeout(function() {

					$('.float-slider__fade-item[data-index="'+ Next.attr('data-index') +'"]').addClass('float-slider__fade-item_curr');

					if (_.count > 3) {
						ToNext.addClass('float-slider__float-item_next').removeClass('to-next');
						Prev.removeClass('float-slider__float-item_prev from-prev');
					} else {
						Prev.addClass('float-slider__float-item_next').removeClass('float-slider__float-item_prev prev-to-next');
					}

					Curr.addClass('float-slider__float-item_prev').removeClass('float-slider__float-item_curr curr-to-prev');

					Next.addClass('float-slider__float-item_curr').removeClass('float-slider__float-item_next next-to-curr');

					_.animation = false;
					_.activeDot();

				}, 1021);
				
			} else if (dir == 'prev') {
				_.animation = true;

				Prev.addClass('prev-to-curr');
				Curr.addClass('curr-to-next');
				

				if (_.count > 3) {
					ToPrev.addClass('to-prev');
					Next.addClass('from-next');
				} else {
					Next.addClass('next-to-prev');
				}

				$('.float-slider__fade-item').removeClass('float-slider__fade-item_curr');
				
				setTimeout(function() {

					$('.float-slider__fade-item[data-index="'+ Prev.attr('data-index') +'"]').addClass('float-slider__fade-item_curr');

					Prev.addClass('float-slider__float-item_curr').removeClass('float-slider__float-item_prev prev-to-curr');

					Curr.addClass('float-slider__float-item_next').removeClass('float-slider__float-item_curr curr-to-next');

					if (_.count > 3) {
						ToPrev.addClass('float-slider__float-item_prev').removeClass('to-prev');
						Next.removeClass('float-slider__float-item_next from-next');
					} else {
						Next.addClass('float-slider__float-item_prev').removeClass('float-slider__float-item_next next-to-prev');
					}

					_.animation = false;
					_.activeDot();

				}, 1021);
				
			}

		}
		
	}

};


$('document').ready(function() {

	FlSlider.init();

	if ($('.float-slider-control').length) {
		var s = true;
		$(window).scroll(function() {
			if ( $('.float-slider-control').offset().top < (($(window).height()/2)+$(window).scrollTop()) ) {
				if (s) {
					s = false;
					FlSlider.line();
				}
			}
		});
	}

	$('body').on('click', '.float-slider-control__btn-btn', function() {
		if (!$(this).parent().hasClass('float-slider-control__btn_active')) {
			var ind = +$(this).attr('data-index');
			FlSlider.dots(ind);
		}
	});

	$('body').on('click', '.float-slider__dots button', function() {
		if (!$(this).parent().hasClass('float-slider__dots-active')) {
			var ind = +$(this).attr('data-index');
			FlSlider.dots(ind);
		}
	});

	$('body').on('click', '.float-slider__arrow', function() {
		var dir = $(this).attr('data-direct');
		FlSlider.change(dir);
	});

	if (window.innerWidth < 1200) {
		$('.float-slider').swipe({
			swipe: function(event, direction) {
				if (direction == 'right') {
					FlSlider.change('prev');
				} else if(direction == 'left') {
					FlSlider.change('next');
				}
			},
			triggerOnTouchEnd: false,
			excludedElements: '',
			threshold: 21,
		});
	}

});
var Form;

(function() {
	"use strict";

	//next fieldset
	var NextFieldset = {

		next: function(elem) {
			var nextFieldset = (elem.hasAttribute('data-next-fieldset-item')) ? document.querySelector(elem.getAttribute('data-next-fieldset-item')) : false;

			if (!nextFieldset) {
				return;
			}

			var currentFieldset = elem.closest('.fieldset__item');

			if (ValidateForm.validate(currentFieldset)) {
				currentFieldset.classList.add('fieldset__item_hidden');
				nextFieldset.classList.remove('fieldset__item_hidden');
			}

		},

		init: function(form, elemStr) {

			form.addEventListener('click', (e) => {

				var elem = e.target.closest(elemStr);

				if (elem) {
					this.next(elem);
				}

			});

		}

	};

	//init forms
	Form = function(formSelector) {

		this.onSubmit = null;

		var form = document.querySelector(formSelector);

		if (!form) {
			return;
		}

		//clear form
		function clear() {
			//clear inputs
			var elements = form.querySelectorAll('input[type="text"], input[type="password"], textarea');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				elem.value = '';
				CustomPlaceholder.hidePlaceholder(elem, false);
			}

			var textareaMirrors = form.querySelectorAll('.form__textarea-mirror');

			for (var i = 0; i < textareaMirrors.length; i++) {
				textareaMirrors[i].innerHTML = '';
			}

		}

		//submit button
		function actSubmitBtn(st) {
			var elements = form.querySelectorAll('button[type="submit"], input[type="submit"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (!elem.elementIsHidden()) {
					if (st) {
						elem.removeAttribute('disabled');
					} else {
						elem.setAttribute('disabled', 'disable');
					}
				}
			}

		}

		//submit
		const submit = (e) => {

			if (ValidateForm.submit(form)) {

				actSubmitBtn(false);

				form.classList.add('form_sending');

				if (this.onSubmit) {
					e.preventDefault();

					this.onSubmit(form, function(obj) {
						obj = obj || {};

						actSubmitBtn(obj.unlockSubmitButton);

						form.classList.remove('form_sending');

						if (obj.clearForm == true) {
							clear();
						}

					});

				}

				form.classList.remove('form_error');

			} else {
				e.preventDefault();
				form.classList.add('form_error');
			}

		}

		//add submit event
		form.addEventListener('submit', submit);

		ValidateForm.init(form);

		NextFieldset.init(form, '.form__button');

	}
	

}());
var FsScroll = {
	winH: null,
	scrolling: false,
	factor: 0,
	scrChangedEv: null,
	beforeScrChangeEv: null,

	init: function() {
		var _ = this;
		_.winH =  window.innerHeight;

		$('.fsscroll__screen').removeClass('fsscroll__screen_scroll').css('height', 'auto');

		$('.fsscroll__screen').each(function() {
			var _item = $(this),
			itemH = _item.innerHeight();
			if (itemH <= _.winH) {
				_item.css('height', _.winH);
			} else {
				_item.addClass('fsscroll__screen_scroll');
			}
		});
		
		$('.fsscroll__screen').first().addClass('fsscroll__screen_first fsscroll__screen_current');
		$('.fsscroll__screen').last().addClass('fsscroll__screen_last');

		setTimeout(function() {
			_.current();
		}, 21);

		$(window).scroll(function() {
			if (!_.scrolling) {
				_.current();
			}
		});

		_.scrChangedEv = new CustomEvent('scrChanged');
		_.beforeScrChangeEv = new CustomEvent('beforeScrChange');

	},

	current: function() {
		var _ = this,
		midWinScrollTop = $(window).scrollTop() + _.winH / 2;

		$('.fsscroll__screen').removeClass('fsscroll__screen_current');

		$('.fsscroll__screen').each(function() {
			var $item = $(this),
			itemOfsTop = $item.offset().top,
			itemH = $item.innerHeight();

			if (itemOfsTop <= midWinScrollTop && (itemOfsTop + itemH) >= midWinScrollTop) {
				$item.addClass('fsscroll__screen_current');
				window.dispatchEvent(_.scrChangedEv);
			}

		});

	},
	
	move: function(moveTo, scroll) {
		var _ = this,
		duration = 1500,
		easing = 'easeInOutCubic';

		_.scrolling = true;

		if (scroll) {
			duration = 900;
			easing = 'easeInOutCubic';
		}

		window.dispatchEvent(_.beforeScrChangeEv);

		$('body, html').stop().animate({scrollTop: moveTo}, duration, easing, function() {
			setTimeout(function() {
				_.current();
				_.scrolling = false;
				_.factor = 0;
			}, 21);
		});
	},

	mouseScroll: function(delta, factor, fun) {
		var _ = this,
		$curScr = $('.fsscroll__screen_current'),
		winScrollTop = $(window).scrollTop(),
		winScrollBottom = winScrollTop + _.winH,
		$nextScr;

		if (delta < 0) {
			$nextScr = $curScr.next('.fsscroll__screen');

			if ($curScr.length && !$curScr.hasClass('fsscroll__screen_scroll') && !$curScr.hasClass('fsscroll__screen_last')) {
				if (!_.scrolling) {
					if ((winScrollTop + 21) < $curScr.offset().top) {
						_.move($curScr.offset().top);
					} else {
						_.move($nextScr.offset().top);
					}
				}
			} else {
				if ($nextScr.length && winScrollBottom > $nextScr.offset().top) {
					if (!_.scrolling) {
						_.move($nextScr.offset().top);
					}
				} else {
					_.factor = _.factor + factor / 2;
					_.move(winScrollTop + _.factor, true);
				}
			}
			
		} else if (delta > 0) {

			$nextScr = $curScr.prev('.fsscroll__screen');

			if ($curScr.length && !$curScr.hasClass('fsscroll__screen_scroll') && !$curScr.hasClass('fsscroll__screen_first')) {
				if (!_.scrolling) {
					if ((winScrollBottom - 21) > ($curScr.offset().top + $curScr.innerHeight())) {
						_.move($curScr.offset().top + $curScr.innerHeight() - _.winH);
					} else {
						_.move($nextScr.offset().top + $nextScr.innerHeight() - _.winH);
					}
				}
			} else {
				if ($nextScr.length && ($nextScr.offset().top + $nextScr.innerHeight()) > winScrollTop) {
					if (!_.scrolling) {
						_.move($nextScr.offset().top);
					}
				} else {
					_.factor = _.factor + factor / 2;
					_.move(winScrollTop - _.factor, true);
				}
			}
		}
		
	}

};


$(document).ready(function() {

	if ($('.fsscroll').length) {
		$('.fsscroll').attr('id', 'js-fsscroll');

		(function initFsS() {

			if (window.innerWidth > 1030) {

				FsScroll.init();

				$('#js-fsscroll').on('mousewheel', function(e) {
					e.preventDefault ? e.preventDefault() : (e.returnValue = false);
					FsScroll.mouseScroll(e.deltaY, e.deltaFactor);
				});

			} else {

				$('#js-fsscroll').off('mousewheel');

				if (window.innerWidth > 1000) {

					FsScroll.init();

					$('.wrapper_fsscroll').swipe({
						swipe: function(e, direct, factor) {
							var delta;
							switch (direct) {
								case 'down': delta = 1;
								break;
								case 'up': delta = -1;
								break;
								default: delta = 0;
								break;
							}

							FsScroll.mouseScroll(delta, factor);

						},
						allowPageScroll: 'none',
						excludedElements: '',
						threshold: 21,
					});

				}

			}

			$(window).on('winResized', initFsS);

		})();

	}

});
var flexImg, CoverImg;

(function() {
	"use strict";

	//flexible image
	flexImg = function(elementsStr) {

		function load(elem) {

			if (!elem.hasAttribute('data-images')) {
				return;
			}

			var images = elem.getAttribute('data-images').split(',');

			images.forEach(function(image) {

				var imageProp = image.split('->');

				if (window.innerWidth < (+imageProp[0])) {
					elem.src = imageProp[1];
				}

			});

		}

		//init
		var elements = document.querySelectorAll(elementsStr);

		if (elements.length) {

			for (var i = 0; i < elements.length; i++) {
				load(elements[i]);
			}

		}

	}

	//cover image
	CoverImg = {

		cover: function(e) {
			var img = e.currentTarget,
			imgWrap = img.closest('.cover-img-wrap'),
			imgProportion = img.offsetWidth/img.offsetHeight,
			imgWrapProportion = imgWrap.offsetWidth/imgWrap.offsetHeight;

			if (imgWrapProportion != Infinity && imgWrapProportion < 21) {

				if (imgProportion <= imgWrapProportion) {
					var margin = Math.round(-(imgWrap.offsetWidth / imgProportion - imgWrap.offsetHeight) / 2);

					img.classList.add('cover-img_w');
					img.style.marginTop = margin +'px';

				} else {
					var margin = Math.round(-(imgWrap.offsetHeight * imgProportion - imgWrap.offsetWidth) / 2);

					img.classList.add('cover-img_h');
					img.style.marginLeft = margin +'px';

				}

			} else {
				img.classList.add('cover-img_w');
			}

		},

		reInit: function(parentElementStr) {

			var elements;

			if (parentElementStr) {

				if ((typeof parentElementStr) == 'object') {
					elements = parentElementStr.querySelectorAll('.cover-img');
				} else {
					elements = document.querySelectorAll(parentElementStr +' .cover-img');
				}

			} else {
				elements = document.querySelectorAll('.cover-img');
			}

			for (var i = 0; i < elements.length; i++) {
				var img = elements[i];

				img.classList.remove('cover-img_w');
				img.classList.remove('cover-img_h');
				img.style.marginTop = '';
				img.style.marginLeft = '';
				img.src = (browser == 'ie') ? (img.src +'?'+ new Date().getTime()) : img.src;
			}

		},

		init: function(parentElementStr) {
			var elements = (parentElementStr) ? document.querySelectorAll(parentElementStr +' .cover-img, '+ parentElementStr +' .cover-img-wrap') : document.querySelectorAll('.cover-img, .cover-img-wrap');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i],
				img;

				if (elem.classList.contains('cover-img-wrap')) {

					img = elem.querySelector('img');

					img.classList.add('cover-img');

				} else if (elem.classList.contains('cover-img')) {

					img = elem;

					img.parentElement.classList.add('cover-img-wrap');

				}

				if (!img.hasAttribute('data-event')) {

					img.addEventListener('load', this.cover);

					img.setAttribute('data-event', 'true');

				}

				if (browser == 'ie') {
					img.src = img.src +'?'+ new Date().getTime();
				}

			}

		}

	};

}());
$(document).ready(function() {

	$('body').find('.more').each(function() {
		var _ = $(this),
		moreHeight = _.height(),
		content = _.html();

		_.html('<div class="more__inner">'+ content +'</div>');

		var _inner = _.find('.more__inner'),
		innerHeight = _inner.innerHeight();

		if (moreHeight < innerHeight) {
			_.addClass('more_apply').append('<button class="more__button">Показать</button>');
			_inner.css({height: moreHeight}).attr('data-min-height', moreHeight).attr('data-max-height', innerHeight);
		}

	});

	$('body').on('click', '.more__button', function() {
		var _ = $(this),
		_moreInner = _.parent('.more').find('.more__inner'),
		minH = _moreInner.attr('data-min-height'),
		maxH = _moreInner.attr('data-max-height');
		if (!_.hasClass('more__button_active')) {
			_moreInner.css('height', maxH);
			_.addClass('more__button_active').html('Скрыть');
		} else {
			_moreInner.css('height', minH);
			_.removeClass('more__button_active').html('Показать');
		}
		return false;
	});

});
function Mouseparallax(elem, options) {
	var _ = this,
	defaultOpt = {
		listener: document,
		deltaX: 21,
		deltaY: 21,
		rangeX: [],
		rangeY: [],
	},
	options = options || {},
	opt = $.extend({}, defaultOpt, options),
	$elem = $(elem),
	startMousePos = {X: 0, Y: 0},
	listenerW = $(opt.listener).innerWidth(),
	listenerH = $(opt.listener).innerHeight(),
	cursorPos = {X: 0, Y: 0},
	direct = {};

	_.translateElement = {X: 0, Y: 0};
	_.startElementPos = {X: 0, Y: 0};

	if ($elem.attr('data-delta-x') != undefined) {
		opt.deltaX = +$elem.attr('data-delta-x');
	}

	if ($elem.attr('data-delta-y') != undefined) {
		opt.deltaY = +$elem.attr('data-delta-y');
	}

	if ($elem.attr('data-range-x') != undefined) {
		opt.rangeX = $elem.attr('data-range-x').split(',');
	}

	if ($elem.attr('data-range-y') != undefined) {
		opt.rangeY = $elem.attr('data-range-y').split(',');
	}
	
	$(document).on('mouseenter', opt.listener, function(e) {
		startMousePos.X = e.clientX;
		startMousePos.Y = e.clientY;
	});

	$(document).on('mousemove', opt.listener, function(e) {

		if (e.clientX > cursorPos.X) {
			direct.X = 'right';
		} else {
			direct.X = 'left';
		}
		cursorPos.X = e.clientX;

		if (e.clientY > cursorPos.Y) {
			direct.Y = 'up';
		} else {
			direct.Y = 'down';
		}
		cursorPos.Y = e.clientY;

		var deltaMouse = {
			X: e.clientX - startMousePos.X,
			Y: e.clientY - startMousePos.Y
		};

		_.translateElement = {
			X: deltaMouse.X * (opt.deltaX / listenerW) + _.startElementPos.X,
			Y: deltaMouse.Y * (opt.deltaY / listenerH) + _.startElementPos.Y
		};

		var translateX = _.translateElement.X,
		translateY = _.translateElement.Y;

		if (opt.rangeX) {
			if (_.translateElement.X >= opt.rangeX[0]) {
				if (direct.X == 'left') {
					startMousePos.X = e.clientX;
					_.startElementPos.X = +opt.rangeX[0];
				}
				translateX = opt.rangeX[0];
			} else if (_.translateElement.X <= opt.rangeX[1]) {
				if (direct.X == 'right') {
					startMousePos.X = e.clientX;
					_.startElementPos.X = +opt.rangeX[1];
				}
				translateX = opt.rangeX[1];
			}
		}

		if (opt.rangeY) {
			if (_.translateElement.Y >= opt.rangeY[0]) {
				if (direct.Y == 'down') {
					startMousePos.Y = e.clientY;
					_.startElementPos.Y = +opt.rangeY[0];
				}
				translateY = opt.rangeY[0];
			} else if (_.translateElement.Y <= opt.rangeY[1]) {
				if (direct.Y == 'up') {
					startMousePos.Y = e.clientY;
					_.startElementPos.Y = +opt.rangeY[1];
				}
				translateY = opt.rangeY[1];
			}
		}

		$elem.css('transform', 'translate('+ translateX +'px, '+ translateY +'px)');

	});

	$(document).on('mouseleave', opt.listener, function(e) {
		_.startElementPos.X = _.translateElement.X;
		_.startElementPos.Y = _.translateElement.Y;
	});

}

var mousePlxObj = [], i = 0, ind;
function mouseparallax(elem, options) {

	if ($(elem)[0].ind == undefined) {
		$(elem)[0].ind = ind = i;
	} else {
		ind = $(elem)[0].ind;
	}

	i++;

	if (!(mousePlxObj[elem+ind] instanceof Mouseparallax)) {
		mousePlxObj[elem+ind] = new Mouseparallax(elem, options);
	}

	return mousePlxObj[elem+ind];
}
function Numberspin(elem, opt) {
	var def = {
		animation: 1
	},
	opt = opt || {},
	options = $.extend({}, def, opt),
	interval = null,
	animate = false,
	$Elem = $(elem),
	curVal = 0,
	val = $Elem.html().replace(/[\s]/g, ''),
	pattern = val.match(/[\.,]/),
	endVal = +val.replace(/[\D]/g, '');

	$Elem.html(0);

	this.start = function() {
		
		if (!animate) {
			animate = true;
			spin();
		}
	}

	function spin() {

		interval = setTimeout(function run() {

				if (curVal < endVal) {

					if (options.animation == 1) {

						var d = endVal - curVal;

						if (d > 1213214321321) {
							curVal = curVal + 1213214321321;
						} else if (d > 3214321321) {
							curVal = curVal + 3214321321;
						} else if (d > 4321321) {
							curVal = curVal + 4321321;
						} else if (d > 321321) {
							curVal = curVal + 321321;
						} else if (d > 32321) {
							curVal = curVal + 32321;
						} else if (d > 2321) {
							curVal = curVal + 2321;
						} else if (d > 1321) {
							curVal = curVal + 1321;
						} else if (d > 321) {
							curVal = curVal + 321;
						} else if (d > 21) {
							curVal = curVal + 21;
						} else {
							curVal++;
						}


					} else if (options.animation == 2) {

						var endValArr = String(endVal).split(''),
						curValArr = String(curVal).split('');

						for (var i = 0; i < endValArr.length; i++) {
							if (curValArr[i]) {
								if (curValArr[i] < endValArr[i] && curValArr[i-1] == endValArr[i-1]) {
									curValArr[i]++;
								}
							} else if (curValArr[i-1] && curValArr[i-1] == endValArr[i-1]) {
								curValArr[i] = 0;
							}

						}

						curVal = curValArr.join('');

					}

					var output = String(curVal);

					if (pattern) {
						output = output.replace(new RegExp('(\\d{'+ pattern.index +'})'), '$1'+ pattern[0]);
						output = output.replace(new RegExp('(\\d)?(?=(\\d{3})+?\\'+ pattern[0] +')', 'g'), '$1 ');
					} else {
						output = output.replace(/(\d)?(?=(\d{3})+$)/g, '$1 ');
					}
					
					$Elem.html(output);

					setTimeout(run, 85);

				} else {
					stop();
				}

		}, 1);

	}

	function stop() {
		clearTimeout(interval);
	}

}

var numberspinObj = [], i = 0, ind;
function numberspin(elem, opt) {
	if ($(elem)[0].ind == undefined) {
		$(elem)[0].ind = ind = i;
	} else {
		ind = $(elem)[0].ind;
	}

	if (!(numberspinObj[elem+ind] instanceof Numberspin)) {
		numberspinObj[elem+ind] = new Numberspin(elem, opt);
	}
	i++;

	return numberspinObj[elem+ind];
}
var Popup, MediaPopup;

(function() {
	"use strict";

	//popup core
	Popup = {

		winScrollTop: 0,
		onClose: null,

		fixBody: function(st) {
			if (st) {
				this.winScrollTop = window.pageYOffset;

				document.body.classList.add('popup-is-opened');
				document.body.style.top = -this.winScrollTop +'px';
			} else {
				document.body.classList.remove('popup-is-opened');

				window.scrollTo(0, this.winScrollTop);
			}
		},

		open: function(elementStr, callback) {
			var elem = document.querySelector(elementStr);

			if (!elem || !elem.classList.contains('popup__window')) {
				return;
			}

			var elemParent = elem.parentElement;

			this.fixBody(true);
			
			elemParent.classList.add('popup_visible');

			elem.classList.add('popup__window_visible');

			setTimeout(function() {
				CoverImg.reInit(elem);
			}, 721);

			if (callback) {
				this.onClose = callback;
			}

			return elem;
		},

		message: function(elementStr, msg, callback) {
			var elem = this.open(elementStr, callback);

			elem.querySelector('.popup__inner').innerHTML = '<div class="popup__message">'+ msg +'</div>';
		},

		close: function() {
			var elements = document.querySelectorAll('.popup__window');

			if (!elements.length) {
				return;
			}

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (!elem.classList.contains('popup__window_visible')) {
					continue;
				}

				elem.classList.remove('popup__window_visible');
				elem.parentElement.classList.remove('popup_visible');
			}

			this.fixBody(false);

			if (this.onClose) {
				this.onClose();
				this.onClose = null;
			}
		},

		init: function(elementStr) {
			document.addEventListener('click', (e) => {
				var element = e.target.closest(elementStr),
				closeElem = e.target.closest('.popup__close');

				if (element) {
					e.preventDefault();

					this.open(element.getAttribute('data-popup'));

				} else if (closeElem || (!e.target.closest('.popup__window') && e.target.closest('.popup'))) {

					this.close();

				}

			});
		}

	};

	//popup media
	MediaPopup = {
		image: function(args) {
			var elemPopup = Popup.open(args.popupStr),
			elemImg = elemPopup.querySelector('.popup-media__image');

			Popup.onClose = function() {
				elemImg.src = '#';
				elemImg.classList.remove('popup-media__image_visible'); 
			}

			elemImg.src = args.href;
			elemImg.classList.add('popup-media__image_visible');
			
		},

		video: function(args) {

		},

		next: function(elem) {
			if (!elem.hasAttribute('data-group')) {
				return;
			}

			var group = elem.getAttribute('data-group'),
			index = [].slice.call(document.querySelectorAll('[data-group="'+ group +'"]')).indexOf(elem);

			

			console.log(index);
		},

		init: function(elementStr) {
			document.addEventListener('click', (e) => {
				var element = e.target.closest(elementStr);

				if (!element) {
					return;
				}

				e.preventDefault();

				var type = element.getAttribute('data-type'),
				args = {
					href: element.href,
					caption: element.getAttribute('data-caption'),
					group: element.getAttribute('data-group'),
					popupStr: element.getAttribute('data-popup')
				};

				if (type == 'image') {
					this.image(args);
				} else if (type == 'video') {
					this.video(args);
				}

				this.next(element);
			});
		}
	};

}());



var pPopup = {
	closeCallback: function() {},
	play: null,
	ind: 0,
	group: null,
	position: 0,

	show: function(id, fun) {
		var _ = this,
		$popWin = $(id),
		$popup = $popWin.closest('.popup');
		
		if ($popWin.length && $popWin.hasClass('popup__window')) {

			_.position = $(window).scrollTop();
			$popup.fadeIn(321).scrollTop(0);
			$('.popup__window').removeClass('popup__window_visible');
			$popWin.addClass('popup__window_visible');
			$('body').css('top', -_.position).addClass('is-popup-opened');

			setTimeout(function() {
				CoverImg.reInit('#media-popup');
			}, 721);

		}

		_.closeCallback = fun || function() {};
	},

	hide: function() {
		var _ = this;
		$('.popup__window').removeClass('popup__window_visible');
		$('.popup').fadeOut(321);
		$('.popup__message').remove();
		$('body').removeClass('is-popup-opened').removeAttr('style');
		$('html, body').scrollTop(_.position);
		_.closeCallback();
	},

	message: function(id,msg,fun) {
		var _ = this;
		$(id).find('.popup__inner').prepend('<div class="popup__message">'+ msg +'</div>');
		_.show(id);
		_.closeCallback = fun || function() {};
	},

	/*resize: function($pop, $img) {
		var popH = $pop.innerHeight();
		if (popH > window.innerHeight) {
			$pop.css('max-width', (window.innerHeight * ($pop.innerWidth() / popH)));
		}
	},*/

	media: function(_$,args,show) {
		var _ = this,
		id = $(_$).attr('data-popup'),
		Pop = $(id),
		$box = Pop.find('.popup-media__box'),
		Img = Pop.find('.popup-media__image'),
		BtnPlay = Pop.find('.popup-media__play'),
		Iframe = Pop.find('.popup-media__iframe');

		if (args.data) {
			Pop.find('.popup-media__bar').css('display', 'block');
			var data = JSON.parse( args.data );
			for (var i = 0; i < data.length; i++) {
				Pop.find('.popup-media__data-'+ i).html(data[i]);
			}
		}

		if (args.imgSize) {
			var imgSize = JSON.parse(args.imgSize);
			Img.attr('width', imgSize[0]).attr('height', imgSize[1]);
		} else {
			Img.attr('width', '').attr('height', '');
		}

		if (args.img) {
			Img.css({visibility: 'visible', marginLeft: '', marginTop: ''}).removeClass('cover-img_w cover-img_h').attr('src', args.img);
		}
		
		//Pop.css('max-width', '');
		Iframe.css('visibility', 'hidden').attr('src', '');
		BtnPlay.css('visibility', 'hidden');
		
		if (args.vid) {
			$box.removeClass('middle').addClass('cover-img-wrap');
			Img.removeClass('middle__img').addClass('cover-img');
			BtnPlay.css('visibility', 'visible').attr('href', args.vid);

			_.play = function() {
				var utm = args.vid.match(/(?:youtu\.be\/|youtube\.com\/watch\?v\=|youtube\.com\/embed\/)+?([\w-]+)/i),
				ifrSrc = 'https://www.youtube.com/embed/'+ utm[1] +'?autoplay=1';
				BtnPlay.css('visibility', 'hidden');
				Img.css('visibility', 'hidden');
				Iframe.css('visibility', 'visible').attr('src', ifrSrc);
			}

			if (!args.img) {
				_.play();
			} else {
				setTimeout(function() {
					CoverImg.init(id);
					Img.attr('src', args.img);
				}, 721);
			}

			

		} else {
			$box.removeClass('cover-img-wrap').addClass('middle');
			Img.removeClass('cover-img').addClass('middle__img');
		}



		if (args.group) {
			Pop.find('.popup-media__arr').css('display', 'block');
			_.group =  $(_$).attr('data-group');
			_.ind = $('[data-group="'+ _.group +'"]').index(_$);
		}

		if (show) {
			_.show(id);
		}

		/*if (!args.vid) {
			setTimeout(function() {
				_.resize(Pop, Img);
			}, 721);
		}*/

		_.closeCallback = function() {
			Img.css('visibility', 'hidden').attr('src', '');
			Iframe.css('visibility', 'hidden').attr('src', '');
			BtnPlay.css('visibility', 'hidden');
		}

	},

	next: function(dir) {
		var _ = this,
		$next,
		ind = _.ind;

		if (dir == 'next') {
			ind++;
			if ($('[data-group="'+ _.group +'"]').eq(ind).length) {
				$next = $('[data-group="'+ _.group +'"]').eq(ind);
			}
		} else if (dir == 'prev' && ind > 0) {
			ind--;
			if ($('[data-group="'+ _.group +'"]').eq(ind).length) {
				$next = $('[data-group="'+ _.group +'"]').eq(ind);
			}
		}

		if ($next) {
			var args;

			if ($next.hasClass('js-open-popup-image')) {
				args = {
					img: $next.attr('href'),
					imgSize: $next.attr('data-image-size'),
					group: $next.attr('data-group'),
					data: $next.attr('data-data')
				};
			} else if ($next.hasClass('js-open-popup-video')) {
				args = {
					vid: $next.attr('href'),
					img: $next.attr('data-preview'),
					imgSize: $next.attr('data-preview-size'),
					group: $next.attr('data-group'),
					data: $next.attr('data-data')
				};
			}

			_.media($next, args);
			
		}

	}

};


$(document).ready(function() {
	/*$('body').on('click', '.js-open-popup', function () {
		Popup.show($(this).attr('data-popup'));
		return false;
	});*/

	$('body').on('click', '.js-open-popup-image', function () {
		var args = {
			img: $(this).attr('href'),
			imgSize: $(this).attr('data-image-size'),
			group: $(this).attr('data-group'),
			data: $(this).attr('data-data')
		};
		Popup.media(this, args, true);
		return false;
	});

	$('body').on('click', '.js-open-popup-video', function () {
		var args = {
			vid: $(this).attr('href'),
			img: $(this).attr('data-preview'),
			imgSize: $(this).attr('data-preview-size'),
			group: $(this).attr('data-group'),
			data: $(this).attr('data-data')
		};
		Popup.media(this, args, true);
		return false;
	});

	$('body').on('click', '.popup-media__play', function () {
		Popup.play();
		return false;
	});

	$('body').on('click', '.popup-media__arr', function () {
		Popup.next($(this).attr('data-dir'));
		return false;
	});

	$('body').on('click', '.js-open-msg-popup', function () {
		Popup.message('#message-popup', 'Это всплывашка с сообщением.<br> вызов: <span class="c-red">Popup.message("#id", "Текст или html");</span>', function() { alert('После закрытия'); });
		return false;
	});

	/*$('body').on('click', '.popup__close', function () {
		Popup.hide();
		return false;
	});

	$('body').on('click', '.popup', function(e) {
		if (!$(e.target).closest('.popup__window').length) {
			Popup.hide();
		}
	});*/


	if (window.location.hash) {
		var hash = window.location.hash;
		if($(hash).length && $(hash).hasClass('popup__window')){
			Popup.show(hash);
		}
	}

});
;(function() {

		var href = window.location.href;

		var Share = {
			vkontakte: function() {
				url  = 'http://vkontakte.ru/share.php?';
				url += 'url=' + encodeURIComponent( href );
				Share.popup(url);
			},
			facebook: function() {
				url  = 'http://www.facebook.com/sharer.php?';
				url += 'u=' + encodeURIComponent( href );
				Share.popup(url);
			},
			twitter: function() {
				url  = 'http://twitter.com/share?';
				url += 'url=' + encodeURIComponent( href );
				Share.popup(url);
			},
			odnoklasniki: function() {
				url  = 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview';
				url += '&st.shareUrl=' + encodeURIComponent( href );
				Share.popup(url);
			},

			popup: function(url) {
				window.open(url,'','toolbar=0,status=0,width=626,height=436');
			}
		};


	$(document).ready(function() {

		$('.js-share-vk').click(function() {
			Share.vkontakte();
			return false;
		});
		$('.js-share-fb').click(function() {
			Share.facebook();
			return false;
		});
		$('.js-share-tw').click(function() {
			Share.twitter();
			return false;
		});
		$('.js-share-ok').click(function() {
			Share.odnoklasniki();
			return false;
		});

	});


}());
var Tab = {
	tabBlock: null,
	init: function() {
		var _ = this;
		$('.tab').each(function() {
			_.tabBlock = $(this);
			_.setHeight();
		});
	},
	button: function(_btn) {
		var _ = this,
		$btn = $(_btn);
		tab = $btn.attr('data-tab');
		_.tabBlock = $(_btn).closest('.tab');

		if (!$btn.hasClass('tab__button_active')) {
			_.tabBlock.find('.tab__button').removeClass('tab__button_active');
			$btn.addClass('tab__button_active');

			_.changeItem(tab);
		}
		
	},
	changeItem: function(tab) {
		var _ = this,
		$tabItem = this.tabBlock.find('.tab__item_'+ tab);
		_.tabBlock.find('.tab__item').removeClass('tab__item_active');
		_.setHeight($tabItem);
		setTimeout(function() {
			$tabItem.addClass('tab__item_active');
		}, 321);
	},
	setHeight: function($tabItem) {
		var _ = this,
		$container = this.tabBlock.find('.tab__container'),
		$activeItem = ($tabItem) ? $tabItem : _.tabBlock.find('.tab__item_active');
		$container.css('height', $activeItem.innerHeight());
	}
};

$(document).ready(function() {
	Tab.init();
	$('body').on('click', '.tab__button', function() {
		Tab.button(this);
	});
});
var Timer = {
	min: 0,
	sec: 0,
	Interval: null,
	onStop: null,
	init: function(initVal, onStop) {

		this.onStop = onStop || null;
		
		function setCookies() {
			var date = new Date(Date.now() + 86400000);
			document.cookie = 'lastTimer='+ Date.now() +'; expires='+ date.toUTCString();
		}

		function getCookies() {
			var val;
			if (document.cookie) {
				var cokArr = document.cookie.replace(/(\s)+/g, '').split(';');
				for (var i = 0; i < cokArr.length; i++) {
					var keyVal = cokArr[i].split('=');
					if (keyVal[0] == 'lastTimer') {
						val = keyVal[1];
					}
				}
			}
			return val || undefined;
		}

		var cokValue = getCookies();

		if (cokValue) {
			var delta = Math.round((Date.now()-cokValue)/1000);
			if (delta < initVal) {
				initVal = initVal-delta;
			} else {
				setCookies();
			}
		} else {
			setCookies();
		}

		this.min = (initVal > 60) ? Math.floor(initVal/60) : 0;
		this.sec = (initVal > 60) ? Math.round(initVal%60) : initVal;

		this.start();
	},
	counter: function() {
		var _ = this;
		_.Interval = setInterval(function() {
			if (_.sec == 0) {
				if (_.min == 0) {
					_.stop();
				} else {
					_.sec = 59;
					_.min--;
				}
			} else {
				_.sec--;
			}
			_.output();
		}, 1000);
	},
	start: function() {
		this.counter();
	},
	stop: function() {
		clearInterval(this.Interval);
		if (this.onStop) {
			this.onStop();
		}
	},
	output: function() {
		var _ = this, 
		minO  = '',
		secTxt = 'секунд',
		sec,
		output;

		if (_.min != 0) {
			if (_.min == 1) {
				minO = _.min +' минуту';
			} else if (_.min < 5) {
				minO = _.min +' минуты';
			}
		}

		if (_.sec == 1 || _.sec == 21) {
			secTxt = 'секунду';
		} else if (_.sec < 5) {
			secTxt = 'секунды';
		} else if (_.sec < 21) {
			secTxt = 'секунд';
		}

		sec = (_.sec < 10) ? '0'+ _.sec : _.sec;
		
		output = [minO, sec, secTxt].join(' '); 
		
		var el = document.getElementById('timer');
		el.innerHTML = output;
	}
};
var ValidateForm;

(function() {
	"use strict";

	ValidateForm = {

		input: null,

		errorTip: function(err, errInd) {
			var field = this.input.closest('.form__field'),
			errTip = field.querySelector('.form__error-tip');

			if (err) {

				field.classList.add('form__field_error');

				if (errInd) {
					if (!errTip.getAttribute('data-error-text')) {
						errTip.setAttribute('data-error-text', errTip.innerHTML);
					}
					errTip.innerHTML = errTip.getAttribute('data-error-text-'+ errInd);
				}

			} else {
				field.classList.remove('form__field_error');
			}

		},

		customErrorTip: function($inp, errorTxt) {
			var _ = this;

			_.$input = $inp;
			_.errorTip(true, 'custom', errorTxt);
		},

		date: function() {
			var err = false,
			validDate = function(val) {
				var _reg = new RegExp("^([0-9]{2}).([0-9]{2}).([0-9]{4})$"),
				matches = _reg.exec(val);
				if (!matches) {
					return false;
				}
				var now = new Date(),
				cDate = new Date(matches[3], (matches[2] - 1), matches[1]);
				return ((cDate.getMonth() == (matches[2] - 1)) && (cDate.getDate() == matches[1]) && (cDate.getFullYear() == matches[3]) && (cDate.valueOf() < now.valueOf()));
			};

			if (!validDate(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		email: function() {
			var err = false;

			if (!/^[a-z0-9]+[\w\-\.]*@[\w\-]{2,}\.[a-z]{2,6}$/i.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		tel: function() {
			var err = false;

			if (!/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(this.input.value)) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		pass: function() {
			var err = false,
			minLng = this.input.getAttribute('data-min-length');

			if (minLng && this.input.value.length < minLng) {
				this.errorTip(true, 2);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		select: function(elem) {
			var err = false;

			this.input = elem;

			if (elem.getAttribute('data-required') && !elem.value.length) {
				this.errorTip(true);
				err = true;
			} else {
				this.errorTip(false);
			}
			
			return err;
		},

		validateOnInputOrBlur: function(e) {

			var elem = e.target.closest('input[type="text"], input[type="password"], textarea');

			if (!elem) {
				return;
			}

			this.input = elem;

			if (e.type == 'blur') {
				elem.setAttribute('data-tested', 'true');
			} else if (e.type == 'input' && !elem.getAttribute('data-tested')) {
				return;
			}

			var type = elem.getAttribute('data-type'),
			val = elem.value;

			if (elem.getAttribute('data-required') && !val.length) {
				this.errorTip(true);
			} else if (val.length && type) {
				this[type]();
			} else {
				this.errorTip(false);
			}
			
		},

		file: function(e) {

			if (e) {
				var elem = e.target.closest('input[type="file"]');
				if (!elem) {
					return;
				} else {
					this.input = elem;
				}
			}

			var err = false,
			errCount = {type: 0, size: 0},
			files = this.input.files,
			type = this.input.getAttribute('data-type'),
			maxSize = +this.input.getAttribute('data-max-size');

			for (var i = 0; i < files.length; i++) {

				var file = files[i];

				if (!file.type.match(type)) {
					errCount.type++;
					continue;
				}

				if (file.size > maxSize) {
					errCount.size++;
				}

			}

			if (errCount.type) {
				this.errorTip(true, 2);
				err = true;
			} else if (errCount.size) {
				this.errorTip(true, 3);
				err = true;
			} else {
				this.errorTip(false);
			}

			return err;
		},

		validate: function(form) {
			var err = 0;

			//text, password, textarea
			var elements = form.querySelectorAll('input[type="text"], input[type="password"], textarea');

			for (var i = 0; i < elements.length; i++) {

				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				elem.setAttribute('data-tested', 'true');

				var inpType = elem.getAttribute('data-type');

				if (elem.value.length) {
					if (inpType && this[inpType]()) {
						err++;
					}
				} else if (elem.getAttribute('data-required')) {
					this.errorTip(true);
					err++;
				} else {
					this.errorTip(false);
				}

			}

			//select
			var elements = form.querySelectorAll('.custom-select__input');

			for (var i = 0; i < elements.length; i++) {

				var elem = elements[i];

				if (elementIsHidden(elem.parentElement)) {
					continue;
				}

				if (this.select(elem)) {
					err++;
				}

			}

			//checkboxes
			var elements = form.querySelectorAll('input[type="checkbox"]');

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				if (elem.getAttribute('data-required') && !elem.checked) {
					this.errorTip(true);
					err++;
				} else {
					this.errorTip(false);
				}

			}

			//checkbox group
			var groups = form.querySelectorAll('.form__chbox-group');

			for (var i = 0; i < groups.length; i++) {
				var group = groups[i],
				checkedElements = 0;

				if (elementIsHidden(group)) {
					continue;
				}

				var elements = group.querySelectorAll('input[type="checkbox"]');

				for (var j = 0; j < elements.length; j++) {
					if (elements[j].checked) {
						checkedElements++;
					}
				}

				if (checkedElements < group.getAttribute('data-min')) {
					group.classList.add('form__chbox-group_error');
					err++;
				} else {
					group.classList.remove('form__chbox-group_error');
				}

			}

			//radio group
			var groups = form.querySelectorAll('.form__radio-group');

			for (var i = 0; i < groups.length; i++) {
				var group = groups[i],
				checkedElement = false;

				if (elementIsHidden(group)) {
					continue;
				}

				var elements = group.querySelectorAll('input[type="radio"]');

				for (var j = 0; j < elements.length; j++) {
					if (elements[j].checked) {
						checkedElement = true;
					}
				}

				if (!checkedElement) {
					group.classList.add('form__radio-group_error');
					err++;
				} else {
					group.classList.remove('form__radio-group_error');
				}

			}

			//file
			var elements = form.querySelectorAll('input[type="file"]');

			for (var i = 0; i < elements.length; i++) {

				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				if (elem.files.length) {
					if (this.file()) {
						err++;
					}
				} else if (elem.getAttribute('data-required')) {
					this.errorTip(true);
					err++;
				} else {
					this.errorTip(false);
				}

			}

			//passwords compare
			var elements = form.querySelectorAll('input[data-pass-compare-input]');

			for (var i = 0; i < elements.length; i++) {

				var elem = elements[i];

				if (elem.elementIsHidden()) {
					continue;
				}

				this.input = elem;

				var val = elem.value;

				if (val.length) {
					var compElemVal = form.querySelector(elem.getAttribute('data-pass-compare-input')).value;

					if (val !== compElemVal) {
						this.errorTip(true, 2);
						err++;
					} else {
						this.errorTip(false);
					}

				}

			}

			return (err) ? false : true;
		},

		submit: function(form) {

			return this.validate(form);

		},

		init: function(form) {

			form.addEventListener('input', this.validateOnInputOrBlur.bind(this));

			form.addEventListener('blur', this.validateOnInputOrBlur.bind(this), true);

			form.addEventListener('change', this.file.bind(this));

		}

	};

}());
//# sourceMappingURL=script.js.map
