/*
ScrollSmooth.init();
*/

; var ScrollSmooth;

(function() {
	"use strict";
	
	ScrollSmooth = {
		scrolling: false,
		delta: 0,
		scrollTo: 0,
		
		scroll: function() {
			this.scrolling = true;
			
			duration = 500;
			easing = 'easeInOutQuad';
			
			animate(function(progress) {
				window.scrollTo(0, ((this.scrollTo * progress) + ((1 - progress) * window.pageYOffset)));
			}, duration, easing, () => {
				this.scrolling = false;
				this.delta = 0;
			});
		},
		
		init: function() {
			if ('onwheel' in document) {
				document.addEventListener('wheel', (e) => {
					e.preventDefault();
					
					this.delta += e.deltaY;
					
					this.scrollTo = this.delta + window.pageYOffset;
					
					if (!this.scrolling) {
						this.scroll();
					}
				});
			}
		}
	};
})();