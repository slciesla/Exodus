//---------------------------
// Game
//---------------------------
Pixel = {};
Pixel.State = {};

Pixel.Init = function() {
	Pixel.initialized = 0;
	Pixel.Start = function() {
		//---------------------------
		//Check for browser compat
		//---------------------------
		if(typeof(Storage)!=="undefined") {
			//---------------------------
			//Constants
			//---------------------------
			Pixel.version = 'Beta v1.2.1.1';
			Pixel.initialized = 1;
			Pixel.fps = 120;
			Pixel.saveEvery = 300; //Save every 5 min
			Pixel.maxWidth = 600;
			Pixel.maxHeight = 800;
			Pixel.baseAutoCursorSpeed = 2;
			Pixel.baseBombReloadSpeed = 36;
			Pixel.autoFinishTime = 300; //Let auto finish trigger after 5 min
			Pixel.tabRefreshTime = 1;
			Pixel.baseTimeToParty = 600; //Party Pixel every 10 min
			
			//---------------------------
			//Non-saved vars
			//---------------------------
			Pixel.timeToSave = 0;
			Pixel.timeToCursor = 0;
			Pixel.timeToBomb = 0;
			Pixel.timeToAutoFinish = 0;
			Pixel.timeToTabRefresh = 0;
			Pixel.timeToParty = 0;
			Pixel.newsId = 0;
			Pixel.delay = 0;
			Pixel.imageWidth = Pixel.maxWidth;
			Pixel.imageHeight = Pixel.maxHeight;
			Pixel.time = new Date().getTime();
			Pixel.pictureComplete = false;
			Pixel.lastNews = 0;
			Pixel.news = Array();
			Pixel.gameButtonListeners = Array();
			Pixel.gameButtonOverListeners = Array();
			Pixel.overlayImageData = null;
			Pixel.nextImageButtonListener = null;
			Pixel.bombChain = 0;
			Pixel.partyTime = false;
			
			//---------------------------
			//State Variables that will be saved
			//---------------------------
			Pixel.State.firstPlay = Pixel.time;
			Pixel.State.numPixels = 0;
			Pixel.State.pixelsThisImage = 0;
			Pixel.State.lastRandX = 0;
			Pixel.State.lastRandY = 0;
			Pixel.State.image = null;
			Pixel.State.overlay = null;
			Pixel.State.cursorSizeLvl = 1;
			Pixel.State.autoCursorSpeedLvl = 0;
			Pixel.State.cursorBombSizeLvl = 0;
			Pixel.State.cursorBombSpeedLvl = 0;
			Pixel.State.cursorBombChainLvl = 0;
			Pixel.State.cursorBombMaxChainLvl = 1;
			Pixel.State.color = 0;
			Pixel.State.bombReady = false;
			Pixel.State.history = Array();
			Pixel.State.achievements = new Achievements();
			Pixel.State.upgrades = new Upgrades();
			
			//---------------------------
			//State Variables that will be saved
			//---------------------------
			Pixel.State.stats = {};
			Pixel.State.stats.timePlayed = 0;
			Pixel.State.stats.timePlayedPicture = 0;
			Pixel.State.stats.bestPictureTime = 999999999;
			Pixel.State.stats.worstPictureTime = 0;
			Pixel.State.stats.picturesCompleted = 0;
			Pixel.State.stats.picturesSkipped = 0;
			Pixel.State.stats.pixelsAllTime = 0;
			Pixel.State.stats.pixelsManuallyCollected = 0;
			Pixel.State.stats.pixelsAutoCollected = 0;
			Pixel.State.stats.pixelsBombCollected = 0;
			Pixel.State.stats.maxBombChain = 0;
			Pixel.State.stats.manualPixelsThisImage = 0;
			Pixel.State.stats.alreadyUncovered = 0;
			Pixel.State.stats.partiesHad = 0;
			Pixel.State.stats.partiesMissed = 0;
			
			Pixel.news.push("NSFW images are disabled, but images not labelled as such may still appear. Use at your own risk");
			Pixel.news.push("This game uses the Imgur random image gallery.");
			Pixel.news.push(" ");
			Pixel.news.push("Any PPS increase over 120pps will not take effect due to the nature of the trigger. To be fixed soon™");
			Pixel.news.push("View the changelog <a href='changelog.txt' target='_blank'>here</a>");
			
			//Load the existing state if one exists
			Pixel.LoadGame();
			
			//Setup
			var index = 0;
			$('#pixels').html(Pixel.State.numPixels);
			$('#pps').html(((1+0.5*(Pixel.State.autoCursorSpeedLvl-1))/Pixel.baseAutoCursorSpeed).toFixed(2));
			if(Pixel.State.autoCursorSpeedLvl == 0) {
				$('#pps').html("0");
			}
			
			//If we don't have an image stored, get one
			if(Pixel.State.image == null) {
				Pixel.GetNewImage();
			} else {
				//Otherwise we have an image, load the existing one
				Pixel.LoadImage(Pixel.State.image);
			}
			
			$("#colorSlider").slider({
				range: "max",
				min: 0,
				max: 255,
				value: Pixel.State.color,
				slide: function( event, ui ) {
					Pixel.ChangePixelColor(ui.value);
				}
			});
			
			//Header Button listeners
			Pixel.UpgradesButtonListener = snack.listener({node: document.getElementById('upgradesHeaderBtn'),
				event: 'click'}, 
				function (){
					$("#info").html("");
					var txt = "<div id='infoHeader' class='infoHeader'>Available Upgrades:</div><br />";
					$("#info").append(txt);
					
					//Make the buttons
					for(var ndx=0; ndx!=Pixel.State.upgrades.upgradeList.length; ndx++) {
						var upgradeNum = Pixel.State.upgrades.upgradeList[ndx];
						var upgd = Pixel.State.upgrades.upgrades[upgradeNum];
						if(!Pixel.State.upgrades.Check(upgradeNum)) {
							if(upgd.prereq == -1 || Pixel.State.upgrades.Check(upgd.prereq)) {
								txt = "<div class='gameButton' id='upgradeButton"+upgradeNum+"'>"+upgd.name+"</div>";
								$("#info").append(txt);
							
								//Now make the event listeners
								var upgradeNum = Pixel.State.upgrades.upgradeList[ndx];
								var upgd = Pixel.State.upgrades.upgrades[upgradeNum];
								(function (_upgd) {
									var cost = _upgd.cost;
									var popupTxt = "Desc: "+_upgd.desc+"<br />";
									if(_upgd.persist && _upgd.tracker) {
										cost = _upgd.costFunc(cost);
										popupTxt += "Current Level: " + _upgd.tracker() + "<br />";
									}
									popupTxt += "Cost: "+cost+" Pixels<br />";
									
									Pixel.gameButtonListeners[_upgd.id] = snack.listener({node: document.getElementById('upgradeButton'+_upgd.id),
										event: 'click'}, 
										function (event){
											if(cost <= Pixel.State.numPixels) {
												Pixel.State.numPixels -= cost;
												$('#pixels').html(Pixel.State.numPixels);
												_upgd.unlockFunction();
												Pixel.UpgradesButtonListener.fire();
											} else {
												Pixel.news.push("You need more pixels");
											}
											Pixel.HidePopUpDiv();
										}
									);
									Pixel.gameButtonOverListeners[_upgd.id] = snack.listener({node: document.getElementById('upgradeButton'+_upgd.id),
										event: "mouseover"},
										function(e) {
											$(this).mousemove(function(event){
												Pixel.ShowPopUpDiv(event.pageX, event.pageY, popupTxt);
											});
										}
									);
									
									//Game Buttons - On mouseout
									$('#upgradeButton'+_upgd.id).bind("mouseout",
										function(e) {
											Pixel.HidePopUpDiv();
										}
									);
								})(upgd);
							}
						}
					}
				}
			);
			Pixel.UpgradesButtonListener.fire();
			
			Pixel.imageInfoButtonListener = snack.listener({node: document.getElementById('imageInfoHeaderBtn'),
				event: 'click'}, 
				function (){
					$("#info").html("");
					var txt = "<div id='infoHeader' class='infoHeader'>Image Information:</div><br />";
					if(Pixel.State.upgrades.Check(5)) {
						txt += "<span class='statName'>Image Title:</span> " + Pixel.State.image.title + "<br />";
						txt += "<span class='statName'>Image Source:</span> <a href='http://imgur.com/gallery/" + 
							Pixel.State.image.id + "' target='_blank'>Gallery Link</a><br />";
						txt += "<span class='statName'>Upload Date:</span> "+dateFormat(Pixel.State.image.datetime*1000)+dateFormat(Pixel.State.image.datetime*1000,"Z")+"<br />";
					} else {
						txt += "<div>Requires Purchase!</div><br /><br />";
					}
					if(Pixel.State.upgrades.Check(6)) {
						txt += "<span class='statName'>Imgur Score:</span> "+Pixel.State.image.score+" Points<br />";
						txt += "<span class='statName'>Imgur Upvotes:</span> "+Pixel.State.image.ups+" Votes<br />";
						txt += "<span class='statName'>Imgur Downvotes:</span> "+Pixel.State.image.downs+" Votes<br />";
						txt += "<span class='statName'>Image Width:</span> "+Pixel.imageWidth+" (original: "+Pixel.State.image.width+") Pixels<br />";
						txt += "<span class='statName'>Image Height:</span> "+Pixel.imageHeight+" (original: "+Pixel.State.image.height+") Pixels<br />";
					}
					txt += "<br />";
					txt += "<div class='infoHeader'>Statistics:</div><br />";
					
					if(Pixel.State.upgrades.Check(7)) {
						txt += "<span class='statName'>Time Played:</span> "+Math.floor(Pixel.State.stats.timePlayed)+" seconds<br />";
						txt += "<span class='statName'>Time Played this Picture:</span> "+Math.floor(Pixel.State.stats.timePlayedPicture)+" seconds<br />";
						txt += "<span class='statName'>All Time Pixels:</span> "+Pixel.State.stats.pixelsAllTime+"<br />";
						txt += "<span class='statName'>All Time Manual Pixels:</span> "+Pixel.State.stats.pixelsManuallyCollected+"<br />";
						txt += "<span class='statName'>All Time Auto Pixels:</span> "+Pixel.State.stats.pixelsAutoCollected+"<br />";
						txt += "<span class='statName'>All Time Bomb Pixels:</span> "+Pixel.State.stats.pixelsBombCollected+"<br />";
						txt += "<span class='statName'>Max Bomb Chain:</span> "+Pixel.State.stats.maxBombChain+"<br />";
						txt += "<span class='statName'>Pixels This Image:</span> "+Pixel.State.pixelsThisImage+"<br />";
					} else {
						txt += "<div>Requires Purchase!</div><br /><br />";
					}
					if(Pixel.State.upgrades.Check(8)) {
						txt += "<span class='statName'>Total Pixels In Image:</span> "+Pixel.imageWidth*Pixel.imageHeight+"<br />";
						txt += "<span class='statName'>Fastest Picture Completion:</span> "+Math.floor(Pixel.State.stats.bestPictureTime)+" seconds<br />";
						txt += "<span class='statName'>Slowest Picture Completion:</span> "+Math.floor(Pixel.State.stats.worstPictureTime)+" seconds<br />";
						txt += "<span class='statName'>Pictures Completed:</span> "+Pixel.State.stats.picturesCompleted+"<br />";
						txt += "<span class='statName'>Pictured Skipped:</span> "+Pixel.State.stats.picturesSkipped+"<br />";
					}
					$("#info").html(txt);
				}
			);
			
			Pixel.imageHistoryButtonListener = snack.listener({node: document.getElementById('imageHistoryHeaderBtn'),
				event: 'click'}, 
				function (){
					$("#info").html("");
					var txt = "<div id='infoHeader' class='infoHeader'>Image History:</div><br />";
					for(var i = Pixel.State.history.length; i != 0; i--) {
						if(Pixel.State.history[i-1].skipped) {
							txt += "Image "+i+": <a target='_blank' href='"+Pixel.State.history[i-1].link+"'>"
									+Pixel.State.history[i-1].link+"</a> skipped after "
									+Pixel.State.history[i-1].time+" seconds";
						} else {
							txt += "Image "+i+": <a target='_blank' href='"+Pixel.State.history[i-1].link+"'>"
									+Pixel.State.history[i-1].link+"</a> completed in "
									+Pixel.State.history[i-1].time+" seconds";
						}
						txt += "<br />";
					}
					if(Pixel.State.history.length == 0) {
						txt += "No Image History";
					}
					$("#info").html(txt);
				}
			);
			
			Pixel.AchievementsButtonListener = snack.listener({node: document.getElementById('achievementsHeaderBtn'),
				event: 'click'}, 
				function (){
					$("#info").html("");
					var txt = "<div id='infoHeader' class='infoHeader'>Achievements:</div><br />";
					var chievos = Pixel.State.achievements.chievos;
					var ndx = Pixel.State.achievements.chievoList;
					var achieved = Pixel.State.achievements.achieved;
					txt += achieved.length+"/"+ndx.length+" achieved";
					for(var i=0; i!= ndx.length; i++) {
						//Achieved
						if($.inArray(ndx[i], achieved) != -1) {
							txt += "<div class='chievo achieved'><span class='chievoName'>"+chievos[ndx[i]].name+": </span>";
							txt += chievos[ndx[i]].desc
							txt += "<br />"
							if(Pixel.State.upgrades.Check(5)) {
								if(chievos[ndx[i]].achievedOn != null && chievos[ndx[i]].achievedOn != "") {
									txt += "<a style='color: #FFF;' target='_blank' href='"+chievos[ndx[i]].achievedOn+"'>Achieved On</a>";
								} else {
									txt += "Achieved Long Ago";
								}
							} else {
								txt += "Link Requires Info Purchase";
							}
							txt += "</div>";
						//Hidden
						} else if(chievos[ndx[i]].hidden) {
							txt += "<div class='chievo hiddenChievo'><span class='chievoName'>"+chievos[ndx[i]].name+": </span>HIDDEN???</div>";
						//Normal, unachieved
						} else {
							txt += "<div class='chievo'><span class='chievoName'>"+chievos[ndx[i]].name+": </span>"+chievos[ndx[i]].beforeDesc+"</div>";
						}
					}
					$("#newsDiv").html(txt);
					$("#info").html(txt);
				}
			);
			
			Pixel.menuButtonListener = snack.listener({node: document.getElementById('menuHeaderBtn'),
				event: 'click'}, 
				function (){
					$("#info").html("");
					var txt = "<div id='infoHeader' class='infoHeader'>MENU:</div><br />";
					txt += "<div id='saveGameButton' class='headerButton'>Save Game</div>";
					txt += "<div style='height: 5px; clear: both;'></div>";
					txt += "<div style='font-size: 0.7em'>Note: Game is saved automatically every 5 min</div><br />";
					txt += "Save Game State (copy this and save it somewhere safe):<br />";
					txt += "<textarea style='height:125px; width:330px;'>"+Pixel.ExportSave()+"</textarea>";
					txt += "<br /><br />";
					txt += "Load Game State (paste the code you saved previously):<br />";
					txt += "<textarea id='importSave' name='importSave' style='height:75px; width:330px;'></textarea>";
					txt += "<div id='importSaveButton' class='headerButton'>Import</div>";
					$("#info").html(txt);
					Pixel.importSaveButtonListener = snack.listener({node: document.getElementById('importSaveButton'),
						event: 'click'}, 
						function (){
							Pixel.ImportSave($("#importSave").val());
						}
					);
					Pixel.SaveGameButtonListener = snack.listener({node: document.getElementById('saveGameButton'),
						event: 'click'}, 
						function (){
							Pixel.SaveGame();
						}
					);
				}
			);
			
			$('#gameContainer').css('display','block');
			$('#version').html(Pixel.version);
			
			ga('send', 'event', 'global', 'gamestart');
			//---------------------------
			//Start the game
			//---------------------------
			Pixel.Loop();
		} else {
			$('#document').css('display','none');
			e('body').innerHTML = "This game requires an HTML5 compliant browser.<br />This" +
					" includes IE8+, Chrome, Firefox, Safari, and Opera.";
			ga('send', 'event', 'error', 'html5');
		}
	};
	
	Pixel.ShowPopUpDiv = function(x, y, txt) {
		$('#popUpDiv').html(txt);
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
	
	Pixel.HidePopUpDiv = function() {
		$('#popUpDiv').css('display','none');
	};
	
	//Upgrade Unlock Functions
	Pixel.DisplayPixels = function() {
		$('#currency').css('display','block');
		Pixel.State.upgrades.owned.push(0);
	};
	Pixel.AutoCursor = function() {
		Pixel.State.autoCursorSpeedLvl = 1;
		$('#pps').html(((1+0.5*(Pixel.State.autoCursorSpeedLvl-1))/Pixel.baseAutoCursorSpeed).toFixed(2));
		Pixel.State.upgrades.owned.push(1);
	};
	Pixel.AutoCursorSpeedUpgrade = function() {
		Pixel.State.autoCursorSpeedLvl++;
		$('#pps').html(((1+0.5*(Pixel.State.autoCursorSpeedLvl-1))/Pixel.baseAutoCursorSpeed).toFixed(2));
	};
	Pixel.CursorSizeUpgrade = function() {
		Pixel.State.cursorSizeLvl++;
		var canvas = document.getElementById("overlayCanvas");
		canvas.removeEventListener('mousemove', Pixel.canvasMouseOver);
		canvas.addEventListener('mousemove', Pixel.canvasMouseOver);
	};
	Pixel.BasicInfoUnlock = function() {
		Pixel.State.upgrades.owned.push(5);
	};
	Pixel.AdvancedInfoUnlock = function() {
		Pixel.State.upgrades.owned.push(6);
		Pixel.State.achievements.UnlockAchievement(52, "http://imgur.com/gallery/"+Pixel.State.image.id);
		ga('send', 'event', 'achievement', 'unlock', 'Chievo 52');
	};
	Pixel.BasicStatsUnlock = function() {
		Pixel.State.upgrades.owned.push(7);
	};
	Pixel.AdvancedStatsUnlock = function() {
		Pixel.State.upgrades.owned.push(8);
		Pixel.State.achievements.UnlockAchievement(53, "http://imgur.com/gallery/"+Pixel.State.image.id);
		ga('send', 'event', 'achievement', 'unlock', 'Chievo 53');
	};
	Pixel.CursorBombUnlock = function() {
		Pixel.State.cursorBombSizeLvl = 1;
		Pixel.State.cursorBombSpeedLvl = 1;
		Pixel.State.upgrades.owned.push(10);
		Pixel.State.bombReady = true;
		$('#bomb').css("display","block");
		Pixel.TurnOnBombListener();
	};
	Pixel.CursorBombSizeUpgradeI = function() {
		Pixel.State.cursorBombSizeLvl++;
		Pixel.State.upgrades.owned.push(11);
		$('#bomb').css("display","block");
		Pixel.State.bombReady = true;
		$('#bomb').css("display","block");
	};
	Pixel.CursorBombSizeUpgradeII = function() {
		Pixel.State.cursorBombSizeLvl++;
		Pixel.State.upgrades.owned.push(13);
		$('#bomb').css("display","block");
		Pixel.State.bombReady = true;
		$('#bomb').css("display","block");
	};
	Pixel.CursorBombSizeUpgradeIII = function() {
		Pixel.State.cursorBombSizeLvl++;
		Pixel.State.upgrades.owned.push(14);
		$('#bomb').css("display","block");
		Pixel.State.bombReady = true;
		$('#bomb').css("display","block");
	};
	Pixel.CursorBombSizeUpgradeIV = function() {
		Pixel.State.cursorBombSizeLvl++;
		Pixel.State.upgrades.owned.push(15);
		$('#bomb').css("display","block");
		Pixel.State.bombReady = true;
		$('#bomb').css("display","block");
	};
	Pixel.CursorBombSizeUpgradeV = function() {
		Pixel.State.cursorBombSizeLvl++;
		Pixel.State.upgrades.owned.push(16);
		$('#bomb').css("display","block");
		Pixel.State.bombReady = true;
		$('#bomb').css("display","block");
	};
	Pixel.CursorBombSpeedUpgrade = function() {
		Pixel.State.cursorBombSpeedLvl++;
	};
	Pixel.CursorBombChainUpgrade = function() {
		Pixel.State.cursorBombChainLvl++;
	};
	Pixel.CursorBombMaxChainUpgrade = function() {
		Pixel.State.cursorBombMaxChainLvl++;
	};
	Pixel.AutoFinishImage = function() {
		$('#autoFinishToggle').css("display","block");
		Pixel.State.upgrades.owned.push(18);
	};
	Pixel.PixelColorUnlock = function() {
		$('#colorSliderContainer').css("display","block");
		Pixel.State.upgrades.owned.push(20);
	};
	
	//Upgrade Cost Functions
	Pixel.AutoCursorSpeedCost = function(initial) {
		return initial + initial * 0.1 * Pixel.State.autoCursorSpeedLvl * 10;
	};
	Pixel.CursorSizeCost = function(initial) {
		return Math.floor(initial + initial * 0.5 * Math.pow(1.5,Pixel.State.cursorSizeLvl));
	};
	Pixel.CursorBombSpeedCost = function(initial) {
		return Math.floor(initial + initial * 0.25 *  Math.pow(Pixel.State.cursorBombSpeedLvl,2));
	};
	Pixel.CursorBombChainCost = function(initial) {
		return Math.floor(initial + initial * 0.5 *  Math.pow(Pixel.State.cursorBombChainLvl,1.5));
	};
	Pixel.CursorBombMaxChainCost = function(initial) {
		return Math.floor(initial + initial * 2 *  Math.pow(Pixel.State.cursorBombMaxChainLvl,2));
	};
	
	//Other Functions
	Pixel.ChangePixelColor = function(color) {
		Pixel.State.color = color;
		for(var ndx = 0; ndx != Pixel.imageHeight*Pixel.imageWidth*4; ndx++) {
			if(ndx%4 != 3) {
				Pixel.overlayImageData.data[ndx] = color;
			}
		}
		Pixel.WriteOverlayData();
	};
	
	//This is only for Manual and Bomb, Auto is handled in its timer
	Pixel.CollectPixel = function(xPos, yPos, xOff, yOff, type) {
		var ndx = (xPos+xOff)*4 + (yPos+yOff)*Pixel.imageWidth*4 + 3;
		var offset = 1;
		while(ndx%4 != 3) {
			ndx = (xPos+xOff)*4 + (yPos+yOff)*Pixel.imageWidth*4 + 3+offset++;
		}
		var transparency = Pixel.overlayImageData.data[ndx];
		if(transparency != 0 && ndx > 0 && ndx < Pixel.imageHeight*Pixel.imageWidth*4) {
			Pixel.State.numPixels++;
			Pixel.State.pixelsThisImage++;
			Pixel.State.stats.pixelsAllTime++;
			if(type == "Manual") {
				Pixel.State.stats.pixelsManuallyCollected++;
				Pixel.State.stats.manualPixelsThisImage++;
			} else if(type == "Bomb") {
				Pixel.State.stats.pixelsBombCollected++;
			}
			Pixel.overlayImageData.data[ndx] = 0;
		} else if(type == "Manual" && transparency == 0 && ndx < Pixel.imageHeight*Pixel.imageWidth*4) {
			Pixel.State.stats.alreadyUncovered++;
		}
	};
	
	Pixel.WriteOverlayData = function() {
		var canvas = document.getElementById("overlayCanvas");
		var ctx = canvas.getContext("2d");
		ctx.putImageData(Pixel.overlayImageData, 0, 0);
	}
	
	Pixel.canvasMouseOver = function(evt) {
		var canvas = document.getElementById("overlayCanvas");
		var rect = canvas.getBoundingClientRect();
		
		var canvasOffset=$("#overlayCanvas").offset();
		var offsetX=canvasOffset.left;
		var offsetY=canvasOffset.top;

		var mouseX = evt.clientX - Math.floor(rect.left);
		var mouseY = evt.clientY - Math.floor(rect.top);
		
		var offset = 1;
		var i=0;
		var x=0, y=0, xMod=1, yMod=1, cap=0;
		Pixel.CollectPixel(mouseX, mouseY, x, y, "Manual");
		
		while(Pixel.State.cursorSizeLvl > 4*cap ) {
			cap++;x=cap;y=0;xMod=1;yMod=1;
			var limit = Math.min(4*cap,(Pixel.State.cursorSizeLvl-1-(4*(cap-1))));
			for(i=0; i!= limit; i++) {
				Pixel.CollectPixel(mouseX, mouseY, x, y, "Manual");
				if(Math.abs(x) == cap) {
					xMod *= -1;
				}
				x += xMod;
				if(Math.abs(y) == cap) {
					yMod *= -1;
				}
				y += yMod;
			}
		}
		
		Pixel.WriteOverlayData();
		$('#pixels').html(Pixel.State.numPixels);
	};
	
	Pixel.TurnOnBombListener = function() {
		var canvas = document.getElementById("overlayCanvas");
		Pixel.bombListener = canvas.addEventListener('click', function(evt) {
			if(Pixel.State.bombReady) {
				$('#bomb').css("display","none");
				Pixel.State.bombReady = false;
				Pixel.bombChain = 0;
				var rect = canvas.getBoundingClientRect();
				Pixel.NewBombCanvas(evt.clientX - Math.floor(rect.left), evt.clientY - Math.floor(rect.top), 0);
			}
		}, false);
	};
			
	Pixel.ColorPixel = function(xPos, yPos, xOff, yOff, turn) {
		var ndx = (xPos+xOff)*4 + (yPos+yOff)*Pixel.imageWidth*4;
		var offset = 1;
		while(ndx%4 != 0) {
			ndx = (xPos+xOff)*4 + (yPos+yOff)*Pixel.imageWidth*4+offset++;
		}
		if(ndx < Pixel.imageHeight*Pixel.imageWidth*4) {
			switch(turn) {
				case 0:
					Pixel.overlayImageData.data[ndx] = 204;
					Pixel.overlayImageData.data[ndx+1] = 12;
					Pixel.overlayImageData.data[ndx+2] = 12;
					break;
				case 1:
					Pixel.overlayImageData.data[ndx] = 242;
					Pixel.overlayImageData.data[ndx+1] = 105;
					Pixel.overlayImageData.data[ndx+2] = 19;
					break;
				case 2:
					Pixel.overlayImageData.data[ndx] = 245;
					Pixel.overlayImageData.data[ndx+1] = 252;
					Pixel.overlayImageData.data[ndx+2] = 41;
					break;
			}
		}
	};
	
	Pixel.NewBombCanvas = function(mouseX, mouseY, turn) {
		//lvl base
		var i=0;
		var x=0, y=0, xMod=1, yMod=1, cap=0;
		if(turn == 3) {
			Pixel.CollectPixel(mouseX, mouseY, x, y, "Bomb");
		} else {
			Pixel.ColorPixel(mouseX, mouseY, x, y, turn);
		}
		
		var keepBombing = true;
		while(keepBombing) {
			cap++;x=cap;y=0;xMod=1;yMod=1;
			var limit = 4*cap;
			for(i=0; i!= limit; i++) {
				if(turn == 3) {
					Pixel.CollectPixel(mouseX, mouseY, x, y, "Bomb");
				} else {
					Pixel.ColorPixel(mouseX, mouseY, x, y, turn);
				}
				if(Math.abs(x) == cap) {
					xMod *= -1;
				}
				x += xMod;
				if(Math.abs(y) == cap) {
					yMod *= -1;
				}
				y += yMod;
			}
			if((cap == 3 && !Pixel.State.upgrades.Check(11)) ||
			   (cap == 5 && !Pixel.State.upgrades.Check(13)) ||
			   (cap == 7 && !Pixel.State.upgrades.Check(14)) ||
			   (cap == 9 && !Pixel.State.upgrades.Check(15)) ||
			   (cap == 11 && !Pixel.State.upgrades.Check(16)) ||
			   (cap >= 13)) {
				keepBombing = false;
			}
				
		}
		
		//Set up the next part of the bomb
		if(turn < 3) {
			var timeout = window.setTimeout(function(){
					Pixel.NewBombCanvas(mouseX, mouseY, turn+1);
				}, 200);
		}
		
		//Write back to the image
		Pixel.WriteOverlayData();
		$('#pixels').html(Pixel.State.numPixels);
		
		//Check for a chain
		if(turn == 0 && Pixel.State.cursorBombChainLvl > 0) {
			Math.seedrandom();
			//The bigger the comparator, the harder it is to succeed
			var comparator = 1-(1/Math.sqrt(Pixel.State.cursorBombChainLvl-(Pixel.bombChain)));
			if(Pixel.State.cursorBombChainLvl == 1) {
				//10% base chance on lvl 1, formula starts at 0.0 for lvl 1
				comparator += 0.1;
			}
			
			if(Math.random() < comparator) {
				var randX = Math.floor((Math.random()-0.5)*40)+mouseX;
				var randY = Math.floor((Math.random()-0.5)*40)+mouseY;
				
				ndx = randX*4 + randY*Pixel.imageWidth*4 + 3;
				offset = 1;
				while(ndx%4 != 3) {
					ndx = randX*4 + randY*Pixel.imageWidth*4 + 3+offset++;
				}
				if(Pixel.bombChain < Pixel.State.cursorBombMaxChainLvl) {
					Pixel.bombChain++;
					if(Pixel.bombChain > Pixel.State.stats.maxBombChain) {
						Pixel.State.stats.maxBombChain = Pixel.bombChain;
					}
					var timeout = window.setTimeout(function(){
						Pixel.NewBombCanvas(randX, randY, 0);
					}, 100);
				}
			}
		}
	}
	
	Pixel.SkipImage = function() {
		ga('send', 'event', 'global', 'skipimage');
		Pixel.news.push("Image Skipped");
		Pixel.State.stats.picturesSkipped++;
		Pixel.State.history.push({
			skipped: true,
			link: "http://imgur.com/gallery/"+Pixel.State.image.id,
			time: Math.floor(Pixel.State.stats.timePlayedPicture)
		});
		Pixel.GetNewImage();
	}
	
	Pixel.GetNewImage = function() {
		ga('send', 'event', 'global', 'newimage');
		try {
			var canvas = document.getElementById("overlayCanvas");
			canvas.removeEventListener('mousemove', Pixel.canvasMouseOver);
		} catch(e) {
			console.log(e);
		}
		//Set up our header auth
		$.ajaxSetup({
			headers: { 'Authorization': 'Client-ID 74f45f2bd4ebd51' }
		});
		//Call the imgur API to get a random image
		var imgurResponse = $.get(
			'https://api.imgur.com/3/gallery/random/random/1'
		).done(function() {
			var index = 0;
			imgurImage = imgurResponse.responseJSON.data[index];
			while(imgurImage.is_album || 
				imgurImage.height < 200 ||
				imgurImage.width < 75 ||
				imgurImage.nsfw) {
				index++;
				imgurImage = imgurResponse.responseJSON.data[index];
			}
			Pixel.State.image = imgurImage;
			//We got a new image, reset the overlay
			Pixel.State.overlay = null;
		}).fail(function() {
			//If we failed to get an image, just 
			imgurImage = null;
			Pixel.news.push("Error getting image from imgur, have a pretty blue image");
		}).always(function() {
			Pixel.pictureComplete = false;
			Pixel.State.pixelsThisImage = 0;
			Pixel.State.stats.timePlayedPicture = 0;
			Pixel.State.stats.manualPixelsThisImage = 0;
			Pixel.State.lastRandX = 0;
			Pixel.State.lastRandY = 0;
			Pixel.LoadImage(imgurImage);
		});
	};
	
	Pixel.LoadImage = function(image) {
		if(image != null) {
			Pixel.imageWidth = image.width;
			Pixel.imageHeight = image.height;
			var widthPct = Pixel.maxWidth/Pixel.imageWidth;
			var heightPct = Pixel.maxHeight/Pixel.imageHeight;
			if(Pixel.imageWidth > Pixel.maxWidth || Pixel.imageHeight > Pixel.maxHeight) {
				if(widthPct < heightPct) {
					Pixel.imageWidth = Math.floor(Pixel.imageWidth * widthPct);
					Pixel.imageHeight = Math.floor(Pixel.imageHeight * widthPct);
				} else {
					Pixel.imageWidth = Math.floor(Pixel.imageWidth * heightPct);
					Pixel.imageHeight = Math.floor(Pixel.imageHeight * heightPct);
				}
			}
			$('#picture').css('background-image','url("'+image.link+'")');
		}
		$('#gameContainer').css('width',Pixel.imageWidth+'px');
		$('#gameContainer').css('height',Pixel.imageHeight+'px');
		$('#overlayCanvas').attr('width',Pixel.imageWidth+'px');
		$('#overlayCanvas').attr('height',Pixel.imageHeight+'px');
		
		var canvas = document.getElementById("overlayCanvas");
		var ctx = canvas.getContext("2d");
		ctx.width = Pixel.imageWidth;
		ctx.height = Pixel.imageHeight;

		// draw the overlay into the canvas
		if(Pixel.State.overlay != null) {
			$('#overlay').attr('src',Pixel.State.overlay);
			overlay = document.getElementById("overlay");
			ctx.drawImage(overlay, 0, 0);
		} else {
			ctx.beginPath();
			ctx.fillStyle = "rgba("+Pixel.State.color+", "+Pixel.State.color+", "+Pixel.State.color+", 1.0)";
			ctx.rect(0, 0, Pixel.imageWidth, Pixel.imageHeight);
			ctx.fill();
		}
		
		var overlayImage = ctx.getImageData(0,0,Pixel.imageWidth,Pixel.imageHeight);
		Pixel.overlayImageData = overlayImage;
			
		//Mouse Move event for overlay
		canvas = document.getElementById("overlayCanvas");
		canvas.addEventListener('mousemove', Pixel.canvasMouseOver);
	}
	
	//---------------------------
	//Load & Import the Game
	//---------------------------
	Pixel.LoadGame = function() {
		try {
			if(localStorage.thePixels != JSON.stringify({})) {
				//We want to extend the state so that if the user is loading an old version, it works.
				//This only runs into issues if variables change, which means we'll need special cases 
				//whenever that happens.
				jQuery.extend(true,Pixel.State,JSON.parse(localStorage.thePixels));
				Pixel.news.push(" ");
				Pixel.news.push("If the image has no overlay, please refresh the page");
				Pixel.news.push(" ");
				Pixel.news.push("Pixels Loaded Successfully");
				
				//Load objects
				var tmpChievo = new Achievements();
				Pixel.State.achievements = tmpChievo.LoadAchievements(Pixel.State.achievements);
				var tmpUpgrades = new Upgrades();
				Pixel.State.upgrades = tmpUpgrades.LoadUpgrades(Pixel.State.upgrades);
				
				//Check stuff
				//If we have the pixel display, turn it on
				if(Pixel.State.upgrades.Check(0)) {
					$('#currency').css('display','block');
				}
				if(Pixel.State.upgrades.Check(10)) {
					Pixel.TurnOnBombListener();
				}
				if(Pixel.State.upgrades.Check(18)) {
					$('#autoFinishToggle').css("display","block");
				}
				if(Pixel.State.upgrades.Check(20)) {
					$('#colorSliderContainer').css("display","block");
				}
				
				//This is where we do things that need to be updated from old chievos

				//Other random stuff
				if(Pixel.State.bombReady) {
					$('#bomb').css("display","block");
				}
			} else {
				Pixel.news.push("No Saved Pixels Found");
			}
		} catch(e) {
			Pixel.news.push("Error Loading Saved Pixels");
			//console.log(e.message);
		}
	};
	Pixel.DecryptSave = function(str) {
		var retval = "";
		var i = 0;
		while(i != str.length) {
			retval += String.fromCharCode(parseInt(str.substr(i, 2), 16));
			i+=2;
		}
		return retval;
	}
	Pixel.ImportSave = function(save) {
		if (save && save!='') {
			Pixel.State = JSON.parse(Pixel.DecryptSave(save));
		}
		Pixel.SaveGame(false);
		location.reload();
	}
	
	//---------------------------
	//Save & Export the Game
	//---------------------------
	Pixel.EncryptSave = function(str) {
		var retval = "";
		var i = 0;
		while(i != str.length) {
			retval += str.charCodeAt(i++).toString(16);
		}
		return retval;
	}
	Pixel.ExportSave = function() {
		return Pixel.EncryptSave(JSON.stringify(Pixel.State));
	}
	
	Pixel.SaveGame = function(saveCanvas) {
		Pixel.UpdateCheck();
		if(saveCanvas === undefined || saveCanvas == true) {
			//Save the overlay, no need to do this every pixel uncovered
			var canvas = document.getElementById("overlayCanvas");
			Pixel.State.overlay = canvas.toDataURL();
		}
		//Save the game
		var thePixels = JSON.stringify(Pixel.State);
		localStorage.thePixels = thePixels;
		Pixel.news.push("Pixels Saved");
	};
	
	Pixel.UpdateCheck = function() {
		var the_url = "version.html?time="+new Date().getTime();
		$.get(the_url,function(data) {
			if(data != Pixel.version) {
				$("#version").css('display','block');
				$('#version').html('New Version Available '+data+'<br />Refresh To Get!!');
			}
		});
	};
	
	Pixel.PictureComplete = function() {
		$('#nextImage').css('display', 'block');
		Pixel.news.push("<a href='http://imgur.com/gallery/" + Pixel.State.image.id + "' target='_blank'>Image</a> finished, new image obtained");
		
		Pixel.nextImageButtonListener = snack.listener({node: document.getElementById('nextImage'),
			event: 'click'}, 
			function (){
				ga('send', 'event', 'global', 'finishedimage');
				$("#nextImage").css("display", "none");
				Pixel.State.history.push({
					skipped: false,
					link: "http://imgur.com/gallery/"+Pixel.State.image.id,
					time: Math.floor(Pixel.State.stats.timePlayedPicture)
				});
				Pixel.GetNewImage();
			}
		);
	};
	
	//---------------------------
	//Check Achievements
	//---------------------------
	Pixel.CheckChievos = function() {
		achieved = Pixel.State.achievements.achieved;
		//Total Pixels
		if(Pixel.State.stats.pixelsAllTime >= 1) {
			if($.inArray(0, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(0, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 0');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 500) {
			if($.inArray(1, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(1, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 1');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 1000) {
			if($.inArray(2, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(2, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 2');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 2500) {
			if($.inArray(3, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(3, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 3');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 5000) {
			if($.inArray(4, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(4, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 4');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 10000) {
			if($.inArray(5, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(5, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 5');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 25000) {
			if($.inArray(6, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(6, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 6');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 50000) {
			if($.inArray(7, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(7, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 7');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 100000) {
			if($.inArray(8, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(8, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 8');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 500000) {
			if($.inArray(9, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(9, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 9');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 1000000) {
			if($.inArray(10, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(10, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 10');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 5000000) {
			if($.inArray(11, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(11, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 11');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 10000000) {
			if($.inArray(12, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(12, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 12');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 100000000) {
			if($.inArray(13, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(13, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 13');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 1000000000) {
			if($.inArray(14, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(14, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 14');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 10000000000) {
			if($.inArray(15, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(15, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 15');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 100000000000) {
			if($.inArray(16, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(16, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 16');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 1000000000000) {
			if($.inArray(17, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(17, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 17');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 10000000000000) {
			if($.inArray(18, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(18, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 18');
			}
		}
		if(Pixel.State.stats.pixelsAllTime >= 100000000000000) {
			if($.inArray(19, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(19, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 19');
			}
		}
		//Manual Pixels
		if(Pixel.State.stats.pixelsManuallyCollected >= 1000) {
			if($.inArray(20, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(20, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 20');
			}
		}
		if(Pixel.State.stats.pixelsManuallyCollected >= 1000000) {
			if($.inArray(21, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(21), "http://imgur.com/gallery/"+Pixel.State.image.id;
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 21');
			}
		}
		if(Pixel.State.stats.pixelsManuallyCollected >= 1000000000) {
			if($.inArray(22, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(22, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 22');
			}
		}
		if(Pixel.State.stats.pixelsManuallyCollected >= 1000000000000) {
			if($.inArray(23, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(23, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 23');
			}
		}
		if(Pixel.State.stats.pixelsManuallyCollected >= 1000000000000000) {
			if($.inArray(24, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(24, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 24');
			}
		}
		//Auto Pixels
		if(Pixel.State.stats.pixelsAutoCollected >= 1000) {
			if($.inArray(30, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(30, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 30');
			}
		}
		if(Pixel.State.stats.pixelsAutoCollected >= 1000000) {
			if($.inArray(31, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(31, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 31');
			}
		}
		if(Pixel.State.stats.pixelsAutoCollected >= 1000000000) {
			if($.inArray(32, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(32, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 32');
			}
		}
		if(Pixel.State.stats.pixelsAutoCollected >= 1000000000000) {
			if($.inArray(33, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(33, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 33');
			}
		}
		if(Pixel.State.stats.pixelsAutoCollected >= 1000000000000000) {
			if($.inArray(34, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(34, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 34');
			}
		}
		//Bomb Pixels
		if(Pixel.State.stats.pixelsBombCollected >= 1000) {
			if($.inArray(40, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(40, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 40');
			}
		}
		if(Pixel.State.stats.pixelsBombCollected >= 1000000) {
			if($.inArray(41, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(41, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 41');
			}
		}
		if(Pixel.State.stats.pixelsBombCollected >= 1000000000) {
			if($.inArray(42, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(42, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 42');
			}
		}
		if(Pixel.State.stats.pixelsBombCollected >= 1000000000000) {
			if($.inArray(43, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(43, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 43');
			}
		}
		if(Pixel.State.stats.pixelsBombCollected >= 1000000000000000) {
			if($.inArray(44, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(44, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 44');
			}
		}
		//Misc
		if(Pixel.State.stats.bestPictureTime <= 2700) {
			if($.inArray(45, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(45, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 45');
			}
		}
		if(Pixel.State.stats.bestPictureTime <= 1800) {
			if($.inArray(46, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(46, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 46');
			}
		}
		if(Pixel.State.stats.bestPictureTime <= 1200) {
			if($.inArray(47, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(47, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 47');
			}
		}
		if(Pixel.State.stats.bestPictureTime <= 600) {
			if($.inArray(50, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(50, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 50');
			}
		}
		if(Pixel.State.stats.maxBombChain >= 8) {
			if($.inArray(51, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(51, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 51');
			}
		}
		if(Pixel.State.pixelsThisImage >= Pixel.imageHeight*Pixel.imageWidth) {
			if($.inArray(54, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(54, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 54');
			}
		}
		if(Pixel.State.stats.manualPixelsThisImage == 0 && Pixel.pictureComplete) {
			if($.inArray(55, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(55, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 55');
			}
		}
		if(Pixel.State.stats.alreadyUncovered >= 10000) {
			if($.inArray(56, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(56, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 85');
			}
		}
		if(Pixel.State.stats.picturesCompleted >= 1) {
			if($.inArray(60, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(60, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 85');
			}
		}
		if(Pixel.State.stats.picturesCompleted >= 5) {
			if($.inArray(61, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(61, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 85');
			}
		}
		if(Pixel.State.stats.picturesCompleted >= 25) {
			if($.inArray(62, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(62, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 85');
			}
		}
		if(Pixel.State.stats.picturesCompleted >= 100) {
			if($.inArray(63, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(63, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 85');
			}
		}
		if(Pixel.State.stats.picturesCompleted >= 1000) {
			if($.inArray(64, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(64, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 85');
			}
		}
		if(Pixel.State.stats.picturesSkipped >= 1) {
			if($.inArray(70, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(70, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 85');
			}
		}
		if(Pixel.State.stats.picturesSkipped >= 5) {
			if($.inArray(71, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(71, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 85');
			}
		}
		if(Pixel.State.stats.picturesSkipped >= 25) {
			if($.inArray(72, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(72, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 85');
			}
		}
		if(Pixel.State.stats.picturesSkipped >= 50) {
			if($.inArray(73, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(73, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 85');
			}
		}
		if(Pixel.State.stats.picturesSkipped >= 100) {
			if($.inArray(74, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(74, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 85');
			}
		}
		if(Pixel.State.pixelsThisImage >= Pixel.imageHeight*Pixel.imageWidth*0.01) {
			if($.inArray(80, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(80, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 80');
			}
		}
		if(Pixel.State.pixelsThisImage >= Pixel.imageHeight*Pixel.imageWidth*0.1) {
			if($.inArray(81, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(81, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 81');
			}
		}
		if(Pixel.State.pixelsThisImage >= Pixel.imageHeight*Pixel.imageWidth*0.25) {
			if($.inArray(82, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(82, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 82');
			}
		}
		if(Pixel.State.pixelsThisImage >= Pixel.imageHeight*Pixel.imageWidth*0.5) {
			if($.inArray(83, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(83, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 83');
			}
		}
		if(Pixel.State.pixelsThisImage >= Pixel.imageHeight*Pixel.imageWidth*0.75) {
			if($.inArray(84, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(84, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 84');
			}
		}
		if(Pixel.State.pixelsThisImage >= Pixel.imageHeight*Pixel.imageWidth*0.99) {
			if($.inArray(85, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(85, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 85');
			}
		}
		if(Pixel.State.stats.partiesHad >= 1) {
			if($.inArray(90, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(90, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 90');
			}
		}
		if(Pixel.State.stats.partiesHad >= 10) {
			if($.inArray(91, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(91, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 91');
			}
		}
		if(Pixel.State.stats.partiesHad >= 50) {
			if($.inArray(92, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(92, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 92');
			}
		}
		if(Pixel.State.stats.partiesHad >= 100) {
			if($.inArray(93, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(93, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 93');
			}
		}
		if(Pixel.State.stats.partiesHad >= 1000) {
			if($.inArray(94, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(94, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 94');
			}
		}
		if(Pixel.State.stats.partiesMissed >= 1000) {
			if($.inArray(95, achieved) == -1) {
				Pixel.State.achievements.UnlockAchievement(95, "http://imgur.com/gallery/"+Pixel.State.image.id);
				ga('send', 'event', 'achievement', 'unlock', 'Chievo 95');
			}
		}
	};
	
	//---------------------------
	//Handle the Processing
	//---------------------------
	Pixel.Logic = function() {
		if(!Pixel.pictureComplete) {
			Pixel.State.stats.timePlayed += 1/Pixel.fps;
			Pixel.State.stats.timePlayedPicture += 1/Pixel.fps;
		
			//Check Picture Complete (If within 1%)
			if(Pixel.State.pixelsThisImage >= Pixel.imageWidth*Pixel.imageHeight*0.999) {
				Pixel.news.push("Picture Complete");
				Pixel.pictureComplete=true;
				Pixel.State.stats.picturesCompleted++;
				if(Pixel.State.stats.timePlayedPicture < Pixel.State.stats.bestPictureTime || Pixel.State.stats.bestPictureTime == 0) {
					Pixel.State.stats.bestPictureTime = Pixel.State.stats.timePlayedPicture;
				}
				if(Pixel.State.stats.timePlayedPicture > Pixel.State.stats.worstPictureTime) {
					Pixel.State.stats.worstPictureTime = Pixel.State.stats.timePlayedPicture;
				}
				Pixel.PictureComplete();
			}
		} else {
			//Else see if the auto new picture is on and start that timer
			if(Pixel.State.upgrades.Check(18) && $('#autoFinishCheckbox').prop('checked')) {
				Pixel.timeToAutoFinish+=1/Pixel.fps;
				if(Pixel.timeToAutoFinish >= Pixel.autoFinishTime) {
					Pixel.nextImageButtonListener.fire();
					Pixel.timeToAutoFinish = 0;
				}
			}
		}
		
		//Save Game
		Pixel.timeToSave+=1/Pixel.fps;
		if(Pixel.timeToSave >= Pixel.saveEvery) {
			Pixel.SaveGame();
			Pixel.timeToSave = 0;
			Pixel.UpdateCheck(); //Check for an update when we save
			ga('send', 'event', 'global', 'savegame');
			ga('send', 'event', 'stats', 'currPixels', Pixel.State.numPixels);
			ga('send', 'event', 'stats', 'allPixels', Pixel.State.stats.pixelsAllTime);
		}
		
		//Write the news
		if(Pixel.lastNews != Pixel.news.length) {
			Pixel.lastNews = Pixel.news.length;
			var news = "";
			var i = Math.min(20,Pixel.news.length);
			while(i != 0){
				news += Pixel.news[i-1] + "<br />";
				i--;
			}
			$('#breakingNews').html(news);
		}
		
		//Refresh the bomb
		if(!Pixel.State.bombReady) {
			Pixel.timeToBomb+=1/Pixel.fps;
			if(Pixel.timeToBomb >= Pixel.baseBombReloadSpeed/(1+0.2*Pixel.State.cursorBombSpeedLvl)) {
				$('#bomb').css("display","block");
				Pixel.State.bombReady = true;
				Pixel.timeToBomb = 0;
			}
		}
		
		//Run the auto cursor
		if(Pixel.State.upgrades.Check(1) && !Pixel.pictureComplete) {
			Pixel.timeToCursor+=1/Pixel.fps;
			if(Pixel.timeToCursor >= Pixel.baseAutoCursorSpeed/(1+0.5*(Pixel.State.autoCursorSpeedLvl-1))) {
				Pixel.timeToCursor = 0;
				
				var trans = 0;
				var maxTry = 0;
				var ndx = 0;
				var offset = 1;
				//Only try this method up to 20 times, we don't want to get stuck in a loop
				//randomly trying to get like the last pixel
				while(trans == 0 && maxTry != 50) {
					maxTry++;
					Math.seedrandom();
					var randX = Math.floor(Math.random() * (Pixel.imageWidth+1));
					var randY = Math.floor(Math.random() * (Pixel.imageHeight+1));
					//console.log("Random Try "+maxTry+": "+randX+" - "+randY);
					
					ndx = randX*4 + randY*Pixel.imageWidth*4 + 3;
					offset = 1;
					while(ndx%4 != 3) {
						ndx = randX*4 + randY*Pixel.imageWidth*4 + 3+offset++;
					}
					trans = Pixel.overlayImageData.data[ndx];
				}
				
				//If we hit the max random tries, time to go pixel by pixel through the image looking for an open one
				var pxpX = Pixel.State.lastRandX;
				var pxpY = Pixel.State.lastRandY;
				while(trans == 0) {
					ndx = pxpX*4 + pxpY*Pixel.imageWidth*4 + 3;
					offset = 1;
					while(ndx%4 != 3) {
						ndx = pxpX*4 + pxpY*Pixel.imageWidth*4 + 3+offset++;
					}
					trans = Pixel.overlayImageData.data[ndx];
					if(pxpX++ > Pixel.imageWidth){
						pxpX = 0;
						pxpY++;
					}
				}
				Pixel.State.lastRandX = pxpX;
				Pixel.State.lastRandY = pxpY;
				
				Pixel.State.numPixels++;
				Pixel.State.pixelsThisImage++;
				Pixel.State.stats.pixelsAllTime++;
				Pixel.State.stats.pixelsAutoCollected++;
				
				Pixel.overlayImageData.data[ndx] = 0;
				
				Pixel.WriteOverlayData();
				$('#pixels').html(Pixel.State.numPixels);
			}
		}
		
		//If on Stats page, update the data shown
		if($('#infoHeader').html()=="Image Information:") {
			Pixel.timeToTabRefresh+=1/Pixel.fps;
			if(Pixel.timeToTabRefresh >= Pixel.tabRefreshTime) {
				Pixel.timeToTabRefresh = 0;
				Pixel.imageInfoButtonListener.fire();
			}
		}
		//If on Chievos page, update the data shown
		if($('#infoHeader').html()=="Achievements:") {
			Pixel.timeToTabRefresh+=1/Pixel.fps;
			if(Pixel.timeToTabRefresh >= Pixel.tabRefreshTime) {
				Pixel.timeToTabRefresh = 0;
				Pixel.AchievementsButtonListener.fire();
			}
		}
		
		Pixel.CheckChievos();
	};
	
	//---------------------------
	//Game Loop
	//---------------------------
	Pixel.Loop=function() {
		Pixel.Logic();
		
		//Logic looper for when slow
		Pixel.delay+=((new Date().getTime()-Pixel.time)-1000/Pixel.fps);
		Pixel.delay=Math.min(Pixel.delay,15000);
		Pixel.time=new Date().getTime();
		while(Pixel.delay>0) {
			Pixel.Logic();
			Pixel.delay-=1000/Pixel.fps;
		}
		
		//Pixel.Draw();
		
		setTimeout(Pixel.Loop,1000/Pixel.fps);
	};
};

window.onload=function() {
	Pixel.Init();
	Pixel.Start();
};
