var setTextareaHeight;

//label
function initOverLabels () {
	if (!document.getElementById) return; 
	var labels, id, field;
	labels = document.getElementsByTagName('label');
	for (var i = 0; i < labels.length; i++) {
		if (labels[i].className == 'overlabel') {
			id = labels[i].htmlFor || labels[i].getAttribute('for');
			if (!id || !(field = document.getElementById(id))) {
				continue;
			} 
			labels[i].className = 'overlabel-apply';
			if (field.value !== '') {
				hideLabel(field.getAttribute('id'), true);
			}
			field.onfocus = function () {
				hideLabel(this.getAttribute('id'), true);
			};
			field.onblur = function () {
				if (this.value === '') {
					hideLabel(this.getAttribute('id'), false);
				}
			};
			labels[i].onclick = function () {
				var id, field;
				id = this.getAttribute('for');
				if (id && (field = document.getElementById(id))) {
					field.focus();
				}
			};
		}
	}
}

function hideLabel (field_id, hide) {
	var field_for;
	var labels = document.getElementsByTagName('label');
	for (var i = 0; i < labels.length; i++) {
		field_for = labels[i].htmlFor || labels[i].getAttribute('for');
		if (field_for == field_id) {
			labels[i].style.textIndent = (hide) ? '-4000px' : '0';
			labels[i].style.paddingLeft = (hide) ? '0' : '';
			labels[i].style.paddingRight = (hide) ? '0' : '';
			return true;
		}
	}
}

