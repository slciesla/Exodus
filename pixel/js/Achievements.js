function Achievements() {
	this.chievos = Array();
	this.chievos[0] = {
		name: "Depixelator I",
		hidden: false,
		beforeDesc: "Uncover 1 pixel",
		desc: "Uncovered 1 pixel",
		image: "depixel1.png"
	};
	this.chievos[1] = {
		name: "Depixelator II",
		hidden: false,
		beforeDesc: "Uncover 500 pixels",
		desc: "Uncovered 500 pixels, now you can buy things!",
		image: "depixel2.png"
	};
	this.chievos[2] = {
		name: "Depixelator III",
		hidden: false,
		beforeDesc: "Uncover 1000 pixels",
		desc: "Uncovered 1000 pixels",
		image: "depixel3.png"
	};
	this.chievos[3] = {
		name: "Depixelator IV",
		hidden: false,
		beforeDesc: "Uncover 2500 pixels",
		desc: "Uncovered 2500 pixels",
		image: "depixel4.png"
	};
	this.chievos[4] = {
		name: "Depixelator V",
		hidden: false,
		beforeDesc: "Uncover 5000 pixels",
		desc: "Uncovered 5000 pixels",
		image: "depixel5.png"
	};
	this.chievos[5] = {
		name: "Depixelator VI",
		hidden: false,
		beforeDesc: "Uncover 10000 pixels",
		desc: "Uncovered 10000 pixels, now we're getting somewhere",
		image: "depixel6.png"
	};
	this.chievos[6] = {
		name: "Depixelator VII",
		hidden: false,
		beforeDesc: "Uncover 25000 pixels",
		desc: "Uncovered 25000 pixels",
		image: "depixel7.png"
	};
	this.chievos[7] = {
		name: "Depixelator VIII",
		hidden: false,
		beforeDesc: "Uncover 50000 pixels",
		desc: "Uncovered 50000 pixels",
		image: "depixel8.png"
	};
	this.chievos[8] = {
		name: "Depixelator IX",
		hidden: false,
		beforeDesc: "Uncover 100k pixels",
		desc: "Uncovered 100k pixels",
		image: "depixel9.png"
	};
	this.chievos[9] = {
		name: "Depixelator X",
		hidden: false,
		beforeDesc: "Uncover 500k pixels",
		desc: "Uncovered 500k pixels",
		image: "depixel10.png"
	};
	this.chievos[10] = {
		name: "Mega-Depixelator I",
		hidden: false,
		beforeDesc: "Uncover 1M pixels",
		desc: "Uncovered 1M pixels",
		image: "megadepixel1.png"
	};
	this.chievos[11] = {
		name: "Mega-Depixelator II",
		hidden: false,
		beforeDesc: "Uncover 5M pixels",
		desc: "Uncovered 5M pixels",
		image: "megadepixel2.png"
	};
	this.chievos[12] = {
		name: "Mega-Depixelator III",
		hidden: false,
		beforeDesc: "Uncover 10M pixels",
		desc: "Uncovered 10M pixels",
		image: "megadepixel3.png"
	};
	this.chievos[13] = {
		name: "Mega-Depixelator IV",
		hidden: false,
		beforeDesc: "Uncover 100M pixels",
		desc: "Uncovered 100M pixels",
		image: "megadepixel4.png"
	};
	this.chievos[14] = {
		name: "Mega-Depixelator V",
		hidden: false,
		beforeDesc: "Uncover 1B pixels",
		desc: "Uncovered 1B pixels",
		image: "megadepixel5.png"
	};
	this.chievos[15] = {
		name: "Mega-Depixelator VI",
		hidden: false,
		beforeDesc: "Uncover 10B pixels",
		desc: "Uncovered 10B pixels",
		image: "megadepixel6.png"
	};
	this.chievos[16] = {
		name: "Mega-Depixelator VII",
		hidden: false,
		beforeDesc: "Uncover 100B pixels",
		desc: "Uncovered 100B pixels",
		image: "megadepixel7.png"
	};
	this.chievos[17] = {
		name: "Mega-Depixelator VIII",
		hidden: false,
		beforeDesc: "Uncover 1T pixels",
		desc: "Uncovered 1T pixels",
		image: "megadepixel8.png"
	};
	this.chievos[18] = {
		name: "Mega-Depixelator IX",
		hidden: false,
		beforeDesc: "Uncover 10T pixels",
		desc: "Uncovered 10T pixels",
		image: "megadepixel9.png"
	};
	this.chievos[19] = {
		name: "Mega-Depixelator X",
		hidden: false,
		beforeDesc: "Uncover 100T pixels",
		desc: "Uncovered 100T pixels",
		image: "megadepixel10.png"
	};
	this.chievos[20] = {
		name: "Manual Picker I",
		hidden: false,
		beforeDesc: "Manually uncover 1k pixels",
		desc: "Manually uncovered 1k pixels",
		image: "manual1.png"
	};
	this.chievos[21] = {
		name: "Manual Picker II",
		hidden: false,
		beforeDesc: "Manually uncover 1M pixels",
		desc: "Manually uncovered 1M pixels",
		image: "manual2.png"
	};
	this.chievos[22] = {
		name: "Manual Picker III",
		hidden: false,
		beforeDesc: "Manually uncover 1B pixels",
		desc: "Manually uncovered 1B pixels",
		image: "manual3.png"
	};
	this.chievos[23] = {
		name: "Manual Picker IV",
		hidden: false,
		beforeDesc: "Manually uncover 1T pixels",
		desc: "Manually uncovered 1T pixels",
		image: "manual4.png"
	};
	this.chievos[24] = {
		name: "Manual Picker V",
		hidden: false,
		beforeDesc: "Manually uncover 1Qu pixels",
		desc: "Manually uncovered 1Qu pixels",
		image: "manual5.png"
	};
	this.chievos[30] = {
		name: "Auto Picker I",
		hidden: false,
		beforeDesc: "Automatically uncover 1k pixels",
		desc: "Automatically uncovered 1k pixels",
		image: "auto1.png"
	};
	this.chievos[31] = {
		name: "Auto Picker II",
		hidden: false,
		beforeDesc: "Automatically uncover 1M pixels",
		desc: "Automatically uncovered 1M pixels",
		image: "auto2.png"
	};
	this.chievos[32] = {
		name: "Auto Picker III",
		hidden: false,
		beforeDesc: "Automatically uncover 1B pixels",
		desc: "Automatically uncovered 1B pixels",
		image: "auto3.png"
	};
	this.chievos[33] = {
		name: "Auto Picker IV",
		hidden: false,
		beforeDesc: "Automatically uncover 1T pixels",
		desc: "Automatically uncovered 1T pixels",
		image: "auto4.png"
	};
	this.chievos[34] = {
		name: "Auto Picker V",
		hidden: false,
		beforeDesc: "Automatically uncover 1Qu pixels",
		desc: "Automatically uncovered 1Qu pixels",
		image: "auto5.png"
	};
	this.chievos[40] = {
		name: "Bomber I",
		hidden: false,
		beforeDesc: "Uncover 1k pixels with bombs",
		desc: "Uncovered 1k pixels with bombs",
		image: "bomb1.png"
	};
	this.chievos[41] = {
		name: "Bomber II",
		hidden: false,
		beforeDesc: "Uncover 1M pixels with bombs",
		desc: "Uncovered 1M pixels with bombs",
		image: "bomb2.png"
	};
	this.chievos[42] = {
		name: "Bomber III",
		hidden: false,
		beforeDesc: "Uncover 1B pixels with bombs",
		desc: "Uncovered 1B pixels with bombs",
		image: "bomb3.png"
	};
	this.chievos[43] = {
		name: "Bomber IV",
		hidden: false,
		beforeDesc: "Uncover 1T pixels with bombs",
		desc: "Uncovered 1T pixels with bombs",
		image: "bomb4.png"
	};
	this.chievos[44] = {
		name: "Bomber V",
		hidden: false,
		beforeDesc: "Uncover 1Qu pixels with bombs",
		desc: "Uncovered 1Qu pixels with bombs",
		image: "bomb5.png"
	};
	this.chievos[45] = {
		name: "Speedy",
		hidden: false,
		beforeDesc: "Finish a picture in under 2700 seconds",
		desc: "Finished a picture in under 2700 seconds",
		image: "speedy1.png"
	};
	this.chievos[46] = {
		name: "Speedier",
		hidden: false,
		beforeDesc: "Finish a picture in under 1800 seconds",
		desc: "Finished a picture in under 1800 seconds",
		image: "speedy2.png"
	};
	this.chievos[47] = {
		name: "Speediest",
		hidden: false,
		beforeDesc: "Finish a picture in under 1200 seconds",
		desc: "Finished a picture in under 1200 seconds",
		image: "speedy3.png"
	};
	this.chievos[50] = {
		name: "Most Speediest",
		hidden: true,
		beforeDesc: "Finish a picture in under 600 seconds",
		desc: "Finished a picture in under 600 seconds",
		image: "speedy4.png"
	};
	this.chievos[51] = {
		name: "Chain Master",
		hidden: true,
		beforeDesc: "Get a bomb chain of more than 8",
		desc: "Got a bomb chain of more than 8",
		image: "chain.png"
	};
	this.chievos[52] = {
		name: "Information Addict",
		hidden: true,
		beforeDesc: "Unlock all the image information upgrades",
		desc: "Unlocked all the image information upgrades",
		image: "infoaddict.png"
	};
	this.chievos[53] = {
		name: "Statistics Addict",
		hidden: true,
		beforeDesc: "Unlock all the statistic upgrades",
		desc: "Unlocked all the statistic upgrades",
		image: "stataddict.png"
	};
	this.chievos[54] = {
		name: "Completionist",
		hidden: true,
		beforeDesc: "Uncover every pixel in an image before moving on (Auto only works to 99.9%)",
		desc: "Uncovered every pixel in an image",
		image: "completionist.png"
	};
	this.chievos[55] = {
		name: "Bored",
		hidden: true,
		beforeDesc: "Finish an image without manually collecting any pixels",
		desc: "Finished an image without manually collecting any pixels",
		image: "bored.png"
	};
	this.chievos[56] = {
		name: "Got Those",
		hidden: true,
		beforeDesc: "Try to uncover 10000 pixels that have already been uncovered",
		desc: "Uncovered 10000 pixels that have already been uncovered",
		image: "gotthose.png"
	};
	this.chievos[57] = {
		name: "True Speedster",
		hidden: true,
		beforeDesc: "Finish a picture in under 60 seconds",
		desc: "Finished a picture in under 60 seconds",
		image: "speedy5.png"
	};
	this.chievos[60] = {
		name: "Picturesque I",
		hidden: false,
		beforeDesc: "Finish 1 picture",
		desc: "Finished 1 picture",
		image: "picture1.png"
	};
	this.chievos[61] = {
		name: "Picturesque II",
		hidden: false,
		beforeDesc: "Finish 5 pictures",
		desc: "Finished 5 pictures",
		image: "picture2.png"
	};
	this.chievos[62] = {
		name: "Picturesque III",
		hidden: false,
		beforeDesc: "Finish 25 pictures",
		desc: "Finished 25 pictures",
		image: "picture3.png"
	};
	this.chievos[63] = {
		name: "Picturesque IV",
		hidden: false,
		beforeDesc: "Finish 100 pictures",
		desc: "Finished 100 pictures",
		image: "picture4.png"
	};
	this.chievos[64] = {
		name: "Picturesque V",
		hidden: false,
		beforeDesc: "Finish 1000 pictures",
		desc: "Finished 1000 pictures",
		image: "picture5.png"
	};
	this.chievos[70] = {
		name: "Uncultured Swine I",
		hidden: false,
		beforeDesc: "Skip 1 picture",
		desc: "Skipped 1 picture",
		image: "skip1.png"
	};
	this.chievos[71] = {
		name: "Uncultured Swine II",
		hidden: false,
		beforeDesc: "Skip 5 pictures",
		desc: "Skipped 5 pictures",
		image: "skip2.png"
	};
	this.chievos[72] = {
		name: "Uncultured Swine III",
		hidden: false,
		beforeDesc: "Skip 25 pictures",
		desc: "Skipped 25 pictures",
		image: "skip3.png"
	};
	this.chievos[73] = {
		name: "Uncultured Swine IV",
		hidden: false,
		beforeDesc: "Skip 50 pictures",
		desc: "Skipped 50 pictures",
		image: "skip4.png"
	};
	this.chievos[74] = {
		name: "Uncultured Swine V",
		hidden: false,
		beforeDesc: "Skip 100 pictures",
		desc: "Skipped 100 pictures",
		image: "skip5.png"
	};
	this.chievos[80] = {
		name: "Getting Started I",
		hidden: false,
		beforeDesc: "Uncover 1% of your first image",
		desc: "Uncovered 1% of your first image",
		image: "start1.png"
	};
	this.chievos[81] = {
		name: "Getting Started II",
		hidden: false,
		beforeDesc: "Uncover 10% of your first image",
		desc: "Uncovered 10% of your first image",
		image: "start2.png"
	};
	this.chievos[82] = {
		name: "Getting Started III",
		hidden: false,
		beforeDesc: "Uncover 25% of your first image",
		desc: "Uncovered 25% of your first image",
		image: "start3.png"
	};
	this.chievos[83] = {
		name: "Getting Started IV",
		hidden: false,
		beforeDesc: "Uncover 50% of your first image",
		desc: "Uncovered 50% of your first image",
		image: "start4.png"
	};
	this.chievos[84] = {
		name: "Getting Started V",
		hidden: false,
		beforeDesc: "Uncover 75% of your first image",
		desc: "Uncovered 75% of your first image",
		image: "start5.png"
	};
	this.chievos[85] = {
		name: "Getting Started VI",
		hidden: false,
		beforeDesc: "Uncover 99% of your first image",
		desc: "Uncovered 99% of your first image",
		image: "start6.png"
	};
	this.chievos[90] = {
		name: "Partier I",
		hidden: false,
		beforeDesc: "Have a pixel party!",
		desc: "You had your first pixel party!",
		image: "party1.png"
	};
	this.chievos[91] = {
		name: "Partier II",
		hidden: false,
		beforeDesc: "Have 10 pixel parties",
		desc: "You've had 10 pixel parties",
		image: "party2.png"
	};
	this.chievos[92] = {
		name: "Partier III",
		hidden: false,
		beforeDesc: "Have 50 pixel parties",
		desc: "You've had 50 pixel parties",
		image: "party3.png"
	};
	this.chievos[93] = {
		name: "Partier IV",
		hidden: false,
		beforeDesc: "Have 100 pixel parties",
		desc: "You've had 100 pixel parties",
		image: "party4.png"
	};
	this.chievos[94] = {
		name: "Partier V",
		hidden: false,
		beforeDesc: "Have 1000 pixel parties",
		desc: "You've had 1000 pixel parties",
		image: "party5.png"
	};
	this.chievos[95] = {
		name: "Party Pooper",
		hidden: true,
		beforeDesc: "Miss 1000 pixel parties",
		desc: "You've missed 1000 pixel parties :-(",
		image: "partypooper.png"
	};
	this.chievos[100] = {
		name: "Bomberman I",
		hidden: false,
		beforeDesc: "Launch 1 bomb",
		desc: "Launched your first bomb!",
		image: "bomber1.png"
	};
	this.chievos[101] = {
		name: "Bomberman II",
		hidden: false,
		beforeDesc: "Explode 50 bombs",
		desc: "50 bombs have exploded",
		image: "bomber2.png"
	};
	this.chievos[102] = {
		name: "Bomberman III",
		hidden: false,
		beforeDesc: "Explode 250 bombs",
		desc: "250 bombs have exploded",
		image: "bomber3.png"
	};
	this.chievos[103] = {
		name: "Bomberman IV",
		hidden: false,
		beforeDesc: "Explode 500 bombs",
		desc: "500 bombs have exploded",
		image: "bomber4.png"
	};
	this.chievos[104] = {
		name: "Bomberman V",
		hidden: false,
		beforeDesc: "Explode 1000 bombs",
		desc: "1000 bombs have exploded",
		image: "bomber5.png"
	};
	this.chievos[105] = {
		name: "Pacifist",
		hidden: true,
		beforeDesc: "Complete an image without launching a bomb",
		desc: "Completed an image without using any bombs",
		image: "pacifist1.png"
	};
	this.chievoList = Array(80,81,82,83,84,85,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,30,31,32,33,34,40,41,
		42,43,44,45,46,47,60,61,62,63,64,70,71,72,73,74,50,57,51,52,53,54,55,56,90,91,92,93,94,95,100,101,102,103,104,105);
	this.achieved = Array();
	this.achievedOn = Array();
}

Achievements.prototype = {
	constructor: Achievements,
	LoadAchievements:function(old) {
		this.achieved = old.achieved;
		if(old.achievedOn !== undefined){
		    this.achievedOn = old.achievedOn;
		}
		return this;
	},
	ToastAchievement:function(ndx) {
		$('#toaster').append("<div class='toastDiv' id='toast"+ndx+"'><div class='toastHeader'>Achievement Unlocked!</div><div class='toastChievo'>"+
			this.chievos[ndx].name+"</div><span class='toastDesc'>"+this.chievos[ndx].desc+"</span></div>");
		$('#toast'+ndx).delay(2000).fadeOut(6000);
	},
	UnlockAchievement:function(ndx, link) {
		this.achieved.push(ndx);
		this.achievedOn[this.achieved.length-1] = link;
		this.ToastAchievement(ndx);
	}
}
