var colors = new Array("Red","Blue","Yellow","Green","Purple","Black","White","Lime","Magenta","Cyan","Orange","Navy");
var colorHex1 = new Array("#AA0000","#0000AA","#FFFF00","#00DD00","#DD00FF","#111111","#DDDDDD","#88CC00","#FF55BB","#00FFDD","#FF7700","#111177");
var colorHex2 = new Array("#DD0000","#0000DD","#FFFF00","#00DD00","#DD00FF","#111111","#DDDDDD","#88CC00","#FF55BB","#00FFDD","#FF7700","#111177");

function PointOnCircle(radius, angle, originX, originY) {
	// Convert from degrees to radians via multiplication by PI/180        
	var x = radius * Math.cos(angle * Math.PI / 180.0) + originX;
	var y = radius * Math.sin(angle * Math.PI / 180.0) + originY;

	return new Array(x, y);
}

function Planet(starting) {
	Math.seedrandom();
	this.mods = {};
	this.mods.food = 1.0;
	this.mods.wood = 1.0;
	this.mods.metal = 1.0;
	this.cosmetic = {};
	this.cosmetic.color1ndx = Math.floor(Random(0, colors.length));
	this.cosmetic.color1 = colors[this.cosmetic.color1ndx];
	this.cosmetic.color2ndx = Math.floor(Random(0, colors.length));
	this.cosmetic.color2 = colors[this.cosmetic.color2ndx];
	
	this.radius = 400;
	this.originX = 600;
	this.originY = 400;
	this.shape1 = new Array(200, 220, 240, 190);
	this.shape2 = new Array(140, 90, 100, 200);
	
	this.satellites = new Array();
	var numSats = 2;
	if(!starting) {
		numSats = Math.floor(Math.random()*5);
	}
	for(var i = 0; i != numSats; i++) {
		this.satellites.push("Satellite "+i);
	}
	this.name = "";
	if(!starting) {
	}
}

Planet.prototype = {
	constructor: Planet,
	Draw:function(canvas) {
		var c=document.getElementById(canvas);
		var ctx=c.getContext("2d");
		ctx.globalCompositeOperation = 'source-over';
		ctx.clearRect(0, 0, 600, 800);
		ctx.fillStyle=colorHex2[this.cosmetic.color2ndx];
		ctx.globalAlpha = 0.7;
		ctx.beginPath();
		ctx.arc(this.originX,this.originY,this.radius,Math.PI*0.5,Math.PI*1.5);
		ctx.fill();
		
		ctx.globalCompositeOperation = 'source-atop';
		ctx.fillStyle=colorHex1[this.cosmetic.color1ndx];
		ctx.beginPath();
		//Planet at equ is (200,400)
		//(600,0) at north pole
		//(600,800) at south pole
		ctx.moveTo(250,475);
		ctx.bezierCurveTo(220,550,380,600,405,510);
		ctx.quadraticCurveTo(415,500,480,510);
		ctx.bezierCurveTo(520,515,530,360,500,340);
		ctx.quadraticCurveTo(475,320,510,215);
		ctx.quadraticCurveTo(525,175,470,200);
		ctx.bezierCurveTo(450,215,320,110,370,70);
		ctx.bezierCurveTo(100,100,100,500,230,460);
		ctx.quadraticCurveTo(260,440,250,475);
		ctx.stroke();
		ctx.fill();
		
		ctx.beginPath();
		//Planet at equ is (200,400)
		//(600,0) at north pole
		//(600,800) at south pole
		ctx.moveTo(650,740);
		ctx.bezierCurveTo(650,770,600,765,580,740);
		ctx.quadraticCurveTo(555,700,510,725);
		ctx.bezierCurveTo(495,735,465,700,480,690);
		ctx.quadraticCurveTo(495,660,480,640);
		ctx.bezierCurveTo(450,620,460,595,480,600);
		ctx.quadraticCurveTo(530,610,570,590);
		ctx.bezierCurveTo(620,550,700,700,700,750);
	/*	ctx.quadraticCurveTo();
		ctx.bezierCurveTo();
		ctx.quadraticCurveTo();*/
		ctx.stroke();
		ctx.fill();
	},
	LoadPlanet:function(old) {
		this.mods.food = old.mods.food;
		this.mods.wood = old.mods.wood;
		this.mods.metal = old.mods.metal;
		this.cosmetic.color1ndx = old.cosmetic.color1ndx;
		this.cosmetic.color1 = old.cosmetic.color1;
		this.cosmetic.color2ndx = old.cosmetic.color2ndx;
		this.cosmetic.color2 = old.cosmetic.color2;
		this.satellites = old.satellites;
		this.name = old.name;
		/*this.radius = old.radius;
		this.originX = old.originX;
		this.originY = old.originY;
		this.startAngle = old.startAngle;
		this.endAngle = old.endAngle;
		this.startCoord = old.startCoord;
		this.endCoord = old.endCoord;*/
		return this;
	}
}
