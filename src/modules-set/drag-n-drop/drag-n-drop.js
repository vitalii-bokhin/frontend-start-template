var DragAndDrop;

(function () {
    'use strict';

    DragAndDrop = {
        opt: null,
        mD: null,
        mM: null,
        mU: null,
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
            this.dragElemObj.dragEl = dragEl;
            this.dragElemObj.X = dragEl.getBoundingClientRect().left;
            this.dragElemObj.Y = dragEl.getBoundingClientRect().top;
            this.dragElemObj.shiftX = clientX - this.dragElemObj.X;
            this.dragElemObj.shiftX = clientX - this.dragElemObj.X;
            this.dragElemObj.index = dragEl.getAttribute('data-index');
            this.dragElemObj.width = dragEl.offsetWidth;
            this.dragElemObj.height = dragEl.offsetHeight;

            dragEl.style.width = this.dragElemObj.width + 'px';
            dragEl.style.height = this.dragElemObj.height + 'px';
            
            dragEl.classList.add('dragable_active');
        }
    };
})();