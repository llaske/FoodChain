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
		{ kind: "ShadowButton", img: "one", classes: "game-one", ontap: "" },
		{ kind: "ShadowButton", img: "two", classes: "game-two", ontap: "startBuildGame" },
		{ kind: "ShadowButton", img: "three", classes: "game-three", ontap: "" }	
	],
	
	// Constructor, save home
	create: function() {
		this.inherited(arguments);
		FoodChain.context.home = this;
	},
	
	// Launch the "Build" game
	startBuildGame: function() {
		new FoodChain.BuildGame({level: 1}).renderInto(document.body);
	}
});
