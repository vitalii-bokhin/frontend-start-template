var DragAndDrop;

(function () {
    'use strict';

    DragAndDrop = {
        opt: null,
        dragElemObj: {},

        init: function (opt) {
            this.opt = opt || {};

            document.removeEventListener('mousedown', this.mD);

            this.mD = this.mD.bind(this);

            document.addEventListener('mousedown', this.mD);
        },

        mD: function(e) {
            if (e.type == 'mousedown' && e.which != 1) return;

            const dragEl = e.target.closest('.dragable');

            if (!dragEl) return;

            this.mM = this.mM.bind(this);
            this.mU = this.mU.bind(this);

            document.addEventListener('mousemove', this.mM);
            document.addEventListener('mouseup', this.mU);

            const clientX = (e.type == 'touchstart') ? e.targetTouches[0].clientX : e.clientX,
            clientY = (e.type == 'touchstart') ? e.targetTouches[0].clientY : e.clientY;

            // dragable options 
            this.dragElemObj.elem = dragEl;
            this.dragElemObj.X = dragEl.getBoundingClientRect().left;
            this.dragElemObj.Y = dragEl.getBoundingClientRect().top;
            this.dragElemObj.shiftX = clientX - this.dragElemObj.X;
            this.dragElemObj.shiftY = clientY - this.dragElemObj.Y;
            this.dragElemObj.width = dragEl.offsetWidth;
            this.dragElemObj.height = dragEl.offsetHeight;

            dragEl.style.width = this.dragElemObj.width + 'px';
            dragEl.style.height = this.dragElemObj.height + 'px';
            dragEl.style.left = this.dragElemObj.X + 'px';
            dragEl.style.top = this.dragElemObj.Y + 'px';
            
            dragEl.classList.add('dragable_active');
        },

        mM: function(e) {
            if (!this.dragElemObj.elem) return;

            const clientX = (e.type == 'touchmove') ? e.targetTouches[0].clientX : e.clientX,
            clientY = (e.type == 'touchstart') ? e.targetTouches[0].clientY : e.clientY;

            const moveX = clientX - this.dragElemObj.shiftX,
            moveY = clientY - this.dragElemObj.shiftY;

            this.dragElemObj.elem.style.left = moveX + 'px';
            this.dragElemObj.elem.style.top = moveY + 'px';
        },

        mU: function(e) {
            // body
        }
    };
})();