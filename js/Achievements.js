function Achievements() {
	this.chievos = Array();
	this.chievos[0] = {
		name: "Manual Labor",
		hidden: true,
		desc: "Manually harvested resources once",
		image: "click1.png"
	};
	this.chievos[1] = {
		name: "Manual Labor 10",
		hidden: true,
		desc: "Manually harvested resources 10 times",
		image: "click2.png"
	};
	this.chievos[2] = {
		name: "Manual Labor 100",
		hidden: true,
		desc: "Manually harvested resources 100 times",
		image: "click3.png"
	};
	this.chievos[3] = {
		name: "Manual Labor 1k",
		hidden: true,
		desc: "Manually harvested 1000 resources",
		image: "click4.png"
	};
	this.chievos[4] = {
		name: "Manual Labor 5k",
		hidden: true,
		desc: "Manually harvested 5000 resources",
		image: "click5.png"
	};
	this.chievos[5] = {
		name: "Manual Labor 10k",
		hidden: true,
		desc: "Manually harvested 10k resources",
		image: "click6.png"
	};
	this.chievos[10] = {
		name: "Free Labor",
		hidden: true,
		desc: "One resource automatically harvested",
		image: "labor1.png"
	};
	this.chievos[11] = {
		name: "Free Labor 10",
		hidden: true,
		desc: "10 resources automatically harvested",
		image: "labor2.png"
	};
	this.chievos[12] = {
		name: "Free Labor 100",
		hidden: true,
		desc: "100 resources automatically harvested",
		image: "labor3.png"
	};
	this.chievos[13] = {
		name: "Free Labor 1k",
		hidden: true,
		desc: "1000 resources automatically harvested",
		image: "labor4.png"
	};
	this.chievos[14] = {
		name: "Free Labor 5k",
		hidden: true,
		desc: "5000 resources automatically harvested",
		image: "labor5.png"
	};
	this.chievos[15] = {
		name: "Free Labor 10k",
		hidden: true,
		desc: "10k resources automatically harvested",
		image: "labor6.png"
	};
	this.chievos[16] = {
		name: "Free Labor 25k",
		hidden: true,
		desc: "25k resources automatically harvested",
		image: "labor7.png"
	};
	this.chievos[17] = {
		name: "Free Labor 100k",
		hidden: true,
		desc: "100k resources automatically harvested",
		image: "labor8.png"
	};
	this.chievos[100] = {
		name: "Make Babies",
		hidden: false,
		beforeDesc: "Make one baby",
		desc: "Your people have had a baby!",
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
	this.chievos[103] = {
		name: "Make Babies 1B",
		hidden: false,
		beforeDesc: "Make one billion babies",
		desc: "Bred one billion babies",
		image: "babies4.png"
	};
	this.chievos[104] = {
		name: "Make Babies 1T",
		hidden: false,
		beforeDesc: "Make one trillion babies",
		desc: "Bred one trillion babies",
		image: "babies5.png"
	};
	this.chievos[150] = {
		name: "Harvest Food",
		hidden: false,
		beforeDesc: "Harvest one food",
		desc: "You've harvested one food",
		image: "food1.png"
	};
	this.chievos[151] = {
		name: "Harvest Food 1k",
		hidden: false,
		beforeDesc: "Harvest one thousand food",
		desc: "You've harvested one thousand food",
		image: "food2.png"
	};
	this.chievos[152] = {
		name: "Harvest Food 1M",
		hidden: false,
		beforeDesc: "Harvest one million food",
		desc: "You've harvested one million food",
		image: "food3.png"
	};
	this.chievos[153] = {
		name: "Harvest Food 1B",
		hidden: false,
		beforeDesc: "Harvest one billion food",
		desc: "You've harvested one billion food",
		image: "food4.png"
	};
	this.chievos[154] = {
		name: "Harvest Food 1T",
		hidden: false,
		beforeDesc: "Harvest one trillion food",
		desc: "You've harvested one trillion food",
		image: "food5.png"
	};
	this.chievos[200] = {
		name: "Harvest Wood",
		hidden: false,
		beforeDesc: "Harvest one wood",
		desc: "You've harvested one wood",
		image: "wood1.png"
	};
	this.chievos[201] = {
		name: "Harvest Wood 1k",
		hidden: false,
		beforeDesc: "Harvest one thousand wood",
		desc: "You've harvested one thousand wood",
		image: "wood2.png"
	};
	this.chievos[202] = {
		name: "Harvest Wood 1M",
		hidden: false,
		beforeDesc: "Harvest one million wood",
		desc: "You've harvested one million wood",
		image: "wood3.png"
	};
	this.chievos[203] = {
		name: "Harvest Wood 1B",
		hidden: false,
		beforeDesc: "Harvest one billion wood",
		desc: "You've harvested one billion wood",
		image: "wood4.png"
	};
	this.chievos[204] = {
		name: "Harvest Wood 1T",
		hidden: false,
		beforeDesc: "Harvest one trillion wood",
		desc: "You've harvested one trillion wood",
		image: "wood5.png"
	};
	this.chievos[250] = {
		name: "Make Stone",
		hidden: false,
		beforeDesc: "Harvest one stone",
		desc: "You've harvested one stone",
		image: "stone1.png"
	};
	this.chievos[251] = {
		name: "Harvest Stone 1k",
		hidden: false,
		beforeDesc: "Harvest one thousand stone",
		desc: "You've harvested one thousand stone",
		image: "stone2.png"
	};
	this.chievos[252] = {
		name: "Harvest Stone 1M",
		hidden: false,
		beforeDesc: "Harvest one million stone",
		desc: "You've harvested one million stone",
		image: "stone3.png"
	};
	this.chievos[253] = {
		name: "Harvest Stone 1B",
		hidden: false,
		beforeDesc: "Harvest one billion stone",
		desc: "You've harvested one billion stone",
		image: "stone4.png"
	};
	this.chievos[254] = {
		name: "Harvest Stone 1T",
		hidden: false,
		beforeDesc: "Harvest one trillion stone",
		desc: "You've harvested one trillion stone",
		image: "stone5.png"
	};
	this.chievos[300] = {
		name: "Building Mogul I",
		hidden: false,
		beforeDesc: "Build your first building",
		desc: "Built your first building",
		image: "building1.png"
	};
	this.chievos[301] = {
		name: "Building Mogul II",
		hidden: false,
		beforeDesc: "Build 10 buildings",
		desc: "Built your 10th building",
		image: "building2.png"
	};
	this.chievos[302] = {
		name: "Building Mogul III",
		hidden: false,
		beforeDesc: "Build 50 buildings",
		desc: "Built your 50th building",
		image: "building3.png"
	};
	this.chievos[303] = {
		name: "Building Mogul IV",
		hidden: false,
		beforeDesc: "Build 100 buildings",
		desc: "Built your 100th building",
		image: "building4.png"
	};
	this.chievos[304] = {
		name: "Building Mogul V",
		hidden: false,
		beforeDesc: "Build 500 buildings",
		desc: "Built your 500th building",
		image: "building5.png"
	};
	this.chievos[305] = {
		name: "Building Mogul VI",
		hidden: false,
		beforeDesc: "Build 1000 buildings",
		desc: "Built your 1000th building",
		image: "building6.png"
	};
	this.chievos[306] = {
		name: "Building Mogul VII",
		hidden: false,
		beforeDesc: "Build 5000 buildings",
		desc: "Built your 5000th building",
		image: "building7.png"
	};
	this.chievos[350] = {
		name: "Upgrader I",
		hidden: false,
		beforeDesc: "Aquire your first upgrade",
		desc: "Acquired one upgrade",
		image: "upgrade1.png"
	};
	this.chievos[351] = {
		name: "Upgrader II",
		hidden: false,
		beforeDesc: "Aquire 10 upgrades",
		desc: "Acquired 10 upgrades",
		image: "upgrade2.png"
	};
	this.chievos[352] = {
		name: "Upgrader III",
		hidden: false,
		beforeDesc: "Aquire 50 upgrades",
		desc: "Acquired 50th upgrades",
		image: "upgrade3.png"
	};
	this.chievos[353] = {
		name: "Upgrader IV",
		hidden: false,
		beforeDesc: "Aquire 100 upgrades",
		desc: "Acquired 100th upgrades",
		image: "upgrade4.png"
	};
	this.chievos[354] = {
		name: "Upgrader V",
		hidden: false,
		beforeDesc: "Aquire 500 upgrades",
		desc: "Acquired 500th upgrades",
		image: "upgrade5.png"
	};
	this.chievos[400] = {
		name: "Asteroid Clicker I",
		hidden: false,
		beforeDesc: "Click an asteroid",
		desc: "Clicked an asteroid",
		image: "asteroidclick1.png"
	};
	this.chievos[401] = {
		name: "Asteroid Clicker II",
		hidden: false,
		beforeDesc: "Click asteroids 100 times",
		desc: "Clicked asteroids 100 times",
		image: "asteroidclick2.png"
	};
	this.chievos[402] = {
		name: "Asteroid Clicker III",
		hidden: false,
		beforeDesc: "Click asteroids 500",
		desc: "Clicked asteroids 500 times",
		image: "asteroidclick3.png"
	};
	this.chievos[403] = {
		name: "Asteroid Clicker IV",
		hidden: false,
		beforeDesc: "Click asteroids 1000 times",
		desc: "Clicked asteroids 1000 times",
		image: "asteroidclick4.png"
	};
	this.chievos[404] = {
		name: "Asteroid Clicker V",
		hidden: false,
		beforeDesc: "Click asteroids 5000 times",
		desc: "Clicked asteroids 5000 times",
		image: "asteroidclick5.png"
	};
	this.chievos[450] = {
		name: "Asteroid Exhauster I",
		hidden: false,
		beforeDesc: "Exhaust an asteroid",
		desc: "Exhausted an asteroid",
		image: "asteroidexhaust1.png"
	};
	this.chievos[451] = {
		name: "Asteroid Exhauster II",
		hidden: false,
		beforeDesc: "Exhaust asteroids 10 times",
		desc: "Exhausted asteroids 10 times",
		image: "asteroidexhaust2.png"
	};
	this.chievos[452] = {
		name: "Asteroid Exhauster III",
		hidden: false,
		beforeDesc: "Exhaust asteroids 50",
		desc: "Exhausted asteroids 50 times",
		image: "asteroidexhaust3.png"
	};
	this.chievos[453] = {
		name: "Asteroid Exhauster IV",
		hidden: false,
		beforeDesc: "Exhaust asteroids 100 times",
		desc: "Exhausted asteroids 100 times",
		image: "asteroidexhaust4.png"
	};
	this.chievos[454] = {
		name: "Asteroid Exhauster V",
		hidden: false,
		beforeDesc: "Exhaust asteroids 1000 times",
		desc: "Exhausted asteroids 1000 times",
		image: "asteroidexhaust5.png"
	};
	this.chievos[500] = {
		name: "Adam & Eve",
		hidden: true,
		desc: "Reached 10k population after first being down to 2",
		image: "adameve.png"
	};
	this.chievos[501] = {
		name: "Natural Born Killer",
		hidden: true,
		desc: "Let 10k population starve to death",
		image: "starve.png"
	};
	this.chievos[502] = {
		name: "Idler",
		hidden: false,
		beforeDesc: "Play the game for over 24 hours",
		desc: "Played more than 24 hours",
		image: "24hr.png"
	};
	this.chievos[503] = {
		name: "Idle Player",
		hidden: true,
		desc: "Reached the Bronze Age without harvesting any resources",
		image: "idle.png"
	};
	this.chievos[504] = {
		name: "Manual Player",
		hidden: true,
		desc: "Reached the Bronze Age without letting any resources be auto harvested",
		image: "manual.png"
	};
	this.chievos[600] = {
		name: "Stone Age",
		hidden: false,
		beforeDesc: "Land on a planet and reach the Stone Age",
		desc: "Landed on a planet and reached the Stone Age",
		image: "stoneage.png"
	};
	this.chievos[601] = {
		name: "Bronze Age",
		hidden: false,
		beforeDesc: "Reach the Bronze Age",
		desc: "Reached the Bronze Age",
		image: "bronzeage.png"
	};
	this.chievos[650] = {
		name: "Speed Bronze Age",
		hidden: false,
		beforeDesc: "Reach the Bronze Age in under 1 hour played",
		desc: "Reached the Bronze Age in under 1 hour",
		image: "speedbronzeage.png"
	}
	this.chievos[651] = {
		name: "Speed Stone Age",
		hidden: false,
		beforeDesc: "Reach the Stone Age in under 1 hour played",
		desc: "Reached the Stone Age in under 1 hour",
		image: "speedstoneage.png"
	}
	this.chievoList = Array(0,1,2,3,4,5,10,11,12,13,14,15,16,17,100,101,102,103,104,150,151,152,153,154,
		200,201,202,203,204,250,251,252,253,254,300,301,302,303,304,305,306,350,351,352,353,354,400,401,
		402,403,404,450,451,452,453,454,500,501,502,503,504,600,601,650,651);
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
