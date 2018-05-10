;(function() {

		var href = window.location.href;

		var Share = {
			vkontakte: function() {
				url  = 'http://vkontakte.ru/share.php?';
				url += 'url=' + encodeURIComponent( href );
				Share.popup(url);
			},
			facebook: function() {
				url  = 'http://www.facebook.com/sharer.php?';
				url += 'u=' + encodeURIComponent( href );
				Share.popup(url);
			},
			twitter: function() {
				url  = 'http://twitter.com/share?';
				url += 'url=' + encodeURIComponent( href );
				Share.popup(url);
			},
			odnoklasniki: function() {
				url  = 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview';
				url += '&st.shareUrl=' + encodeURIComponent( href );
				Share.popup(url);
			},

			popup: function(url) {
				window.open(url,'','toolbar=0,status=0,width=626,height=436');
			}
		};


	$(document).ready(function() {

		$('.js-share-vk').click(function() {
			Share.vkontakte();
			return false;
		});
		$('.js-share-fb').click(function() {
			Share.facebook();
			return false;
		});
		$('.js-share-tw').click(function() {
			Share.twitter();
			return false;
		});
		$('.js-share-ok').click(function() {
			Share.odnoklasniki();
			return false;
		});

	});


}());