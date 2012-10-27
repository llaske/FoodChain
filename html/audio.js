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
	
	// Constructor
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

	// Render
	rendered: function() {
		this.inherited(arguments);
		
		// If source is an array component is generated here
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
		
		// Handle sound ended event
		if (this.hasNode() != null) {
			var audio = this;
			enyo.dispatcher.listen(audio.hasNode(), "ended", function() {
				audio.bubble("onended");
			});	
		}
	},
	
	// Property changed
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
	
	// Test if component could play a file type
	canPlayType: function(typename) {
		var node = this.hasNode();
		if (node == null)
			return false;
		return node.canPlayType(typename);
	},
	
	// Play audio
	play: function() {
		var node = this.hasNode();
		if (node == null)
			return;	
		node.play();
	},
	
	// Pause audio
	pause: function() {
		var node = this.hasNode();
		if (node == null)
			return;		
		node.pause();
	},
	
	// Test if audio is paused
	paused: function() {
		var node = this.hasNode();
		if (node == null)
			return false;		
		return node.paused;
	},

	// Test if audio is ended
	ended: function() {
		var node = this.hasNode();
		if (node == null)
			return false;		
		return node.ended;
	}	
});