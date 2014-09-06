var canvas;
var ctx;
var w;
var h;

var snowballSprite;
	
$(document).ready(function(){
	//init canvas
	canvas = $('#gameCanvas')[0];
	ctx = canvas.getContext('2d');
	
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();
	
	snowballSprite = loadSprite('img/sprites/snowball/', 2, 10)
});

function paint()
{
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0, w, h);
	ctx.strokeStyle = 'black';
	ctx.strokeRect(0,0, w, h);
	
	ctx.drawImage(getCurrentSpriteImage(snowballSprite), snowballX, snowballY);
	stepSpriteAnimation(snowballSprite);
}

function resizeCanvas() {
	w = canvas.width = window.innerWidth;
	h = canvas.height = window.innerHeight;
}

function loadSprite(spriteImageFolder, imageCount, stepsPerFrame) {
	var img;
	var spriteImages = new Array();
	
    for (var i=0; i<imageCount; i++){
        bCheckEnabled = false;
        img = new Image();
        img.src = spriteImageFolder + i + '.png';
	    spriteImages.push(img);
    }
    
    var keyframeIndexes = new Array();
  	var keyframeIndexCount = imageCount * stepsPerFrame;
  	
    for (var i=0; i<keyframeIndexCount; i++){
    	keyframeIndexes.push(parseInt(i / stepsPerFrame));
    }

	return {
		SpriteImages: spriteImages,
		CurrentIndex: 0,
		KeyframeIndexes: keyframeIndexes
	}
}

function stepSpriteAnimation(sprite) {
	sprite.CurrentIndex += 1;
	if(sprite.CurrentIndex >= sprite.KeyframeIndexes.length) sprite.CurrentIndex = 0;
}

function getCurrentSpriteImage(sprite) {
	return sprite.SpriteImages[sprite.KeyframeIndexes[sprite.CurrentIndex]];
}
