

// Main app class
enyo.kind({
	name: "FoodChain.App",
	kind: enyo.Control,
	classes: "board",
	components: [		
		// Card box
		{ name: "glass", classes: "glass" },
		{ name: "cardbox", classes: "cardbox", components: [] },
		
		// Logo
		{ kind: "Image", src: "images/FoodChain.png", classes: "logo" },
		
		// Game button
		{ name: "one", kind: "ShadowButton", img: "one", classes: "game-one", ontap: "playGame", onenter: "showGameDescription", onleave: "hideGameDescription" },
		{ name: "two", kind: "ShadowButton", img: "two", classes: "game-two", ontap: "playGame", onenter: "showGameDescription", onleave: "hideGameDescription" },
		{ name: "three", kind: "ShadowButton", img: "three", classes: "game-three", ontap: "playGame", onenter: "showGameDescription", onleave: "hideGameDescription" },
		{ kind: "ShadowButton", img: "information", classes: "information", ontap: "showCredits" },
		
		// Popup for game title and description
		{ name: "popup", classes: "game-popup", components: [
			{ name: "title", classes: "game-title" },
			{ name: "description", classes: "game-description" }
		]},
		
		// End of sound event
		{kind: "Signals", onEndOfSound: "endOfSound"}
	],
	
	// Constructor, save home
	create: function() {
		this.inherited(arguments);
		FoodChain.context.home = this;
	
		// Start display card timer
		this.initCardStack();
		
		// Create game description
		this.$.popup.hide();
		this.games = [];
		this.games["one"] = { title: "Learn", description: "Set cards in the right box to learn what sort of food each animal eat." };
		this.games["two"] = { title: "Build", description: "Set cards in the right order to build the right food chain." };
		this.games["three"] = { title: "Play", description: "Play the food chain: eat and avoid being eaten." };
		
		// Init soundtrack
		this.soundtrack = "audio/popcorn";
	},
	
	// Init card stack for the animation
	initCardStack: function() {
		// Pick randomly N cards
		this.cardcount = 0;
		this.cards = [];
		for (var i = 0 ; i < 12 ; i++) {
			var index = Math.floor(Math.random()*FoodChain.cards.length); 
			this.cards.push(FoodChain.cards[index]);
		}
	},
	
	// Play soundtrack when rendered and restart at end
	rendered: function() {
		// Play soundtrack
		FoodChain.sound.play(this.soundtrack);
		
		// Create timer for card animation
		this.createComponent({ name: "timer", kind: "Timer", baseInterval: 1200, onTriggered: "displayCard" }, {owner: this});		
	},
	
	endOfSound: function(e, s) {
		if (s == this.soundtrack)
			FoodChain.sound.play(this.soundtrack);
	},
	
	// Display card animation
	displayCard: function() {	
		// All cards displayed
		if (this.cardcount == this.cards.length) {
			this.$.cardbox.destroyComponents();
			this.$.cardbox.render();
			this.initCardStack();
			return;
		}
		
		// Display a new card
		var x = Math.floor(Math.random()*1000);
		var y = Math.floor(Math.random()*400);
		this.$.cardbox.createComponent({ kind: "FoodChain.Card", cardname: this.cards[this.cardcount], x: x, y: y, z: 0}).render();
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
	
	// Show credit page
	showCredits: function() {
		new FoodChain.Credits().renderInto(document.getElementById("body"));	
	},
	
	// Launch a game
	playGame: function(s) {
		// Stop sound
		this.$.popup.hide();
		FoodChain.sound.pause();
		this.$.timer.stop();
		this.removeComponent(this.$.timer);
		
		// Launch Learn game
		if (s.name == "one") {
			new FoodChain.LearnGame({level: 1}).renderInto(document.getElementById("body"));
		}
		
		// Launch Build game
		else if (s.name == "two") {
			new FoodChain.BuildGame({level: 1}).renderInto(document.getElementById("body"));
		}
		
		// Launch Play game
		else if (s.name == "three") {
			new FoodChain.PlayGame({level: 1}).renderInto(document.getElementById("body"));
		}		
	}
});
