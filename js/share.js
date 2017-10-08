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

		$('.social__a_vk').click(function() {
			Share.vkontakte();
			return false;
		});
		$('.social__a_fb').click(function() {
			Share.facebook();
			return false;
		});
		$('.social__a_tw').click(function() {
			Share.twitter();
			return false;
		});
		$('.social__a_ok').click(function() {
			Share.odnoklasniki();
			return false;
		});

	});


}());