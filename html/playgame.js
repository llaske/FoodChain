// Level config
FoodChain.playLevels = [
	{ flies: 2, rocks: 2, snake: 0, time: 30 },   // Level 1
	{ flies: 2, rocks: 3, snake: 0, time: 40 },   // Level 2
	{ flies: 3, rocks: 3, snake: 0, time: 60 },   // Level 3
	{ flies: 3, rocks: 3, snake: 1, time: 90 },   // Level 4
	{ flies: 4, rocks: 4, snake: 1, time: 120 },  // Level 5
	{ flies: 4, rocks: 4, snake: 2, time: 140 },  // Level 6
	
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
				{ name: "lifes", classes: "life life-border", components: [
					{ kind: "Image", classes: "life", src:"images/frog9.png" },
					{ kind: "Image", classes: "life", src:"images/frog9.png" },
					{ kind: "Image", classes: "life", src:"images/frog9.png" }
				]},
				{ name: "timercount", content: "0:0,0", classes: "title timer-value" }				
			]},			
			{ name: "timer", kind: "Timer", paused: true, onTriggered: "updateTimer" },
			
			// Playing zone
			{ classes: "game-box", components: [
				{kind: "Canvas", name: "canvas", attributes: {width: 1174, height: 600}}
			]},
			{ name: "ia-timer", kind: "Timer", baseInterval: 500, onTriggered: "fliesEngine" },
			
			// Buttons bar
			{ name: "play", kind: "ShadowButton", img: "play", classes: "play", ontap: "play" },	
			{ name: "pause", kind: "ShadowButton", img: "pause", classes: "play", ontap: "pause" },	
			{ name: "forward", kind: "ShadowButton", img: "forward", classes: "restart", ontap: "next" },
			{ name: "home", kind: "ShadowButton", img: "home", classes: "home", ontap: "home" },

			// End of sound event
			{kind: "Signals", onEndOfSound: "endSound", onkeypress: "keyPressed"},
			
			// Preload of all images for the game
			{kind: "Image", id: "frog1", src:"images/frog1.png", classes: "image-preload", onload: "initGame" },
			{kind: "Image", id: "frog2", src:"images/frog2.png", classes: "image-preload" },
			{kind: "Image", id: "frog3", src:"images/frog3.png", classes: "image-preload" },
			{kind: "Image", id: "frog4", src:"images/frog4.png", classes: "image-preload" },
			{kind: "Image", id: "frog5", src:"images/frog5.png", classes: "image-preload" },
			{kind: "Image", id: "frog6", src:"images/frog6.png", classes: "image-preload" },
			{kind: "Image", id: "frog7", src:"images/frog7.png", classes: "image-preload" },
			{kind: "Image", id: "frog8", src:"images/frog8.png", classes: "image-preload" },					
			{kind: "Image", id: "frog9", src:"images/frog9.png", classes: "image-preload" },
			{kind: "Image", id: "fly1", src:"images/fly1.png", classes: "image-preload" },
			{kind: "Image", id: "fly2", src:"images/fly2.png", classes: "image-preload" },
			{kind: "Image", id: "rock", src:"images/rock.png", classes: "image-preload" }
		]}		
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.nextaction = 0;
		this.life = 3;
		this.levelChanged();
	},
	
	// Level changed, init board then start game
	levelChanged: function() {

		// Init frog
		this.frog = new Sprite({
			x: 70, y: 280, heading: 0, images: ["frog1", "frog2", "frog3", "frog4", "frog5", "frog6", "frog7", "frog8", "frog9"],
			width: 116, height: 172, index: 0, sound: "audio/frog"
		});
		this.frog.alive = true;
		
		// Set randomely rocks
		this.rocks = [];
		for(var i = 0 ; i < FoodChain.playLevels[this.level-1].rocks ; i++) {
			// Ensure distance between blocks and between block and frog is sufficient
			var distance, x, y, h;
			do {
				distance = 1000;
				x = 100+Math.floor(Math.random()*900);
				y = 100+Math.floor(Math.random()*400);
				h = Math.floor(Math.random()*4)*90;
				distance = Math.min(this.frog.distance({x: x, y: y}), distance);				
				for (var j = 0 ; i > 0 && j < i ; j++ ) {
					distance = Math.min(this.rocks[j].distance({x: x, y: y}), distance);
				}			
			} while (distance < 200)
			
			// Create the new rock
			this.rocks.push(new Sprite({
				x: x, y: y, heading: h, images: ["rock"], width: 115, height: 104, index: 0
			}));
		}
		
		// Set randomely flies
		this.flies = [];
		for(var i = 0 ; i < FoodChain.playLevels[this.level-1].flies ; i++) {
			// Ensure not on a rock or on the frog
			var alone, x, y, h, fly;
			do {
				x = 100+Math.floor(Math.random()*900);
				y = 100+Math.floor(Math.random()*400);
				h = Math.floor(Math.random()*4)*90;
				fly = new Sprite({
					x: x, y: y, heading: h, images: ["fly1", "fly2"], width: 58, height: 86, index: 0, sound: "audio/flies"
				});
				alone = !fly.intersect(this.frog);
				for (var j = 0 ; alone && j < this.rocks.length ; j++ ) {
					alone = !fly.intersect(this.rocks[j]);
				}			
			} while (!alone)
			
			// Create the new fly
			fly.alive = true;
			this.flies.push(fly);
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
	},
	
	// Image loaded, start displaying game
	initGame: function() {
		this.ctx = this.$.canvas.node.getContext('2d');	
		this.ctx.clearRect(0, 0, this.$.canvas.attributes.width, this.$.canvas.attributes.height);		
		
		// Draw rocks
		for(var i = 0 ; i < this.rocks.length ; i++) {
			this.rocks[i].draw(this.ctx);
		}
		
		// Draw frog
		this.frog.draw(this.ctx);
		
		// Draw flies
		for(var i = 0 ; i < this.flies.length ; i++) {
			this.flies[i].draw(this.ctx);
		}	

		// Start timer
		this.$.timer.resume();
	},
	
	// A key was pressed
	keyPressed: function(s,e) {
		var key = e.charCode;
		
		// Game paused
		if (this.$.timer.paused)
			return;
			
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
		
		// Move frog
		this.frog.unDraw(this.ctx);		
		if (newHeading != this.frog.getHeading()) {
			// Just change heading
			this.frog.playSound();
			this.frog.setHeading(newHeading);
			this.frog.firstImage();
		} else {
			// Move frog
			this.frog.animate(this.ctx, [1, 2, 3, 4, 5, 6, 0], dx*10, dy*10, enyo.bind(this, "frogEngine"));
		}
		this.frog.draw(this.ctx);
	},
	
	// Frog engine: test collition between frog and other sprites
	frogEngine: function() {		
		// Test if not collide with a rock
		for(var i = 0 ; i < this.rocks.length ; i++) {
			if (this.frog.intersect(this.rocks[i])) {
				// Yes, frog is dead
				this.frog.unDraw(this.ctx);			
				this.frog.useImage(7);
				this.frog.draw(this.ctx);
				this.rocks[i].draw(this.ctx);
				this.frog.alive = false;
				this.testEndOfGame();
				return false;
			}
		}
		
		// Test if eat a fly
		for(var i = 0 ; i < this.flies.length ; i++) {
			if (this.flies[i].alive && this.frog.intersect(this.flies[i])) {
				// Yes, flies is dead
				this.flies[i].unDraw(this.ctx);
				this.flies[i].alive = false;
				
				// Animate the happy frog, score and test for next level
				this.frog.playSound();
				this.addScore(1);				
				return !this.testEndOfGame();
			}
		}
		
		// Test if out of playboard
		if (this.frog.getX() <= this.frog.width/2 || this.frog.getX() >= this.$.canvas.attributes.width-this.frog.width/2 ||
			this.frog.getY() <= this.frog.height/2 || this.frog.getY() >= this.$.canvas.attributes.height-this.frog.height/2) {
			// Yes, replace it on the limit
			this.frog.setX(Math.max(this.frog.width/2+1, this.frog.getX()));
			this.frog.setX(Math.min(this.$.canvas.attributes.width-this.frog.width/2-1, this.frog.getX()));
			this.frog.setY(Math.max(this.frog.height/2+1, this.frog.getY()));
			this.frog.setY(Math.min(this.$.canvas.attributes.height-this.frog.height/2-1, this.frog.getY()));
			this.frog.unDraw(this.ctx);			
			this.frog.firstImage();
			this.frog.draw(this.ctx);		
			this.frog.playSound();
			return false;
		}
		
		return true;
	},
	
	// Flies engine move and sound periodically
	fliesEngine: function() {		
		// Game paused
		if (this.$.timer.paused)
			return;
	
		// For each fly
		for(var i = 0 ; i < this.flies.length ; i++) {
			// Dead fly, nothing to do
			if (!this.flies[i].alive)
				continue;
				
			// Randomly decide what to do
			var n = Math.floor(Math.random()*10);
			
			// Move the fly
			if (n == 1) {
				// Ensure not on a rock or on the frog
				var alone, x, y, h;
				do {
					x = 100+Math.floor(Math.random()*900);
					y = 100+Math.floor(Math.random()*400);
					h = Math.floor(Math.random()*4)*90;
					var dummyfly = new Sprite({ x: x, y: y, heading: h, width: 58, height: 86 });
					alone = !dummyfly.intersect(this.frog);
					for (var j = 0 ; alone && j < this.rocks.length ; j++ ) {
						alone = !dummyfly.intersect(this.rocks[j]);
					}	
					for (var j = 0 ; alone && j < this.flies.length ; j++ ) {
						if (!this.flies[j].alive) continue;
						alone = !dummyfly.intersect(this.flies[j]);
					}					
				} while (!alone)
				
				// Redraw
				this.flies[i].unDraw(this.ctx);
				this.flies[i].setX(x);
				this.flies[i].setY(y);
				this.flies[i].setHeading(h);
				this.flies[i].draw(this.ctx);
				this.flies[i].playSound();
			
			// Just animate
			} else if (n <= 4) {
				this.flies[i].animate(this.ctx, [0, 1, 0, 1, 0, 1], 0, 0, enyo.bind(this, "testFlyDead"));			
			}
		}
	},

	// Use to force end of fly animation if fly is dead
	testFlyDead: function(fly) {
		if (!fly.alive) {
			fly.unDraw(this.ctx);
			return false;
		}
	},
	
	// Test end of game
	testEndOfGame: function() {
		// Frog is dead
		if (!this.frog.alive) {
			// Delete a life
			this.life--;		
			this.$.lifes.getControls()[this.life].hide();
			FoodChain.sound.play("audio/disappointed");
			
			// Is it last life ?
			if (this.life > 0) {
				// No, next frog
				this.nextaction = 1;
			} else {
				// Yes
				this.$.pause.hide();
				this.$.home.show();
			}
		}
		
		// Frog is alive: last fly eaten ?
		else {
			// Count living fly
			var flies = 0;
			for(var i = 0 ; i < this.flies.length ; i++) {
				if (this.flies[i].alive) flies++;
			}
			
			// Not the last, continue
			if (flies > 0)
				return false;

			// Show happy frog
			this.frog.unDraw(this.ctx);
			this.frog.setX(this.frog.getX()+50);
			this.frog.setY(this.frog.getY()+50);
			this.frog.useImage(8);
			this.frog.setHeading(90);
			this.frog.draw(this.ctx);
			
			// No more, go to next level
			this.$.timer.pause();
			this.computeLevelScore();
			this.$.play.hide();
			this.$.pause.hide();				
			this.$.home.show();
			if (this.level != FoodChain.playLevels.length)
				this.$.forward.show();

			return true;
		}
	},
	
	// Sound ended
	endSound: function(e, s) {	
	
		// Next life
		if (this.nextaction == 1) {
			this.nextaction = 0;
			this.frog.unDraw(this.ctx);
			this.frog.setX(70);
			this.frog.setY(280);
			this.frog.setHeading(0);
			this.frog.useImage(0);
			this.frog.draw(this.ctx);
			this.frog.alive = true;
			return;
		}
		
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
		this.$.timer.resume();
		this.$.play.hide();		
		this.$.pause.show();
		this.$.home.hide();
	},
	
	// Pause game
	pause: function() {
		this.$.timer.pause();
		this.$.pause.hide();
		this.$.play.show();
		this.$.home.show();
	},
	
	// Go to the next level
	next: function() {
		this.level = this.level + 1;
		this.levelChanged();
		this.initGame();
	},
	
	// Go to the home page of the app
	home: function() {
		FoodChain.goHome();
	}
});
