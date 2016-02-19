
// TODO: Write proper documentation

// Usage:
// If only one breakpoint paramenter is passed (in the example: 500), the resize function will
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


(function( $ ) {

  var functions = new Array();

  // Set the absolute mininmum a devices can never respond down to by default 
  var mininmum = 360;

  // Return viewport width including scroller bar width - http://www.w3schools.com/js/js_window.asp
  function getWindowWidth() { 
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

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
  $.onWindowResize = function(options, callback) {
    $(window).onWindowResize(options, callback);
  }

  // Add the selector, function, and breakpoint rules into an array, to be called when the screen resizes
  $.fn.extend({
    onWindowResize : function(options, callback) {
      // This checks to see if any options have been passed at all. And assumes the resize handler will be called at any resolution
      if ( typeof options == 'function' && callback === undefined || callback === null) { 
        callback = options;
        options = mininmum;
      }

      if (typeof callback == 'function' && options !== undefined || options !== null) { 

        // Puts breakpoints in numerical order, so the mininmum width is the first array element
        if ($.isArray(options) && options.length > 1) {
          options.sort(function(a, b){return a-b});
        }

        // Set the min and max width variables
        var minWidth = $.isArray(options) && options.length > 1 ? options[0] : parseInt(options.toString(), 10);
        var maxWidth = $.isArray(options) && options.length > 1 ? options[1] : null;

        // Check the numbers are not lower that 360px
        minWidth = minWidth < mininmum ? mininmum : minWidth;
        maxWidth = maxWidth < mininmum && maxWidth !== undefined && maxWidth !== null ? mininmum : maxWidth;

        // Perform a few checks to make sure the selector that is being checked is valid
        var selector = this.selector !== undefined && this.selector !== null && this[0] !== window ? this.selector : window;

        // If the breakpoints don't match, add to the functions array
        if (minWidth !== maxWidth) {
          functions.push({'selector':selector, 'func':callback, 'breakpoints':[minWidth, maxWidth]});
        } else {
          console.warn("Your onWindowResize breakpoint conditions were invlaid for: '" + this.selector + "'");
        }
      }
    }

  });

  $(window).on("load resize",resize);
 
}( jQuery ));
