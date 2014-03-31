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
    var s = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    var e = Math.floor(Math.log(number) / Math.log(1000));
	return number < 1000 ? Math.floor(number) : ((number / Math.pow(1000, e)).toFixed(2) + " " + s[e]);
}

function hideActivityDivs() {
	$("#mainActivityDiv").css('display', 'none');
	$("#mainTab").removeClass('activeTab');
	$("#buildingsActivityDiv").css('display', 'none');
	$("#buildingsTab").removeClass('activeTab');
	$("#upgradesActivityDiv").css('display', 'none');
	$("#upgradesTab").removeClass('activeTab');
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
			Game.version = 'Beta v0.2.0.0';
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
			Game.expUpgradeAmount = 0.1;
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
			Game.State.planet = {};
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
			Game.State.stats.naturalDeaths = 0;
			//Upgrades
			Game.State.upgrades = {};
			Game.State.upgrades.expMultLevel = 0;
			Game.State.upgrades.autoClickLevel = 0;
			Game.State.upgrades.autoSpeedLevel = 0;
			Game.State.upgrades.manualClickLevel = 0;
			Game.State.upgrades.upgradeCostLevel = 0;
			
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
			Game.changeLogButtonListener = snack.listener({node: document.getElementById('changeLogButton'),
				event: 'click'}, 
				function (){
					$("#newsDiv").html("");
					var txt = "<h3>CHANGE LOG:</h3>\
						2014.03.30:&nbsp;&nbsp;&nbsp;Beta v0.2.0.0<br />\
						The Big Beta v0.2!<br />\
						New, more spacey color scheme! (Coming soon, option to change color schemes)<br />\
						Added hotkeys for the tabs, they go in order, 1-2-3, thinking of adding hotkeys for buttons on the current tab<br />\
						Added CABINS! Now you can do something with all that pesky stone! Also, asteroids give stone!<br />\
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
					var thisEra = (new Date().getTime()) - Game.State.firstPlay;
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
						"Upgrades Purchased: " + hrFormat(Game.State.stats.upgradesBought);
						
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
			
			//Game Tabs - Click
			Game.mainTabButtonListener = snack.listener({node: document.getElementById('mainTab'),
				event: 'click'}, 
				function (){
					hideActivityDivs();
					$("#mainActivityDiv").css('display', 'block');
					$("#mainTab").addClass('activeTab');
				}
			);
			Game.buildingsTabButtonListener = snack.listener({node: document.getElementById('buildingsTab'),
				event: 'click'}, 
				function (){
					hideActivityDivs();
					$("#buildingsActivityDiv").css('display', 'block');
					$("#buildingsTab").addClass('activeTab');
				}
			);
			Game.upgradesTabButtonListener = snack.listener({node: document.getElementById('upgradesTab'),
				event: 'click'}, 
				function (){
					hideActivityDivs();
					$("#upgradesActivityDiv").css('display', 'block');
					$("#upgradesTab").addClass('activeTab');
				}
			);
			
			//Game Buttons - Click
			Game.popBarListener = snack.listener({node: document.getElementById('popProgBar'),
				event: 'click'}, 
				function (){
					Game.popBarListener.detach();
					Game.State.pop = Math.floor(Game.State.pop + Game.currPopIncrease);
					Game.State.stats.harvestPop = Math.floor(Game.State.pop + Game.currPopIncrease);
					if(Game.State.pop > Game.currMaxPop) {
						Game.State.stats.harvestPop -= (Game.State.pop - Game.currMaxPop);
						Game.State.pop = Game.currMaxPop;
						Game.State.stats.harvestAuto += 1;
					}
					if(Game.nextPop >= Game.currPopMod*5) {
						Game.GiveExp(Game.currAutoClickExp);
					} else {
						Game.GiveExp(Game.currClickExp);
						Game.State.stats.harvestClick += 1;
					}
					if(Game.State.pop > Game.State.stats.maxPop) {
						Game.State.stats.maxPop = Game.State.pop;
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
					Game.State.wood = Math.floor(Game.State.wood + Game.currWoodHarvest);
					Game.State.stats.harvestWood = Math.floor(Game.State.wood + Game.currWoodHarvest);
					if(Game.nextWood >= Game.currWoodMod*5) {
						Game.GiveExp(Game.currAutoClickExp);
						Game.State.stats.harvestAuto += 1;
					} else {
						Game.GiveExp(Game.currClickExp);
						Game.State.stats.harvestClick += 1;
					}
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
					Game.State.food = Math.floor(Game.State.food + Game.currFoodHarvest);
					Game.State.stats.harvestFood = Math.floor(Game.State.food + Game.currFoodHarvest);
					if(Game.nextFood >= Game.currFoodMod*5) {
						Game.GiveExp(Game.currAutoClickExp);
						Game.State.stats.harvestAuto += 1;
					} else {
						Game.GiveExp(Game.currClickExp);
						Game.State.stats.harvestClick += 1;
					}
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
					Game.State.stone = Math.floor(Game.State.stone + Game.currStoneHarvest);
					Game.State.stats.harvestStone = Math.floor(Game.State.stone + Game.currStoneHarvest);
					if(Game.nextStone >= Game.currStoneMod*5) {
						Game.GiveExp(Game.currAutoClickExp);
						Game.State.stats.harvestAuto += 1;
					} else {
						Game.GiveExp(Game.currClickExp);
						Game.State.stats.harvestClick += 1;
					}
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
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Next Gain: " + hrFormat(Game.currPopIncrease) + "<br />" +
							"Gain/hr (Auto): " + hrFormat(Game.currPopIncrease * 3600/(Game.currPopMod*5)) + "<br />" +
							"Gain/hr (Manual): " + hrFormat(Game.currPopIncrease * 3600/(Game.currPopMod)) + "<br />" +
							"Death/hr (Natural): " + hrFormat(Game.currMortalityRate * Game.State.pop * 3600/Game.currDeathTime) + "<br />");
					});
				}
			);
			Game.woodBarOverListener = snack.listener({node: document.getElementById('woodProgBar'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Next Gain: " + hrFormat(Game.currWoodHarvest) + "<br />" +
							"Gain/hr (Auto): " + hrFormat(Game.currWoodHarvest * 3600/(Game.currWoodMod*5)) + "<br />" +
							"Gain/hr (Manual): " + hrFormat(Game.currWoodHarvest * 3600/(Game.currWoodMod)) + "<br />");
					});
				}
			);
			Game.foodBarOverListener = snack.listener({node: document.getElementById('foodProgBar'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Next Gain: " + hrFormat(Game.currFoodHarvest) + "<br />" +
							"Gain/hr (Auto): " + hrFormat(Game.currFoodHarvest * 3600/(Game.currFoodMod*5)) + "<br />" +
							"Gain/hr (Manual): " + hrFormat(Game.currFoodHarvest * 3600/(Game.currFoodMod)) + "<br />" +
							"Consumed/hr: " + hrFormat(Game.currFoodConsumption * Game.State.pop * 6));
					});
				}
			);
			Game.stoneBarOverListener = snack.listener({node: document.getElementById('stoneProgBar'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Next Gain: " + hrFormat(Game.currStoneHarvest) + "<br />" +
							"Gain/hr (Auto): " + hrFormat(Game.currStoneHarvest * 3600/(Game.currStoneMod*5)) + "<br />" +
							"Gain/hr (Manual): " + hrFormat(Game.currStoneHarvest * 3600/(Game.currStoneMod)) + "<br />");
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
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Current Level: "+(0.1*Game.State.upgrades.expMultLevel+1).toFixed(1)+"x<br />" + 
								"Next Level: "+(0.1*(Game.State.upgrades.expMultLevel+1)+1).toFixed(1)+"x<br />Cost: "+Game.currExpUpgradeCost+" Exp");
					});
				}
			);
			Game.autoClickUpgradeOverListener = snack.listener({node: document.getElementById('autoClickUpgrade'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Current Level: "+(0.1*Game.State.upgrades.autoClickMultLevel+1).toFixed(1)+"x<br />" + 
								"Next Level: "+(0.1*(Game.State.upgrades.autoClickMultLevel+1)+1).toFixed(1)+"x<br />Cost: "+Game.currAutoClickUpgradeCost+" Exp");
					});
				}
			);
			Game.autoSpeedUpgradeOverListener = snack.listener({node: document.getElementById('autoSpeedUpgrade'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Current Level: "+(0.1*Game.State.upgrades.autoSpeedMultLevel+1).toFixed(1)+"x<br />" + 
								"Next Level: "+(0.1*(Game.State.upgrades.autoSpeedMultLevel+1)+1).toFixed(1)+"x<br />Cost: "+Game.currAutoSpeedUpgradeCost+" Exp");
					});
				}
			);
			Game.manualClickUpgradeOverListener = snack.listener({node: document.getElementById('manualClickUpgrade'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Current Level: "+(0.1*Game.State.upgrades.manualClickMultLevel+1).toFixed(1)+"x<br />" + 
								"Next Level: "+(0.1*(Game.State.upgrades.manualClickMultLevel+1)+1).toFixed(1)+"x<br />Cost: "+Game.currManualClickUpgradeCost+" Exp");
					});
				}
			);
			Game.upgradeCostUpgradeOverListener = snack.listener({node: document.getElementById('upgradeCostUpgrade'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Current Level: "+(0.1*Game.State.upgrades.upgradeCostMultLevel+1).toFixed(1)+"x<br />" + 
								"Next Level: "+(0.1*(Game.State.upgrades.upgradeCostMultLevel+1)+1).toFixed(1)+"x<br />Cost: "+Game.currUpgradeCostUpgradeCost+" Exp");
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
			Game.achOverListener = snack.listener({node: document.getElementById('achievementsButton'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Coming Soon!");
					});
				}
			);
			Game.alertOverListener = snack.listener({node: document.getElementById('alertButton'),
				event: 'mouseover'}, 
				function(evt){
					$(this).mousemove(function(event){
						Game.ShowPopUpDiv(event.pageX, event.pageY, "Coming Soon!");
					});
				}
			);
			
			//Game Buttons - On mouseout
			Game.popBarOutListener = snack.listener({node: document.getElementById('popProgBar'),
				event: 'mouseout'}, 
				function(){
					Game.HidePopUpDiv();
				}
			);
			Game.woodBarOutListener = snack.listener({node: document.getElementById('woodProgBar'),
				event: 'mouseout'}, 
				function(evt){
					Game.HidePopUpDiv();
				}
			);
			Game.foodBarOutListener = snack.listener({node: document.getElementById('foodProgBar'),
				event: 'mouseout'}, 
				function(evt){
					Game.HidePopUpDiv();
				}
			);
			Game.stoneBarOutListener = snack.listener({node: document.getElementById('stoneProgBar'),
				event: 'mouseout'}, 
				function(evt){
					Game.HidePopUpDiv();
				}
			);
			Game.houseButtonOutListener = snack.listener({node: document.getElementById('houseButton'),
				event: 'mouseout'}, 
				function(evt){
					Game.HidePopUpDiv();
				}
			);
			Game.cabinButtonOutListener = snack.listener({node: document.getElementById('cabinButton'),
				event: 'mouseout'}, 
				function(evt){
					Game.HidePopUpDiv();
				}
			);
			Game.experienceUpgradeOutListener = snack.listener({node: document.getElementById('experienceUpgrade'),
				event: 'mouseout'}, 
				function(evt){
					Game.HidePopUpDiv();
				}
			);
			Game.autoClickUpgradeOutListener = snack.listener({node: document.getElementById('autoClickUpgrade'),
				event: 'mouseout'}, 
				function(evt){
					Game.HidePopUpDiv();
				}
			);
			Game.autoSpeedUpgradeOutListener = snack.listener({node: document.getElementById('autoSpeedUpgrade'),
				event: 'mouseout'}, 
				function(evt){
					Game.HidePopUpDiv();
				}
			);
			Game.manualClickUpgradeOutListener = snack.listener({node: document.getElementById('manualClickUpgrade'),
				event: 'mouseout'}, 
				function(evt){
					Game.HidePopUpDiv();
				}
			);
			Game.upgradeCostUpgradeOutListener = snack.listener({node: document.getElementById('upgradeCostUpgrade'),
				event: 'mouseout'}, 
				function(evt){
					Game.HidePopUpDiv();
				}
			);
			Game.eraUpgradeOutListener = snack.listener({node: document.getElementById('eraUpgrade'),
				event: 'mouseout'}, 
				function(evt){
					Game.HidePopUpDiv();
				}
			);
			Game.achOutListener = snack.listener({node: document.getElementById('achievementsButton'),
				event: 'mouseout'}, 
				function(evt){
					Game.HidePopUpDiv();
				}
			);
			Game.alertOutListener = snack.listener({node: document.getElementById('alertButton'),
				event: 'mouseout'}, 
				function(evt){
					Game.HidePopUpDiv();
				}
			);
			
			//Keyboard Listeners
			Game.keyboardListener = snack.listener({node: document.getElementById('body'),
				event: 'keypress'}, 
				function(evt){
					switch(evt.charCode){
						case 49: {
							Game.mainTabButtonListener.fire();
							break;
						}
						case 50: {
							Game.buildingsTabButtonListener.fire();
							break;
						}
						case 51: {
							Game.upgradesTabButtonListener.fire();
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
		if(x+160 > screen.availWidth) {
			x = screen.availWidth - 160 - 45;
		}
		if(y+80 > screen.availHeight) {
			y = screen.availHeight - 80 - 45;
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
		$('#baseTab').css('display','none');
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
	/*Game.ExportSave=function()
	{
		var save=prompt('Copy this text and keep it somewhere safe!',Game.WriteSave(1));
	}
	Game.ImportSave=function()
	{
		var save=prompt('Please paste in the text that was given to you on save export.','');
		if (save && save!='') Game.LoadSave(save);
		Game.WriteSave();
	}*/
	
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
	
	Game.UpdateButtons = function() {
		//House
		
		//Cabin
		
	}
	
	Game.UpdateCalculations = function() {
		Game.currExpMod = Game.baseExpMod + Game.State.upgrades.expMultLevel * Game.expUpgradeAmount;
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
		
		Game.currExpUpgradeCost = Math.floor(Math.pow(Game.State.upgrades.expMultLevel,3) * 1.1)+100;
		Game.currAutoClickUpgradeCost = Math.floor(Math.pow(Game.State.upgrades.autoClickMultLevel,3) * 1.3)+1000;
		Game.currAutoSpeedUpgradeCost = Math.floor(Math.pow(Game.State.upgrades.autoSpeedMultLevel,3) * 1.5)+2500;
		Game.currManualClickUpgradeCost = Math.floor(Math.pow(Game.State.upgrades.manualClickMultLevel,3) * 1.2)+1000;
		Game.currUpgradeCostUpgradeCost = Math.floor(Math.pow(Game.State.upgrades.upgradeCostMultLevel,4) * 2.0)+1500;
		
		
		if(Game.State.houses >= 25) {
			$("#cabinButton").css('display','block');
		}
	};
	
	Game.EvaluateCosts = function() {
		Game.UpdateCalculations();
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
		if(Game.nextPop >= Game.currPopMod*5) {
			Game.popBarListener.fire();
			Game.news.push("Babies automatically harvested");
		}
		if(Game.nextWood >= Game.currWoodMod*5) {
			Game.woodBarListener.fire();
			Game.news.push("Wood automatically chopped");
		}
		if(Game.nextFood >= Game.currFoodMod*5) {
			Game.foodBarListener.fire();
			Game.news.push("Food automatically gathered");
		}
		if(Game.nextStone >= Game.currStoneMod*5) {
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