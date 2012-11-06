// Utility functions


// Force Enyo to process ondragover event
document.ondragover = enyo.dispatch;


// Game context
FoodChain.context = {
	// Current score
	score: 0
};

// Home handling
FoodChain.goHome = function() {
	if (FoodChain.context.home != null)
		FoodChain.context.home.renderInto(document.getElementById("body"));
};

// Sugar interface
FoodChain.sugar = new Sugar();
FoodChain.log = function(msg) {
	FoodChain.sugar.sendMessage("console-message", msg);
	console.log(msg);
}

// Return a string with first letter to upper case
FoodChain.firstLetterCase = function(name) {
	return name.substring(0,1).toUpperCase()+name.substring(1);
}

// Add and remove a class to an element
FoodChain.addRemoveClass = function(element, toAdd, toRemove) {
	element.removeClass(toRemove);
	element.addClass(toAdd);
}

// "Old style" sleep function
FoodChain.sleep = function(delay) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
}

// Create a object respecting a condition on a set of object
FoodChain.createWithCondition = function(create, condition, set) {
	var conditionValue;
	var newObject;
	var time = 0;
	do {
		conditionValue = true;
		newObject = create();
		for (var i = 0; conditionValue && i < set.length ; i++) {
			conditionValue = condition(newObject, set[i]);
		}
		time++;
	} while (!conditionValue && time < 12); // time is need to avoid infinite or too long loop
	if (!conditionValue)
		FoodChain.log("WARNING: out of pre-requisite creating "+newObject.id);
	return newObject;
}