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
			
			{ name: "validate", kind: "Image", src: "images/validate.svg", classes: "validate", onenter: "showValidateShadow", onleave: "hideValidateShadow", ontap: "controlOrder" },
			{ name: "validateshadow", kind: "Image", src: "images/validate_shadow.svg", classes: "validateshadow" },
			{ name: "play", kind: "Image", src: "images/play.svg", classes: "play", onenter: "showPlayShadow", onleave: "hidePlayShadow", ontap: "play" },	
			{ name: "playshadow", kind: "Image", src: "images/play_shadow.svg", classes: "playshadow" },
			{ name: "pause", kind: "Image", src: "images/pause.svg", classes: "play", onenter: "showPauseShadow", onleave: "hidePauseShadow", ontap: "pause" },	
			{ name: "pauseshadow", kind: "Image", src: "images/pause_shadow.svg", classes: "playshadow" },

			
			{ classes: "footer", components: [
				{ content: "Images and sounds CC BY-SA from", classes: "licence" },
				{ tag: "a", attributes: {"href":"http://art4apps.org/"}, content: "Art4Apps", classes: "licence" }
			]}
		]}		
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		
		// Create cards
		this.$.gamebox.createComponent({ kind: "FoodChain.Card", cardname: "fish", x: 50, y: 50, ontap: "taped", ondragstart: "dragstart", ondragfinish: "dragfinish" }, {owner: this});
		this.$.gamebox.createComponent({ kind: "FoodChain.Card", cardname: "alligator", x: 300, y: 100, ontap: "taped", ondragstart: "dragstart", ondragfinish: "dragfinish" }, {owner: this});
		this.$.gamebox.createComponent({ kind: "FoodChain.Card", cardname: "shrimp", x: 500, y: 150, ontap: "taped", ondragstart: "dragstart", ondragfinish: "dragfinish" }, {owner: this});		
		this.$.gamebox.createComponent({ kind: "FoodChain.Card", cardname: "spider", x: 700, y: 200, ontap: "taped", ondragstart: "dragstart", ondragfinish: "dragfinish" }, {owner: this});				
		
		// Box handling
		this.dragobject = null;
		this.zmax = 0;	

		// Button handling
		this.$.validateshadow.hide();
		this.$.pauseshadow.hide();
		this.$.play.hide();
		this.$.playshadow.hide();
		
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
		s.play();
		this.dragobject = s;
		this.dragx = e.clientX-s.x;
		this.dragy = e.clientY-s.y;
		this.toTop(this.dragobject);
	},
	
	// Card drag end, change style to not dragged
	dragfinish: function(s, e) {
		s.removeClass("card-dragged");
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

	// Show/Hide shadow
	showValidateShadow: function() {
		this.$.validateshadow.show();
	},

	hideValidateShadow: function() {
		this.$.validateshadow.hide();
	},

	showPlayShadow: function() {
		this.$.playshadow.show();
	},

	hidePlayShadow: function() {
		this.$.playshadow.hide();
	},
	
	showPauseShadow: function() {
		this.$.pauseshadow.show();
	},

	hidePauseShadow: function() {
		this.$.pauseshadow.hide();
	},
	
	// Validate cards order
	controlOrder: function() {
		console.log(this.$.gamebox.getControls());
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
		this.$.playshadow.hide();		
		this.$.pause.show();
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
		this.$.pauseshadow.hide();
		this.$.play.show();
	}
});
