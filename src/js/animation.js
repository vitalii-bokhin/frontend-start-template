(function() {
   'use strict';
   
   // animate when is visible
   const animationOnVisible = {
      animElements: null,
      
      scroll: function() {
         for (let i = 0; i < this.animElements.length; i++) {
            const animElem = this.animElements[i],
            animElemOffsetTop = animElem.getBoundingClientRect().top + window.pageYOffset;
            
            if ((window.pageYOffset + window.innerHeight) > animElemOffsetTop && window.pageYOffset < animElemOffsetTop) {
               animElem.classList.add('animated');
            } else {
               animElem.classList.remove('animated');
            }
         }
      },
      
      init: function() {
         const animElements = document.querySelectorAll('.animate');
         
         if (animElements.length) {
            this.animElements = animElements;
         }
      }
   };

   // document ready
   document.addEventListener('DOMContentLoaded', function() {
      animationOnVisible.init();
      
      window.addEventListener('scroll', function() {
         animationOnVisible.scroll();
      });
   });
})();