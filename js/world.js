//constants
var REDRAW_MS = 100;

var MOVEMENT = 1;

var MAX_SPEED_X = 20;
var MIN_SPEED_Y = 5;
var MAX_SPEED_Y = 30;

var WORLD_MAX_SCALE = 1.0;
var WORLD_MIN_SCALE = 0.2;

var WORLD_GROWTH_CONSTANT = 1.001;
var WORLD_SHRINK_CONSTANT = 0.999;

var DIRT = 0;
var SNOW = 1;

var TERRAIN_MIN_WIDTH = 600;

//global variables
//sprite resources
var snowballSprite;

var worldW;
var worldH;
var worldScale;

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
	snowballCharacter.speedY = MIN_SPEED_Y;
	snowballCharacter.speedX = 0;
	
	terrainGrid = seedTerrain();
});

function gameLoop() {
	//friction
	if(snowballCharacter.speedX > 0) snowballCharacter.speedX -= 1;
	if(snowballCharacter.speedX < 0) snowballCharacter.speedX += 1;
	
	snowballCharacter.x += snowballCharacter.speedX;
	checkBounds(snowballCharacter);
	checkSnow(terrainGrid, snowballCharacter);
	terrainGrid = shiftTerrain(terrainGrid, speedY);
	paint();
}

function createCharacter(sprite) {
	return {
		x: 0,
		y: 0,
		speedX: 0,
		speedY: 0,
		sprite: sprite
	}
}

function checkBounds(character) {
	var halfWidth = (character.sprite.getCurrentFrameImage().width/2);
	var halfHeight = (character.sprite.getCurrentFrameImage().height/2);
	if(character.x + halfWidth > worldW) {
		 character.x = (worldW - halfWidth);
		 snowballCharacter.speedX = -MAX_SPEED_X;
	}
	if(character.x - halfWidth < 0) {
		character.x = (0 + halfWidth);
		 snowballCharacter.speedX = MAX_SPEED_X;
	}
}

function checkSnow(terrainGrid, character) {
	if(terrainGrid[character.x][character.y] === SNOW)
	{
		speedY = (speedY+1) > MAX_SPEED_Y ? MAX_SPEED_Y : (speedY+1);
		worldScale = (worldScale * WORLD_SHRINK_CONSTANT) < WORLD_MIN_SCALE ? WORLD_MIN_SCALE : (worldScale * WORLD_SHRINK_CONSTANT);
	} else {	
		speedY = (speedY-1) < MIN_SPEED_Y ? MIN_SPEED_Y : (speedY-1);
		worldScale = (worldScale * WORLD_GROWTH_CONSTANT) > WORLD_MAX_SCALE ? WORLD_MAX_SCALE : (worldScale * WORLD_GROWTH_CONSTANT);
	}
	
}
