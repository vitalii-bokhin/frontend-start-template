var FormSlider;

(function () {
    'use strict';

    FormSlider = {
        mM: null,
        mU: null,
        dragElemObj: {},
        formsliderObj: {},
        track: null,
        edge: {},
        input: null,
        valUnit: 0,
        dragElemLeft: 0,
        dragEndSubscribers: [],
        formaters: {},

        init: function () {
            const sliders = document.querySelectorAll('.formslider');

            for (let i = 0; i < sliders.length; i++) {
                const sliderEl = sliders[i],
                    isRange = sliders[i].getAttribute('data-range');

                let dragElem;

                if (isRange) {
                    dragElem = '<button type="button" class="formslider__drag" data-index="0" data-input="' + sliderEl.getAttribute('data-first-input') + '"></button><button type="button" class="formslider__drag" data-index="1" data-input="' + sliderEl.getAttribute('data-second-input') + '"></button>';
                } else {
                    dragElem = '<button type="button" class="formslider__drag" data-input="' + sliderEl.getAttribute('data-input') + '></button>';
                }

                sliderEl.innerHTML = '<div class="formslider__bar"><div class="formslider__track"></div>' + dragElem + '</div>';

                this.setInitState(sliderEl);
            }

            document.addEventListener('mousedown', this.mouseDown.bind(this));
            document.addEventListener('touchstart', this.mouseDown.bind(this));
        },

        reInit: function () {
            const sliders = document.querySelectorAll('.formslider');

            for (var i = 0; i < sliders.length; i++) {
                this.setInitState(sliders[i]);
            }
        },

        setInitState: function (slider) {
            const dragElems = slider.querySelectorAll('.formslider__drag'),
                trackEl = slider.querySelector('.formslider__track'),
                dragWidth = dragElems[0].offsetWidth,
                sliderW = slider.offsetWidth,
                min = +slider.getAttribute('data-min'),
                max = +slider.getAttribute('data-max'),
                isRange = slider.getAttribute('data-range');

            if (isRange) {
                for (let i = 0; i < dragElems.length; i++) {
                    const dragEl = dragElems[i],
                        inpEl = document.getElementById(dragEl.getAttribute('data-input')),
                        inpVal = inpEl.hasAttribute('data-value') ? +inpEl.getAttribute('data-value') : +inpEl.value,

                        left = ((inpVal - min) / ((max - min) / 100)) * ((sliderW - dragWidth) / 100);

                    dragEl.style.left = left + 'px';

                    if (!i) {
                        trackEl.style.left = (left + dragWidth / 2) + 'px';
                    } else {
                        trackEl.style.right = (sliderW - left - dragWidth / 2) + 'px';
                    }
                }
            }
        },

        // on mouse down
        mouseDown: function (e) {
            if (e.type == 'mousedown' && e.which != 1) {
                return;
            }

            var elem = e.target.closest('.formslider__drag');

            if (!elem) {
                return;
            }

            this.mM = this.mouseMove.bind(this);
            this.mU = this.mouseUp.bind(this);

            document.addEventListener('mousemove', this.mM);
            document.addEventListener('touchmove', this.mM);

            document.addEventListener('mouseup', this.mU);
            document.addEventListener('touchend', this.mU);

            var clientX = (e.type == 'touchstart') ? e.targetTouches[0].clientX : e.clientX;

            // dragable options 
            this.dragElemObj.elem = elem;
            this.dragElemObj.X = elem.getBoundingClientRect().left;
            this.dragElemObj.shiftX = clientX - this.dragElemObj.X;
            this.dragElemObj.index = elem.getAttribute('data-index');
            this.dragElemObj.width = elem.offsetWidth;
            elem.setAttribute('data-active', 'true');

            //formslider options
            var formslider = elem.closest('.formslider');
            this.formsliderObj.X = formslider.getBoundingClientRect().left;
            this.formsliderObj.width = formslider.offsetWidth;
            this.formsliderObj.isRange = formslider.getAttribute('data-range');
            this.formsliderObj.min = +formslider.getAttribute('data-min');

            //one unit of value
            this.valUnit = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / (formslider.offsetWidth - elem.offsetWidth);

            this.oneValPerc = (+formslider.getAttribute('data-max') - this.formsliderObj.min) / 100;

            //track
            this.track = formslider.querySelector('.formslider__track');

            //get parameters of slider
            if (this.formsliderObj.isRange) {

                if (this.dragElemObj.index == 0) {

                    var siblElem = formslider.querySelector('.formslider__drag[data-index="1"]');

                    this.edge.L = 0;

                    this.edge.R = siblElem.getBoundingClientRect().left - this.formsliderObj.X - siblElem.offsetWidth;

                } else if (this.dragElemObj.index == 1) {

                    var siblElem = formslider.querySelector('.formslider__drag[data-index="0"]');

                    this.edge.L = siblElem.getBoundingClientRect().left - this.formsliderObj.X + siblElem.offsetWidth;

                    this.edge.R = this.formsliderObj.width - elem.offsetWidth;

                }

                this.input = document.getElementById(elem.getAttribute('data-input'));

            } else {
                this.edge.L = 0;
                this.edge.R = this.formsliderObj.width - elem.offsetWidth;
            }

        },

        // on mouse move
        mouseMove: function (e) {
            if (!this.dragElemObj.elem) {
                return;
            }

            var clientX = (e.type == 'touchmove') ? e.targetTouches[0].clientX : e.clientX;

            var dragElemLeft = clientX - this.dragElemObj.shiftX - this.formsliderObj.X;

            if (dragElemLeft < this.edge.L) {
                dragElemLeft = this.edge.L;
            } else if (dragElemLeft > this.edge.R) {
                dragElemLeft = this.edge.R;
            }

            if (this.formsliderObj.isRange) {

                if (this.dragElemObj.index == 0) {
                    this.track.style.left = (dragElemLeft + 5) + 'px';
                } else if (this.dragElemObj.index == 1) {
                    this.track.style.right = (this.formsliderObj.width - dragElemLeft - 5) + 'px';
                }

            } else {
                this.track.style.width = (dragElemLeft + 5) + 'px';
            }

            this.dragElemObj.elem.style.left = dragElemLeft + 'px';

            this.dragElemLeft = dragElemLeft;

            this.setInputVal();
        },

        // end drag
        mouseUp: function (e) {
            document.removeEventListener('mousemove', this.mM);
            document.removeEventListener('touchmove', this.mM);

            document.removeEventListener('mouseup', this.mU);
            document.removeEventListener('touchend', this.mU);

            this.setInputVal();

            this.dragElemObj.elem.setAttribute('data-active', 'false');

            this.dragEndSubscribers.forEach(item => {
                item();
            });

            //reset properties
            this.dragElemObj = {};
            this.formsliderObj = {};
            this.track = null;
            this.edge = {};
            this.input = null;
            this.valUnit = 0;
            this.dragElemLeft = 0;
        },

        onDragEnd: function (fun) {
			if (typeof fun === 'function') {
				this.dragEndSubscribers.push(fun);
			}
		},

        //set hidden input value
        setInputVal: function () {
            let val;

            if (this.formsliderObj.isRange) {
                if (this.dragElemObj.index == 0) {
                    val = Math.round((this.dragElemLeft / ((this.formsliderObj.width - this.dragElemObj.width * 2) / 100)) * this.oneValPerc);
                } else {
                    val = Math.round(((this.dragElemLeft - this.dragElemObj.width) / ((this.formsliderObj.width - this.dragElemObj.width * 2) / 100)) * this.oneValPerc);
                }
            }

            val = val + this.formsliderObj.min;

            const formatId = this.input.getAttribute('data-format');

            if (formatId !== null && this.formaters[formatId]) {
                val = this.formaters[formatId](val)
            }

            this.input.value = val;
        },

        format: function (id, fun) {
            this.formaters[id] = fun;
        }
    };

    document.addEventListener('DOMContentLoaded', function (e) {
        FormSlider.init();

        window.addEventListener('winResized', function () {
            FormSlider.reInit();
        });
    });

})();