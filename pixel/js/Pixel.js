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
			Pixel.newGame = true;
			Pixel.fps = 30;
			Pixel.saveEvery = 300; //Save every 5 min
			Pixel.maxWidth = 600;
			Pixel.maxHeight = 800;
			Pixel.news = Array();
			
			//---------------------------
			//Non-saved vars
			//---------------------------
			Pixel.timeToSave = 0;
			Pixel.newsId = 0;
			Pixel.delay = 0;
			Pixel.time = new Date().getTime();
			
			//---------------------------
			//State Variables that will be saved
			//---------------------------
			Pixel.State.firstPlay = Pixel.time;
			Pixel.State.numPixels = 0;
			Pixel.State.pixelsThisImage = 0;
			Pixel.State.image = null;
			Pixel.State.overlay = null;
			
			//---------------------------
			//State Variables that will be saved
			//---------------------------
			Pixel.State.stats = {};
			Pixel.State.stats.timePlayed = 0;
			Pixel.State.stats.timePlayedPicture = 0;
			Pixel.State.stats.bestPictureTime = 0;
			Pixel.State.stats.worstPictureTime = 0;
			Pixel.State.stats.picturesCompleted = 0;
			
			//Setup
			var index = 0;
			var width = Pixel.maxWidth;
			var height = Pixel.maxHeight;
			$('#pixels').html("Pixels: "+Pixel.State.numPixels);
			// get the image
			var overlay = document.getElementById("overlay");
			// create and customize the canvas
			var canvas = document.getElementById("overlayCanvas");
			
			$.ajaxSetup({
				headers: { 'Authorization': 'Client-ID 74f45f2bd4ebd51' }
			});
			var imgurResponse = $.get(
				'https://api.imgur.com/3/gallery/random/random/1'
			).done(function() {
				var imgurImage = Pixel.State.image;
				if(imgurImage == null) {
					imgurImage = imgurResponse.responseJSON.data[index].link;
					while(imgurImage.indexOf("/a/") > -1 && index < 50 && 
						imgurResponse.responseJSON.data[index].height/imgurResponse.responseJSON.data[index].width > 0.2 &&
						imgurResponse.responseJSON.data[index].width/imgurResponse.responseJSON.data[index].height > 0.2) {
						index++;
						imgurImage = imgurResponse.responseJSON.data[index].link;
					}
					Pixel.State.image = imgurResponse.responseJSON.data[index];
				}
				width = Pixel.State.image.width;
				height = Pixel.State.image.height;
				var widthPct = Pixel.maxWidth/width;
				var heightPct = Pixel.maxHeight/height;
				if(width > Pixel.maxWidth || height > Pixel.maxHeight) {
					if(widthPct < heightPct) {
						width = Math.floor(width * widthPct);
						height = Math.floor(height * widthPct);
					} else {
						width = Math.floor(width * heightPct);
						height = Math.floor(height * heightPct);
					}
				}
				$('#picture').css('background-image','url("'+imgurImage+'")');
			}).fail(function() {
				alert("Error getting image from imgur, have a pretty blue image");
			}).always(function() {
				$('#gameContainer').css('width',width+'px');
				$('#gameContainer').css('height',height+'px');
				$('#overlayCanvas').attr('width',width+'px');
				$('#overlayCanvas').attr('height',height+'px');
				// get the context
				var ctx = canvas.getContext("2d");
				ctx.width = width;
				ctx.height = height;
				// draw the image into the canvas
				if(Pixel.State.overlay == null) {
					ctx.drawImage(overlay, 0, 0);
				} else {
					ctx.putImageData(Pixel.State.image, 0, 0);
				}
				canvas.addEventListener('mousemove', function(evt) {
					var canvas = document.getElementById("overlayCanvas");
					var ctx = canvas.getContext("2d");
					var rect = canvas.getBoundingClientRect();
					
					var canvasOffset=$("#overlayCanvas").offset();
					var offsetX=canvasOffset.left;
					var offsetY=canvasOffset.top;

					var mouseX = evt.clientX - rect.left;
					var mouseY = evt.clientY - rect.top;
					var image = ctx.getImageData(0,0,width,height);
					var imageData = image.data;
					
					var ndx = mouseX*4 + mouseY*width*4 + 3;
					var offset = 1;
					while(ndx%4 != 3) {
						ndx = mouseX*4 + mouseY*width*4 + 3+offset++;
					}
					var transparency = imageData[ndx];
					if(transparency != 0) {
						Pixel.State.numPixels++;
						imageData[ndx] = 0;
					}
					image.data = imageData;
					//Save the state of the overlay
					ctx.putImageData(image, 0, 0);
					Pixel.State.overlay = canvas.toDataURL();
					$('#pixels').html("Pixels: "+Pixel.State.numPixels);
				}, false);
				$('#gameContainer').css('display','block');
			});
			//---------------------------
			//Start the game
			//---------------------------
			$('#version').html(Pixel.version);
			Pixel.Loop();
		} else {
			$('#document').css('display','none');
			e('body').innerHTML = "This game requires an HTML5 compliant browser.<br />This" +
					" includes IE8+, Chrome, Firefox, Safari, and Opera.";
		}
	};
	
	
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
				Pixel.newGame = false;
				
				//Load objects
				
				//This is where we do things that need to be updated from old chievos

			} else {
				Pixel.news.push("No Saved Pixels Found");
				Pixel.NewGame();
			}
		} catch(e) {
			Pixel.news.push("Error Loading Saved Pixels");
			Pixel.NewGame();
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
		Pixel.SaveGame();
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
	
	Pixel.SaveGame = function() {
		var thePixels = JSON.stringify(Pixel.State);
		localStorage.thePixels = thePixels;
		Pixel.news.push("Pixels Saved");
	};
	
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
	}
	
	//---------------------------
	//Game Loop
	//---------------------------
	Pixel.Loop=function() {
		if(!Pixel.newGame) {
			Pixel.Logic();
			
			//Logic looper for when slow
			Pixel.delay+=((new Date().getTime()-Pixel.time)-1000/Pixel.fps);
			Pixel.delay=Math.min(Pixel.delay,5000);
			Pixel.time=new Date().getTime();
			while(Pixel.delay>0) {
				Pixel.Logic();
				Pixel.delay-=1000/Pixel.fps;
			}
			
			Pixel.Draw();
			
			setTimeout(Pixel.Loop,1000/Pixel.fps);
		}
	}
};

window.onload=function() {
	Pixel.Init();
	Pixel.Start();
};