var Tab = {
	tabBlock: null,
	init: function() {
		var _ = this;
		$('.tab').each(function() {
			_.tabBlock = $(this);
			_.setHeight();
		});
	},
	button: function(_btn) {
		var _ = this,
		$btn = $(_btn);
		tab = $btn.attr('data-tab');
		_.tabBlock = $(_btn).closest('.tab');

		if (!$btn.hasClass('tab__button_active')) {
			_.tabBlock.find('.tab__button').removeClass('tab__button_active');
			$btn.addClass('tab__button_active');

			_.changeItem(tab);
		}
		
	},
	changeItem: function(tab) {
		var _ = this,
		$tabItem = this.tabBlock.find('.tab__item_'+ tab);
		_.tabBlock.find('.tab__item').removeClass('tab__item_active');
		_.setHeight($tabItem);
		setTimeout(function() {
			$tabItem.addClass('tab__item_active');
		}, 321);
	},
	setHeight: function($tabItem) {
		var _ = this,
		$container = this.tabBlock.find('.tab__container'),
		$activeItem = ($tabItem) ? $tabItem : _.tabBlock.find('.tab__item_active');
		$container.css('height', $activeItem.innerHeight());
	}
};

$(document).ready(function() {
	Tab.init();
	$('body').on('click', '.tab__button', function() {
		Tab.button(this);
	});
});