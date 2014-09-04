function Upgrades() {
	this.upgrades = Array();
	this.upgrades[0] = {
		id: 0,
		name: "Pixel Display",
		desc: "Display your hard earned pixels",
		cost: 500,
		persist: false,
		prereq: -1,
		unlockFunction: Pixel.DisplayPixels
	};
	this.upgrades[1] = {
		id: 1,
		name: "Automatic Cursor",
		desc: "Automatically collects 1 pixels every 2 seconds for you",
		cost: 1000,
		persist: false,
		prereq: 0,
		unlockFunction: Pixel.AutoCursor
	};
	this.upgrades[2] = {
		id: 2,
		name: "Auto Cursor Speed",
		desc: "Cursors collect pixels faster",
		cost: 2500,
		costFunc: Pixel.AutoCursorSpeedCost,
		tracker: function() { return Pixel.State.autoCursorSpeedLvl; },
		persist: true,
		prereq: 1,
		unlockFunction: Pixel.AutoCursorSpeedUpgrade
	};
	this.upgrades[4] = {
		id: 4,
		name: "Cursor Size",
		desc: "Manually collect more pixels at once",
		cost: 5000,
		costFunc: Pixel.CursorSizeCost,
		tracker: function() { return Pixel.State.cursorSizeLvl; },
		persist: true,
		prereq: 1,
		unlockFunction: Pixel.CursorSizeUpgrade
	};
	this.upgrades[5] = {
		id: 5,
		name: "Basic Image Info",
		desc: "Shows the most basic image information",
		cost: 2000,
		persist: false,
		prereq: 1,
		unlockFunction: Pixel.BasicInfoUnlock
	};
	this.upgrades[6] = {
		id: 6,
		name: "Advanced Image Info",
		desc: "Shows more image information",
		cost: 25000,
		persist: false,
		prereq: 5,
		unlockFunction: Pixel.AdvancedInfoUnlock
	};
	this.upgrades[7] = {
		id: 7,
		name: "Basic Stats",
		desc: "Shows some basic stats",
		cost: 4000,
		persist: false,
		prereq: 1,
		unlockFunction: Pixel.BasicStatsUnlock
	};
	this.upgrades[8] = {
		id: 8,
		name: "Advanced Stats",
		desc: "Shows more statistics",
		cost: 25000,
		persist: false,
		prereq: 7,
		unlockFunction: Pixel.AdvancedStatsUnlock
	};
	this.upgrades[9] = {
		id: 9,
		name: "Get New Image",
		desc: "Gets a new image if you don't like the one you have<br />Only works about once every 30 seconds",
		cost: 25000,
		persist: true,
		tracker: false,
		prereq: 6,
		unlockFunction: Pixel.SkipImage
	};
	this.upgrades[10] = {
		id: 10,
		name: "Cursor Bomb",
		desc: "Drops a pixel collecting bomb when you click",
		cost: 15000,
		persist: false,
		prereq: 1,
		unlockFunction: Pixel.CursorBombUnlock
	};
	this.upgrades[11] = {
		id: 11,
		name: "Bomb Size I",
		desc: "Makes the cursor bomb bigger",
		cost: 50000,
		persist: false,
		prereq: 10,
		unlockFunction: Pixel.CursorBombSizeUpgradeI
	};
	this.upgrades[12] = {
		id: 12,
		name: "Bomb Reload Speed",
		desc: "Makes the cursor bomb reload faster",
		cost: 10000,
		costFunc: Pixel.CursorBombSpeedCost,
		tracker: function() { return Pixel.State.cursorBombSpeedLvl; },
		persist: true,
		prereq: 10,
		unlockFunction: Pixel.CursorBombSpeedUpgrade
	};
	this.upgrades[13] = {
		id: 13,
		name: "Bomb Size II",
		desc: "Makes the cursor bomb bigger",
		cost: 200000,
		persist: false,
		prereq: 11,
		unlockFunction: Pixel.CursorBombSizeUpgradeII
	};
	this.upgrades[14] = {
		id: 14,
		name: "Bomb Size III",
		desc: "Makes the cursor bomb bigger",
		cost: 600000,
		persist: false,
		prereq: 13,
		unlockFunction: Pixel.CursorBombSizeUpgradeIII
	};
	this.upgrades[15] = {
		id: 15,
		name: "Bomb Size IV",
		desc: "Makes the cursor bomb bigger",
		cost: 1500000,
		persist: false,
		prereq: 14,
		unlockFunction: Pixel.CursorBombSizeUpgradeIV
	};
	this.upgrades[16] = {
		id: 16,
		name: "Bomb Size V",
		desc: "Makes the cursor bomb bigger",
		cost: 5000000,
		persist: false,
		prereq: 15,
		unlockFunction: Pixel.CursorBombSizeUpgradeV
	};
	this.upgrades[17] = {
		id: 17,
		name: "Bomb Chain Chance",
		desc: "Bombs have a chance of triggering another (free) bomb",
		cost: 25000,
		costFunc: Pixel.CursorBombChainCost,
		tracker: function() { return Pixel.State.cursorBombChainLvl; },
		persist: true,
		prereq: 10,
		unlockFunction: Pixel.CursorBombChainUpgrade
	};
	this.upgrades[18] = {
		id: 18,
		name: "Auto Finish Image",
		desc: "Unlocks a toggle to have the game automatically start the next image once complete",
		cost: 75000,
		persist: false,
		prereq: 6,
		unlockFunction: Pixel.AutoFinishImage
	};
	this.upgrades[19] = {
		id: 19,
		name: "Bomb Max Chain",
		desc: "Number of bombs that can be triggered in a chain (Warning: Extreme numbers could lag the game on bombing) and there are diminishing returns on successive bombings.",
		cost: 20000,
		costFunc: Pixel.CursorBombMaxChainCost,
		tracker: function() { return Pixel.State.cursorBombMaxChainLvl; },
		persist: true,
		prereq: 10,
		unlockFunction: Pixel.CursorBombMaxChainUpgrade
	};
	this.upgradeList = Array(0,7,8,5,6,9,4,1,2,10,12,11,13,14,15,16,17,19,18);
	this.owned = Array();
}

Upgrades.prototype = {
	constructor: Upgrades,
	LoadUpgrades:function(old) {
		this.owned = old.owned;
		return this;
	},
	Check:function(ndx) {
		return !($.inArray(ndx, this.owned) == -1);
	}
}
