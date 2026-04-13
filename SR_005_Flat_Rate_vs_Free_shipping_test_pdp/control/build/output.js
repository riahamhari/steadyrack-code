
					/**
Test name: SR 005 Flat Rate vs Free shipping test - control
Developed by: Riah Amhari
**/

'use strict';

(async () => {
  try {

var tagInterval = setInterval(() => {
  if (typeof window?.clarity === "function") {
    window.clarity("set", "test-SR005", "control");
    clearInterval(tagInterval);
  }
}, 300);

  } catch (error) {
    const stack = error.stack || '';
    const lineMatch = stack.match(/:([0-9]+):([0-9]+)/);
    const location = lineMatch ? `Line ${lineMatch[1]}, Column ${lineMatch[2]}` : 'Unknown location';

    console.error(`\u274C Opti test error | Test ID: SR_005 |`);
    console.error(`\u{1F4CD} Location: ${location}`);
    console.error(`\u{1F50D} Stack trace:`, error.stack);
  }
})();
					document.body.insertAdjacentHTML('afterbegin', `
<style>

</style>`);
				