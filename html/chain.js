// Cards lists
FoodChain.cards = [
	"alligator", "animal", "bat", "bee", "bird", "camel", "cat", "chicken", "chimp",
	"clam", "corn", "cow", "crab", "crocodile", "crow", "dog", "duck", "fish", "flies",
	"fox", "frog", "giraffe", "goat", "grass", "hay", "hen", "lamb", "mice", "mole",
	"mule", "owl", "ox", "pig", "rat", "shark", "shrimp", "skunk", "snail", "snake",
	"spider", "spike", "squid", "squirrel", "starfish", "swan", "tick", "wheat"
];


// Chains computation
FoodChain.validChains = [
	["snake", "mice", "corn"],
	["cat", "mice", "corn"],
	["fox", "bird", "spider", "flies"],
	["fox", "duck", "frog", "flies"],
	["snake", "frog", "flies"],
	["fox", "duck", "frog", "snail", "grass"],
	["spike", "spider", "flies"],
	["shark", "fish", "shrimp"],
	["owl", "bat", "flies"],
	["cat", "bat", "flies"],
	["fox", "hen", "corn"],
	["fox", "chicken", "corn"],
	["cow", "grass"],
	["starfish", "clam"],
	["frog", "snail", "grass"],
	["skunk", "rat", "snail", "grass"],
	["skunk", "mice", "snail", "grass"],
	["spike", "snail", "grass"],
	["crow", "snail", "grass"],
	["duck", "snail", "grass"],
	["starfish", "crab"]
];

// Create a random foodchain for the specified size
FoodChain.randomChain = function(size) {
	// Check size
	if (size == undefined || size < 2) {
		size = 3;
	}
	
	// Look for chains for this size
	var chains = [];
	for(var i in FoodChain.validChains) {
		// Too small
		var c = FoodChain.validChains[i];
		if (c.length < size)
			continue;
			
		// Just the right size
		if (c.length == size) {
			chains.push(c);
			continue;
		}
		
		// Too long, compute randomly a subchain
		var index = Math.floor(Math.random()*(c.length-size));
		var newchain = [];
		for (var j = index; j < index+size ; j++) {
			newchain.push(c[j]);
		}
		chains.push(newchain);
	}
	
	// Randomly choose a chain
	return chains[Math.floor(Math.random()*chains.length)];
};


// Mix a chain
FoodChain.mix = function(chain) {
	// Check size
	if (chain.length < 2) {
		return chain;
	}
	
	// Mix cards
	var mixedchain = [];
	var tomix = enyo.cloneArray(chain);
	while (tomix.length != 1) {
		// Take a card
		var i = Math.floor(Math.random()*tomix.length);
		mixedchain.push(tomix[i]);
		tomix[i] = null;
		
		// Remix
		var newmix = [];
		for (var j = 0 ; j < tomix.length ; j++) {
			if (tomix[j] != null)
				newmix.push(tomix[j]);
		}
		tomix = newmix;
	}
	mixedchain.push(tomix[0]);
	
	return mixedchain;
};