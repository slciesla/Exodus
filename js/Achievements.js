function Achievements() {
	this.chievos = Array();
	this.chievos[0] = {
		name: "Manual Labor",
		hidden: true,
		desc: "Manually harvested one time",
		image: "labor1.png"
	};
	this.chievos[100] = {
		name: "Make Babies",
		hidden: false,
		beforeDesc: "Make one baby",
		desc: "You've successfully bred people to make a baby!",
		image: "babies1.png"
	};
	this.chievos[101] = {
		name: "Make Babies 1k",
		hidden: false,
		beforeDesc: "Make one thousand babies",
		desc: "Bred one thousand babies",
		image: "babies2.png"
	};
	this.chievos[102] = {
		name: "Make Babies 1M",
		hidden: false,
		beforeDesc: "Make one million babies",
		desc: "Bred one million babies",
		image: "babies3.png"
	};
	this.chievoList = Array(0, 100, 101, 102);
	this.achieved = Array();
}

Achievements.prototype = {
	constructor: Achievements,
	LoadAchievements:function(old) {
		return this;
	}
}
