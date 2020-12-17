var DragAndDrop;

(function () {
    'use strict';

    DragAndDrop = {
        opt: null,
        dragElemObj: {},
        parentDropElem: null,
        curentDropElem: null,
        maskDiv: null,
        lastInsertPos: '',

        init: function (opt) {
            this.opt = opt || {};

            document.removeEventListener('mousedown', this.mD);

            this.mD = this.mD.bind(this);

            document.addEventListener('mousedown', this.mD);

            this.setInd();
        },

        setInd: function () {
            const dropEls = document.querySelectorAll('.dropable');

            for (let i = 0; i < dropEls.length; i++) {
                const dropEl = dropEls[i];

                const dragEls = dropEl.querySelectorAll('.dragable');

                for (let i = 0; i < dragEls.length; i++) {
                    const dragEl = dragEls[i];

                    dragEl.setAttribute('data-index', i);
                }
            }
        },

        mD: function (e) {
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

            this.parentDropElem = dragEl.closest('.dropable');
        },

        mM: function (e) {
            const clientX = (e.type == 'touchmove') ? e.targetTouches[0].clientX : e.clientX,
                clientY = (e.type == 'touchstart') ? e.targetTouches[0].clientY : e.clientY;

            const moveX = clientX - this.dragElemObj.shiftX,
                moveY = clientY - this.dragElemObj.shiftY;

            this.dragElemObj.elem.style.left = moveX + 'px';
            this.dragElemObj.elem.style.top = moveY + 'px';

            const dropEl = e.target.closest('.dropable');

            if (dropEl && dropEl !== this.curentDropElem) {
                this.curentDropElem = dropEl;

                if (this.maskDiv) this.maskDiv.parentElement.removeChild(this.maskDiv);

                this.maskDiv = document.createElement('div');

                this.maskDiv.className = 'dropable__mask';
                this.maskDiv.style.height = this.dragElemObj.height + 'px';

                dropEl.appendChild(this.maskDiv);

                this.lastInsertPos = '';
            }

            const siblingDragEl = e.target.closest('.dragable');

            if (siblingDragEl) {
                const siblingDragElCenter = siblingDragEl.getBoundingClientRect().top + (siblingDragEl.offsetHeight / 2);

                if (clientY >= siblingDragElCenter) {
                    if (this.maskDiv && this.lastInsertPos != 'after') {
                        this.lastInsertPos = 'after'
                        siblingDragEl.after(this.maskDiv);
                    }

                } else {
                    console.log(this.lastInsertPos);
                    if (this.maskDiv && this.lastInsertPos != 'before') {
                        this.lastInsertPos = 'before';
                        siblingDragEl.before(this.maskDiv);
                    }
                }

            }
        },

        mU: function (e) {
            document.removeEventListener('mousemove', this.mM);

            if (this.curentDropElem == this.parentDropElem && !this.maskDiv) {
                if (this.dragElemObj.elem) {
                    this.dragElemObj.elem.style.left = this.dragElemObj.X + 'px';
                    this.dragElemObj.elem.style.top = this.dragElemObj.Y + 'px';

                    this.dragElemObj.elem.classList.remove('dragable_active');

                    this.dragElemObj.elem.style = '';
                }

            } else {
                // const dropX = this.curentDropElem.getBoundingClientRect().left,
                //     dropY = this.curentDropElem.getBoundingClientRect().top,
                //     div = document.createElement('div');

                if (this.dragElemObj.elem) {
                    // this.dragElemObj.elem.style.left = dropX + 'px';
                    // this.dragElemObj.elem.style.top = dropY + 'px';

                    // div.className = 'dragable';
                    // div.innerHTML = this.dragElemObj.elem.innerHTML;

                    // this.curentDropElem.appendChild(div);

                    // this.dragElemObj.elem.parentElement.removeChild(this.dragElemObj.elem);

                    this.dragElemObj.elem.classList.remove('dragable_active');

                    this.dragElemObj.elem.style = '';

                    if (this.maskDiv) {
                        this.maskDiv.replaceWith(this.dragElemObj.elem);
                    }
                }

                this.dragElemObj = {};
            }

            this.maskDiv = null;
            this.curentDropElem = null;

            this.setInd();
        }
    };
})();