//maskInputPlugin
// github.com/igorescobar/jQuery-Mask-Plugin
var $jscomp={scope:{},findInternal:function(a,l,d){a instanceof String&&(a=String(a));for(var p=a.length,h=0;h<p;h++){var b=a[h];if(l.call(d,b,h,a))return{i:h,v:b}}return{i:-1,v:void 0}}};$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(a,l,d){if(d.get||d.set)throw new TypeError("ES3 does not support getters and setters.");a!=Array.prototype&&a!=Object.prototype&&(a[l]=d.value)};
$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.polyfill=function(a,l,d,p){if(l){d=$jscomp.global;a=a.split(".");for(p=0;p<a.length-1;p++){var h=a[p];h in d||(d[h]={});d=d[h]}a=a[a.length-1];p=d[a];l=l(p);l!=p&&null!=l&&$jscomp.defineProperty(d,a,{configurable:!0,writable:!0,value:l})}};
$jscomp.polyfill("Array.prototype.find",function(a){return a?a:function(a,d){return $jscomp.findInternal(this,a,d).v}},"es6-impl","es3");
(function(a,l,d){"function"===typeof define&&define.amd?define(["jquery"],a):"object"===typeof exports?module.exports=a(require("jquery")):a(l||d)})(function(a){var l=function(b,e,f){var c={invalid:[],getCaret:function(){try{var a,r=0,g=b.get(0),e=document.selection,f=g.selectionStart;if(e&&-1===navigator.appVersion.indexOf("MSIE 10"))a=e.createRange(),a.moveStart("character",-c.val().length),r=a.text.length;else if(f||"0"===f)r=f;return r}catch(C){}},setCaret:function(a){try{if(b.is(":focus")){var c,
g=b.get(0);g.setSelectionRange?g.setSelectionRange(a,a):(c=g.createTextRange(),c.collapse(!0),c.moveEnd("character",a),c.moveStart("character",a),c.select())}}catch(B){}},events:function(){b.on("keydown.mask",function(a){b.data("mask-keycode",a.keyCode||a.which);b.data("mask-previus-value",b.val());b.data("mask-previus-caret-pos",c.getCaret());c.maskDigitPosMapOld=c.maskDigitPosMap}).on(a.jMaskGlobals.useInput?"input.mask":"keyup.mask",c.behaviour).on("paste.mask drop.mask",function(){setTimeout(function(){b.keydown().keyup()},
100)}).on("change.mask",function(){b.data("changed",!0)}).on("blur.mask",function(){d===c.val()||b.data("changed")||b.trigger("change");b.data("changed",!1)}).on("blur.mask",function(){d=c.val()}).on("focus.mask",function(b){!0===f.selectOnFocus&&a(b.target).select()}).on("focusout.mask",function(){f.clearIfNotMatch&&!h.test(c.val())&&c.val("")})},getRegexMask:function(){for(var a=[],b,c,f,n,d=0;d<e.length;d++)(b=m.translation[e.charAt(d)])?(c=b.pattern.toString().replace(/.{1}$|^.{1}/g,""),f=b.optional,
(b=b.recursive)?(a.push(e.charAt(d)),n={digit:e.charAt(d),pattern:c}):a.push(f||b?c+"?":c)):a.push(e.charAt(d).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"));a=a.join("");n&&(a=a.replace(new RegExp("("+n.digit+"(.*"+n.digit+")?)"),"($1)?").replace(new RegExp(n.digit,"g"),n.pattern));return new RegExp(a)},destroyEvents:function(){b.off("input keydown keyup paste drop blur focusout ".split(" ").join(".mask "))},val:function(a){var c=b.is("input")?"val":"text";if(0<arguments.length){if(b[c]()!==a)b[c](a);
c=b}else c=b[c]();return c},calculateCaretPosition:function(){var a=b.data("mask-previus-value")||"",e=c.getMasked(),g=c.getCaret();if(a!==e){var f=b.data("mask-previus-caret-pos")||0,e=e.length,d=a.length,m=a=0,h=0,l=0,k;for(k=g;k<e&&c.maskDigitPosMap[k];k++)m++;for(k=g-1;0<=k&&c.maskDigitPosMap[k];k--)a++;for(k=g-1;0<=k;k--)c.maskDigitPosMap[k]&&h++;for(k=f-1;0<=k;k--)c.maskDigitPosMapOld[k]&&l++;g>d?g=e:f>=g&&f!==d?c.maskDigitPosMapOld[g]||(f=g,g=g-(l-h)-a,c.maskDigitPosMap[g]&&(g=f)):g>f&&(g=
g+(h-l)+m)}return g},behaviour:function(f){f=f||window.event;c.invalid=[];var e=b.data("mask-keycode");if(-1===a.inArray(e,m.byPassKeys)){var e=c.getMasked(),g=c.getCaret();setTimeout(function(){c.setCaret(c.calculateCaretPosition())},10);c.val(e);c.setCaret(g);return c.callbacks(f)}},getMasked:function(a,b){var g=[],d=void 0===b?c.val():b+"",n=0,h=e.length,q=0,l=d.length,k=1,r="push",p=-1,t=0,y=[],v,z;f.reverse?(r="unshift",k=-1,v=0,n=h-1,q=l-1,z=function(){return-1<n&&-1<q}):(v=h-1,z=function(){return n<
h&&q<l});for(var A;z();){var x=e.charAt(n),w=d.charAt(q),u=m.translation[x];if(u)w.match(u.pattern)?(g[r](w),u.recursive&&(-1===p?p=n:n===v&&(n=p-k),v===p&&(n-=k)),n+=k):w===A?(t--,A=void 0):u.optional?(n+=k,q-=k):u.fallback?(g[r](u.fallback),n+=k,q-=k):c.invalid.push({p:q,v:w,e:u.pattern}),q+=k;else{if(!a)g[r](x);w===x?(y.push(q),q+=k):(A=x,y.push(q+t),t++);n+=k}}d=e.charAt(v);h!==l+1||m.translation[d]||g.push(d);g=g.join("");c.mapMaskdigitPositions(g,y,l);return g},mapMaskdigitPositions:function(a,
b,e){a=f.reverse?a.length-e:0;c.maskDigitPosMap={};for(e=0;e<b.length;e++)c.maskDigitPosMap[b[e]+a]=1},callbacks:function(a){var h=c.val(),g=h!==d,m=[h,a,b,f],q=function(a,b,c){"function"===typeof f[a]&&b&&f[a].apply(this,c)};q("onChange",!0===g,m);q("onKeyPress",!0===g,m);q("onComplete",h.length===e.length,m);q("onInvalid",0<c.invalid.length,[h,a,b,c.invalid,f])}};b=a(b);var m=this,d=c.val(),h;e="function"===typeof e?e(c.val(),void 0,b,f):e;m.mask=e;m.options=f;m.remove=function(){var a=c.getCaret();
c.destroyEvents();c.val(m.getCleanVal());c.setCaret(a);return b};m.getCleanVal=function(){return c.getMasked(!0)};m.getMaskedVal=function(a){return c.getMasked(!1,a)};m.init=function(d){d=d||!1;f=f||{};m.clearIfNotMatch=a.jMaskGlobals.clearIfNotMatch;m.byPassKeys=a.jMaskGlobals.byPassKeys;m.translation=a.extend({},a.jMaskGlobals.translation,f.translation);m=a.extend(!0,{},m,f);h=c.getRegexMask();if(d)c.events(),c.val(c.getMasked());else{f.placeholder&&b.attr("placeholder",f.placeholder);b.data("mask")&&
b.attr("autocomplete","off");d=0;for(var l=!0;d<e.length;d++){var g=m.translation[e.charAt(d)];if(g&&g.recursive){l=!1;break}}l&&b.attr("maxlength",e.length);c.destroyEvents();c.events();d=c.getCaret();c.val(c.getMasked());c.setCaret(d)}};m.init(!b.is("input"))};a.maskWatchers={};var d=function(){var b=a(this),e={},f=b.attr("data-mask");b.attr("data-mask-reverse")&&(e.reverse=!0);b.attr("data-mask-clearifnotmatch")&&(e.clearIfNotMatch=!0);"true"===b.attr("data-mask-selectonfocus")&&(e.selectOnFocus=
!0);if(p(b,f,e))return b.data("mask",new l(this,f,e))},p=function(b,e,f){f=f||{};var c=a(b).data("mask"),d=JSON.stringify;b=a(b).val()||a(b).text();try{return"function"===typeof e&&(e=e(b)),"object"!==typeof c||d(c.options)!==d(f)||c.mask!==e}catch(t){}},h=function(a){var b=document.createElement("div"),d;a="on"+a;d=a in b;d||(b.setAttribute(a,"return;"),d="function"===typeof b[a]);return d};a.fn.mask=function(b,d){d=d||{};var e=this.selector,c=a.jMaskGlobals,h=c.watchInterval,c=d.watchInputs||c.watchInputs,
t=function(){if(p(this,b,d))return a(this).data("mask",new l(this,b,d))};a(this).each(t);e&&""!==e&&c&&(clearInterval(a.maskWatchers[e]),a.maskWatchers[e]=setInterval(function(){a(document).find(e).each(t)},h));return this};a.fn.masked=function(a){return this.data("mask").getMaskedVal(a)};a.fn.unmask=function(){clearInterval(a.maskWatchers[this.selector]);delete a.maskWatchers[this.selector];return this.each(function(){var b=a(this).data("mask");b&&b.remove().removeData("mask")})};a.fn.cleanVal=function(){return this.data("mask").getCleanVal()};
a.applyDataMask=function(b){b=b||a.jMaskGlobals.maskElements;(b instanceof a?b:a(b)).filter(a.jMaskGlobals.dataMaskAttr).each(d)};h={maskElements:"input,td,span,div",dataMaskAttr:"*[data-mask]",dataMask:!0,watchInterval:300,watchInputs:!0,useInput:!/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent)&&h("input"),watchDataMask:!1,byPassKeys:[9,16,17,18,36,37,38,39,40,91],translation:{0:{pattern:/\d/},9:{pattern:/\d/,optional:!0},"#":{pattern:/\d/,recursive:!0},A:{pattern:/[a-zA-Z0-9]/},
S:{pattern:/[a-zA-Z]/}}};a.jMaskGlobals=a.jMaskGlobals||{};h=a.jMaskGlobals=a.extend(!0,{},h,a.jMaskGlobals);h.dataMask&&a.applyDataMask();setInterval(function(){a.jMaskGlobals.watchDataMask&&a.applyDataMask()},h.watchInterval)},window.jQuery,window.Zepto);


