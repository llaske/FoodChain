// Button component with image and shadow
enyo.kind({
	name: "ShadowButton",
	kind: enyo.Control,
	published: { img: "" },
	components: [
		{ name: "button", kind: "Image", classes: "shadowbutton", onenter: "showShadow", onleave: "hideShadow" },
		{ name: "buttonshadow", kind: "Image", classes: "shadowbutton-shadow" }
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.imgChanged();
		this.$.buttonshadow.hide();		
	},	
	
	// Image name changed set images src
	imgChanged: function() {
		this.$.button.setAttribute("src", "images/"+this.img+".svg");
		this.$.buttonshadow.setAttribute("src", "images/"+this.img+"_shadow.svg");
	},
	
	// Cursor on image, show shadow
	showShadow: function() {
		this.$.buttonshadow.show();
	},

	// Cursor out of image, hide shadow
	hideShadow: function() {
		this.$.buttonshadow.hide();
	}
});	