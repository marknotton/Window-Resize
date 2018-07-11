# On Window Resize

Create numerous window resize checks that are loaded into a single listener handler.

Breakpoints can also be defined to restrict when functions are called.

## Installation

### [NPM](https://www.npmjs.com/package/on-window-resize)
```
npm i on-window-resize --save
```

# Usage:
If only one breakpoint paramenter is passed (in the example: 500), the resize function will
call from the set number and anything above (100%)

```
$('body').onWindowResize(500, () => {
  console.log('test1');
});
```
When two numbers are set (within an array), the functions will
only call between those two number
```
$('body').onWindowResize([500, 700], () => {
  console.log('test2');
});
```

To call the function at any resolution, don't pass any breakpoints
```
$('body').onWindowResize(() => {
  console.log('test3');
});
```

Remember, when you pass in a selector, it is that element which has it's width checked
against the breakpoints. This means the scollbar width doesn't get added to the calculations.
To accurately check for real breakpoints against the full viewport width, use window.
```
$(window).onWindowResize(800, () => {
  console.log('test4');
});
```

...or don't use a selector at all
```
$.onWindowResize(() => {
  console.log('test5');
});
```
