/* 
new LazyLoad({
   selector: @Str,
   event: false
});
*/

; var LazyLoad;

(function() {
   'use strict';
   
   LazyLoad = function(opt) {
      opt = opt || {};
      
      const elements = document.querySelectorAll(opt.selector);
      
      if (!elements.length) return;
      
      function doLoad() {
         for (let i = 0; i < elements.length; i++) {
            const elem = elements[i],
            src = elem.getAttribute('data-src') || null;
            
            if (src) {
               elem.src = src;
            }
         }
      }
      
      // do load
      if (opt.event && opt.event == 'scroll') {} else {
         setTimeout(doLoad, 1000);
      }
   }
})();