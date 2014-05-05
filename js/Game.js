function e(item) {return document.getElementById(item);}

//TODO:
// Add stuff to planet
// Prettify
// Events, which if ignored, go to a mailbox. After x time of having the game open, 
//   they're still ignored, the "people" pick a random solution
// Exp upgrades
// Make it so you can lock all but 1 slider
// Allow for a queue of buildings that take time to build

function hrFormat(number) {
	number = number < 1 && number > 0 ? 1 : number;
    var s = ['', 'k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    var e = Math.floor(Math.log(number) / Math.log(1000));
	return number < 1000 ? Math.floor(number) : ((number / Math.pow(1000, e)).toFixed(2) + " " + s[e]);
}

function hideActivityDivs() {
	for(var i=0; i!=Game.tabs.length; i++) {
		$("#"+Game.tabs[i].name+"TabActivityDiv").css('display', 'none');
		$("#"+Game.tabs[i].name+"Tab").removeClass('activeTab');
	}
}

//---------------------------
// Game
//---------------------------
Game = {};
Game.State = {};

Game.Start = function() {
	Game.initialized = 0;
	//---------------------------
	//Game Initialization
	//---------------------------
	Game.Init = function() {
		//---------------------------
		//Check for browser compat
		//---------------------------
		if(typeof(Storage)!=="undefined") {
			//---------------------------
			//Constants
			//---------------------------
			Game.version = 'Beta v0.2.1.0';
			Game.initialized = 1;
			Game.newGame = true;
			Game.fps = 30;
			Game.saveEvery = 300; //Save every 5 min
			Game.minPop = 1;
			Game.basePopPct = .05;
			Game.baseMaxPop = 2000;
			Game.basePopMod = 10;
			Game.baseHarvestMod = 1.0;
			Game.baseFoodHarvest = 2;
			Game.baseFoodMod = 30;
			Game.baseFoodPct = .05;
			Game.baseWoodHarvest = 1;
			Game.baseWoodMod = 60;
			Game.baseWoodPct = .05;
			Game.baseStoneHarvest = 1;
			Game.baseStoneMod = 90;
			Game.baseStonePct = .05;
			Game.housePop = 200;
			Game.baseClickExp = 1;
			Game.baseAutoClickExpMod = .1;
			Game.baseExpMod = 1;
			Game.houseWoodCost = 100;
			Game.housePopIncrease = 50;
			Game.cabinWoodCost = 500;
			Game.cabinStoneCost = 100;
			Game.cabinPopIncrease = 400;
			Game.baseFoodConsumptionTime = 600; //Every 10 min food is consumed
			Game.baseFoodConsumption = .1; //Every 1 pop eats .1 food
			Game.baseBuildingExpMod = 5;
			Game.sliderUpdate = 2;
			Game.sliderUpdateTime = 2; //Update sliders every 2 sec
			Game.baseMinTimeToAsteroid = 600; //Every 10 min
			Game.baseAsteroidHealth = 100; //100 health
			Game.baseAsteroidTime = 15; //15 seconds till despawn
			Game.baseAsteroidClickExp = 2;
			Game.baseAsteroidExhaustExp = 10;
			Game.baseAsteroidStone = 1;
			Game.expUpgradeAmount = 0.05;
			Game.baseMortalityRate = 0.01;
			Game.baseDeathTime = 120; //Every 2 min people die
			
			//---------------------------
			//Non-saved vars
			//---------------------------
			Game.timeToSave = 0;
			Game.nextPop = 0;
			Game.nextWood = 0;
			Game.nextFood = 0;
			Game.nextStone = 0;
			Game.newsId = 0;
			Game.delay = 0;
			Game.time = new Date().getTime();
			Game.news = new Array();
			Game.currIdlePop = Game.State.pop;
			Game.timeToAsteroid = 0;
			Game.lastTimeToAsteroid = 0;
			Game.asteroidSpawned = 0;
			Game.asteroid = {};

			//---------------------------
			//State Variables that will be saved
			//---------------------------
			Game.State.firstPlay = Game.time;
			Game.State.eraPlayed = Game.State.firstPlay;
			Game.State.exp = 0;
			Game.State.pop = 200;
			Game.State.houses = 0;
			Game.State.cabins = 0;
			Game.State.wood = 0;
			Game.State.food = 0;
			Game.State.stone = 0;
			Game.State.timeToEat = 0;
			Game.State.timeToDeath = 0;
			Game.State.era = 0;
			Game.State.planet = {};
			Game.State.achievements = {};
			//Sliders
			Game.State.range = {};
			Game.State.range.pop = 150;
			Game.State.range.food = 50;
			Game.State.range.wood = 0;
			Game.State.range.stone = 0;
			//Stats
			Game.State.stats = {};
			Game.State.stats.harvestAuto = 0;
			Game.State.stats.harvestClick = 0;
			Game.State.stats.minPop = 2000;
			Game.State.stats.maxPop = 2000;
			Game.State.stats.popStarved = 0;
			Game.State.stats.harvestPop = 0;
			Game.State.stats.harvestWood = 0;
			Game.State.stats.harvestFood = 0;
			Game.State.stats.harvestStone = 0;
			Game.State.stats.expGained = 0;
			Game.State.stats.asteroidSpawns = 0;
			Game.State.stats.asteroidClicks = 0;
			Game.State.stats.asteroidExhausts = 0;
			Game.State.stats.asteroidKills = 0;
			Game.State.stats.asteroidFoodKills = 0;
			Game.State.stats.asteroidWoodKills = 0;
			Game.State.stats.asteroidFreeStone = 0;
			Game.State.stats.upgradesBought = 0;
			Game.State.stats.buildings = 0;
			Game.State.stats.naturalDeaths = 0;
			Game.State.stats.erasVisited = 0;
			//Upgrades
			Game.State.upgrades = {};
			Game.State.upgrades.expMultLevel = 0;
			Game.State.upgrades.autoClickLevel = 0;
			Game.State.upgrades.autoSpeedLevel = 0;
			Game.State.upgrades.manualClickLevel = 0;
			Game.State.upgrades.upgradeCostLevel = 0;
			//Prestige Stuff
			Game.State.prestige = {};
			
			//Era's
			Game.era = Array();
			Game.era[0] = {
				name: 'Stone Age',
				maxPopulation: 10000,
				neededPop: 6000,
				cost: {
					food: 10000,
					wood: 5000,
					stone: 1000
				}
			};
			Game.era[1] = {
				name: 'Metal Age',
				maxPopulation: 100000,
				neededPop: 75000,
				cost: {}
			};
			
			//Game Tabs
			Game.tabs = Array();
			Game.tabButtonListener = Array();
			Game.tabs[0] = {
				name: "harvests"
			};
			Game.tabs[1] = {
				name: "buildings"
			};
			Game.tabs[2] = {
				name: "upgrades"
			};
			Game.tabs[3] = {
				name: "research"
			};
			Game.tabs[4] = {
				name: "mining"
			};
			
			//---------------------------
			//Load the Game
			//---------------------------
			Game.LoadGame();
			
			//---------------------------
			//Curr Calculators
			//---------------------------
			Game.UpdateCalculations();

			//---------------------------
			//Event Handlers
			//---------------------------
			//Menu Buttons - Click
			Game.saveGameButtonListener = snack.listener({node: document.getElementById('saveButton'),
				event: 'click'}, 
				function (){
					Game.SaveGame();
					Game.UpdateCheck();
				}
			);
			Game.menuButtonListener = snack.listener({node: document.getElementById('menuButton'),
				event: 'click'}, 
				function (){
					$("#newsDiv").html("");
					var txt = "<h3>MENU:</h3>";
					txt += "Save Game State (copy this and save it somewhere safe):<br />";
					txt += Game.ExportSave();
					$("#newsDiv").html(txt);
					$("#newsDiv").toggleClass('hiddenDiv');
					$("#overlay").toggleClass('hiddenDiv');
				}
			);
			Game.changeLogButtonListener = snack.listener({node: document.getElementById('changeLogButton'),
				event: 'click'}, 
				function (){
					$("#newsDiv").html("");
					var txt = "<h3>CHANGE LOG:</h3>\
						2014.04.23:&nbsp;&nbsp;&nbsp;Beta v0.2.1.0<br />\
						Added achievements & some stuff behind the scenes<br />\
						Reduced amount of exp each exp gain update gives from 10% to 5%<br />\
						<br />\
						2014.03.30:&nbsp;&nbsp;&nbsp;Beta v0.2.0.1<br />\
						Fixed some bugs with the click gather modifiers<br />\
						<br />\
						2014.03.30:&nbsp;&nbsp;&nbsp;Beta v0.2.0.0<br />\
						The Big Beta v0.2!<br />\
						New, more spacey color scheme! (Coming soon, option to change color schemes)<br />\
						Added hotkeys for the tabs, they go in order, 1-2-3<br />\
						Added CABINS (need 25 houses)! Now you can do something with all that pesky stone! Also, asteroids give stone!<br />\
						More Upgrades!<br />\
						More Stats!<br />\
						<br />\
						2014.03.18:&nbsp;&nbsp;&nbsp;Beta v0.1.9.0<br />\
						Added an Upgrade! More to come soon!<br />\
						Also, people die every 2 minutes now<br />\
						<br />\
						2014.03.11:&nbsp;&nbsp;&nbsp;Beta v0.1.8.0<br />\
						Added Stone Harvesting<br />\
						<br />\
						2014.02.25:&nbsp;&nbsp;&nbsp;Beta v0.1.7.1<br />\
						Added visual planets. Land masses are static for now, want to eventually<br />\
						make them random or pseudo-random. Colors are based on the planet you pick at the<br />\
						beginning of the game (or the one that was randomly assigned to you)<br />\
						This was not the big, cool thing, that's still in the works<br />\
						<br />\
						2014.02.25:&nbsp;&nbsp;&nbsp;Beta v0.1.7.0<br />\
						Added story to the beginning of the game<br />\
						Added planet selection to new games (old games get a boring default planet)<br />\
						<br />\
						2014.02.17:&nbsp;&nbsp;&nbsp;Beta v0.1.6.4<br />\
						Fixed some bugs<br />\
						<br />\
						2014.02.12:&nbsp;&nbsp;&nbsp;Beta v0.1.6.3<br />\
						Fixed some bugs w/ asteroids<br />\
						Tweaked food<br />\
						<br />\
						2014.02.11:&nbsp;&nbsp;&nbsp;Beta v0.1.6.2<br />\
						Asteroids now give exp (but nothing else yet)<br />\
						Adjusted food consumption & display of it<br />\
						<br />\
						2014.02.11:&nbsp;&nbsp;&nbsp;Beta v0.1.6.1<br />\
						ASTEROIDS!<br />\
						<br />\
						2014.02.10:&nbsp;&nbsp;&nbsp;Beta v0.1.5.1<br />\
						Added stats page<br />\
						<br />\
						2014.02.10:&nbsp;&nbsp;&nbsp;Beta v0.1.4.2<br />\
						Fixed sliders, they should affect growth too!<br />\
						<br />\
						2013.11.17:&nbsp;&nbsp;&nbsp;Beta v0.1.4.1<br />\
						Added news div<br />\
						Started work on sliders, while it doesn't affect pop growth, it should adjust based on available pop<br />\
						<br />\
						2013.11.13:&nbsp;&nbsp;&nbsp;Beta v0.1.3.1<br />\
						Fixed some bugs w/ food<br />\
						<br />\
						2013.11.12:&nbsp;&nbsp;&nbsp;Beta v0.1.3<br />\
						Added food harvesting & consumption<br />\
						Added exp gain from building houses<br />\
						<br />\
						2013.11.10:&nbsp;&nbsp;&nbsp;Beta v0.1.2<br />\
						Added update game notification<br />\
						Made it so houses can be purchased<br />\
						Added alert div<br />\
						Added save game button<br />";
					$("#newsDiv").html(txt);
					$("#newsDiv").toggleClass('hiddenDiv');
					$("#overlay").toggleClass('hiddenDiv');
				}
			);
			Game.newsButtonListener = snack.listener({node: document.getElementById('newsButton'),
				event: 'click'}, 
				function (){
					$("#newsDiv").html("");
					var i = Game.news.length;
					var j = 0;
					var txt = "<h3>NEWS:</h3>";
					while(i != 0 && j != 50) {
						txt += Game.news[i-1];
						txt += "<br />";
						i--;
						j++;
					}
					$("#newsDiv").html(txt);
					$("#newsDiv").toggleClass('hiddenDiv');
					$("#overlay").toggleClass('hiddenDiv');
				}
			);
			Game.statsButtonListener = snack.listener({node: document.getElementById('statsButton'),
				event: 'click'}, 
				function (){
					$("#newsDiv").html("");
					var firstPlay = new Date(Game.State.firstPlay);
					var thisEra = (new Date().getTime()) - Game.State.eraPlayed;
					var thisEraDisplay = thisEra/1000/60/60;
					var thisEraType = " hours";
					if(thisEraDisplay > 1000) {
						thisEraDisplay = thisEraDisplay/24;
						var thisEraType = " days";
					}
					var txt = "<h3>STATS</h3>"+
						"Game Started: " + (firstPlay.getMonth()+1) + "/" + firstPlay.getDate() + "/" + firstPlay.getFullYear() + "<br />" + 
						"Time Played this Era: ~" + hrFormat(thisEraDisplay) + thisEraType + "<br />" + 
						"Harvests Automatically Gathered: " + hrFormat(Game.State.stats.harvestAuto) + "<br />" +
						"Harvests Manually Clicked: " + hrFormat(Game.State.stats.harvestClick) + "<br />" +
						"Minimum Population Attained: " + hrFormat(Game.State.stats.minPop) + "<br />" +
						"Maximum Population Attained: " + hrFormat(Game.State.stats.maxPop) + "<br />" +
						"Population Starved to Death: " + hrFormat(Game.State.stats.popStarved) + "<br />" +
						"Total Population Bred: " + hrFormat(Game.State.stats.harvestPop) + "<br />" +
						"Total Wood Gathered: " + hrFormat(Game.State.stats.harvestWood) + "<br />" +
						"Total Food Gathered: " + hrFormat(Game.State.stats.harvestFood) + "<br />" +
						"Total Stone Gathered: " + hrFormat(Game.State.stats.harvestStone) + "<br />" +
						"Total Experience Gained: " + hrFormat(Game.State.stats.expGained) + "<br />" +
						"Number of Asteroids Spawned: " + hrFormat(Game.State.stats.asteroidSpawns) + "<br />" +
						"Number of Times Asteroids Clicked: " + hrFormat(Game.State.stats.asteroidClicks) + "<br />" +
						"Asteroids Exhausted: " + hrFormat(Game.State.stats.asteroidExhausts) + "<br />";
					if(Game.State.stats.asteroidKills > 0) {
						txt += "Deaths by Asteroid: " + hrFormat(Game.State.stats.asteroidKills) + "<br />";
					}
					if(Game.State.stats.asteroidFoodKills > 0) {
						txt += "Food Destroyed by Asteroid: " + hrFormat(Game.State.stats.asteroidFoodKills) + "<br />";
					}
					if(Game.State.stats.asteroidWoodKills > 0) {
						txt += "Wood Crushed by Asteroid: " + hrFormat(Game.State.stats.asteroidWoodKills) + "<br />";
					}
					if(Game.State.stats.asteroidFreeStone > 0) {
						txt += "Free Stone from Asteroid: " + hrFormat(Game.State.stats.asteroidFreeStone) + "<br />";
					}
					txt += "Natural Deaths: " + hrFormat(Game.State.stats.naturalDeaths) + "<br />" + 
						"Upgrades Purchased: " + hrFormat(Game.State.stats.upgradesBought) + "<br />" + 
						"Buildings Built: " + hrFormat(Game.State.stats.buildings);
						
					$("#newsDiv").html(txt);
					$("#newsDiv").toggleClass('hiddenDiv');
					$("#overlay").toggleClass('hiddenDiv');
				}
			);
			Game.achievementButtonListener = snack.listener({node: document.getElementById('achievementsButton'),
				event: 'click'}, 
				function (){
					$("#newsDiv").html("");
					var chievos = Game.State.achievements.chievos;
					var ndx = Game.State.achievements.chievoList;
					var achieved = Game.State.achievements.achieved;
					var txt = "<h3>ACHIEVEMENTS:</h3>";
					txt += achieved.length+"/"+ndx.length+" achieved";
					for(var i=0; i!= ndx.length; i++) {
						//Achieved
						if($.inArray(ndx[i], achieved) != -1) {
							//txt += " achieved' style=\"background-image: url('images/"+chievos[ndx[i]].image+"');\"";
							txt += "<div class='chievo achieved'><span class='chievoName'>"+chievos[ndx[i]].name+": </span>"+chievos[ndx[i]].desc+"</div>";
						//Hidden
						} else if(chievos[ndx[i]].hidden) {
							txt += "<div class='chievo hiddenChievo'><span class='chievoName'>HIDDEN: </span>???</div>";
						//Normal, unachieved
						} else {
							txt += "<div class='chievo'><span class='chievoName'>"+chievos[ndx[i]].name+": </span>"+chievos[ndx[i]].beforeDesc+"</div>";
						}
					}
					$("#newsDiv").html(txt);
					$("#newsDiv").toggleClass('hiddenDiv');
					$("#overlay").toggleClass('hiddenDiv');
				}
			);
			Game.alertButtonListener = snack.listener({node: document.getElementById('alertButton'),
				event: 'click'}, 
				function (){
					$("#newsDiv").html("");
					var txt = "<h3>Coming Soon!</h3>";
					$("#newsDiv").html(txt);
					$("#newsDiv").toggleClass('hiddenDiv');
					$("#overlay").toggleClass('hiddenDiv');
				}
			);
			Game.overlayListener = snack.listener({node: document.getElementById('overlay'),
				event: 'click'}, 
				function (){
					$("#newsDiv").toggleClass('hiddenDiv');
					$("#overlay").toggleClass('hiddenDiv');
				}
			);
			
			//Game Tabs Setup
			for(var i=0; i!=Game.tabs.length; i++) {
				$('#headerTabs').append("<div id='"+Game.tabs[i].name+"Tab' class='headerTab'>"+Game.tabs[i].name.toUpperCase()+"</div>");
				if(i==0) {
					$("#"+Game.tabs[i].name+"Tab").addClass('activeTab');
				}
			}
			$("#headerTabs .headerTab").bind("click",
				function(e) {
					hideActivityDivs();
					$('#'+this.id+"ActivityDiv").css('display', 'block');
					$('#'+this.id).addClass('activeTab');
				}
			);
			
			//Game Buttons - Click
			Game.popBarListener = snack.listener({node: document.getElementById('popProgBar'),
				event: 'click'}, 
				function (){
					Game.popBarListener.detach();
					
					var addedPop = 0;
					if(Game.nextPop >= Game.currPopMod*5*Game.currAutoSpeedMod) {
						Game.GiveExp(Game.currAutoClickExp);
						Game.State.stats.harvestAuto += 1;
						addedPop = Math.floor(Game.currPopIncrease * Game.currAutoClickMod);
					} else {
						Game.GiveExp(Game.currClickExp);
						Game.State.stats.harvestClick += 1;
						addedPop = Math.floor(Game.currPopIncrease * Game.currManualClickMod);
					}
					
					Game.State.pop += addedPop;
					Game.State.stats.harvestPop += addedPop;
					if(Game.State.pop > Game.State.stats.maxPop) {
						Game.State.stats.maxPop = Game.State.pop;
					}
					if(Game.State.pop > Game.currMaxPop) {
						Game.State.stats.harvestPop -= (Game.State.pop - Game.currMaxPop);
						Game.State.pop = Game.currMaxPop;
					}
					Game.nextPop = 0;
					
					$("#popProgBar").progressbar({value: 0});
					$("#popProgBar").addClass('disabled');
					$("#popProgBar").removeClass('enabled');
				}
			);
			Game.popBarListener.detach();
			$("#popProgBar").addClass('disabled');
			
			Game.woodBarListener = snack.listener({node: document.getElementById('woodProgBar'),
				event: 'click'}, 
				function (){
					Game.woodBarListener.detach();
					
					var addedWood = 0;
					if(Game.nextWood >= Game.currWoodMod*5*Game.currAutoSpeedMod) {
						addedWood = Math.floor(Game.currWoodHarvest * Game.currAutoClickMod);
						Game.GiveExp(Game.currAutoClickExp);
						Game.State.stats.harvestAuto += 1;
					} else {
						addedWood = Math.floor(Game.currWoodHarvest * Game.currManualClickMod);
						Game.GiveExp(Game.currClickExp);
						Game.State.stats.harvestClick += 1;
					}
					
					Game.State.wood += addedWood;
					Game.State.stats.harvestWood += addedWood;
					Game.nextWood = 0;
					$("#woodProgBar").progressbar({value: 0});
					$("#woodProgBar").addClass('disabled');
					$("#woodProgBar").removeClass('enabled');
				}
			);
			Game.woodBarListener.detach();
			$("#woodProgBar").addClass('disabled');
			
			Game.foodBarListener = snack.listener({node: document.getElementById('foodProgBar'),
				event: 'click'}, 
				function (){
					Game.foodBarListener.detach();
					
					var addedFood = 0;
					if(Game.nextFood >= Game.currFoodMod*5*Game.currAutoSpeedMod) {
						addedFood = Math.floor(Game.currFoodHarvest * Game.currAutoClickMod);
						Game.GiveExp(Game.currAutoClickExp);
						Game.State.stats.harvestAuto += 1;
					} else {
						addedFood = Math.floor(Game.currFoodHarvest * Game.currManualClickMod);
						Game.GiveExp(Game.currClickExp);
						Game.State.stats.harvestClick += 1;
					}
					Game.State.food += addedFood;
					Game.State.stats.harvestFood += addedFood;
					Game.nextFood = 0;
					$("#foodProgBar").progressbar({value: 0});
					$("#foodProgBar").addClass('disabled');
					$("#foodProgBar").removeClass('enabled');
				}
			);
			Game.foodBarListener.detach();
			$("#foodProgBar").addClass('disabled');
			
			Game.stoneBarListener = snack.listener({node: document.getElementById('stoneProgBar'),
				event: 'click'}, 
				function (){
					Game.stoneBarListener.detach();
					
					var addedStone = 0;
					if(Game.nextStone >= Game.currStoneMod*5*Game.currAutoSpeedMod) {
						addedStone = Math.floor(Game.currStoneHarvest * Game.currAutoClickMod);
						Game.GiveExp(Game.currAutoClickExp);
						Game.State.stats.harvestAuto += 1;
					} else {
						addedStone = Math.floor(Game.currStoneHarvest * Game.currManualClickMod);
						Game.GiveExp(Game.currClickExp);
						Game.State.stats.harvestClick += 1;
					}
					Game.State.stone += addedStone;
					Game.State.stats.harvestStone += addedStone;
					Game.nextStone = 0;
					$("#stoneProgBar").progressbar({value: 0});
					$("#stoneProgBar").addClass('disabled');
					$("#stoneProgBar").removeClass('enabled');
				}
			);
			Game.stoneBarListener.detach();
			$("#stoneProgBar").addClass('disabled');
			
			Game.houseBtnListener = snack.listener({node: document.getElementById('houseButton'),
				event: 'click'}, 
				function (){
					Game.GiveExp(Game.currBuildingExp);
					Game.houseBtnListener.detach();
					Game.State.houses += 1;
					Game.State.wood -= Game.currHouseWoodCost;
					Game.State.stats.buildings++;
					Game.EvaluateCosts();
					$("#houseButton").addClass('disabled');
					$("#houseButton").removeClass('enabled');
				}
			);
			Game.houseBtnListener.detach();
			$("#houseButton").addClass('disabled');
			
			Game.cabinBtnListener = snack.listener({node: document.getElementById('cabinButton'),
				event: 'click'}, 
				function (){
					Game.GiveExp(Game.currBuildingExp);
					Game.cabinBtnListener.detach();
					Game.State.cabins += 1;
					Game.State.wood -= Game.cabinWoodCost;
					Game.State.stone -= Game.cabinStoneCost;
					Game.State.stats.buildings++;
					Game.EvaluateCosts();
					$("#cabinButton").addClass('disabled');
					$("#cabinButton").removeClass('enabled');
				}
			);
			Game.cabinBtnListener.detach();
			$("#cabinButton").addClass('disabled');
			
			Game.experienceUpgradeListener = snack.listener({node: document.getElementById('experienceUpgrade'),
				event: 'click'}, 
				function (){
					Game.experienceUpgradeListener.detach();
					Game.State.exp -= Game.currExpUpgradeCost;
					Game.State.upgrades.expMultLevel++;
					Game.State.stats.upgradesBought++;
					Game.EvaluateCosts();
					$("#experienceUpgrade").addClass('disabled');
					$("#experienceUpgrade").removeClass('enabled');
				}
			);
			Game.experienceUpgradeListener.detach();
			$("#experienceUpgrade").addClass('disabled');
			
			Game.autoClickUpgradeListener = snack.listener({node: document.getElementById('autoClickUpgrade'),
				event: 'click'}, 
				function (){
					Game.autoClickUpgradeListener.detach();
					Game.State.exp -= Game.currAutoClickUpgradeCost;
					Game.State.upgrades.autoClickLevel++;
					Game.State.stats.upgradesBought++;
					Game.EvaluateCosts();
					$("#autoClickUpgrade").addClass('disabled');
					$("#autoClickUpgrade").removeClass('enabled');
				}
			);
			Game.autoClickUpgradeListener.detach();
			$("#autoClickUpgrade").addClass('disabled');
			
			Game.autoSpeedUpgradeListener = snack.listener({node: document.getElementById('autoSpeedUpgrade'),
				event: 'click'}, 
				function (){
					Game.autoSpeedUpgradeListener.detach();
					Game.State.exp -= Game.currAutoSpeedUpgradeCost;
					Game.State.upgrades.autoSpeedLevel++;
					Game.State.stats.upgradesBought++;
					Game.EvaluateCosts();
					$("#autoSpeedUpgrade").addClass('disabled');
					$("#autoSpeedUpgrade").removeClass('enabled');
				}
			);
			Game.autoSpeedUpgradeListener.detach();
			$("#autoSpeedUpgrade").addClass('disabled');
			
			Game.manualClickUpgradeListener = snack.listener({node: document.getElementById('manualClickUpgrade'),
				event: 'click'}, 
				function (){
					Game.manualClickUpgradeListener.detach();
					Game.State.exp -= Game.currManualClickUpgradeCost;
					Game.State.upgrades.manualClickLevel++;
					Game.State.stats.upgradesBought++;
					Game.EvaluateCosts();
					$("#manualClickUpgrade").addClass('disabled');
					$("#manualClickUpgrade").removeClass('enabled');
				}
			);
			Game.manualClickUpgradeListener.detach();
			$("#manualClickUpgrade").addClass('disabled');
			
			Game.upgradeCostUpgradeListener = snack.listener({node: document.getElementById('upgradeCostUpgrade'),
				event: 'click'}, 
				function (){
					Game.upgradeCostUpgradeListener.detach();
					Game.State.exp -= Game.currUpgradeCostUpgradeCost;
					Game.State.upgrades.upgradeCostLevel++;
					Game.State.stats.upgradesBought++;
					Game.EvaluateCosts();
					$("#upgradeCostUpgrade").addClass('disabled');
					$("#upgradeCostUpgrade").removeClass('enabled');
				}
			);
			Game.upgradeCostUpgradeListener.detach();
			$("#upgradeCostUpgrade").addClass('disabled');
			
			Game.asteroidClickListener = snack.listener({node: document.getElementById('asteroid'),
				event: 'click'}, 
				function (){
					Game.AsteroidClick();
				}
			);
			Game.asteroidClickListener.detach();
			
			//Game Buttons - On mouseover
			Game.popBarOverListener = snack.listener({node: document.getElementById('popProgBar'),
				event: 'mouseover'}, 
				function(){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Next Base Gain: " + hrFormat(Game.currPopIncrease) + "<br />" +
							"Gain/hr (Auto): " + hrFormat(Game.currPopIncrease*Game.currAutoClickMod * 3600/(Game.currPopMod*5*Game.currAutoSpeedMod)) + "<br />" +
							"Gain/hr (Manual): " + hrFormat(Game.currPopIncrease*Game.currManualClickMod * 3600/(Game.currPopMod)) + "<br />" +
							"Death/hr (Natural): " + hrFormat(Game.currMortalityRate * Game.State.pop * 3600/Game.currDeathTime) + "<br />");
					});
				}
			);
			Game.woodBarOverListener = snack.listener({node: document.getElementById('woodProgBar'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Next Base Gain: " + hrFormat(Game.currWoodHarvest) + "<br />" +
							"Gain/hr (Auto): " + hrFormat(Game.currWoodHarvest*Game.currAutoClickMod * 3600/(Game.currWoodMod*5*Game.currAutoSpeedMod)) + "<br />" +
							"Gain/hr (Manual): " + hrFormat(Game.currWoodHarvest*Game.currManualClickMod * 3600/(Game.currWoodMod)) + "<br />");
					});
				}
			);
			Game.foodBarOverListener = snack.listener({node: document.getElementById('foodProgBar'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Next Base Gain: " + hrFormat(Game.currFoodHarvest) + "<br />" +
							"Gain/hr (Auto): " + hrFormat(Game.currFoodHarvest*Game.currAutoClickMod * 3600/(Game.currFoodMod*5*Game.currAutoSpeedMod)) + "<br />" +
							"Gain/hr (Manual): " + hrFormat(Game.currFoodHarvest*Game.currManualClickMod * 3600/(Game.currFoodMod)) + "<br />" +
							"Consumed/hr: " + hrFormat(Game.currFoodConsumption * Game.State.pop * 6));
					});
				}
			);
			Game.stoneBarOverListener = snack.listener({node: document.getElementById('stoneProgBar'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Next Base Gain: " + hrFormat(Game.currStoneHarvest) + "<br />" +
							"Gain/hr (Auto): " + hrFormat(Game.currStoneHarvest*Game.currAutoClickMod * 3600/(Game.currStoneMod*5*Game.currAutoSpeedMod)) + "<br />" +
							"Gain/hr (Manual): " + hrFormat(Game.currStoneHarvest*Game.currManualClickMod * 3600/(Game.currStoneMod)) + "<br />");
					});
				}
			);
			Game.houseButtonOverListener = snack.listener({node: document.getElementById('houseButton'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "House Cost: " + hrFormat(Game.currHouseWoodCost) + 
								" wood<br />Population Increase: " + hrFormat(Game.housePopIncrease));
					});
				}
			);
			Game.cabinButtonOverListener = snack.listener({node: document.getElementById('cabinButton'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Cabin Cost: " + hrFormat(Game.currCabinWoodCost) + 
								" wood<br />" + hrFormat(Game.currCabinStoneCost) + " stone<br />" + 
								"Population Increase: " + hrFormat(Game.cabinPopIncrease));
					});
				}
			);
			Game.experienceUpgradeOverListener = snack.listener({node: document.getElementById('experienceUpgrade'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Current Level: "+(Game.expUpgradeAmount*Game.State.upgrades.expMultLevel+1).toFixed(2)+"x<br />" + 
								"Next Level: "+(Game.expUpgradeAmount*(Game.State.upgrades.expMultLevel+1)+1).toFixed(2)+"x<br />Cost: "+Game.currExpUpgradeCost+" Exp");
					});
				}
			);
			Game.autoClickUpgradeOverListener = snack.listener({node: document.getElementById('autoClickUpgrade'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Current Level: "+(0.05*Game.State.upgrades.autoClickLevel+1).toFixed(2)+"x<br />" + 
								"Next Level: "+(0.05*(Game.State.upgrades.autoClickLevel+1)+1).toFixed(2)+"x<br />Cost: "+Game.currAutoClickUpgradeCost+" Exp");
					});
				}
			);
			Game.autoSpeedUpgradeOverListener = snack.listener({node: document.getElementById('autoSpeedUpgrade'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						if(Game.State.upgrades.upgradeCostLevel < 75) {
							Game.ShowPopUpDiv(event.pageX, event.pageY, "Current Level: "+(1-0.01*Game.State.upgrades.autoSpeedLevel).toFixed(2)+"x<br />" + 
									"Next Level: "+(1-0.01*(Game.State.upgrades.autoSpeedLevel+1)).toFixed(2)+"x<br />Cost: "+Game.currAutoSpeedUpgradeCost+" Exp");
						} else {
							Game.ShowPopUpDiv(event.pageX, event.pageY, "Current Level: "+(1-0.01*Game.State.upgrades.autoSpeedLevel).toFixed(2)+"x<br />Max Level Attained");
						}
					});
				}
			);
			Game.manualClickUpgradeOverListener = snack.listener({node: document.getElementById('manualClickUpgrade'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Current Level: "+(0.1*Game.State.upgrades.manualClickLevel+1).toFixed(2)+"x<br />" + 
								"Next Level: "+(0.1*(Game.State.upgrades.manualClickLevel+1)+1).toFixed(2)+"x<br />Cost: "+Game.currManualClickUpgradeCost+" Exp");
					});
				}
			);
			Game.upgradeCostUpgradeOverListener = snack.listener({node: document.getElementById('upgradeCostUpgrade'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						if(Game.State.upgrades.upgradeCostLevel < 75) {
							Game.ShowPopUpDiv(event.pageX, event.pageY, "Current Level: "+(1-0.01*Game.State.upgrades.upgradeCostLevel).toFixed(2)+"x<br />" + 
									"Next Level: "+(1-0.01*(Game.State.upgrades.upgradeCostLevel+1)).toFixed(2)+"x<br />Cost: "+Game.currUpgradeCostUpgradeCost+" Exp");
						} else {
							Game.ShowPopUpDiv(event.pageX, event.pageY, "Current Level: "+(1-0.01*Game.State.upgrades.upgradeCostLevel).toFixed(2)+"x<br />Max Level Attained");
						}
					});
				}
			);
			Game.eraUpgradeOverListener = snack.listener({node: document.getElementById('eraUpgrade'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "The developer needs to do this...");
					});
				}
			);
			
			//Game Buttons - On mouseout
			$(".activityDiv .gameButton").bind("mouseout",
				function(e) {
					Game.HidePopUpDiv();
				}
			);
			
			//Keyboard Listeners
			Game.keyboardListener = snack.listener({node: document.getElementById('body'),
				event: 'keypress'}, 
				function(evt){
					switch(evt.charCode){
						case 49: {
							$("#"+Game.tabs[0].name+"Tab").click();
							break;
						}
						case 50: {
							$("#"+Game.tabs[1].name+"Tab").click();
							break;
						}
						case 51: {
							$("#"+Game.tabs[2].name+"Tab").click();
							break;
						}
						case 52: {
							if(Game.State.era > 0) {
							$("#"+Game.tabs[3].name+"Tab").click();
							}
							break;
						}
						case 53: {
							if(Game.State.era > 0) {
							$("#"+Game.tabs[4].name+"Tab").click();
							}
							break;
						}
						default: {
							break;
						}
					}
				}
			);
			
			//Game Sliders
			$(function() {
				$("#popSlider").slider({
				  range: "min",
				  value: Game.State.range.pop,
				  min: 2,
				  max: Game.State.pop,
				  slide: function( event, ui ) {
					Game.State.range.pop = ui.value;
					Game.UpdateSliders();
					if(Game.currIdlePop < 0) {
						ui.value += Game.currIdlePop;
						Game.UpdateSliders();
					}
					Game.State.range.pop = ui.value;
					$("#popRangeLabel").html(hrFormat(Game.State.range.pop));
					Game.nextPop = 0;
					Game.popBarListener.detach();
					$("#popProgBar").addClass('disabled');
					$("#popProgBar").removeClass('enabled');
				  }
				});
				$("#popRangeLabel").html(hrFormat(Game.State.range.pop));
			});
			$(function() {
				$("#foodSlider").slider({
				  range: "min",
				  value: Game.State.range.food,
				  min: 0,
				  max: Game.State.pop,
				  slide: function( event, ui ) {
					Game.State.range.food = ui.value;
					Game.UpdateSliders();
					if(Game.currIdlePop < 0) {
						ui.value += Game.currIdlePop;
						Game.UpdateSliders();
					}
					Game.State.range.food = ui.value;
					$("#foodRangeLabel").html(hrFormat(Game.State.range.food));
					Game.nextFood = 0;
					Game.foodBarListener.detach();
					$("#foodProgBar").addClass('disabled');
					$("#foodProgBar").removeClass('enabled');
				  }
				});
				$("#foodRangeLabel").html(hrFormat(Game.State.range.food));
			});
			$(function() {
				$("#woodSlider").slider({
				  range: "min",
				  value: Game.State.range.wood,
				  min: 0,
				  max: Game.State.pop,
				  slide: function( event, ui ) {
					Game.State.range.wood = ui.value;
					Game.UpdateSliders();
					if(Game.currIdlePop < 0) {
						ui.value += Game.currIdlePop;
						Game.UpdateSliders();
					}
					Game.State.range.wood = ui.value;
					$("#woodRangeLabel").html(hrFormat(Game.State.range.wood));
					Game.nextWood = 0;
					Game.woodBarListener.detach();
					$("#woodProgBar").addClass('disabled');
					$("#woodProgBar").removeClass('enabled');
				  }
				});
				$("#woodRangeLabel").html(hrFormat(Game.State.range.wood));
			});
			$(function() {
				$("#stoneSlider").slider({
				  range: "min",
				  value: Game.State.range.stone,
				  min: 0,
				  max: Game.State.pop,
				  slide: function( event, ui ) {
					Game.State.range.stone = ui.value;
					Game.UpdateSliders();
					if(Game.currIdlePop < 0) {
						ui.value += Game.currIdlePop;
						Game.UpdateSliders();
					}
					Game.State.range.stone = ui.value;
					$("#stoneRangeLabel").html(hrFormat(Game.State.range.stone));
					Game.nextStone = 0;
					Game.stoneBarListener.detach();
					$("#stoneProgBar").addClass('disabled');
					$("#stoneProgBar").removeClass('enabled');
				  }
				});
				$("#stoneRangeLabel").html(hrFormat(Game.State.range.stone));
			});
			
			//---------------------------
			//Start the game
			//---------------------------
			$('#document').css('display','block');
			$('#version').html(Game.version);
			Game.Loop();
		} else {
			$('#document').css('display','none');
			e('body').innerHTML = "This game requires an HTML5 compliant browser.<br />This" +
					" includes IE8+, Chrome, Firefox, Safari, and Opera.";
		}
	};
	
	Game.ShowPopUpDiv = function(x, y, txt) {
		e('popUpDiv').innerHTML = txt;
		if(x+160 > document.body.offsetWidth) {
			x = document.body.offsetWidth - 160 - 15;
		}
		if(y+80 > document.body.offsetHeight) {
			y = document.body.offsetHeight - 80 - 15;
		}
		$('#popUpDiv').css('left',x+5+"px");
		$('#popUpDiv').css('top',y+5+"px");
		$('#popUpDiv').css('display','block');
	};
	
	Game.HidePopUpDiv = function() {
		$('#popUpDiv').css('display','none');
	}
	
	Game.WipeGame = function() {
		localStorage.gameState=JSON.stringify({});
		window.location.reload();
	};
	
	//---------------------------
	//Start A New Game
	//---------------------------
	Game.NewGame = function() {
		Game.newGame = true;
		Game.State.achievements = new Achievements();
		$('#baseTab').css('display','none');
		$('#headerTabs').css('display','none');
		$('#intro').html('<br />You are the leader of one of many colony ships that left Earth many years \
		ago. Your ships scanners have finally found what could be your new home. Your ship is the first \
		to reach its destination so you have little experience or knowledge of what is to come. You must \
		now choose which planet your people will now colonize:<br /><br />');
		var planet1 = new Planet(true);
		planet1.name = "Planet A";
		var planet2 = new Planet(true);
		planet2.name = "Planet B";
		$('#intro').append('<div id="planet1" class="planetChoice"><strong>'+planet1.name+'</strong><br /> \
		This planet has '+planet1.cosmetic.color1+' flora and '+planet1.cosmetic.color2+' tinted water. \
		The scanners indicate this is an otherwise normal planet with '+planet1.satellites.length+' moons.</div>');
		$('#intro').append('<div id="planet2" class="planetChoice"><strong>'+planet2.name+'</strong><br /> \
		This planet has '+planet2.cosmetic.color1+' flora and '+planet2.cosmetic.color2+' tinted water. \
		The scanners indicate this is an otherwise normal planet with '+planet2.satellites.length+' moons.</div>');
		
		Game.planet1ClickListener = snack.listener({node: document.getElementById('planet1'),
			event: 'click'}, 
			function (){
				Game.State.planet = planet1;
				$('#baseTab').css('display','block');
				$('#headerTabs').css('display','block');
				$('#intro').css('display','none');
				Game.newGame = false;
				Game.Loop();
			}
		);
		Game.planet2ClickListener = snack.listener({node: document.getElementById('planet2'),
			event: 'click'}, 
			function (){
				Game.State.planet = planet2;
				$('#baseTab').css('display','block');
				$('#headerTabs').css('display','block');
				$('#intro').css('display','none');
				Game.newGame = false;
				Game.Loop();
			}
		);
	}
	
	//---------------------------
	//Load the Game
	//---------------------------
	Game.LoadGame = function() {
		try {
			if(localStorage.gameState != JSON.stringify({})) {
				//We want to extend the state so that if the user is loading an old version, it works.
				//This only runs into issues if variables change, which means we'll need special cases 
				//whenever that happens.
				jQuery.extend(true,Game.State,JSON.parse(localStorage.gameState));
				Game.news.push("Loaded Successfully");
				Game.newGame = false;
				var tmpPlanet = new Planet(true);
				Game.State.planet = tmpPlanet.LoadPlanet(Game.State.planet);
				var tmpChievo = new Achievements();
				Game.State.achievements = tmpChievo.LoadAchievements(Game.State.achievements);
			} else {
				Game.news.push("No Saved Game Found");
				Game.NewGame();
			}
		} catch(e) {
			Game.news.push("Error Loading Saved Game");
			Game.NewGame();
		}
	};
	
	Game.WriteBreakingNews = function(id) {
		$('#breakingNews').append("<div class='breakingNewsItem' id='newsItem"+id+"'>"+Game.news[id]+"</div>");
		$('#newsItem'+id).delay(2000).fadeOut(6000); 
	}
	
	//---------------------------
	//Save the Game
	//---------------------------
	Game.EncryptSave = function(str) {
		return str>>2;
	}
	Game.ExportSave = function() {
		return JSON.stringify(Game.State, Game.EncryptSave);
	}
	Game.DecryptSave = function(str) {
		return str<<2;
	}
	Game.ImportSave = function() {
		var save = prompt('Please paste in the text that was given to you on save export.','');
		if (save && save!='') {
			Game.State = JSON.parse(save, Game.DecryptSave);
		}
		Game.SaveGame();
	}
	
	Game.SaveGame = function() {
		Game.UpdateCalculations();
		var theGame = JSON.stringify(Game.State);
		localStorage.gameState = theGame;
		Game.news.push("Game Saved");
	};
	
	//---------------------------
	//Draw the Game
	//---------------------------
	Game.Draw = function() {
		if(Game.newsId != Game.news.length) {
			Game.WriteBreakingNews(Game.newsId);
			Game.newsId = Game.news.length;
		}
		e('eraName').innerHTML = "Era: " + Game.era[Game.State.era].name;
		e('experience').innerHTML = "Experience: " + (Game.State.exp).toFixed(1);
		e('population').innerHTML = "Population: " + hrFormat(Game.State.pop) + " / " + hrFormat(Game.currMaxPop);
		e('idlePop').innerHTML = "Idle Pop: " + hrFormat(Game.currIdlePop < 0 ? 0 : Game.currIdlePop);
		e('food').innerHTML = "Food: " + hrFormat(Game.State.food);
		e('wood').innerHTML = "Wood: " + hrFormat(Game.State.wood);
		e('stone').innerHTML = "Stone: " + hrFormat(Game.State.stone);
		e('houses').innerHTML = "Houses: " + hrFormat(Game.State.houses);
		if(Game.State.houses >= 25) {
			e('cabins').innerHTML = "Cabins: " + hrFormat(Game.State.cabins);
		}
		
		//Population Progress Bar
		$(function() {
			$("#popProgBar").progressbar({
				value: Game.nextPop,
				max: Game.currPopMod,
				complete: function( event, ui ) {
					$("#popProgBar").removeClass('disabled');
					$("#popProgBar").addClass('enabled');
					Game.popBarListener.attach();
				}
			});
		});
		
		//Wood Progress Bar
		$(function() {
			$("#woodProgBar").progressbar({
				value: Game.nextWood,
				max: Game.currWoodMod,
				complete: function( event, ui ) {
					$("#woodProgBar").removeClass('disabled');
					$("#woodProgBar").addClass('enabled');
					Game.woodBarListener.attach();
				}
			});
		});
		
		//Food Progress Bar
		$(function() {
			$("#foodProgBar").progressbar({
				value: Game.nextFood,
				max: Game.currFoodMod,
				complete: function( event, ui ) {
					$("#foodProgBar").removeClass('disabled');
					$("#foodProgBar").addClass('enabled');
					Game.foodBarListener.attach();
				}
			});
		});
		
		//Stone Progress Bar
		$(function() {
			$("#stoneProgBar").progressbar({
				value: Game.nextStone,
				max: Game.currStoneMod,
				complete: function( event, ui ) {
					$("#stoneProgBar").removeClass('disabled');
					$("#stoneProgBar").addClass('enabled');
					Game.stoneBarListener.attach();
				}
			});
		});
		
		//Planet
		Game.State.planet.Draw('planetCanvas');
	};
	
	Game.AsteroidSpawn = function() {
		Game.asteroidSpawned = 1;
		Game.State.stats.asteroidSpawns++;
		Game.asteroid.asteroidSpawnedAt = Game.timeToAsteroid;
		Game.asteroid.health = Game.baseAsteroidHealth;
		Game.asteroidClickListener.attach();
		Game.asteroid.div = $('#asteroid');
		Game.asteroid.div.css('background-image', 'url("images/asteroid_full.png")');
		Game.asteroid.div.css('top', '0px');
		Game.asteroid.div.css('left', Math.random()*99+'%');
		Game.asteroid.div.css('display', 'block');
		Game.asteroid.div.animate({ 'top': Math.random()*70+25+'%', 'left': Math.random()*95+'%'}, 1000, function() {Game.asteroid.div.css('background-image', 'url("images/asteroid.png")');});
		if(Math.random() >= 0.95) {
			//5% chance to do something:
			var type = Math.random();
			if(type < 0.25) { //25% chance to kill people
				Game.news.push("The Asteroid killed "+hrFormat(Game.State.pop * 0.01)+" People");
				Game.State.stats.asteroidKills += Game.State.pop * 0.01;
				Game.State.pop = Math.floor(Game.State.pop * 0.99);
				if(Game.State.pop < 2) {
					Game.State.pop = 2;
				}
			} else if(type < 0.55) { //30% chance to destroy food
				Game.news.push("The Asteroid landed on you food stores!");
				Game.State.stats.asteroidFoodKills += Game.State.food * 0.1;
				Game.State.food = Math.floor(Game.State.food * 0.9);
			} else if(type < 0.85) { //30% chance to destroy wood
				Game.news.push("The Asteroid crushed your wood piles!");
				Game.State.stats.asteroidWoodKills += Game.State.wood * 0.05;
				Game.State.wood = Math.floor(Game.State.wood * 0.95);
			} else { //15% chance to destr- nah, free rocks!
				Game.news.push("The Asteroid landed in your quarry! Eh, free stones!");
				Game.State.stats.asteroidFreeStone += Game.State.stone * 0.01;
				Game.State.stone = Math.floor(Game.State.stone * 0.99);
			}
		}
	}

	Game.AsteroidClick = function() {
		if(Game.asteroidSpawned == 1) {
			if(Game.asteroid.health > 0) {
				Game.State.stats.asteroidClicks++;
				Game.GiveExp(Game.currAsteroidClickExp);
				Game.State.stone += Game.currAsteroidStone;
				Game.asteroid.health -= 1;
				Game.news.push("Asteroid Mined");
			}
			if(Game.asteroid.health <= 0) {
				Game.asteroidSpawned = 0;
				Game.GiveExp(Game.currAsteroidExhaustExp);
				Game.news.push("Asteroid Exhausted");
				Game.State.stats.asteroidExhausts++;
				Game.AsteroidDespawn();
			}
		}
	}
	
	Game.AsteroidDespawn = function() {
		Game.asteroid.div.fadeOut();
		Game.timeToAsteroid = 0;
		Game.asteroidSpawned = 0;
	}
	
	Game.UpdateSliders = function() {
		//Check over pop for sliders
		if(Game.currIdlePop < 0) {
			/*if(Game.State.range.pop - 2 > Game.State.currIdlePop * -1) {
				Game.State.range.pop = Game.State.range.pop + Game.State.currIdlePop;
			} else {
				Game.State.range.pop = 2;
				Game.UpdateCalculations();
				if(Game.State.range.wood > Game.State.currIdlePop * -1) {
					Game.State.range.wood = Game.State.range.pop + Game.State.currIdlePop;
				} else {
					Game.State.range.wood = 0;
					Game.UpdateCalculations();
					Game.State.range.food = Game.State.range.pop + Game.State.currIdlePop;
				}
			}*/
		}
		
		//Pop Slider
		$("#popSlider").slider("option", "max", Game.State.pop);
		var value = Game.State.range.pop;
		value = value > Game.State.pop ? Game.State.pop : value;
		Game.State.range.pop = value;
		$("#popSlider").slider("option", "value", value);
		$("#popRangeLabel").html(hrFormat(value));
		
		$("#foodSlider").slider("option", "max", Game.State.pop);
		var value = Game.State.range.food;
		value = value > Game.State.pop ? Game.State.pop : value;
		Game.State.range.food = value;
		$("#foodSlider").slider("option", "value", value);
		$("#foodRangeLabel").html(hrFormat(value));
		
		$("#woodSlider").slider("option", "max", Game.State.pop);
		var value = Game.State.range.wood;
		value = value > Game.State.pop ? Game.State.pop : value;
		Game.State.range.wood = value;
		$("#woodSlider").slider("option", "value", value);
		$("#woodRangeLabel").html(hrFormat(value));
		
		$("#stoneSlider").slider("option", "max", Game.State.pop);
		var value = Game.State.range.stone;
		value = value > Game.State.pop ? Game.State.pop : value;
		Game.State.range.stone = value;
		$("#stoneSlider").slider("option", "value", value);
		$("#stoneRangeLabel").html(hrFormat(value));
		
		Game.currIdlePop = Game.State.pop - $("#popSlider").slider("option", "value") - $("#foodSlider").slider("option", "value")
			- $("#woodSlider").slider("option", "value") - $("#stoneSlider").slider("option", "value");
	}
	
	Game.UpdateCalculations = function() {
		Game.currExpMod = Game.baseExpMod + Game.State.upgrades.expMultLevel * Game.expUpgradeAmount;
		Game.currAutoClickMod = (1+0.05*Game.State.upgrades.autoClickLevel).toFixed(2);
		Game.currAutoSpeedMod = (1-0.01*Game.State.upgrades.autoSpeedLevel).toFixed(2);
		Game.currManualClickMod = (1+0.1*Game.State.upgrades.manualClickLevel).toFixed(2);
		Game.currUpgradeCostReduction = (1-0.01*Game.State.upgrades.upgradeCostLevel).toFixed(2);
		
		Game.currClickExp = Game.baseClickExp;
		Game.currAutoClickExpMod = Game.baseAutoClickExpMod;
		Game.currAutoClickExp = Game.currClickExp * Game.currAutoClickExpMod;
		Game.currBuildingExp = Game.currClickExp * Game.baseBuildingExpMod;
		Game.currPopPct = Game.basePopPct;
		Game.currPopIncrease = Math.floor(Game.currPopPct * Game.State.range.pop + Game.minPop);
		Game.currMaxPop = Game.baseMaxPop + (Game.housePopIncrease * Game.State.houses) + (Game.cabinPopIncrease * Game.State.cabins);
		Game.currPopMod = Game.basePopMod;
		Game.currWoodMod = Game.baseWoodMod;
		Game.currFoodMod = Game.baseFoodMod;
		Game.currStoneMod = Game.baseStoneMod;
		Game.currHarvestMod = Game.baseHarvestMod;
		Game.currWoodHarvest = Math.ceil(Game.baseWoodHarvest * Game.baseWoodPct * Game.currHarvestMod * Game.State.range.wood);
		Game.currFoodHarvest = Math.ceil(Game.baseFoodHarvest * Game.baseFoodPct * Game.currHarvestMod * Game.State.range.food);
		Game.currStoneHarvest = Math.ceil(Game.baseStoneHarvest * Game.baseStonePct * Game.currHarvestMod * Game.State.range.stone);
		Game.currFoodConsumptionTime = Game.baseFoodConsumptionTime;
		Game.currFoodConsumption = Game.baseFoodConsumption;
		Game.currMinTimeToAsteroid = Game.baseMinTimeToAsteroid;
		Game.currAsteroidTime = Game.baseAsteroidTime;
		Game.currAsteroidClickExp = Game.baseAsteroidClickExp;
		Game.currAsteroidExhaustExp = Game.baseAsteroidExhaustExp;
		Game.currAsteroidStone = Game.baseAsteroidStone;
		Game.currMortalityRate = Game.baseMortalityRate;
		Game.currDeathTime = Game.baseDeathTime;
		
		Game.currHouseWoodCost = Game.houseWoodCost;
		Game.currCabinWoodCost = Game.cabinWoodCost;
		Game.currCabinStoneCost = Game.cabinStoneCost;
		
		Game.currExpUpgradeCost = Math.floor((Math.pow(Game.State.upgrades.expMultLevel,3) * 1.1+100)*Game.currUpgradeCostReduction);
		Game.currAutoClickUpgradeCost = Math.floor((Math.pow(Game.State.upgrades.autoClickLevel,3) * 1.3+1000)*Game.currUpgradeCostReduction);
		Game.currAutoSpeedUpgradeCost = Math.floor((Math.pow(Game.State.upgrades.autoSpeedLevel,3) * 1.5+2500)*Game.currUpgradeCostReduction);
		Game.currManualClickUpgradeCost = Math.floor((Math.pow(Game.State.upgrades.manualClickLevel,3) * 1.2+1000)*Game.currUpgradeCostReduction);
		Game.currUpgradeCostUpgradeCost = Math.floor((Math.pow(Game.State.upgrades.upgradeCostLevel,4) * 2.0+1500)*Game.currUpgradeCostReduction);
		
		
		if(Game.State.houses >= 25) {
			$("#cabinButton").css('display','block');
		}
	};
	
	Game.CheckEras = function() {
		if(Game.State.era > 0) {
			$('#researchTab').css('display','block');
		} else {
			$('#researchTab').css('display','none');
		}
		if(Game.State.era > 1) {
			$('#miningTab').css('display','block');
		} else {
			$('#miningTab').css('display','none');
		}
	}
	
	Game.UpdateButtons = function() {
		//House Button
		if(Game.State.wood >= Game.currHouseWoodCost) {
			$("#houseButton").removeClass('disabled');
			$("#houseButton").addClass('enabled');
			Game.houseBtnListener.attach();
		} else {
			$("#houseButton").removeClass('enabled');
			$("#houseButton").addClass('disabled');
			Game.houseBtnListener.detach();
		}
		//Cabin Button
		if(Game.State.wood >= Game.currCabinWoodCost && 
		   Game.State.stone >= Game.currCabinStoneCost) {
			$("#cabinButton").removeClass('disabled');
			$("#cabinButton").addClass('enabled');
			Game.cabinBtnListener.attach();
		} else {
			$("#cabinButton").removeClass('enabled');
			$("#cabinButton").addClass('disabled');
			Game.cabinBtnListener.detach();
		}
	}
	
	Game.UpdateUpgrades = function() {
		//Upgrade Buttons
		if(Game.State.exp >= Game.currExpUpgradeCost) {
			$("#experienceUpgrade").removeClass('disabled');
			$("#experienceUpgrade").addClass('enabled');
			Game.experienceUpgradeListener.attach();
		} else {
			$("#experienceUpgrade").removeClass('enabled');
			$("#experienceUpgrade").addClass('disabled');
			Game.experienceUpgradeListener.detach();
		}
		if(Game.State.exp >= Game.currAutoClickUpgradeCost) {
			$("#autoClickUpgrade").removeClass('disabled');
			$("#autoClickUpgrade").addClass('enabled');
			Game.autoClickUpgradeListener.attach();
		} else {
			$("#autoClickUpgrade").removeClass('enabled');
			$("#autoClickUpgrade").addClass('disabled');
			Game.autoClickUpgradeListener.detach();
		}
		if(Game.State.upgrades.autoSpeedLevel < 75 && Game.State.exp >= Game.currAutoSpeedUpgradeCost) {
			$("#autoSpeedUpgrade").removeClass('disabled');
			$("#autoSpeedUpgrade").addClass('enabled');
			Game.autoSpeedUpgradeListener.attach();
		} else {
			$("#autoSpeedUpgrade").removeClass('enabled');
			$("#autoSpeedUpgrade").addClass('disabled');
			Game.autoSpeedUpgradeListener.detach();
		}
		if(Game.State.exp >= Game.currManualClickUpgradeCost) {
			$("#manualClickUpgrade").removeClass('disabled');
			$("#manualClickUpgrade").addClass('enabled');
			Game.manualClickUpgradeListener.attach();
		} else {
			$("#manualClickUpgrade").removeClass('enabled');
			$("#manualClickUpgrade").addClass('disabled');
			Game.manualClickUpgradeListener.detach();
		}
		if(Game.State.upgrades.upgradeCostLevel < 75 && Game.State.exp >= Game.currUpgradeCostUpgradeCost) {
			$("#upgradeCostUpgrade").removeClass('disabled');
			$("#upgradeCostUpgrade").addClass('enabled');
			Game.upgradeCostUpgradeListener.attach();
		} else {
			$("#upgradeCostUpgrade").removeClass('enabled');
			$("#upgradeCostUpgrade").addClass('disabled');
			Game.upgradeCostUpgradeListener.detach();
		}
	}
	
	Game.EvaluateCosts = function() {
		Game.UpdateCalculations();
		Game.CheckEras();
		Game.UpdateButtons();
		Game.UpdateUpgrades();
	}
	
	Game.CheckChievos = function() {
		achieved = Game.State.achievements.achieved;
		//Manual Harvests
		if(Game.State.stats.harvestClick >= 5000) {
			if($.inArray(4, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(4);
			}
		}
		if(Game.State.stats.harvestClick >= 1000) {
			if($.inArray(3, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(3);
			}
		}
		if(Game.State.stats.harvestClick >= 100) {
			if($.inArray(2, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(2);
			}
		}
		if(Game.State.stats.harvestClick >= 10) {
			if($.inArray(1, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(1);
			}
		} 
		if(Game.State.stats.harvestClick >= 1) {
			if($.inArray(0, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(0);
			}
		}
		
		//Auto Harvests
		if(Game.State.stats.harvestAuto >= 5000) {
			if($.inArray(14, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(14);
			}
		} 
		if(Game.State.stats.harvestAuto >= 1000) {
			if($.inArray(13, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(13);
			}
		} 
		if(Game.State.stats.harvestAuto >= 100) {
			if($.inArray(12, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(12);
			}
		} 
		if(Game.State.stats.harvestAuto >= 10) {
			if($.inArray(11, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(11);
			}
		} 
		if(Game.State.stats.harvestAuto >= 1) {
			if($.inArray(10, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(10);
			}
		}
		
		//Population Harvest
		if(Game.State.stats.harvestPop >= 1000000000000) {
			if($.inArray(104, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(104);
			}
		} 
		if(Game.State.stats.harvestPop >= 1000000000) {
			if($.inArray(103, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(103);
			}
		} 
		if(Game.State.stats.harvestPop >= 1000000) {
			if($.inArray(102, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(102);
			}
		} 
		if(Game.State.stats.harvestPop >= 1000) {
			if($.inArray(101, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(101);
			}
		} 
		if(Game.State.stats.harvestPop >= 1) {
			if($.inArray(100, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(100);
			}
		}
		
		//Food Harvest
		if(Game.State.stats.harvestFood >= 1000000000000) {
			if($.inArray(154, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(154);
			}
		} 
		if(Game.State.stats.harvestFood >= 1000000000) {
			if($.inArray(153, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(153);
			}
		} 
		if(Game.State.stats.harvestFood >= 1000000) {
			if($.inArray(152, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(152);
			}
		} 
		if(Game.State.stats.harvestFood >= 1000) {
			if($.inArray(151, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(151);
			}
		} 
		if(Game.State.stats.harvestFood >= 1) {
			if($.inArray(150, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(150);
			}
		}
		
		//Wood Harvest
		if(Game.State.stats.harvestWood >= 1000000000000) {
			if($.inArray(204, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(204);
			}
		} 
		if(Game.State.stats.harvestWood >= 1000000000) {
			if($.inArray(203, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(203);
			}
		} 
		if(Game.State.stats.harvestWood >= 1000000) {
			if($.inArray(202, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(202);
			}
		} 
		if(Game.State.stats.harvestWood >= 1000) {
			if($.inArray(201, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(201);
			}
		} 
		if(Game.State.stats.harvestWood >= 1) {
			if($.inArray(200, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(200);
			}
		}
		
		//Stone Harvest
		if(Game.State.stats.harvestStone >= 1000000000000) {
			if($.inArray(254, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(254);
			}
		} 
		if(Game.State.stats.harvestStone >= 1000000000) {
			if($.inArray(253, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(253);
			}
		} 
		if(Game.State.stats.harvestStone >= 1000000) {
			if($.inArray(252, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(252);
			}
		} 
		if(Game.State.stats.harvestStone >= 1000) {
			if($.inArray(251, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(251);
			}
		} 
		if(Game.State.stats.harvestStone >= 1) {
			if($.inArray(250, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(250);
			}
		}
		
		//TO REMOVE
		if(Game.State.stats.buildings == 0){
			Game.State.stats.buildings = Game.State.cabins + Game.State.houses;
		}
		//Buildings
		if(Game.State.stats.buildings >= 500) {
			if($.inArray(304, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(304);
			}
		} 
		if(Game.State.stats.buildings >= 100) {
			if($.inArray(303, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(303);
			}
		} 
		if(Game.State.stats.buildings >= 50) {
			if($.inArray(302, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(302);
			}
		} 
		if(Game.State.stats.buildings >= 10) {
			if($.inArray(301, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(301);
			}
		} 
		if(Game.State.stats.buildings >= 1) {
			if($.inArray(300, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(300);
			}
		}
		
		//Upgrades
		if(Game.State.stats.upgradesBought >= 500) {
			if($.inArray(354, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(354);
			}
		} 
		if(Game.State.stats.upgradesBought >= 100) {
			if($.inArray(353, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(353);
			}
		} 
		if(Game.State.stats.upgradesBought >= 50) {
			if($.inArray(352, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(352);
			}
		} 
		if(Game.State.stats.upgradesBought >= 10) {
			if($.inArray(351, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(351);
			}
		} 
		if(Game.State.stats.upgradesBought >= 1) {
			if($.inArray(350, achieved) == -1) {
				Game.State.achievements.UnlockAchievement(350);
			}
		}
	}
	
	Game.GiveExp = function(exp) {
		Game.State.exp += exp * Game.currExpMod;
		Game.State.stats.expGained += exp * Game.currExpMod;
	};

	//---------------------------
	//Handle the Processing
	//---------------------------
	Game.Logic = function() {
		Game.EvaluateCosts();
		Game.CheckChievos();
		
		//Timers
		//Sliders Update
		Game.sliderUpdate += 1/Game.fps;
		if(Game.sliderUpdate >= Game.sliderUpdateTime) {
			Game.sliderUpdate = 0;
			Game.UpdateSliders();
		}
		
		//Save Game
		Game.timeToSave+=1/Game.fps;
		if(Game.timeToSave >= Game.saveEvery) {
			Game.SaveGame();
			Game.timeToSave = 0;
			Game.UpdateCheck(); //Check for an update when we save
		}
		
		//Asteroid Spawn
		Game.timeToAsteroid += 1/Game.fps;
		var timeToAsteroidSec = Math.floor(Game.timeToAsteroid);
		if(timeToAsteroidSec >= Game.currMinTimeToAsteroid) {
			if(Game.lastTimeToAsteroid != timeToAsteroidSec && Math.random() > .75 && Game.asteroidSpawned == 0) {
				Game.AsteroidSpawn();
			}
			if(Game.asteroidSpawned == 1 && Game.timeToAsteroid >= Game.asteroid.asteroidSpawnedAt + Game.currAsteroidTime) {
				Game.AsteroidDespawn();
			}
			Game.lastTimeToAsteroid = timeToAsteroidSec;
		}
		
		//Pop
		if(Game.State.pop<Game.currMaxPop) {
			Game.nextPop+=1/Game.fps;
		}
		
		//Wood
		if(Game.State.range.wood > 0) {
			Game.nextWood+=1/Game.fps;
		}
		
		//Food
		if(Game.State.range.food > 0) {
			Game.nextFood+=1/Game.fps;
		}
		
		//Stone
		if(Game.State.range.stone > 0) {
			Game.nextStone+=1/Game.fps;
		}
		
		//Food
		Game.State.timeToEat+=1/Game.fps;
		if(Game.State.timeToEat >= Game.currFoodConsumptionTime) {
			Game.State.timeToEat = 0;
			if(Game.State.food > Game.currFoodConsumption * Game.State.pop) {
				Game.State.food -= Math.floor(Game.currFoodConsumption * Game.State.pop);
				Game.news.push("Your people have been fed.");
			} else {
				var diff = Math.floor(Game.currFoodConsumption * Game.State.pop - Game.State.food) / Game.baseFoodConsumption;
				Game.news.push("Not Enough Food! "+diff+" People Perish!");
				Game.news.push("Increase Food Production!");
				Game.State.stats.popStarved += diff;
				Game.State.pop -= diff;
				if(Game.State.pop < 2) {
					Game.State.pop = 2;
				}
				Game.State.food = 0;
				if(Game.State.pop < Game.State.stats.minPop) {
					Game.State.stats.minPop = Game.State.pop;
				}
			}
		}
		//Death
		Game.State.timeToDeath+=1/Game.fps;
		if(Game.State.timeToDeath >= Game.currDeathTime) {
			Game.State.timeToDeath = 0;
			var deaths = Math.floor(Game.currMortalityRate * Game.State.pop);
			Game.State.pop -= deaths;
			if(deaths > 0) {
				Game.news.push(deaths+" people died natural deaths.");
				Game.State.stats.naturalDeaths += deaths;
			}
		}
		
		//---------------------------
		//Automatic Triggers
		//---------------------------
		if(Game.nextPop >= Game.currPopMod*5*Game.currAutoSpeedMod) {
			Game.popBarListener.fire();
			Game.news.push("Babies automatically harvested");
		}
		if(Game.nextWood >= Game.currWoodMod*5*Game.currAutoSpeedMod) {
			Game.woodBarListener.fire();
			Game.news.push("Wood automatically chopped");
		}
		if(Game.nextFood >= Game.currFoodMod*5*Game.currAutoSpeedMod) {
			Game.foodBarListener.fire();
			Game.news.push("Food automatically gathered");
		}
		if(Game.nextStone >= Game.currStoneMod*5*Game.currAutoSpeedMod) {
			Game.stoneBarListener.fire();
			Game.news.push("Stones automatically rolled into storage");
		}
	};
	
	Game.UpdateCheck = function() {
		var the_url = "version.html?time="+new Date().getTime();
		$.get(the_url,function(data,status) {
			if(data != Game.version) {
				$("#version").addClass('newVersion');
				$('#version').html('New Version Available<br />Refresh To Get!!');
			}
		},'html');
	};

	//---------------------------
	//Game Loop
	//---------------------------
	Game.Loop=function() {
		if(!Game.newGame) {
			Game.Logic();
			
			//Logic looper for when slow
			Game.delay+=((new Date().getTime()-Game.time)-1000/Game.fps);
			Game.delay=Math.min(Game.delay,5000);
			Game.time=new Date().getTime();
			while(Game.delay>0) {
				Game.Logic();
				Game.delay-=1000/Game.fps;
			}
			
			Game.Draw();
			
			setTimeout(Game.Loop,1000/Game.fps);
		}
	};
};

Game.Start();

window.onload=function() {
	if (!Game.initialized) Game.Init();
};