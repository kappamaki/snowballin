//constants
var REDRAW_MS = 100;

var MOVEMENT = 1;

var MAX_SPEED_X = 20;
var MIN_SPEED_Y = 5;
var MAX_SPEED_Y = 30;

var WORLD_MAX_SCALE = 1.0;
var WORLD_MIN_SCALE = 0.05;

var WORLD_GROWTH_CONSTANT = 1.005;
var WORLD_SHRINK_CONSTANT = 0.995;

var DIRT = 0;
var SNOW = 1;

var TERRAIN_MIN_WIDTH = 600;

var ROCK_THRESHOLD = 0.7;
var TREE_THRESHOLD = 0.2;

var BUNNY = 0;
var ROCK = 1;
var TREE = 2;

var SPAWN_THRESHOLD = 100;

var SPAWN_CHANCE = 0.05;

var COLLISION_FORGIVENESS = 20;

//global variables
//sprite resources
var snowballSprite;
var bunnySprite;
var rockSprite;
var treeSprite;

var worldW;
var worldH;
var worldScale;

var snowballCharacter;
var obstacleCharacters;

//terrain
var terrainGrid;

$(document).ready(function(){
	worldScale = 1.0;
	game_loop = setInterval(gameLoop, REDRAW_MS);
	
	snowballSprite = loadSprite('img/sprites/snowball/', 2, 500);
	bunnySprite = loadSprite('img/sprites/bunny/', 2, 500);
	rockSprite = loadSprite('img/sprites/rock/', 1, 0);
	treeSprite = loadSprite('img/sprites/tree/', 1, 0);
	
	snowballCharacter = createCharacter(snowballSprite);
	snowballCharacter.x = (worldW / 2);
	snowballCharacter.y = (worldH / 4);
	snowballCharacter.speedY = MIN_SPEED_Y;
	snowballCharacter.speedX = 0;
	
	obstacleCharacters = new Array();
	
	terrainGrid = seedTerrain();
});

function gameLoop() {
	//friction
	if(snowballCharacter.speedX > 0) snowballCharacter.speedX -= 1;
	if(snowballCharacter.speedX < 0) snowballCharacter.speedX += 1;

	spawnObstacles();
	stepObstacles();
	
	snowballCharacter.x += snowballCharacter.speedX;
	checkBounds(snowballCharacter);
	checkSnow(terrainGrid, snowballCharacter);
	
	terrainGrid = shiftTerrain(terrainGrid, snowballCharacter.speedY);
	paint();

	checkPlayerCollisions();
}

function createCharacter(sprite) {
	return {
		x: 0,
		y: 0,
		speedX: 0,
		speedY: 0,
		sprite: sprite,

		width: function() {
			return this.sprite.getCurrentFrameImage().width;
		},

		height: function() {
			return this.sprite.getCurrentFrameImage().height;
		},
	}
}

function checkBounds(character) {
	var halfWidth = (character.width()/2);
	var halfHeight = (character.height()/2);
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
	//minSpeedY = Math.max(MAX_SPEED_Y * (WORLD_MIN_SCALE / worldScale), MIN_SPEED_Y);
	minSpeedY = MIN_SPEED_Y;	maxSpeedY = MAX_SPEED_Y;
	
	if(terrainGrid[character.x][character.y] === SNOW)
	{
		snowballCharacter.speedY = (snowballCharacter.speedY+1) > maxSpeedY ? maxSpeedY : (snowballCharacter.speedY+1);
		worldScale = (worldScale * WORLD_SHRINK_CONSTANT) < WORLD_MIN_SCALE ? WORLD_MIN_SCALE : (worldScale * WORLD_SHRINK_CONSTANT);
	} else {	
		snowballCharacter.speedY = (snowballCharacter.speedY-1) < minSpeedY ? minSpeedY : (snowballCharacter.speedY-1);
		//worldScale = (worldScale * WORLD_GROWTH_CONSTANT) > WORLD_MAX_SCALE ? WORLD_MAX_SCALE : (worldScale * WORLD_GROWTH_CONSTANT);
	}
	
}

function spawnObstacles() {
	if(Math.random() < SPAWN_CHANCE)
	{
		if(worldScale <= TREE_THRESHOLD) {
			var spawnType = parseInt(Math.random() * 3);
			
		} else if(worldScale <= ROCK_THRESHOLD) {
			var spawnType = parseInt(Math.random() * 2);
			
		} else {
			var spawnType = BUNNY;
		}
		
		var newCharacter;
		switch(spawnType) {
			case BUNNY:
				newCharacter = createCharacter(bunnySprite);
				newCharacter.speedX = 10;
				break;
			case ROCK:
				newCharacter = createCharacter(rockSprite);
				break;
			case TREE:
				newCharacter = createCharacter(treeSprite);
				break;
		}
		newCharacter.x = Math.random() * worldW;
		
		newCharacter.y = worldH + SPAWN_THRESHOLD;
		obstacleCharacters.push(newCharacter);
	}
}

function stepObstacles() {
	for(var i=0; i<obstacleCharacters.length; i++) {
		obstacleCharacters[i].x += obstacleCharacters[i].speedX;
		obstacleCharacters[i].y -= snowballCharacter.speedY;
		
		//despawn
		if(obstacleCharacters[i].y + SPAWN_THRESHOLD < 0)
		{
			obstacleCharacters.shift();
			i--;
		}
	}
}

function checkPlayerCollisions() {
	for(var i=0; i<obstacleCharacters.length; i++) {
		if(checkPlayerCollision(obstacleCharacters[i]))
		{
			alert('you are dead!');
		}
	}
}

function checkPlayerCollision(obstacle) {
  return (Math.abs(snowballCharacter.x - obstacle.x) * 2 < (snowballCharacter.width() + (obstacle.width() * worldScale - COLLISION_FORGIVENESS))) &&
         (Math.abs(snowballCharacter.y - obstacle.y) * 2 < (snowballCharacter.height() + (obstacle.height() * worldScale - COLLISION_FORGIVENESS)));
}
