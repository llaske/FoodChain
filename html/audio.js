// HTML 5 Audio Element encapsulation
// Lionel Laské 2012 - CC BY-SA 
// See http://www.w3.org/wiki/HTML/Elements/audio for more

enyo.kind({
	name: "HTML5.Audio",
	kind: enyo.Control,
	tag: "audio",
	published: {
		src: "", crossorigin: "", preload: "auto", autoplay: false,
		mediagroup: "", loop: false, muted: "", controlsbar: false
	},

	create: function() {
		this.inherited(arguments);
		this.srcChanged();
		this.crossoriginChanged();
		this.preloadChanged();
		this.autoplayChanged();
		this.mediagroupChanged();
		this.loopChanged();
		this.mutedChanged();
		this.controlsbarChanged();
	},

	rendered: function() {
		this.inherited(arguments);
		if (this.src instanceof Array) {
			var node = this.hasNode();
			if (node != null) {
				var len = this.src.length;
				var i;
				for (i = 0; i < len ; i++) {
					var source = document.createElement("source");
					source.setAttribute("src", this.src[i]);
					node.appendChild(source);
				}
			}
		}
	},
	
	srcChanged: function() {
		if (!(this.src instanceof Array))
			this.setAttribute("src", this.src);
	},

	crossoriginChanged: function() {
		this.setAttribute("crossorigin", this.crossorigin);
	},
	
	preloadChanged: function() {
		this.setAttribute("preload", this.preload);
	},
	
	autoplayChanged: function() {
		this.setAttribute("autoplay", this.autoplay);
	},
	
	mediagroupChanged: function() {
		this.setAttribute("mediagroup", this.mediagroup);
	},

	loopChanged: function() {
		this.setAttribute("loop", this.loop);
	},
	
	mutedChanged: function() {
		if (this.muted.length != 0)
			this.setAttribute("muted", this.muted);
	},
	
	controlsbarChanged: function() {
		this.setAttribute("controls", this.controlsbar);
	},
	
	canPlayType: function(typename) {
		var node = this.hasNode();
		if (node == null)
			return false;
		return node.canPlayType(typename);
	},
	
	play: function() {
		var node = this.hasNode();
		if (node == null)
			return;	
		node.play();
	},
	
	pause: function() {
		var node = this.hasNode();
		if (node == null)
			return;		
		node.pause();
	},
	
	paused: function() {
		var node = this.hasNode();
		if (node == null)
			return false;		
		return node.paused;
	},

	ended: function() {
		var node = this.hasNode();
		if (node == null)
			return false;		
		return node.ended;
	}	
});