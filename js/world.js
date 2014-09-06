//constants
var REDRAW_MS = 50;

var MOVEMENT = 1;

var MAX_SPEED_X = 20;
var MIN_SPEED_Y = 5;
var MAX_SPEED_Y = 30;

var WORLD_MAX_SCALE = 1.0;
var WORLD_MIN_SCALE = 0.3;

var SNOWBALL_GROWTH_CONSTANT = 1.001;
var SNOWBALL_SHRINK_CONSTANT = 0.999;

//sprite resources
var worldW;
var worldH;

var speedY = MIN_SPEED_Y;
var speedX = 0;
var movementShift = 0;

var worldScale;
var snowballSprite;

var snowballCharacter;

//terrain
var terrainGrid;

$(document).ready(function(){
	worldScale = 1.0;
	game_loop = setInterval(gameLoop, REDRAW_MS);
	
	snowballSprite = loadSprite('img/sprites/snowball/', 2, 500);
	snowballCharacter = createCharacter(snowballSprite);
	snowballCharacter.x = (worldW / 2);
	snowballCharacter.y = (worldH / 4);
	
	terrainGrid = seedTerrain();
});

function gameLoop() {
	//friction
	if(speedX > 0) speedX -= 1;
	if(speedX < 0) speedX += 1;
	
	snowballCharacter.x += speedX;
	checkBounds(snowballCharacter);
	checkSnow(terrainGrid, snowballCharacter);
	terrainGrid = shiftTerrain(terrainGrid, speedY);
	paint();
}

function createCharacter(sprite) {
	return {
		x: 0,
		y: 0,
		sprite: sprite
	}
}

function checkBounds(character) {
	var halfWidth = (character.sprite.getCurrentFrameImage().width/2);
	var halfHeight = (character.sprite.getCurrentFrameImage().height/2);
	if(character.x + halfWidth > worldW) {
		 character.x = (worldW - halfWidth);
		 speedX = -MAX_SPEED_X;
	}
	if(character.x - halfWidth < 0) {
		character.x = (0 + halfWidth);
		 speedX = MAX_SPEED_X;
	}
}

function checkSnow(terrainGrid, character) {
	if(terrainGrid[character.x][character.y] === SNOW)
	{
		speedY = (speedY+1) > MAX_SPEED_Y ? MAX_SPEED_Y : (speedY+1);
		worldScale = (worldScale * SNOWBALL_SHRINK_CONSTANT) < WORLD_MIN_SCALE ? WORLD_MIN_SCALE : (worldScale * SNOWBALL_SHRINK_CONSTANT);
	} else {	
		speedY = (speedY-1) < MIN_SPEED_Y ? MIN_SPEED_Y : (speedY-1);
		worldScale = (worldScale * SNOWBALL_GROWTH_CONSTANT) > WORLD_MAX_SCALE ? WORLD_MAX_SCALE : (worldScale * SNOWBALL_GROWTH_CONSTANT);
	}
	
}
