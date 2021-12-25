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

var FramesAnimate;

(function () {
    'use strict';

    FramesAnimate = function (elemId, options) {
        const contEl = document.getElementById(elemId);

        if (!contEl) return;

        const opt = options || {},
            count = +contEl.getAttribute('data-count'),
            path = contEl.getAttribute('data-path'),
            folderPath = contEl.getAttribute('data-folder'),
            ext = contEl.getAttribute('data-ext'),
            _this = this;

        opt.fps = (opt.fps !== undefined) ? opt.fps : 30;
        opt.autoplay = (opt.autoplay !== undefined) ? opt.autoplay : true;
        opt.backward = (opt.backward !== undefined) ? opt.backward : false;
        opt.infinite = (opt.infinite !== undefined) ? opt.infinite : true;

        this.opt = opt;
        this.contEl = contEl;
        this.fps = opt.fps;
        this.autoplay = opt.autoplay;
        this.infinite = opt.infinite;
        this.animated = false;
        this.onStop = null;
        this.onLoad = null;
        this.loaded = false;
        this.loadedImages = [];
        this.loadedCount = 0;
        this.count = count;
        this.loadedImg = null;

        try {
            this.ctx = contEl.getContext('2d');
        } catch (error) {
            console.log(error, 'Elem Id: ' + elemId);
        }

        this.img = { W: 0, H: 0 };
        this.imgDims = { W: 0, H: 0 };
        this.viewportDims = { W: 0, H: 0, X: 0 };

        const init = () => {
            this.contElWidth = contEl.offsetWidth;
            this.contElHeight = contEl.offsetHeight;

            contEl.width = this.contElWidth;
            contEl.height = this.contElHeight;

            this.imgDims.W = this.img.W / count;
            this.imgDims.H = this.img.H;

            this.viewportDims.W = this.contElHeight * this.imgDims.W / this.img.H;
            this.viewportDims.H = this.contElHeight;
            this.viewportDims.X = this.contElWidth / 2 - this.viewportDims.W / 2;
        }

        if (folderPath) {
            for (let i = 0; i < count; i++) {
                const imgEl = new Image();

                imgEl.onload = function () {
                    _this.loadedImages[i] = this;

                    _this.img.W = this.width;
                    _this.img.H = this.height;

                    _this.loadedCount++;

                    if (_this.loadedCount == count) {
                        init();

                        _this.loaded = true;

                        if (_this.onLoad) {
                            _this.onLoad();
                        }

                        if (_this.autoplay) {
                            _this.play();
                        }
                    }
                }

                imgEl.src = folderPath + '/' + (i + 1) + '.' + ext;
            }

        } else {
            const imgEl = new Image();

            imgEl.onload = function () {
                _this.loadedImg = this;

                _this.img.W = this.width;
                _this.img.H = this.height;

                init();

                _this.loaded = true;

                if (_this.onLoad) {
                    _this.onLoad();
                }

                if (_this.autoplay) {
                    _this.play();
                }
            }

            imgEl.src = path;
        }

        this.reInit = function () {
            if (this.loaded) init();
        }
    }

    FramesAnimate.prototype.animate = function (dir) {
        this.animated = true;

        let i = 0,
            back = false;

        if (dir == 'back') {
            back = true;
            i = this.count - 1;
        }

        let start = performance.now();

        requestAnimationFrame(function anim(time) {
            if (time - start > 1000 / this.fps) {
                this.ctx.clearRect(0, 0, this.contElWidth, this.contElHeight);

                if (this.loadedImages.length) {
                    console.log(i+1);
                    this.ctx.drawImage(this.loadedImages[i], 0, 0, this.contElWidth, this.contElHeight);

                } else {
                    const sx = this.imgDims.W * i;

                    this.ctx.drawImage(this.loadedImg, sx, 0, this.imgDims.W, this.imgDims.H, this.viewportDims.X, 0, this.viewportDims.W, this.viewportDims.H);
                }

                if (!this.infinite) {
                    if ((back && !i) || (!back && i == this.count - 1)) {
                        this.stop();
                        return;
                    }
                }

                if (this.opt.backward) {
                    // if (i == this.count) {
                    //     back = true;
                    //     i = this.count - 1;
                    // } else if (i < 0) {
                    //     back = false;
                    //     i = 0;
                    // }
                } else {
                    if (this.opt.infinite && !back && i == this.count - 1) {
                        i = -1;
                    }
                }

                if (back) {
                    i--;
                } else {
                    i++;
                }

                start = time;
            }

            if (this.animated) requestAnimationFrame(anim.bind(this));
        }.bind(this));
    }

    FramesAnimate.prototype.play = function (dir) {
        if (this.loaded) {
            this.animate(dir);
        } else {
            setTimeout(this.play.bind(this), 121);
        }
    }

    FramesAnimate.prototype.stop = function () {
        this.autoplay = false;
        this.animated = false;

        if (this.onStop) {
            this.onStop();
        }
    }
})();