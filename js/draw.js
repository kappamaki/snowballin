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

function paint()
{
//	ctx.fillStyle = 'white';
//	ctx.fillRect(0,0, worldW, worldH);
//	ctx.strokeStyle = 'black';
//	ctx.strokeRect(0,0, worldW, worldH);
	
	drawTerrain(ctx, terrainGrid);
	snowballCharacter.sprite.stepAnimation(REDRAW_MS);
	snowballCharacter.sprite.draw(ctx, snowballCharacter.x, snowballCharacter.y, 1.0)
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
