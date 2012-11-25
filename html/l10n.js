// Localization API

// Default strings
__$FC_l10n_default = {
	"sounddir": "en",
	"learn": "Learn",
	"build": "Build",
	"play": "Play",
	"learndesc": "Set cards in the right box to learn what sort of food each animal eat.",
	"builddesc": "Set cards in the right order to build the right food chain.",
	"playdesc": "Play the food chain: eat and avoid being eaten.",
	"level": "Level",
	"score": "Score:",
	"concept": "concept & code:",
	"arts": "arts:",
	"music": "music:",
	"sound": "sound effects:",	 
	"alligator": "Alligator",
	"animal": "Animal",
	"bat": "Bat",
	"bee": "Bee",
	"bird": "Bird",
	"camel": "Camel",
	"cat": "Cat",
	"chicken": "Chicken",
	"chimp": "Chimp",
	"clam": "Clam",
	"corn": "Corn",
	"cow": "Cow",
	"crab": "Crab",
	"crocodile": "Crocodile",
	"crow": "Crow",
	"dog": "Dog",
	"duck": "Duck",
	"fish": "Fish",
	"flies": "Flies",
	"fox": "Fox",
	"frog": "Frog",
	"giraffe": "Giraffe",
	"goat": "Goat",
	"grass": "Grass",
	"hay": "Hay",
	"hen": "Hen",
	"lamb": "Lamb",
	"mice": "Mice",
	"mole": "Mole",
	"mosquito": "Mosquito",
	"mule": "Mule",
	"owl": "Owl",
	"ox": "Ox",
	"pig": "Pig",
	"rat": "Rat",
	"shark": "Shark",
	"shrimp": "Shrimp",
	"skunk": "Skunk",
	"snail": "Snail",
	"snake": "Snake",
	"spider": "Spider",
	"spike": "Spike",
	"squid": "Squid",
	"squirrel": "Squirrel",
	"starfish": "Starfish",
	"swan": "Swan",
	"tick": "Tick",
	"wheat": "Wheat",
	"herbivore": "Herbivore",
	"carnivore": "Carnivore",
	"omnivore": "Omnivore"
};


// Change current language setting
__$FC_l10n = __$FC_l10n_default;
__$FC_l10n_set = function(dict) {
	__$FC_l10n = dict;
}

// Localization function
__$FC = function(str) {
	// Look in dictionnary
	var value = __$FC_l10n[str];
	if (value != undefined)
		return value.replace("%27", "'").replace("%22", '"');
	return str;
}