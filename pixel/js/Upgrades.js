function Upgrades() {
	this.upgrades = Array();
	this.upgrades[0] = {
		id: 0,
		name: "Pixel Display",
		desc: "Display your hard earned pixels",
		cost: 1000,
		persist: false,
		prereq: -1,
		unlockFunction: Pixel.DisplayPixels
	};
	this.upgrades[1] = {
		id: 1,
		name: "Automatic Cursor",
		desc: "Automatically collects 1 pixels every 10 seconds for you",
		cost: 10000,
		persist: false,
		prereq: 0,
		unlockFunction: Pixel.AutoCursor
	};
	this.upgrades[2] = {
		id: 2,
		name: "Auto Cursor Speed",
		desc: "Cursors collect pixels faster",
		cost: 10000,
		costFunc: Pixel.CursorCost,
		tracker: Pixel.State.cursorSpeedLvl,
		persist: true,
		prereq: 1,
		unlockFunction: Pixel.AutoCursorUpgrade
	};
	this.upgradeList = Array(0,1,2);
	this.owned = Array();
}

Upgrades.prototype = {
	constructor: Upgrades,
	LoadUpgrades:function(old) {
		this.owned = old.owned;
		return this;
	}
}
