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
			Pixel.version = 'Beta v0.1.0.0';
			Pixel.initialized = 1;
			Pixel.fps = 30;
			Pixel.saveEvery = 300; //Save every 5 min
			Pixel.maxWidth = 600;
			Pixel.maxHeight = 800;
			
			//---------------------------
			//Non-saved vars
			//---------------------------
			Pixel.timeToSave = 0;
			Pixel.newsId = 0;
			Pixel.delay = 0;
			Pixel.imageWidth = Pixel.maxWidth;
			Pixel.imageHeight = Pixel.maxHeight;
			Pixel.time = new Date().getTime();
			Pixel.news = Array();
			Pixel.lastNews = 0;
			Pixel.gameButtonListeners = Array();
			Pixel.gameButtonOverListeners = Array();
			
			//---------------------------
			//State Variables that will be saved
			//---------------------------
			Pixel.State.firstPlay = Pixel.time;
			Pixel.State.numPixels = 0;
			Pixel.State.pixelsThisImage = 0;
			Pixel.State.image = null;
			Pixel.State.overlay = null;
			Pixel.State.achievements = {};
			Pixel.State.upgrades = {};
			
			//---------------------------
			//State Variables that will be saved
			//---------------------------
			Pixel.State.stats = {};
			Pixel.State.stats.timePlayed = 0;
			Pixel.State.stats.timePlayedPicture = 0;
			Pixel.State.stats.bestPictureTime = 0;
			Pixel.State.stats.worstPictureTime = 0;
			Pixel.State.stats.picturesCompleted = 0;
			Pixel.State.stats.picturesSkipped = 0;
			
			//Load the existing state if one exists
			Pixel.LoadGame();
			
			//Setup
			var index = 0;
			$('#pixels').html("Pixels: "+Pixel.State.numPixels);
			
			//If we don't have an image stored, get one
			if(Pixel.State.image == null) {
				Pixel.GetNewImage();
			} else {
				//Otherwise we have an image, load the existing one
				Pixel.LoadImage(Pixel.State.image);
			}
			
			//Mouse Move event for overlay
			var canvas = document.getElementById("overlayCanvas");
			canvas.addEventListener('mousemove', function(evt) {
				var ctx = canvas.getContext("2d");
				var rect = canvas.getBoundingClientRect();
				
				var canvasOffset=$("#overlayCanvas").offset();
				var offsetX=canvasOffset.left;
				var offsetY=canvasOffset.top;

				var mouseX = evt.clientX - rect.left;
				var mouseY = evt.clientY - rect.top;
				var overlayImage = ctx.getImageData(0,0,Pixel.imageWidth,Pixel.imageHeight);
				var overlayImageData = overlayImage.data;
				
				var ndx = mouseX*4 + mouseY*Pixel.imageWidth*4 + 3;
				var offset = 1;
				while(ndx%4 != 3) {
					ndx = mouseX*4 + mouseY*Pixel.imageWidth*4 + 3+offset++;
				}
				var transparency = overlayImageData[ndx];
				if(transparency != 0) {
					Pixel.State.numPixels++;
					overlayImageData[ndx] = 0;
				}
				overlayImage.data = overlayImageData;
				ctx.putImageData(overlayImage, 0, 0);
				$('#pixels').html("Pixels: "+Pixel.State.numPixels);
			}, false);
			
			//Header Button listeners
			Pixel.UpgradesButtonListener = snack.listener({node: document.getElementById('upgradesHeaderBtn'),
				event: 'click'}, 
				function (){
					$("#info").html("");
					var txt = "<div class='infoHeader'>Available Upgrades:</div><br />";
					$("#info").append(txt);
					
					//Make the buttons
					for(var ndx=0; ndx!=Pixel.State.upgrades.upgradeList.length; ndx++) {
						var upgradeNum = Pixel.State.upgrades.upgradeList[ndx];
						var upgd = Pixel.State.upgrades.upgrades[upgradeNum];
						txt = "<div class='gameButton' id='upgradeButton"+upgradeNum+"'>"+upgd.name+"</div>";
						$("#info").append(txt);
					
						//Now make the event listeners
						var upgradeNum = Pixel.State.upgrades.upgradeList[ndx];
						var upgd = Pixel.State.upgrades.upgrades[upgradeNum];
						(function (_upgd) {
							Pixel.gameButtonListeners[upgradeNum] = snack.listener({node: document.getElementById('upgradeButton'+upgradeNum),
								event: 'click'}, 
								function (event){
									if(_upgd.cost <= Pixel.State.numPixels) {
										Pixel.State.numPixels -= _upgd.cost;
										Pixel.State.upgrades.owned.push(upgradeNum);
										_upgd.unlockFunction();
									} else {
										Pixel.news.push("You need more pixels");
									}
								}
							);
							Pixel.gameButtonOverListeners[upgradeNum] = snack.listener({node: document.getElementById('upgradeButton'+upgradeNum),
								event: 'mouseover'}, 
								function(evt){
									$(this).mousemove(function(event){
										Pixel.ShowPopUpDiv(event.pageX, event.pageY,
											"Desc: "+_upgd.desc+"<br />"+
											"Cost: "+_upgd.cost+" Pixels<br />");
									});
								}
							);
						})(upgd);
					}
				}
			);
			Pixel.UpgradesButtonListener.fire();
			
			Pixel.imageInfoButtonListener = snack.listener({node: document.getElementById('imageInfoHeaderBtn'),
				event: 'click'}, 
				function (){
					$("#info").html("");
					var txt = "<div class='infoHeader'>Image Information:</div><br />";
					txt += "<div>Requires upgrade purchase!</div><br /><br />";
					txt += "<div class='infoHeader'>Statistics:</div><br />";
					txt += "<div>Requires upgrade purchase!</div>";
					$("#info").html(txt);
				}
			);
			
			Pixel.AchievementsButtonListener = snack.listener({node: document.getElementById('achievementsHeaderBtn'),
				event: 'click'}, 
				function (){
					$("#info").html("");
					var txt = "<div class='infoHeader'>Achievements:</div><br />";
					txt += "<div>Coming Soon!</div><br />";
					$("#info").html(txt);
				}
			);
			
			Pixel.menuButtonListener = snack.listener({node: document.getElementById('menuHeaderBtn'),
				event: 'click'}, 
				function (){
					$("#info").html("");
					var txt = "<div class='infoHeader'>MENU:</div><br />";
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
			
			//Game Buttons - On mouseout
			$(".gameButton").bind("mouseout",
				function(e) {
					Pixel.HidePopUpDiv();
				}
			);
			
			$('#gameContainer').css('display','block');
			$('#version').html(Pixel.version);
			
			//---------------------------
			//Start the game
			//---------------------------
			Pixel.Loop();
		} else {
			$('#document').css('display','none');
			e('body').innerHTML = "This game requires an HTML5 compliant browser.<br />This" +
					" includes IE8+, Chrome, Firefox, Safari, and Opera.";
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
	
	Pixel.DisplayPixels = function() {
		$('#currency').css('display','block');
	}
	
	Pixel.HidePopUpDiv = function() {
		$('#popUpDiv').css('display','none');
	}
	
	Pixel.GetNewImage = function() {
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
			while(imgurImage.link.indexOf("/a/") > -1 || 
				imgurImage.height < 200 ||
				imgurImage.width < 75) {
				index++;
				imgurImage = imgurResponse.responseJSON.data[index];
			}
			Pixel.State.image = imgurImage;
			//We got a new image, reset the overlay
			Pixel.State.overlay = null;
		}).fail(function() {
			//If we failed to get an image, just 
			imgurImage = null;
			alert("Error getting image from imgur, have a pretty blue image");
		}).always(function() {
			Pixel.LoadImage(imgurImage);
		});
	}
	
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
			ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
			ctx.rect(0, 0, Pixel.imageWidth, Pixel.imageHeight);
			ctx.fill();
		}
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
				Pixel.news.push("Pixels Loaded Successfully");
				
				//Load objects
				var tmpChievo = new Achievements();
				Pixel.State.achievements = tmpChievo.LoadAchievements(Pixel.State.achievements);
				var tmpUpgrades = new Upgrades();
				Pixel.State.upgrades = tmpUpgrades.LoadUpgrades(Pixel.State.upgrades);
				
				//This is where we do things that need to be updated from old chievos

			} else {
				Pixel.news.push("No Saved Pixels Found");
			}
		} catch(e) {
			Pixel.news.push("Error Loading Saved Pixels");
			console.log(e.message);
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
	}
	
	//---------------------------
	//Handle the Processing
	//---------------------------
	Pixel.Logic = function() {
		Pixel.State.stats.timePlayed += 1/Pixel.fps;
		Pixel.State.stats.timePlayedPicture += 1/Pixel.fps;
		
		//Save Game
		Pixel.timeToSave+=1/Pixel.fps;
		if(Pixel.timeToSave >= Pixel.saveEvery) {
			Pixel.SaveGame();
			Pixel.timeToSave = 0;
			Pixel.UpdateCheck(); //Check for an update when we save
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
	};
	
	//---------------------------
	//Game Loop
	//---------------------------
	Pixel.Loop=function() {
		Pixel.Logic();
		
		//Logic looper for when slow
		Pixel.delay+=((new Date().getTime()-Pixel.time)-1000/Pixel.fps);
		Pixel.delay=Math.min(Pixel.delay,5000);
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