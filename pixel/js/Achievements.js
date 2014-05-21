function Achievements() {
	this.chievos = Array();
	this.chievos[0] = {
		name: "Depixelator",
		hidden: false,
		beforeDesc: "Uncover 1 pixel",
		desc: "Uncovered 1 pixel",
		image: "depixel1.png"
	};
	this.chievoList = Array(0);
	this.achieved = Array();
}

Achievements.prototype = {
	constructor: Achievements,
	LoadAchievements:function(old) {
		this.achieved = old.achieved;
		return this;
	},
	ToastAchievement:function(ndx) {
		$('#toaster').append("<div class='toastDiv' id='toast"+ndx+"'><div class='toastHeader'>Achievement Unlocked!</div><div class='toastChievo'>"+
			this.chievos[ndx].name+"</div><span class='toastDesc'>"+this.chievos[ndx].desc+"</span></div>");
		$('#toast'+ndx).delay(2000).fadeOut(6000);
	},
	UnlockAchievement:function(ndx) {
		this.achieved.push(ndx);
		this.ToastAchievement(ndx);
	}
}
