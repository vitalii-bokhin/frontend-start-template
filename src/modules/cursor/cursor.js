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
            let el;

            for (const it of this.opt) {
                el = e.target.closest(it.selector);

                if (el) {
                    this.elObj = { el, cursCl: it.class };
                    break;
                }
            }

            if (!el) return;

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
                
            if (e.pageX + this.cursorEl.offsetWidth / 2 > document.documentElement.clientWidth) {
                x = document.documentElement.clientWidth - this.cursorEl.offsetWidth;

            } else if (e.pageX < this.cursorEl.offsetWidth / 2) {
                x = 0;
            }

            if (e.pageY + this.cursorEl.offsetHeight / 2 > window.innerHeight + window.pageYOffset) {
                y = window.innerHeight + window.pageYOffset - this.cursorEl.offsetHeight;

            } else if (e.pageY < this.cursorEl.offsetHeight / 2) {
                y = 0;
            }

            this.cursorEl.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        },

        end: function (e) {
            console.log('out');
            this.cursorEl.classList.remove('cursor_visible');

            document.removeEventListener('mousemove', this.mMove);
            document.removeEventListener('mouseout', this.mOut);
        }
    };
})();