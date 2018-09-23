; var Bubble;

(function() {
	"use strict";

	Bubble = {
		options: {
			event: 'hover'
		}

		init: function(options) {
			this.options = options;


			console.log(this.options);
			document.addEventListener(this.options.event, (e) => {
				var elem = e.target.closest(this.options.element);

			});
		}
	};
}());