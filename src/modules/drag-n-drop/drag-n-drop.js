var DragAndDrop;

(function () {
    'use strict';

    DragAndDrop = {
        opt: null,
        dragElemObj: {},
        parentDropElem: null,
        curentDropElem: null,
        maskDiv: null,

        init: function (opt) {
            this.opt = opt || {};

            document.removeEventListener('mousedown', this.mD);

            this.mD = this.mD.bind(this);

            document.addEventListener('mousedown', this.mD);
        },

        mD: function (e) {
            if (e.type == 'mousedown' && e.which != 1) return;

            const dragEl = e.target.closest('.dragable');

            if (!dragEl) return;

            this.mM = this.mM.bind(this);
            this.mU = this.mU.bind(this);
            this.mO = this.mO.bind(this);

            document.addEventListener('mousemove', this.mM);
            document.addEventListener('mouseup', this.mU);
            document.addEventListener('mouseover', this.mO);

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

            this.parentDropElem = dragEl.closest('.dropable');
        },

        mM: function (e) {
            const clientX = (e.type == 'touchmove') ? e.targetTouches[0].clientX : e.clientX,
                clientY = (e.type == 'touchstart') ? e.targetTouches[0].clientY : e.clientY;

            const moveX = clientX - this.dragElemObj.shiftX,
                moveY = clientY - this.dragElemObj.shiftY;

            this.dragElemObj.elem.style.left = moveX + 'px';
            this.dragElemObj.elem.style.top = moveY + 'px';
        },

        mO: function (e) {
            const dropEl = e.target.closest('.dropable');

            if (!dropEl) return;

            this.curentDropElem = dropEl;

            if (this.maskDiv) this.maskDiv.parentElement.removeChild(this.maskDiv);

            const maskDiv = document.createElement('div');

            maskDiv.className = 'dropable__mask';
            maskDiv.style.height = this.dragElemObj.height + 'px';

            dropEl.appendChild(maskDiv);

            this.maskDiv = maskDiv;
        },

        mU: function (e) {
            document.removeEventListener('mousemove', this.mM);
            document.removeEventListener('mouseover', this.mO);

            if (!this.curentDropElem || this.curentDropElem == this.parentDropElem) {
                this.dragElemObj.elem.style.left = this.dragElemObj.X + 'px';
                this.dragElemObj.elem.style.top = this.dragElemObj.Y + 'px';

                this.dragElemObj.elem.classList.remove('dragable_active');

                this.dragElemObj.elem.style = '';

            } else {
                const dropX = this.curentDropElem.getBoundingClientRect().left,
                    dropY = this.curentDropElem.getBoundingClientRect().top,
                    div = document.createElement('div');

                if (this.dragElemObj.elem) {
                    this.dragElemObj.elem.style.left = dropX + 'px';
                    this.dragElemObj.elem.style.top = dropY + 'px';

                    div.className = 'dragable';
                    div.innerHTML = this.dragElemObj.elem.innerHTML;

                    this.curentDropElem.appendChild(div);

                    this.dragElemObj.elem.parentElement.removeChild(this.dragElemObj.elem);
                }

                this.dragElemObj = {};
            }

            if (this.maskDiv) {
                this.maskDiv.parentElement.removeChild(this.maskDiv);
                this.maskDiv = null;
            }
        }
    };
})();