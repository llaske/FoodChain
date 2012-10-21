document.ondragover = enyo.dispatch;

// Main app class
enyo.kind({
	name: "FoodChain.App",
	kind: enyo.Control,
	classes: "board",
	components: [
		{ name: "cards", components: [
			{ content: "Set image in the right order of food chain", classes: "title" },
			{ name: "timercount", content: "0:0,0", classes: "timer" },
			{ name: "timer", kind: "Timer", onTriggered: "updateTimer" },
			
			{ name: "gamebox", classes: "box", ondrop: "drop", ondragover: "dragover", components: [] },
			
			{ name: "validate", kind: "ShadowButton", img: "validate", classes: "validate", ontap: "controlOrder" },
			{ name: "play", kind: "ShadowButton", img: "play", classes: "play", ontap: "play" },	
			{ name: "pause", kind: "ShadowButton", img: "pause", classes: "play", ontap: "pause" },	
			{ name: "restart", kind: "ShadowButton", img: "restart", classes: "restart", ontap: "restart" },
			{ name: "forward", kind: "ShadowButton", img: "forward", classes: "restart", ontap: "next" },
			{ name: "home", kind: "ShadowButton", img: "home", classes: "home", ontap: "home" },
			
			{ name: "winSound", kind: "HTML5.Audio", src: ["audio/applause.mp3", "audio/applause.ogg"], preload: "auto", autobuffer: true, controlsbar: false },
			{ name: "lostSound", kind: "HTML5.Audio", src: ["audio/disappointed.mp3", "audio/disappointed.ogg"], preload: "auto", autobuffer: true, controlsbar: false }
		]}		
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		
		// Compute the start chain
		var size = 3;
		this.chain = FoodChain.randomChain(size);
		var mixed = FoodChain.mix(this.chain);
		
		// Display matching cards
		var x = 10, y = 10;
		for (var i = 0 ; i < mixed.length ; i++) {
			this.$.gamebox.createComponent({ kind: "FoodChain.Card", cardname: mixed[i], x: x, y: y, ontap: "taped", ondragstart: "dragstart", ondragfinish: "dragfinish" }, {owner: this});
			x = x + 240;
		}
		
		// Box handling
		this.dragobject = null;
		this.zmax = 0;	

		// Button handling
		this.$.play.hide();
		this.$.restart.hide();
		this.$.forward.hide();
		this.$.home.hide();
		
		this.timecount = {mins:0, secs:0, tenth:0};
		this.$.timer.start();
	},
	
	// Update timer
	updateTimer: function(s, e) {
		this.timecount.tenth = this.timecount.tenth + 1;
		if (this.timecount.tenth == 10) {
			this.timecount.tenth = 0;
			this.timecount.secs = this.timecount.secs + 1;
			if (this.timecount.secs == 60) {
				this.timecount.secs = 0;
				this.timecount.mins = this.timecount.mins + 1;
			}
		}
		this.$.timercount.setContent(this.timecount.mins+":"+String("00"+this.timecount.secs).slice(-2)+","+this.timecount.tenth);
	},
	
	// Play sound when card taped
	taped: function(s, e) {
		s.play();
		console.log("taped");
	},
	
	// Card drag start, change style to dragged
	dragstart: function(s, e) {
		s.addClass("card-dragged");
		this.$.gamebox.addClass("box-dragging");
		s.play();
		this.dragobject = s;
		this.dragx = e.clientX-s.x;
		this.dragy = e.clientY-s.y;
		this.toTop(this.dragobject);
	},
	
	// Card drag end, change style to not dragged
	dragfinish: function(s, e) {
		s.removeClass("card-dragged");
		this.$.gamebox.removeClass("box-dragging");
	},
	
	// Drag over the box, allow dragging
	dragover: function(s, e) {
		if (this.dragobject == null)
			return true;
		e.preventDefault();
		return false;
	},
	
	// Dropped in the box, change card parent
	drop: function(s, e) {
		if (this.dragobject == null)
			return true;		
		e.preventDefault();
		this.dragobject.moveTo(e.clientX-this.dragx, e.clientY-this.dragy);
		this.dragobject = null;
	},
	
	// Set the card to top of the stack
	toTop: function(card) {
		this.zmax = this.zmax + 1;
		card.applyStyle("z-index", this.zmax)
	},
	
	// Validate cards order
	controlOrder: function() {
		// Get cards
		var cards = [];
		enyo.forEach(this.$.gamebox.getControls(), function(card) {
			cards.push(card);
		});	
		
		// Sort using x card position
		cards = cards.sort(function (c1, c2) { return c1.x - c2.x; });
		
		// Check order
		var win = true;
		for (var i = 0 ; win && i < this.chain.length ; i++) {
			if (cards[i].cardname != this.chain[i])
				win = false;
		}
		
		// Play win or loose sound	
		console.log(win);
		if (win) {
			this.$.winSound.play();
			this.$.gamebox.addClass("box-win");
			this.$.home.show();
			this.$.forward.show(); // TODO: Except if last level
		}
		else {
			this.$.lostSound.play();
			this.$.gamebox.addClass("box-lost");
			this.$.home.show();
			this.$.restart.show();
		}
	},
	
	// Resume game
	play: function() {
		// Show cards
		enyo.forEach(this.$.gamebox.getControls(), function(card) {
			card.show();
		});
		
		// Show pause button, hide play button
		this.$.timer.resume();
		this.$.play.hide();		
		this.$.pause.show();
		this.$.home.hide();
	},
	
	// Pause game
	pause: function() {
		// Hide cards
		enyo.forEach(this.$.gamebox.getControls(), function(card) {
			card.hide();
		});
		
		// Show play button, hide pause button
		this.$.timer.pause();
		this.$.pause.hide();
		this.$.play.show();
		this.$.home.show();
	},
	
	restart: function() {
		console.log("restarted");
	},
	
	next: function() {
		console.log("next");
	},
	
	home: function() {
		console.log("home");
	}
});
