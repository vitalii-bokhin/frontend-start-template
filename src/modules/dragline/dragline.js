; var DragLine;

(function() {
	'use strict';
	
	DragLine = {
		
		dragStart: function(e) {
			if (e.type == 'mousedown' && e.which !== 1) return;
			
			
		},
		
		init: function(opt) {
			var dragLineElements = document.getElementsByClassName(opt.lineClass);
			
			if (!dragLineElements.length) return;
			
			for (let i = 0; i < dragLineElements.length; i++) {
				var dlElem = dragLineElements[i],
				itemElements = dlElem.getElementsByTagName('div');

				for (let i = 0; i < itemElements.length; i++) {
					itemElements[i].classList.add(opt.lineClass +'__item');
				}

				dlElem.innerHTML = '<div class="'+ opt.lineClass +'__dragable"><div class="'+ opt.lineClass +'__line">'+ dlElem.innerHTML +'</div></div>';
			}
			
			if (document.ontouchstart !== undefined) {
				document.addEventListener('touchstart', this.dragStart.bind(this));
			} else {
				document.addEventListener('mousedown', this.dragStart.bind(this));
			}
		}
	};
})();