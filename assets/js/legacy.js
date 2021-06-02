// Identifying user's prefered langauge for later use.
var language = window.navigator.userLanguage || window.navigator.language;
document.body.setAttribute("data-pref-lang", language);


// LEFTOVERS
function is_production(){
    return rpEnv == 'production';
}

// BADGES

// Toggle Logos from all badges
function toggleLogos(el){
    if(el){
    var isChecked = el.checked;
    var parent = document.querySelector('.rp-Badges')
    if(isChecked){ //checked
      parent.classList.add('rp-Badges--show-logos')
    }else{ //unchecked
      parent.classList.remove('rp-Badges--show-logos');
    }
  }
}

// Toggle badge content
function toggleBadge(el){
    if (el && el.classList) {
        el.classList.add('rp-Badge--open');
        console.log(el.classList)
        Array.prototype.filter.call(el.parentNode.children, function(child){
            if(child !== el){
                child.classList.remove('rp-Badge--open');
            }
        });
    }
}
// BACK TO TOP clap clap > https://codepen.io/alexandr-kazakov/pen/yMRPOR
if(document.querySelector('.back_top_top')){
  (function() {
    'use strict';

    function trackScroll() {
      var scrolled = window.pageYOffset;
      var coords = document.documentElement.clientHeight;

      if (scrolled > coords) {
        goTopBtn.classList.add('show');
      }
      if (scrolled < coords) {
        goTopBtn.classList.remove('show');
      }
    }

    function backToTop() {
      if (window.pageYOffset > 0) {
        window.scrollBy(0, -80);
        setTimeout(backToTop, 0);
      }
    }

    var goTopBtn = document.querySelector('.back_top_top');

    window.addEventListener('scroll', trackScroll);
    goTopBtn.addEventListener('click', backToTop);
  })();
}

// To make sure function is kept after tree shaking
toggleLogos(false)
toggleBadge(false)