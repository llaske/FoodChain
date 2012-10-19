// Card component with image, text and sound


enyo.kind({
	name: "FoodChain.Card",
	kind: enyo.Control,
	published: { cardname: "", x: 0, y: 0 },
	classes: "card",
	components: [
		{ name: "itemImage", classes: "cardImage", kind: "Image" },
		{ kind: "Image", src: "images/sound_icon.png", classes: "cardSoundIcon" },
		{ name: "itemText", classes: "cardText" },
		{ name: "itemSound", classes: "cardSound", kind: "HTML5.Audio", preload: "auto", autobuffer: true, controlsbar: false }
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.cardnameChanged();
		this.xChanged();
		this.yChanged();
	},
	
	// Rendering, force draggable property
	rendered: function() {
		this.inherited(arguments);
		var node = this.hasNode();
		if (node != null) {
			node.draggable = true;
		}
	},
	
	// Card setup
	cardnameChanged: function() {
		var image = "images/cards/"+this.cardname+".png";
		var text = this.cardname.substring(0,1).toUpperCase()+this.cardname.substring(1);
		var sound = ["audio/en/cards/"+this.cardname+".mp3", "audio/en/cards/"+this.cardname+".ogg"];
		
		this.$.itemImage.setAttribute("src", image);
		this.$.itemSound.setSrc(sound);
		this.$.itemText.setContent(text);
	},
	
	// Coordinate setup
	xChanged: function() {
		this.applyStyle("margin-left", this.x+"px");
	},
	
	// Coordinate setup
	yChanged: function() {
		this.applyStyle("margin-top", this.y+"px");
	},
	
	// Change position
	moveTo: function(x, y) {
		this.x = x;
		this.xChanged();
		this.y = y;
		this.yChanged();		
	},
	
	// Play sound when image taped
	play: function() {
		if (this.$.itemSound.paused())
			this.$.itemSound.play();
		else
			this.$.itemSound.pause();
	}
});