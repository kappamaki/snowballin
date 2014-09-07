var canvas;
var ctx;
var DIRT_COLOUR = [200, 200, 255,  255]
var SNOW_COLOUR = [255, 255, 255,  255]
	
$(document).ready(function(){
	//init canvas
	canvas = $('#gameCanvas')[0];
	ctx = canvas.getContext('2d');
	
	//window.addEventListener('resize', resizeCanvas, false);
	//resizeCanvas();
	worldW = $('#gameCanvas').width();
	worldH = $('#gameCanvas').height();
	canvas.width = worldW;
	canvas.height = worldH;
});

function displayImage(image) {
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

function paint(snowballIsDead)
{
//	ctx.fillStyle = 'white';
//	ctx.fillRect(0,0, worldW, worldH);
//	ctx.strokeStyle = 'black';
//	ctx.strokeRect(0,0, worldW, worldH);
	
	drawTerrain(ctx, terrainGrid);
	
	if(!snowballIsDead) {
		snowballCharacter.sprite.stepAnimation(REDRAW_MS);
		snowballCharacter.sprite.draw(ctx, snowballCharacter.x, snowballCharacter.y, 1.0);
	}
	
	drawObstacles();
	drawEffects();
	
	if(DRAW_HITBOXES) {
		ctx.fillStyle = 'red';
		ctx.fillRect(
			snowballCharacter.x + snowballCharacter.collisionBox.x - ((snowballCharacter.collisionBox.w/2)),
			snowballCharacter.y + snowballCharacter.collisionBox.y - ((snowballCharacter.collisionBox.h/2)),
			snowballCharacter.collisionBox.w,
			snowballCharacter.collisionBox.h);
	}
	
	ctx.lineWidth = 2;
	ctx.textAlign = 'right';
	ctx.fillStyle = 'blue';
	ctx.strokeStyle = 'black';
	ctx.font="32pt Comic Sans MS"
	ctx.fillText(parseInt(playerPoints), 950, 50, 100)
	ctx.strokeText(parseInt(playerPoints), 950, 50, 100)
}

function drawObstacles() {
	for(var i=0; i<obstacleCharacters.length; i++) {
		obstacleCharacters[i].sprite.stepAnimation(REDRAW_MS);
		obstacleCharacters[i].sprite.draw(ctx, obstacleCharacters[i].x, obstacleCharacters[i].y, worldScale);
		obstacleCharacters[i].sprite.draw(ctx, obstacleCharacters[i].x, obstacleCharacters[i].y, worldScale);
	}
}

function drawEffects() {
	var effectsToDestroy = new Array();
	var tempEffects = new Array();
	
	for(var i=0; i<effectCharacters.length; i++) {
		if(effectCharacters[i].sprite.currentFrame == (effectCharacters[i].sprite.spriteImages.length-1)) {
			effectsToDestroy.push(i);
		} else {
			effectCharacters[i].sprite.stepAnimation(REDRAW_MS);
			if(effectCharacters[i].worldEffect) {
				effectCharacters[i].sprite.draw(ctx, effectCharacters[i].x, effectCharacters[i].y, worldScale);
			} else {
				effectCharacters[i].sprite.draw(ctx, effectCharacters[i].x, effectCharacters[i].y, 1.0);
			}
		}

		if(DRAW_HITBOXES) {
			ctx.fillStyle = 'red';
			ctx.fillRect(
				effectCharacters[i].x + effectCharacters[i].collisionBox.x*worldScale - ((effectCharacters[i].collisionBox.w/2)*worldScale),
				effectCharacters[i].y + effectCharacters[i].collisionBox.y*worldScale - ((effectCharacters[i].collisionBox.h/2)*worldScale),
				effectCharacters[i].collisionBox.w*worldScale,
				effectCharacters[i].collisionBox.h*worldScale);
		}
	}
	
	if(effectsToDestroy.length > 0) {
		for(var i=0; i<effectCharacters.length; i++) {
			if($.inArray(i, effectsToDestroy) === -1) {
				tempEffects.push(effectCharacters[i]);
			}
		}
		
		effectCharacters = tempEffects;
	}
}

function drawTerrain(context, terrainGrid) {
	// create a new batch of pixels with the same
    // dimensions as the image:
    var imageData = context.createImageData(terrainGrid.length, terrainGrid[0].length);
    
    for(var x=0; x<terrainGrid.length; x++) {
	    for(var y=0; y<terrainGrid[0].length; y++) {
	    	if(terrainGrid[x][y] === SNOW)
				setPixel(imageData, x, y, SNOW_COLOUR[0], SNOW_COLOUR[1], SNOW_COLOUR[2], SNOW_COLOUR[3]);
			else
				setPixel(imageData, x, y, DIRT_COLOUR[0], DIRT_COLOUR[1], DIRT_COLOUR[2], DIRT_COLOUR[3]);
	    }
    }
    
    context.putImageData(imageData, 0, 0);
}

function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

//function resizeCanvas() {
	//worldW = canvas.width = window.innerWidth;
	//worldH = canvas.height = window.innerHeight;
//}
