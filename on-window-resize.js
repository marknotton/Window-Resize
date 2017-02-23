// Return viewports width including scroller bar width - http://www.w3schools.com/js/js_window.asp
function getWindowWidth(bool) {
  if(typeof bool !== 'undefined' && bool === true) {
    return $("body").prop("clientWidth");
  } else {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }
}

// Return viewport height including scroller bar height
function getWindowHeight(bool) {
  if(typeof bool !== 'undefined' && bool === true) {
    return $("body").prop("clientHeight");
  } else {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  }
}

// https://davidwalsh.name/javascript-debounce-function
// TODO: Add debounce options
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

(function( $ ) {

  var functions = [];

  // Set the absolute mininmum a devices can never respond down to by default
  var mininmum = 320;

  // Call all functions from the 'functions' array if the breakpoint conditions are met
  function resize() {
    $.each(functions, function(i, val) {
      var calculatedWidth = val.selector !== window ? $(val.selector).innerWidth() : getWindowWidth();
      var minBreak = val.breakpoints[0];
      var maxBreak = val.breakpoints[1];

      if (minBreak <= calculatedWidth && maxBreak >= calculatedWidth || minBreak <= calculatedWidth && maxBreak === null) {
        val.func();
      }
    });
  }


  // Incase a selctor isn't used, revert to 'window' by default
  $.onWindowResize = function(options, callbackActive, callbackInactive) {
    $(window).onWindowResize(options, callbackActive, callbackInactive);
  };

  // Add the selector, function, and breakpoint rules into an array, to be called when the screen resizes
  $.fn.extend({
    onWindowResize : function(options, callbackActive, callbackInactive) {

      if ( typeof options == 'function' && callbackActive === undefined || callbackActive === null && callbackInactive === undefined || callbackInactive === null) {
        // One Parameter : breakpoint NOT SET, active function SET, inactive function NOT SET
        callbackActive = options;
        options = mininmum;
        callbackInactive = null;
      } else if ( typeof options == 'function' && typeof callbackActive == 'function' && callbackInactive === undefined || callbackInactive === null) {
        // Two Parameters : breakpoint NOT SET, active function SET, inactive function SET
        callbackActive = options;
        options = mininmum;
        callbackInactive = null;
        console.warn("You have defined a secondary function without setting any breakpints. This second function will not be called.");
      }

      if (typeof callbackActive == 'function' && options !== undefined || options !== null) {

        // Puts breakpoints in numerical order, so the mininmum width is the first array element
        if ($.isArray(options) && options.length > 1) {
          options.sort(function(a, b){return a-b;});
        }

        // Set the min and max width variables
        var minWidth = $.isArray(options) && options.length > 1 ? options[0] : parseInt(options.toString(), 10);
        var maxWidth = $.isArray(options) && options.length > 1 ? options[1] : null;

        // Check the numbers are not lower that 320px
        minWidth = minWidth < mininmum ? mininmum : minWidth;
        maxWidth = maxWidth < mininmum && maxWidth !== undefined && maxWidth !== null ? mininmum : maxWidth;

        // Perform a few checks to make sure the selector that is valid
        var selector = this.selector !== undefined && this.selector !== null && this[0] !== window ? this.selector : window;

        // If the breakpoints don't match, add to the functions array
        if (minWidth !== maxWidth) {
          functions.push({'selector':selector, 'func':callbackActive, 'breakpoints':[minWidth, maxWidth]});
        } else {
          console.warn("Your onWindowResize breakpoint conditions were invlaid for: '" + this.selector + "'");
        }

        if (callbackInactive !== undefined && callbackInactive !== null) {
          if (minWidth > mininmum) {
            functions.push({'selector':selector, 'func':callbackInactive, 'breakpoints':[mininmum, minWidth]});
          }
          if (maxWidth !== null) {
            functions.push({'selector':selector, 'func':callbackInactive, 'breakpoints':[maxWidth, null]});
          }
        }
      }
    }

  });

  $(window).on("load resize", resize);

}( jQuery ));
