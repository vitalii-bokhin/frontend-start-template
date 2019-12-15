/* 
new LazyLoad({
   selector: @Str,
   event: false
});
*/

; var LazyLoad;

(function () {
   'use strict';

   LazyLoad = function (opt) {
      opt = opt || {};

      const elements = document.querySelectorAll(opt.selector);

      if (opt.event) {
         if (opt.event == 'scroll') {
            window.addEventListener('scroll', function (e) {
               for (let i = 0; i < elements.length; i++) {
                  const el = elements[i];

                  console.log(el.getBoundingClientRect());
               }
            });
         }
      } else {
         setTimeout(function () {
            doLoad(elements);
         }, 1000);
      }

      function doLoad(elements) {
         for (let i = 0; i < elements.length; i++) {
            const elem = elements[i];

            if (elem.hasAttribute('data-src')) {
               elem.src = elem.getAttribute('data-src');
            } else if (elem.hasAttribute('data-bg-url')) {
               elem.style.backgroundImage = 'url(' + elem.getAttribute('data-bg-url') + ')';
            }
         }
      }

      return {
         load: function (sel) {
            const elements = document.querySelectorAll(sel);
            doLoad(elements);
         }
      }
   }
})();