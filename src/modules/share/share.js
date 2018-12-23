/*
Share.init(Str button class);
*/

; var Share;

;(function() {
	'use strict';
	
	var encodedHref = encodeURIComponent(window.location.href);

	Share = {
		network: function(elem) {
			var net = elem.getAttribute('data-network');

			if (!net) {
				return;
			}

			var url;

			switch (net) {
				case 'vk':
				url = 'http://vkontakte.ru/share.php?url='+ encodedHref;
				break;

				case 'fb':
				url = 'http://www.facebook.com/sharer.php?u='+ encodedHref;
				break;

				case 'tw':
				url = 'http://twitter.com/share?url='+ encodedHref;
				break;

				case 'ok':
				url = 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl='+ encodedHref;
				break;
			}

			this.popup(url);
		},

		popup: function(url) {
			window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
		},

		init: function(elementStr) {
			document.addEventListener('click', (e) => {
				var elem = e.target.closest(elementStr);

				if (!elem) {
					return;
				}

				e.preventDefault();

				this.network(elem);
			});
		}
	};
})();