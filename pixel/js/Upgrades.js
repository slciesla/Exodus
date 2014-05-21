function Upgrades() {
	this.upgrades = Array();
	this.upgrades[0] = {
		name: "Pixel Display",
		desc: "Display your hard earned pixels",
		cost: 1000,
		prereq: -1
	};
	this.upgrades[1] = {
		name: "Test",
		desc: "Test test",
		cost: 1000,
		prereq: -1
	};
	this.upgradeList = Array(0,1);
	this.owned = Array();
}

Upgrades.prototype = {
	constructor: Upgrades,
	LoadUpgrades:function(old) {
		this.owned = old.owned;
		return this;
	}
}
