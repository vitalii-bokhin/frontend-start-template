/*
ToolTip.init({
	element: '.js-tooltip'
});

ToolTip.onShow = function(elem) {
	
}
*/

; var ToolTip;

(function () {
	'use strict';
	
	ToolTip = {
		tooltipDiv: null,
		tooltipClass: null,
		canBeHidden: false,
		position: {},
		onShow: null,
		opt: null,
		
		show: function (elem) {
			this.tooltipDiv.innerHTML = (elem.hasAttribute('data-tooltip')) ? elem.getAttribute('data-tooltip').replace(/\[(\w+)\](.*)\[\:(\w+)\]/gi, '<$1>$2</$3>') : '';
			
			this.tooltipClass = elem.getAttribute('data-tooltip-class');
			
			if (window.innerWidth < 750) {
				this.position.X = 'center';
			} else if (elem.hasAttribute('data-tooltip-pos-x')) {
				this.position.X = elem.getAttribute('data-tooltip-pos-x');
			}
			
			if (elem.hasAttribute('data-tooltip-pos-y')) {
				this.position.Y = elem.getAttribute('data-tooltip-pos-y');
			}
			
			if (this.tooltipClass) {
				this.tooltipDiv.classList.add(this.tooltipClass);
			}
			
			let bubleStyle = this.tooltipDiv.style,
			elemRect = elem.getBoundingClientRect(),
			winW = window.innerWidth,
			coordX,
			coordY;
			
			switch (this.position.X) {
				case 'center':
				coordX = (elemRect.left + (elem.offsetWidth / 2)) - (this.tooltipDiv.offsetWidth / 2);
				
				if (coordX < 10) {
					coordX = 10;
				}
				
				bubleStyle.left = coordX + 'px';
				bubleStyle.marginLeft = '0';
				bubleStyle.marginRight = '0';
				break;
				
				case 'leftIn':
				coordX = elemRect.left;
				bubleStyle.left = coordX + 'px';
				break;
				
				case 'rightIn':
				coordX = window.innerWidth - elemRect.right;
				bubleStyle.right = coordX + 'px';
				break;
				
				default:
				coordX = elemRect.right;
				bubleStyle.left = coordX + 'px';
				break;
			}
			
			if ((this.tooltipDiv.offsetWidth + coordX) > winW) {
				bubleStyle.width = (winW - coordX - 10) + 'px';
			}
			
			// if (tooltipPotentWidth < tooltipMinWidth) {
			// 	tooltipPotentWidth = tooltipMinWidth;
			
			// 	coordX = window.innerWidth - tooltipMinWidth - 10;
			// }
			
			switch (this.position.Y) {
				case 'bottomIn':
				bubleStyle.top = (elemRect.bottom + window.pageYOffset - this.tooltipDiv.offsetHeight) + 'px';
				break;
				
				case 'bottomOut':
				bubleStyle.top = (elemRect.bottom + window.pageYOffset) + 'px';
				break;
				
				default:
				bubleStyle.top = (elemRect.top + window.pageYOffset - this.tooltipDiv.offsetHeight) + 'px';
				break;
			}
			
			if (this.onShow) {
				this.onShow(elem);
			}
			
			this.tooltipDiv.classList.add('tooltip_visible');
			
			this.canBeHidden = true;
			
			if (document.ontouchstart !== undefined) {
				document.addEventListener('touchstart', this.mouseOut.bind(this));
			}
		},
		
		hide: function () {
			this.tooltipDiv.classList.remove('tooltip_visible');
			this.tooltipDiv.removeAttribute('style');
			this.tooltipDiv.innerHTML = '';
			this.position = {};
			
			if (this.tooltipClass) {
				this.tooltipDiv.classList.remove(this.tooltipClass);
				
				this.tooltipClass = null;
			}
		},
		
		mouseOut: function (e) {
			if (this.canBeHidden && !e.target.closest(this.opt.element) && !e.target.closest('.tooltip')) {
				this.hide();
				
				this.canBeHidden = false;
				
				document.removeEventListener('touchstart', this.mouseOut);
			}
		},
		
		init: function (opt) {
			this.opt = opt || {};
			
			let mouseOver = (e) => {
				if (this.canBeHidden) {
					if (!e.target.closest(opt.element) && !e.target.closest('.tooltip')) {
						this.hide();
						
						this.canBeHidden = false;
					}
				} else {
					const elem = e.target.closest(opt.element);
					
					if (elem) {
						this.show(elem);
					}
				}
			}
			
			let mouseClick = (e) => {
				const elem = e.target.closest(opt.element);
				
				if (elem) {
					this.hide();
					this.show(elem);
				}
			}
			
			if (document.ontouchstart !== undefined) {
				document.addEventListener('click', mouseClick);
			} else {
				document.addEventListener('mouseover', mouseOver);
			}
			
			//add tooltip to DOM
			this.tooltipDiv = document.createElement('div');
			this.tooltipDiv.className = 'tooltip';
			
			document.body.appendChild(this.tooltipDiv);
		}
	};
})();