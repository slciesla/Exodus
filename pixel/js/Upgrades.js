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
		cost: 8000,
		persist: false,
		prereq: 7,
		unlockFunction: Pixel.AdvancedInfoUnlock
	};
	this.upgrades[7] = {
		id: 7,
		name: "Basic Stats",
		desc: "Shows some basic stats",
		cost: 4000,
		persist: false,
		prereq: 5,
		unlockFunction: Pixel.BasicStatsUnlock
	};
	this.upgrades[8] = {
		id: 8,
		name: "Advanced Stats",
		desc: "Shows more statistics",
		cost: 12000,
		persist: false,
		prereq: 6,
		unlockFunction: Pixel.AdvancedStatsUnlock
	};
	this.upgrades[9] = {
		id: 9,
		name: "Get New Image",
		desc: "Gets a new image if you don't like the one you have<br />Only works about once every 30 seconds",
		cost: 10000,
		persist: true,
		tracker: false,
		prereq: 1,
		unlockFunction: Pixel.SkipImage
	};
	this.upgrades[10] = {
		id: 10,
		name: "Cursor Bomb",
		desc: "Drops a pixel collecting bomb when you click proportional to your cursor size",
		cost: 8000,
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
		cost: 60000,
		persist: false,
		prereq: 11,
		unlockFunction: Pixel.CursorBombSizeUpgradeII
	};
	this.upgrades[14] = {
		id: 14,
		name: "Bomb Size III",
		desc: "Makes the cursor bomb bigger",
		cost: 150000,
		persist: false,
		prereq: 13,
		unlockFunction: Pixel.CursorBombSizeUpgradeIII
	};
	this.upgrades[15] = {
		id: 15,
		name: "Bomb Size IV",
		desc: "Makes the cursor bomb bigger",
		cost: 600000,
		persist: false,
		prereq: 14,
		unlockFunction: Pixel.CursorBombSizeUpgradeIV
	};
	this.upgrades[16] = {
		id: 16,
		name: "Bomb Size V",
		desc: "Makes the cursor bomb bigger",
		cost: 2500000,
		persist: false,
		prereq: 15,
		unlockFunction: Pixel.CursorBombSizeUpgradeV
	};
	this.upgrades[17] = {
		id: 17,
		name: "Bomb Chain Chance",
		desc: "Increases chance of bombs triggering another bomb",
		cost: 10000,
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
		prereq: 1,
		unlockFunction: Pixel.AutoFinishImage
	};
	this.upgrades[19] = {
		id: 19,
		name: "Bomb Max Chain",
		desc: "Increases number of bombs that can be triggered in a chain. There are diminishing returns on successive bombings.",
		cost: 4000,
		costFunc: Pixel.CursorBombMaxChainCost,
		tracker: function() { return Pixel.State.cursorBombMaxChainLvl; },
		persist: true,
		prereq: 10,
		unlockFunction: Pixel.CursorBombMaxChainUpgrade
	};
	this.upgrades[20] = {
		id: 20,
		name: "Pixel Color",
		desc: "Unlocks a slider that allows you to change the pixel color",
		cost: 50000,
		persist: false,
		prereq: 1,
		unlockFunction: Pixel.PixelColorUnlock
	};
	this.upgrades[21] = {
		id: 21,
		name: "Pix Splitter",
		desc: "Splits pixels gathered manually, having them count for double currency",
		cost: 50000,
		persist: false,
		prereq: 1,
		unlockFunction: Pixel.PixelSplitManual1Unlock
	};
	this.upgrades[22] = {
		id: 22,
		name: "Pix Dicer",
		desc: "Further splits pixels gathered manually, they now count for quadruple currency",
		cost: 150000,
		persist: false,
		prereq: 21,
		unlockFunction: Pixel.PixelSplitManual2Unlock
	};
	this.upgrades[23] = {
		id: 23,
		name: "Auto Pix Splitter",
		desc: "Splits pixels gathered with the auto cursor, having them count for double currency",
		cost: 50000,
		persist: false,
		prereq: 1,
		unlockFunction: Pixel.PixelSplitAuto1Unlock
	};
	this.upgrades[24] = {
		id: 24,
		name: "Auto Pix Dicer",
		desc: "Further splits pixels gathered with the auto cursor, they now count for quadruple currency",
		cost: 150000,
		persist: false,
		prereq: 23,
		unlockFunction: Pixel.PixelSplitAuto2Unlock
	};
	this.upgrades[25] = {
		id: 25,
		name: "Bomb Pix Splitter",
		desc: "Splits pixels gathered with the bomb, having them count for double currency",
		cost: 50000,
		persist: false,
		prereq: 10,
		unlockFunction: Pixel.PixelSplitBomb1Unlock
	};
	this.upgrades[26] = {
		id: 26,
		name: "Bomb Pix Dicer",
		desc: "Further splits pixels gathered with the bomb, they now count for quadruple currency",
		cost: 150000,
		persist: false,
		prereq: 25,
		unlockFunction: Pixel.PixelSplitBomb2Unlock
	};
	this.upgrades[27] = {
		id: 27,
		name: "Party Pixel Spawn",
		desc: "Cuts the time between party pixels in half",
		cost: 250000,
		persist: false,
		prereq: 1,
		unlockFunction: Pixel.PartyPixelSpawn
	};
	this.upgrades[28] = {
		id: 28,
		name: "Party Pixel Pop",
		desc: "Gives bonus pixels when you pop a party pixel",
		cost: 10000,
		costFunc: Pixel.PartyPixelPopCost,
		tracker: function() { return Pixel.State.partyPixelPopLvl; },
		persist: true,
		prereq: 1,
		unlockFunction: Pixel.PartyPixelPop
	};
    this.upgrades[29] = {
        id: 29,
        name: "Party Pixel Party",
        desc: "Pixel Parties last twice as long",
        cost: 1250000,
        persist: false,
        prereq: 27,
        unlockFunction: Pixel.PartyPixelDuration
    };
    this.upgrades[30] = {
        id: 30,
        name: "NSFW Toggle",
        desc: "Lets you toggle the ability to see NSFW images, not to see only NSFW images",
        cost: 1000000,
        persist: false,
        prereq: 31,
        unlockFunction: Pixel.NsfwUnlock
    };
    this.upgrades[31] = {
        id: 31,
        name: "Search Filter",
        desc: "Allows you to specifiy a subreddit to pull images from or a search term to filter",
        cost: 250000,
        persist: false,
        prereq: 8,
        unlockFunction: Pixel.SearchTermUnlock
    };

	this.upgradeList = Array(0,7,8,5,6,31,30,9,4,1,2,10,12,11,13,14,15,16,17,19,18,20,21,22,23,24,25,26,28,27,29);
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
};
