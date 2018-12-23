; var DragLine;

(function() {
   'use strict';

   DragLine = {

      init: function(opt) {
         var dragLineElements = document.querySelectorAll(opt.lineSelector);

         if (!dragLineElements.length) return;

			console.log(document.ontouchstart);
      }
   };
})();