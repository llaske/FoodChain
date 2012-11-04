// Level config
FoodChain.playLevels = [
	{ flies: 1, rocks: 2, snake: 0, time: 40 },   // Level 1
	{ flies: 2, rocks: 4, snake: 0, time: 60 },   // Level 2
	{ flies: 3, rocks: 5, snake: 0, time: 90 },   // Level 3
	{ flies: 3, rocks: 5, snake: 1, time: 120 },  // Level 4
	{ flies: 4, rocks: 6, snake: 1, time: 180 },  // Level 5
	{ flies: 4, rocks: 6, snake: 2, time: 170 },  // Level 6
	
];


// Learn Game class
enyo.kind({
	name: "FoodChain.PlayGame",
	kind: enyo.Control,
	published: {level: 1},
	classes: "board",
	components: [
		{ name: "cards", components: [
			// Level - Score - Time bar
			{ components: [
				{ content: "Level", classes: "title level-value" },
				{ name: "level", content: "0", classes: "title level-value" },
				{ content: "Score:", classes: "title score" },
				{ name: "score", content: "0000", classes: "title score-value" },
				{ name: "timercount", content: "0:0,0", classes: "title timer-value" }				
			]},			
			{ name: "timer", kind: "Timer", onTriggered: "updateTimer" },
			
			// Playing zone
			{ classes: "game-box", components: [
				{kind: "Canvas", name: "canvas", attributes: {width: 1174, height: 600}}
			]},
			
			// Buttons bar
			{ name: "play", kind: "ShadowButton", img: "play", classes: "play", ontap: "play" },	
			{ name: "pause", kind: "ShadowButton", img: "pause", classes: "play", ontap: "pause" },	
			{ name: "forward", kind: "ShadowButton", img: "forward", classes: "restart", ontap: "next" },
			{ name: "home", kind: "ShadowButton", img: "home", classes: "home", ontap: "home" },

			// End of sound event
			{kind: "Signals", onEndOfSound: "endSound", onkeypress: "keyPressed"},
			
			// Preload of all image game
			{kind: "Image", id: "frog1", src:"images/frog1.png", classes: "image-preload", onload: "initGame" },
			{kind: "Image", id: "frog2", src:"images/frog2.png", classes: "image-preload" },
			{kind: "Image", id: "frog3", src:"images/frog3.png", classes: "image-preload" },
			{kind: "Image", id: "frog4", src:"images/frog4.png", classes: "image-preload" },
			{kind: "Image", id: "frog5", src:"images/frog5.png", classes: "image-preload" },
			{kind: "Image", id: "frog6", src:"images/frog6.png", classes: "image-preload" },
			{kind: "Image", id: "frog7", src:"images/frog7.png", classes: "image-preload" },
			{kind: "Image", id: "frog8", src:"images/frog8.png", classes: "image-preload" },					
			{kind: "Image", id: "fly1", src:"images/fly1.png", classes: "image-preload" },
			{kind: "Image", id: "fly2", src:"images/fly2.png", classes: "image-preload" },
			{kind: "Image", id: "rock", src:"images/rock.png", classes: "image-preload" }
		]}		
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.cardlist = null;
		this.nextaction = 0;
		this.levelChanged();
	},
	
	// Level changed, init board then start game
	levelChanged: function() {
	
		// TODO
		
		// Init frog
		this.frog = new Sprite({
			x: 70, y: 280, heading: 90, images: ["frog1", "frog2", "frog3", "frog4", "frog5", "frog6", "frog7", "frog8"],
			width: 116, height: 172, index: 0, sound: "audio/frog"
		});
		this.frog.alive = true;
		
		// Set randomely rocks
		this.rocks = [];
		for(var i = 0 ; i < FoodChain.playLevels[this.level-1].rocks ; i++) {
			var x = 100+Math.floor(Math.random()*900);
			var y = 100+Math.floor(Math.random()*400);
			var h = Math.floor(Math.random()*4)*90;
			this.rocks.push(new Sprite({
				x: x, y: y, heading: h, images: ["rock"], width: 115, height: 104, index: 0
			}));
		}
		
		// Button handling
		this.$.play.hide();
		this.$.pause.show();
		this.$.forward.hide();
		this.$.home.hide();
		
		// Timer and level init
		this.$.level.setContent(" "+this.level);
		this.timecount = {mins:0, secs:0, tenth:0};
		this.$.timercount.removeClass("timer-overtime");
		this.displayTimer();
		this.$.timer.pause();
	},
	
	// Image loaded, start displaying game
	initGame: function() {
		this.ctx = this.$.canvas.node.getContext('2d');	
		
		// Draw rocks
		for(var i = 0 ; i < FoodChain.playLevels[this.level-1].rocks ; i++) {
			this.rocks[i].draw(this.ctx);
		}
		
		// Draw frog
		this.frog.draw(this.ctx);
	},
	
	// A key was pressed
	keyPressed: function(s,e) {
		var key = e.charCode;
		
		// Frog is dead
		if (!this.frog.alive)
			return;
		
		// Compute asked direction
		var newdir;
		var dx = 0, dy = 0;
		if (key == 107 || key == 75) {
			newHeading = 0; dx = 1;
		} else if (key == 105 || key == 73) {
			newHeading = 90; dy = -1;
		} else if (key == 106 || key == 74) {
			newHeading = 180; dx = -1;
		} else if (key == 108 || key == 76) {
			newHeading = 270; dy = 1;
		} else {
			FoodChain.log("key pressed: " + key);		
			return;
		}
		
		// Change position and/or heading
		this.frog.unDraw(this.ctx);		
		if (newHeading != this.frog.getHeading()) {
			this.frog.playSound();
			this.frog.setHeading(newHeading);
			this.frog.firstImage();
		} else {
			this.frog.setX(this.frog.getX() + (dx*10));
			this.frog.setY(this.frog.getY() + (dy*10));
			this.frog.nextImage(6);
		}
		this.frog.draw(this.ctx);
		
		// Test if not collide with a rock
		for(var i = 0 ; i < FoodChain.playLevels[this.level-1].rocks ; i++) {
			if (this.frog.intersect(this.rocks[i])) {
				// Yes, frog is dead
				this.frog.unDraw(this.ctx);			
				this.frog.useImage(7);
				FoodChain.sound.play("audio/disappointed");
				this.frog.draw(this.ctx);
				this.rocks[i].draw(this.ctx);
				this.frog.alive = false;
				break;
			}
		}
	},
	
	// Sound ended, start game
	endSound: function(e, s) {

		// TODO
		
		// Start timer
		this.$.timer.pause();
		this.$.timer.start();
		this.$.timer.resume();		
	},
	
	// Display timer value
	displayTimer: function() {
		this.$.timercount.setContent(this.timecount.mins+":"+String("00"+this.timecount.secs).slice(-2)+","+this.timecount.tenth);
	},
	
	// Update timer
	updateTimer: function(s, e) {
		this.timecount.tenth = this.timecount.tenth + 1;
		if (this.timecount.tenth == 10) {
			this.timecount.tenth = 0;
			this.timecount.secs = this.timecount.secs + 1;
			var currentcount = this.timecount.mins * 60 + this.timecount.secs;
			if (currentcount >= FoodChain.playLevels[this.level-1].time) {
				this.$.timercount.addClass("timer-overtime");
			}
			if (this.timecount.secs == 60) {
				this.timecount.secs = 0;
				this.timecount.mins = this.timecount.mins + 1;
			}
		}
		this.displayTimer();
	},
	
	// Compute score
	addScore: function(score) {
		FoodChain.context.score += score;
		this.$.score.setContent(String("0000"+FoodChain.context.score).slice(-4));
	},
	
	// Compute score for this level
	computeLevelScore: function() {
		var score = 0;
		var currentcount = this.timecount.mins * 60 + this.timecount.secs;
		if (currentcount < FoodChain.playLevels[this.level-1].time) {
			score += (FoodChain.playLevels[this.level-1].time - currentcount);
		}
		this.addScore(score);
	},	
	
	// Resume game
	play: function() {
		// TODO
		
		// Show pause button, hide play button
		this.$.timer.resume();
		this.$.play.hide();		
		this.$.pause.show();
		this.$.home.hide();
	},
	
	// Pause game
	pause: function() {
		// TODO
		
		// Show play button, hide pause button
		this.$.timer.pause();
		this.$.pause.hide();
		this.$.play.show();
		this.$.home.show();
	},
	
	// Go to the next level
	next: function() {
		this.level = this.level + 1;
		this.levelChanged();
	},
	
	// Go to the home page of the app
	home: function() {
		FoodChain.goHome();
	}
});
