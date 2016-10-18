
// TODO: Write proper documentation
// Make is so when $(this) is called, the selector is the only thing returned
// $('body').onWindowResize(500, function() { $(this).addClass('hello') })

// Usage:
// If only one breakpoint paramenter is passed (in this example: 500), the resize function will
// call from the set number and anything above (100%)
// $('body').onWindowResize(500, function() {
//   console.log('test1');
// });
//
// When two numbers are set (within an array), the functions will
// only call between those two number
// $('body').onWindowResize([500, 700], function() {
//   console.log('test2');
// });
//
// To call the function at any resolution, don't pass any breakpoints
// $('body').onWindowResize(function() {
//   console.log('test3');
// });
//
// Remember, when you pass in a selector, it is that element which has it's width checked
// against the breakpoints. This means the scollbar width doesn't get added to the calculations.
// To accurately check for real breakpoints against the full viewport width, use window.
// $(window).onWindowResize(800, function() {
//   console.log('test4');
// });
//
// ...or don't use a selector at all
// $.onWindowResize(function() {
//   console.log('test5');
// });
//
// You can define a secondary function that gets called when the browser is above and below the given breakpoints.
// You must have at lease one breakpoint set for the secdonary function to work
// $('body').onWindowResize(500, function() {
//   console.log('test6 Active');
// }, function() {
//   console.log('test6 Inactive');
// });

// Return viewport width including scroller bar width - http://www.w3schools.com/js/js_window.asp
function getWindowWidth() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

// Return viewport height including scroller bar height
function getWindowHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

(function( $ ) {

  var functions = new Array();

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
  }

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
          options.sort(function(a, b){return a-b});
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

  $(window).on("load resize",resize);

}( jQuery ));
