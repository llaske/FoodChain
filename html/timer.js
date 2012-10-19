
enyo.kind({
    name: "Timer",
    kind: enyo.Component,
    minInterval: 50,
	paused: false,
    published: {
        baseInterval: 100,
    },
    events: {
        onTriggered: ""
    },
	
    create: function() {
        this.inherited(arguments);
        this.start();
    },
	
    destroy: function() {
        this.stop();
        this.inherited(arguments);
    },
	
    start: function() {
        this.job = window.setInterval(enyo.bind(this, "timer"), this.baseInterval);
    },
	
    stop: function() {
        window.clearInterval(this.job);
    },
	
	pause: function() {
		this.paused = true;
	},
	
	resume: function() {
		this.paused = false;
	},
	
    timer: function() {
		if (!this.paused)
			this.doTriggered({time: new Date().getTime()});
    },
	
    baseIntervalChanged: function(inOldValue) {
        this.baseInterval = Math.max(this.minInterval, this.baseInterval);
        this.stop();
        this.start();
    }
});