//Form Select
var Select = {
	_el: null,
	_field: null,
	_options: null,
	init: function(el) {
		var _ = this;
		_._el = $(el);
		_._field = _._el.closest('.form__select');
		_._options = _._field.find('.form__select-options');
	},
	change: function(state) {
		var _ = this;
		if (state) {
			if (!_._field.hasClass('form__select_autocomplete')) {
				$('.form__select').removeClass('form__select_opened');
				$('.form__select-options').slideUp(221);
			}
			_._field.addClass('form__select_opened');
			_._options.slideDown(221);
		} else {
			_._field.removeClass('form__select_opened');
			_._options.slideUp(221);
		}
	},
	open: function(el) {
		var _ = this;
		_.init(el);
		if (!_._field.hasClass('form__select_opened')) {
			_.change(1);
		} else {
			_.change(0);
		}
		return false;
	},
	select: function(el) {
		var _ = this;
		_.init(el);
		var _f = _._field,
		_button = _f.find('.form__select-button'),
		_srcInput = (_f.find('.form__text-input_autocomplete').length) ? _f.find('.form__text-input_autocomplete') : _f.find('.form__textarea_autocomplete'),
		_input = _f.find('.form__select-input');
		

		if (_f.hasClass('form__select_multiple')) {

			if (!_._el.hasClass('form__select-val_checked')) {
				_._el.addClass('form__select-val_checked');
			} else {
				_._el.removeClass('form__select-val_checked');
			}

			var toButtonValue = [],
			toInputValue = [];

			_._options.find('.form__select-val_checked').each(function(i) {
				var el = $(this);
				toButtonValue[i] = el.html();
				toInputValue[i] = el.attr('data-value');
			});

			if (toButtonValue.length) {
				_button.html(toButtonValue.join(', '));
				_input.val(toInputValue.join('+'));
			} else {
				_.change(0);
				_button.html('Множественный выбор');
				_input.val('');
			}

		} else {
			var toButtonValue = _._el.html(),
			toInputValue = _._el.attr('data-value');

			_.change(0);

			_button.html(toButtonValue);
			_srcInput.val(toButtonValue);
			_input.val(toInputValue);
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

		Form.select(_input);

		return false;
	},
	autocomplete: function(el) {
		var _ = this;
		_.init(el);
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

				_._options.find('.form__select-val').each(function() {

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

				_._options.find('.form__select-val').each(function() {

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

				_._options.find('.form__select-val').each(function() {

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


//validateForm
var Form = {
	input: null,
	error: function(err,sec,trd) {
		var Field = this.input.closest('.form__field'),
		ErrTip = Field.find('.form__error-tip');

		if (!err) {
			Field.removeClass('form__field_error');
		} else {
			Field.addClass('form__field_error');

			if (trd) {

				if (!ErrTip.attr('data-first-error-text')) {
					ErrTip.attr('data-first-error-text', ErrTip.html());
				}
				ErrTip.html(ErrTip.attr('data-third-error-text'));

			} else if (sec) {

				if (!ErrTip.attr('data-first-error-text')) {
					ErrTip.attr('data-first-error-text', ErrTip.html());
				}
				ErrTip.html(ErrTip.attr('data-second-error-text'));

			} else {

				if (ErrTip.attr('data-first-error-text')) {
					ErrTip.html(ErrTip.attr('data-first-error-text'));
				}

			}
		}

	},
	date: function() {
		var _ = this,
		err = false,
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

		if (!validDate(_.input.val())) {
			_.error(true);
			err = true;
		} else {
			_.error(false);
		}
		return err;
	},
	email: function() {
		var _ = this,
		err = false;
		if (!/^[a-z0-9]+[a-z0-9-\.]*@[a-z0-9-]{2,}\.[a-z]{2,6}$/i.test(_.input.val())) {
			_.error(true, true);
			err = true;
		} else {
			_.error(false);
		}
		return err;
	},
	tel: function() {
		var _ = this,
		err = false;
		if (!/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(_.input.val())) {
			_.error(true);
			err = true;
		} else {
			_.error(false);
		}
		return err;
	},
	pass: function() {
		var _ = this,
		err = false,
		lng = _.input.attr('data-pass-length');

		if (_.input.val().length < 1) {
			_.error(true);
			err = true;
		} else if(lng && _.input.val().length < lng) {
			_.error(true, true);
			err = true;
		} else {
			_.error(false);
		}
		return err;
	},
	select: function(inp) {
		var _ = this,
		err = false;
		_.input = inp;
		if (_.input.attr('data-required') && _.input.val().length < 1) {
			_.error(true);
			err = true;
		} else {
			_.error(false);
		}
		return err;
	},
	keyup: function(inp) {
		var _ = this;
		_.input = $(inp);
		var type = _.input.attr('data-type');
		if (_.input.hasClass('tested')) {
			_[type]();
		}
	},
	fUploaded: false,
	file: function(inp,e) {
		var _ = this;
		_.input = $(inp);
		var _imgBlock = _.input.closest('.form__field').find('.form__file-image'),
		file = e.target.files[0],
		fileName = file.name,
		fileSize = (file.size / 1024 / 1024).toFixed(2),
		ext = (function(fN){
			var nArr = fN.split('.');
			return nArr[nArr.length-1];
		})(fileName);

		if (_imgBlock.length) {
			if (!file.type.match('image.*')) {
				_.error(true);
				_.fUploaded = false;
			} else {
				var reader = new FileReader();
				reader.onload = function(e) {
					_imgBlock.html('<img src="'+ e.target.result +'">');
				};
				reader.readAsDataURL(file);
				_.error(false);
				_.fUploaded = true;
			}
		}
	},
	validate: function(form) {
		var _ = this,
		err = 0,
		_form = $(form);

		_form.find('.form__text-input, .form__textarea').each(function() {
			_.input = $(this);

			var type = _.input.attr('data-type'),
			hidden = _.input.closest('.form__field_hidden, .form__fieldset_hidden');

			if (!hidden.length) {
				_.input.addClass('tested');

				if (_.input.attr('data-required') && _.input.val().length < 1) {
					_.error(true);
					err++;
				} else if (_.input.val().length > 0) {
					_.error(false);
					if (type && _[type]()) {
						err++;
					}
				} else {
					_.error(false);
				}

				if (type == 'pass' && _.pass()) {
					err++;
				}
			}

		});

		_form.find('.form__select-input').each(function() {
			var hidden = $(this).closest('.form__field_hidden, .form__fieldset_hidden');
			if (!hidden.length && _.select($(this))) {
				err++;
			}
		});

		_form.find('.form__chbox-input').each(function() {
			var _inp = $(this),
			_chbox = _inp.closest('.form__chbox'),
			hidden = _inp.closest('.form__field_hidden, .form__fieldset_hidden');
			if (!hidden.length) {
				if(_inp.attr('data-required') && !_inp.prop('checked')){
					_chbox.addClass('form__chbox_error');
					err++;
				} else {
					_chbox.removeClass('form__chbox_error');
				}
			}
			
		});

		_form.find('.form__chbox-group').each(function() {
			var i = 0,
			_g = $(this),
			hidden = _g.closest('.form__field_hidden, .form__fieldset_hidden');

			if (!hidden.length) {
				_g.find('.form__chbox-input').each(function() {
					if ($(this).prop('checked')) {
						i++;
					}
				});

				if (i < _g.attr('data-min')) {
					_g.addClass('form__chbox-group_error');
					err++;
				} else {
					_g.removeClass('form__chbox-group_error');
				}
			}
		});

		_form.find('.form__radio-group').each(function() {
			var e = true,
			_g = $(this),
			hidden = _g.closest('.form__field_hidden, .form__fieldset_hidden');

			if (!hidden.length) {
				_g.find('.form__radio-input').each(function() {
					if ($(this).prop('checked')) {
						e = false;
					}
				});

				if (e) {
					_g.addClass('form__radio-group_error');
					err++;
				} else {
					_g.removeClass('form__radio-group_error');
				}
			}
		});

		if (_form.find('.form__file-input').length) {
			_.input = _form.find('.form__file-input');
			if (!_.fUploaded) {
				_.error(true);
				err++;
			} else {
				_.error(false);
			}
		}

		if (_form.find('.form__text-input[data-pass-compare]').length) {
			_form.find('.form__text-input[data-pass-compare]').each(function() {
				var gr = $(this).attr('data-pass-compare');
				_.input = _form.find('.form__text-input[data-pass-compare="'+ gr +'"]');
				if (!_.pass()) {
					if (_.input.eq(0).val() != _.input.eq(1).val()) {
						_.error(true);
					} else {
						_.error(false);
					}
				}
			});
		}

		if (!err) {
			_form.removeClass('form_error');
		} else {
			_form.addClass('form_error');
		}

		return !err;
	},
	step: function(el, fun) {
		if (this.validate(el)) {
			fun();
		}
	},
	submitButton: function(f, st) {
		var Form = $(f),
		Button = Form.find('button[type="submit"], input[type="submit"]');
		if (st) {
			Button.prop('disabled', false).removeClass('form__button_loading');
		} else {
			Button.prop('disabled', true).addClass('form__button_loading');
		}
	},
	submit: function(el, form) {
		var _ = this;
		$('body').on('change', '.form__file-input', function(e) {
			_.file(this, e);
		});
		$('body').on('keyup', '.form__text-input', function() {
			_.keyup(this);
		});
		$('body').on('submit', el, function() {
			var f = this;
			if (_.validate(f)) {
				_.submitButton(f, false);
				form(f, function(ret) {
					_.submitButton(f, ret);
				});
			}
			return false;
		});
	}
};



$(document).ready(function() {

	$('.form__text-input[data-type="tel"]').mask('+7(999)999-99-99');
	$('.form__text-input[data-type="date"]').mask('99.99.9999');

	$('label').each(function(i) {
		var _$ = $(this),
		sibLabel = _$.siblings('label'),
		Input = _$.siblings('input, textarea');

		if (!_$.attr('for') && !Input.attr('id')) {
			_$.attr('for', 'keylabel-'+ i);
			sibLabel.attr('for', 'keylabel-'+ i);
			Input.attr('id', 'keylabel-'+ i);
		}

	});

	initOverLabels();

	$('body').on('click', '.form__select-button', function() { 
		Select.open(this); 
	});

	$('body').on('keyup', '.form__text-input_autocomplete, .form__textarea_autocomplete', function() { 
		Select.autocomplete(this); 
	});

	$('body').on('click', '.form__select-val', function() { 
		Select.select(this);
	});

	$('body').on('change', '.form__chbox-input', function() { 
		var _$ = $(this);
		if (_$.attr('data-show-hidden')) {
			var Field = $(_$.attr('data-show-hidden'));
			if (_$.prop('checked')) {
				Field.removeClass('form__field_hidden');
			} else {
				Field.addClass('form__field_hidden');
			}
		}
	});

	$('body').on('change', '.form__radio-input', function() {
		var _$ = $(this),
		name = _$.attr('name');
		$('.form__radio-input[name="'+ name +'"]').each(function() {
			var _$ = $(this);
			if (_$.attr('data-show-hidden')) {
				var Field = $(_$.attr('data-show-hidden'));
				if (_$.prop('checked')) {
					Field.removeClass('form__field_hidden');
				} else {
					Field.addClass('form__field_hidden');
				}
			}
		});
	});

	$('body').on('click', '.form__button', function() {
		var _$ = $(this);
		if (_$.attr('data-next-step')) {
			var El = $(_$.attr('data-next-step')),
			curEl = '#'+ El.closest('.form__fieldset-wrap').find('.form__fieldset:not(.form__fieldset_hidden)').attr('id');

			Form.step(curEl, function() {
				El.closest('.form__fieldset-wrap').find('.form__fieldset').addClass('form__fieldset_hidden');
				El.removeClass('form__fieldset_hidden');
			});

		}
	});

	$(document).on('click', 'body', function(e) {
		if (!$(e.target).closest('.form__select_opened').length) {
			$('.form__select').removeClass('form__select_opened');
			$('.form__select-options').slideUp(221);
		}
	});

	//textarea with variable height
	$('.form__textarea_var-h').each(function() {
		var _$ = $(this),
		taW = _$.innerWidth();

		_$.parent().append('<div class="form__textarea-shape" style="width:'+ taW +'px;"></div>');

	});

	setTextareaHeight = function (_$) {
		var val = _$.val(),
		Shape = _$.parent().find('.form__textarea-shape');

		Shape.html(val);

		_$.css('height', Shape.innerHeight());
	}

	$('body').on('keyup', '.form__textarea_var-h', function() {
		setTextareaHeight($(this));
	});


	Form.submit('#form1', function(form, callback) {
		var _f = $(form);
		Popup.message('#message-popup', 'Форма отправлена', function() {
			callback(true);
		});
		/*$.ajax({
			url: _f.attr('action'),
			type:"POST",
			dataType:"html",
			data: _f.serialize(), //new FormData(form),
			success: function(response){
				Popup.message('#message-popup', response);
			},
			error: function() {
				alert('Send Error');
			}
		});*/
		
	});

	Form.submit('#form2', function(form, callback) {
		var _f = $(form);
		Popup.message('#message-popup', 'Форма отправлена', function() {
			callback(true);
		});
	});


});



//GetCountriesAndCitiesList
function dAirGetInit() {
	dAirGet.countries(function(c) {
		var contryObj = $.parseJSON(c),
		countryOpt = $('.form__select-options_countries'),
		countryOpt2 = $('.form__select-options_countries2');
		
		for (var i = 0; i < contryObj.length; i++) {
			countryOpt.append('<li><button type="button" class="form__select-val" data-value="'+ contryObj[i].id +'">'+ contryObj[i].name +'</button></li>');
			countryOpt2.append('<li><button type="button" class="form__select-val" data-value="'+ contryObj[i].id +'" data-original="'+ contryObj[i].name +'">'+ contryObj[i].name +'</button></li>');
		}
	});
}