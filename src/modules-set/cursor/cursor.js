var Cursor;

(function () {
    'use strict';

    Cursor = {
        elObj: null,
        cursorEl: null,
        mOver: null,
        mMove: null,
        mOut: null,
        opt: null,

        init: function (options) {
            this.opt = options;

            this.mOver = this.start.bind(this);

            document.addEventListener('mouseover', this.mOver);

            this.cursorEl = document.createElement('div');
            this.cursorEl.className = 'cursor';
            document.body.appendChild(this.cursorEl);
        },

        start: function (e) {
            this.opt.forEach(it => {
                const el = e.target.closest(it.selector);

                if (el) {
                    this.elObj = {el, cursCl: it.class};
                }
            });

            if (!this.elObj) return;

            if (this.elObj.cursCl) {
                this.cursorEl.setAttribute('data-class', this.elObj.cursCl);
            } else {
                this.cursorEl.removeAttribute('data-class');
            }

            this.cursorEl.classList.add('cursor_visible');
            
            this.mMove = this.move.bind(this);
            document.addEventListener('mousemove', this.mMove);

            this.mOut = this.end.bind(this);
            document.addEventListener('mouseout', this.mOut);
        },

        move: function (e) {
            let x = e.pageX - this.cursorEl.offsetWidth / 2,
            y = e.pageY - this.cursorEl.offsetHeight / 2;

            if (e.pageX + this.cursorEl.offsetWidth / 2 > window.innerWidth) {
                x = window.innerWidth - this.cursorEl.offsetWidth;
            }

            if (e.pageY + this.cursorEl.offsetHeight / 2 > window.innerHeight) {
                y = window.innerHeight - this.cursorEl.offsetHeight;
            }

            this.cursorEl.style.transform = 'translate('+ x + 'px,'+ y + 'px)';
        },

        end: function (e) {
            this.cursorEl.classList.remove('cursor_visible');

            document.removeEventListener('mousemove', this.mMove);
            document.removeEventListener('mouseout', this.mOut);
        }
    };
})();