Crafty.c("HUD", {
	init: function() {
		if (this.has("DOM")) {
			this._element.parentNode.removeChild(this._element);
			Crafty.stage.elem.appendChild(this._element);
			this.z = 100;
			Crafty.addEvent(this, this._element, "click", function() { });
		}
	}
});