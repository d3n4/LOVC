/*!
* RealDelay Component for CraftyJS
* https://github.com/hugeen/Crafty-RealDelay-component
*
* Copyright 2012 by hugeen.
* Licensed under the MIT license.
*/

/**@
* #RealDelay
* @category Core
* a delay component, can be paused, destroys itself with its entity
*/
Crafty.c("RealDelay", {
	init : function() {
		this._realDelays = [];
		this.bind("EnterFrame", function() {
			var now = new Date().getTime();
			for(var index in this._realDelays) {
				var item = this._realDelays[index];
				if(!item.triggered && item.start + item.delay + item.pause < now) {
					item.triggered=true;
					item.func.call(this);
				}
			}
		});
		this.bind("Pause", function() {
			var now = new Date().getTime();
			for(var index in this._realDelays) {
				var item = this._realDelays[index];
				item.pauseBuffer = now;
			}
		});
		this.bind("Unpause", function() {
			var now = new Date().getTime();
			for(var index in this._realDelays) {
				var item = this._realDelays[index];
				item.pause += now-item.pauseBuffer;
			}
		});
	},
	/**@
     * Set a new delay.
     * @param func the callback function
     * @param delay the delay in ms
     */
	realDelay : function(func, delay) {
		return this._realDelays.push({
			start : new Date().getTime(),
			func : func,
			delay : delay,
			triggered : false,
			pauseBuffer: 0,
			pause: 0
		});
	}
});
