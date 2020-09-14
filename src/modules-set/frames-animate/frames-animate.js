/* 
const frAn = new FramesAnimate('stopmotion-frames', {
    fps: 30,
    autoplay: true,
    infinite: true,
    backward: false
});

frAn.onStop = function () {
    // code
}
*/

'use strict';

function FramesAnimate(elemId, options) {
    const contEl = document.getElementById(elemId);

    if (!contEl) return;

    const opt = options || {},
        count = contEl.getAttribute('data-count'),
        dirpath = contEl.getAttribute('data-dirpath'),
        dataDelay = contEl.getAttribute('data-delay'),
        ext = contEl.getAttribute('data-ext'),
        _this = this;

    opt.fps = (opt.fps !== undefined) ? opt.fps : 30;
    opt.autoplay = (opt.autoplay !== undefined) ? opt.autoplay : true;
    opt.backward = (opt.backward !== undefined) ? opt.backward : false;
    opt.infinite = (opt.infinite !== undefined) ? opt.infinite : true;

    this.opt = opt;
    this.contEl = contEl;
    this.frElems = [];
    this.fps = opt.fps;
    this.animated = false;
    this.onStop = null;

    let delay = {},
        loadedImgSrc = [],
        loadedImgCount = 0;

    for (let i = 0; i < count; i++) {
        const imgEl = new Image();

        imgEl.onload = function () {
            loadedImgSrc[i] = this.src;

            loadedImgCount++;

            if (loadedImgCount == count) {
                _this.buildHtml(loadedImgSrc);

                if (opt.autoplay) {
                    _this.animate();
                }
            }
        }

        imgEl.src = dirpath + '/' + (i + 1) + '.' + ext;
    }
}

FramesAnimate.prototype.buildHtml = function (loadedImgSrc) {
    loadedImgSrc.forEach((src) => {
        const frEl = document.createElement('div');

        frEl.style.backgroundImage = 'url(' + src + ')';

        this.frElems.push(frEl);

        this.contEl.appendChild(frEl);
    });
}

FramesAnimate.prototype.animate = function () {
    this.animated = true;

    let i = 0,
        back = false;

    (function loop() {
        let mult = 1;

        this.frElems[i].classList.add('visible');

        if (back) {
            if (i < this.frElems.length - 1) {
                this.frElems[i + 1].classList.remove('visible');
            }

            i--;
        } else {
            if (i > 0) {
                this.frElems[i - 1].classList.remove('visible');
            } else {
                this.frElems[this.frElems.length - 1].classList.remove('visible');
            }

            i++;
        }

        if (!this.infinite && i == this.frElems.length) {
            return this.stop();
        }

        if (this.opt.backward) {
            if (i == this.frElems.length) {
                back = true;
                i = this.frElems.length - 1;
            } else if (i < 0) {
                back = false;
                i = 0;
            }
        } else {
            if (i == this.frElems.length) {
                i = 0;
            }
        }

        if (this.animated) {
            setTimeout(loop.bind(this), (1000 / this.fps) * mult);
        }
    }.bind(this))();
}

FramesAnimate.prototype.stop = function () {
    this.animated = false;

    if (this.onStop) {
        this.onStop();
    }
}