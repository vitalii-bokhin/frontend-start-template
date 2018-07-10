var Diagram;

(function() {
	"use strict";

	Diagram = function(options) {
		var canvasElement = document.getElementById(options.canvasId);

		this.animate = function(duration) {
			if (!canvasElement) {
				return;
			}

			const chartValues = options.charts.map((obj) => obj.value);
			
			animate((progress) => {
				this.ctx.clearRect(0, 0, (this.center.x * 2), (this.center.y * 2));
				this.prevChartsWidth = 0;

				options.charts.forEach((chart, i) => {
					chart.value = chartValues[i] * progress;

					drawChart(chart, i);
				});
				
			}, duration, 'easeInOutQuad');
		}

		if (!canvasElement) {
			return;
		}

		canvasElement.width = canvasElement.offsetWidth;
		canvasElement.height = canvasElement.offsetHeight;

		this.ctx = canvasElement.getContext('2d');
		this.canvasWidth = canvasElement.width;
		this.center = {x: canvasElement.width / 2, y: canvasElement.height / 2};
		this.prevChartsWidth = 0;

		const startAngle = 1.5 * Math.PI;

		var drawChart = (chart, i) => {
			var endAngle = 2 * Math.PI * chart.value / options.maxValue + startAngle,
			radius = this.canvasWidth / 2 - chart.width / 2 - (chart.offset || 0) - this.prevChartsWidth;

			this.prevChartsWidth += chart.width + (chart.offset || 0);

			this.ctx.beginPath();
			this.ctx.arc(this.center.x, this.center.y, radius, startAngle, endAngle);
			this.ctx.lineWidth = chart.width;
			this.ctx.strokeStyle = chart.color;
			this.ctx.stroke();
		}

		if (!options.animate) {
			options.charts.forEach((chart, i) => {
				drawChart(chart, i);
			});
		}
	}
}());