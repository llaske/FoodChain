// Force Enyo to process ondragover event
document.ondragover = enyo.dispatch;

// Context
FoodChain.context = {
	// Current score
	score: 0
};

// Home handling
FoodChain.goHome = function() {
	if (FoodChain.context.home != null)
		FoodChain.context.home.renderInto(document.body);
};


// Main app class
enyo.kind({
	name: "FoodChain.App",
	kind: enyo.Control,
	classes: "board",
	components: [
		// Display card timer
		{ name: "timer", kind: "Timer", baseInterval: 500, onTriggered: "displayCard" },
		
		// Card box
		{ name: "glass", classes: "glass" },
		{ name: "cardbox", classes: "cardbox", components: [] },
		
		// Logo
		{ kind: "Image", src: "images/FoodChain.png", classes: "logo" },
		
		// Game button
		{ name: "one", kind: "ShadowButton", img: "one", classes: "game-one", ontap: "playGame", onenter: "showGameDescription", onleave: "hideGameDescription" },
		{ name: "two", kind: "ShadowButton", img: "two", classes: "game-two", ontap: "playGame", onenter: "showGameDescription", onleave: "hideGameDescription" },
		{ name: "three", kind: "ShadowButton", img: "three", classes: "game-three", ontap: "playGame", onenter: "showGameDescription", onleave: "hideGameDescription" },
		
		// Popup for game title and description
		{ name: "popup", classes: "game-popup", components: [
			{ name: "title", classes: "game-title" },
			{ name: "description", classes: "game-description" }
		]},
		
		// Sound track
		{ name: "soundtrack", kind: "HTML5.Audio", src: ["audio/popcorn.mp3", "audio/popcorn.ogg"], preload: "auto", autobuffer: true, controlsbar: false, loop: true }		
	],
	
	// Constructor, save home
	create: function() {
		this.inherited(arguments);
		FoodChain.context.home = this;
		
		// Start display card timer
		this.cardcount = 0;
		this.$.timer.start();	
		
		// Create game description
		this.$.popup.hide();
		this.games = [];
		this.games["one"] = { title: "Learn (coming soon)", description: "Set cards in the right box to learn what sort of food eat each animals." };
		this.games["two"] = { title: "Build", description: "Set cards in the right order to build the right food chain." };
		this.games["three"] = { title: "Play (coming soon)", description: "Play the food chain: eat and avoid being eaten." };
	},

	rendered: function() {
		this.inherited(arguments);
		this.$.soundtrack.play();
	},
	
	// Display card animation
	displayCard: function() {
		// All cards displayed
		if (this.cardcount == FoodChain.cards.length)
			return;
		
		// Display a new card
		var x = Math.floor(Math.random()*1000);
		var y = Math.floor(Math.random()*400)
		this.$.cardbox.createComponent({ kind: "FoodChain.Card", cardname: FoodChain.cards[this.cardcount], x: x, y: y, z: 0});	
		this.$.cardbox.render();
		this.cardcount = this.cardcount + 1;
	},
	
	// Show/hide game description
	showGameDescription: function(s) {
		this.$.title.setContent(this.games[s.name].title+":");
		this.$.title.addClass("game-color-"+s.name);
		this.$.description.setContent(this.games[s.name].description);
		this.$.description.addClass("game-color-"+s.name);
		this.$.popup.show();
	},
	
	hideGameDescription: function(s) {
		this.$.title.removeClass("game-color-"+s.name);	
		this.$.description.removeClass("game-color-"+s.name);		
		this.$.popup.hide();
	},
	
	// Launch a game
	playGame: function(s) {
		this.$.popup.hide();
		
		// Launch Build game
		if (s.name == "two")
			new FoodChain.BuildGame({level: 1}).renderInto(document.body);
	}
});
