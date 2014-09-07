var DRAW_HITBOXES = false;

//constants
var REDRAW_MS = 50;

var MOVEMENT = 3;

var MAX_SPEED_X = 20;
var MIN_SPEED_Y = 5;
var MAX_SPEED_Y = 15;

var WORLD_MAX_SCALE = 1.0;
var WORLD_MIN_SCALE = 0.05;

var WORLD_GROWTH_CONSTANT = 1.005;
var WORLD_SHRINK_CONSTANT = 0.995;

var DIRT = 0;
var SNOW = 1;
var CLIFF = 2;

var TERRAIN_MIN_WIDTH = 600;

var LEVEL0_THRESHOLD = 1.0;
var LEVEL1_THRESHOLD = 0.4;
var LEVEL2_THRESHOLD = 0.2;
var BUNNY_SPEED = 5;

var BUNNY = 0;
var ROCK = 1;
var TREE = 2;

var KILL_THRESHOLD = [0.5, 0.2, 0.09];

var OBSTACLE_SPAWN_CHANCE = [ [0.15, 0.05, 0.01], [0.15, 0.10, 0.05], [0.15, 0.15, 0.15] ];
//var OBSTACLE_SPAWN_CHANCE = [ [0.0, 0.00, 0.1], [0.15, 0.10, 0.05], [0.15, 0.15, 0.15] ];

var SPAWN_THRESHOLD = 300;

var game_loop;

//global variables
//sprite resources
var snowballSprite;
var bunnySpriteLeft;
var bunnySpriteRight;
var rockSprite;
var treeSprite;

//collision boxes for sprites
var snowballCollisonBox;
var bunnyCollisonBox;
var rockCollisonBox;
var treeCollisonBox;

var worldW;
var worldH;
var worldScale;

var snowballCharacter;
var obstacleCharacters;

//terrain
var terrainGrid;

$(document).ready(function(){
	snowballSprite = loadSprite('img/sprites/snowball/', 12, 50);
	bunnySpriteLeft = loadSprite('img/sprites/bunny_left/', 2, 800);
	bunnySpriteRight = loadSprite('img/sprites/bunny_right/', 2, 800);
	rockSprite = loadSprite('img/sprites/rock/', 1, 0);
	treeSprite = loadSprite('img/sprites/tree/', 1, 0);

	snowballCollisonBox = createCollisonBox(0,0,50,62);
	bunnyCollisonBox = createCollisonBox(0,0,80,50);
	rockCollisonBox = createCollisonBox(0,10,230,130);
	treeCollisonBox = createCollisonBox(0,300,500,200);
	
	initiateGameWorld();
});

function initiateGameWorld() {
	worldScale = 1.0;
	snowballCharacter = createCharacter(snowballSprite, snowballCollisonBox);
	snowballCharacter.x = (worldW / 2);
	snowballCharacter.y = (worldH / 4);
	snowballCharacter.speedY = MIN_SPEED_Y;
	snowballCharacter.speedX = 0;
	
	obstacleCharacters = new Array();
	
	terrainGrid = seedTerrain();
}

function startGameLoop() {
	game_loop = setInterval(gameLoop, REDRAW_MS);
}

function gameLoop() {

	if (!PAUSED)
	{
		//friction
		if(snowballCharacter.speedX > 0) snowballCharacter.speedX -= 1;
		if(snowballCharacter.speedX < 0) snowballCharacter.speedX += 1;

		spawnObstacles();
		stepObstacles();
		
		checkBounds(snowballCharacter);
		checkSnow(terrainGrid, snowballCharacter);
		
		snowballCharacter.x += snowballCharacter.speedX;
		
		if(worldScale === WORLD_MIN_SCALE) {
			snowballCharacter.y += snowballCharacter.speedY;
		} else {
			terrainGrid = shiftTerrain(terrainGrid, snowballCharacter.speedY);
		}		
		paint();

		checkPlayerCollisions();
	}
}

function createCharacter(sprite, collisionBox) {
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
		
		collisionBox: collisionBox
	}
}

function createCollisonBox(x, y, w, h) {
	return {
		x: x,
		y: y,
		w: w,
		h: h
	}
}

function checkBounds(character) {
	var halfWidth = (character.width()/2);
	var halfHeight = (character.height()/2);
	if(character.x + halfWidth > worldW) {
		 character.x = (worldW - halfWidth);
		 snowballCharacter.speedX = -snowballCharacter.speedX;
	}
	if(character.x - halfWidth < 0) {
		character.x = (0 + halfWidth);
		 snowballCharacter.speedX = -snowballCharacter.speedX;
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
	var level;
	if(worldScale <= LEVEL0_THRESHOLD) level = 0;
	if(worldScale <= LEVEL1_THRESHOLD) level = 1;
	if(worldScale <= LEVEL2_THRESHOLD) level = 2;
	
	if(Math.random() < OBSTACLE_SPAWN_CHANCE[level][BUNNY])
	{
		var newCharacter;
		var xPos = Math.random() * worldW;
		if(xPos < worldW/2.0) {
			newCharacter = createCharacter(bunnySpriteLeft, bunnyCollisonBox);
			newCharacter.speedX = BUNNY_SPEED;
		} else {
			newCharacter = createCharacter(bunnySpriteRight, bunnyCollisonBox);
			newCharacter.speedX = -BUNNY_SPEED
		}
		newCharacter.obstacleType = BUNNY;
		newCharacter.x = xPos
		newCharacter.y = worldH + SPAWN_THRESHOLD;
		obstacleCharacters.push(newCharacter);
	}

	if(Math.random() < OBSTACLE_SPAWN_CHANCE[level][ROCK])
	{
		var newCharacter;
		newCharacter = createCharacter(rockSprite, rockCollisonBox);
		newCharacter.obstacleType = ROCK;
		newCharacter.x = Math.random() * worldW;
		newCharacter.y = worldH + SPAWN_THRESHOLD;
		obstacleCharacters.push(newCharacter);
	}
	
	if(Math.random() < OBSTACLE_SPAWN_CHANCE[level][TREE])
	{
		var newCharacter;
		newCharacter = createCharacter(treeSprite, treeCollisonBox);
		newCharacter.obstacleType = TREE;
		newCharacter.x = Math.random() * worldW;
		newCharacter.y = worldH + SPAWN_THRESHOLD;
		obstacleCharacters.push(newCharacter);
	}
}

function stepObstacles() {
	var obstaclesToDestroy = new Array();
	var tempObstacles = new Array();
	
	for(var i=0; i<obstacleCharacters.length; i++) {
		obstacleCharacters[i].x += obstacleCharacters[i].speedX;
		
		if(worldScale != WORLD_MIN_SCALE) {
			obstacleCharacters[i].y -= snowballCharacter.speedY;
		}
		
		//despawn
		if(obstacleCharacters[i].y + SPAWN_THRESHOLD < 0 || obstacleCharacters[i].x + SPAWN_THRESHOLD < 0 || obstacleCharacters[i].x - SPAWN_THRESHOLD > worldW)
		{
			obstaclesToDestroy.push(i);
		}
	}
	
	if(obstaclesToDestroy.length > 0) {
		for(var i=0; i<obstacleCharacters.length; i++) {
			if($.inArray(i, obstaclesToDestroy) === -1) {
				tempObstacles.push(obstacleCharacters[i]);
			}
		}
		
		obstacleCharacters = tempObstacles;
	}
}

function checkPlayerCollisions() {
	var obstaclesToDestroy = new Array();
	var tempObstacles = new Array();
	
	for(var i=0; i<obstacleCharacters.length; i++) {
		if(checkPlayerCollision(obstacleCharacters[i]))
		{
			if(worldScale <= KILL_THRESHOLD[obstacleCharacters[i].obstacleType]) {
				obstaclesToDestroy.push(i);
			} else {
				snowballCharacter.speedY = -1;
			}
		}
	}
	
	if(obstaclesToDestroy.length > 0) {
		for(var i=0; i<obstacleCharacters.length; i++) {
			if($.inArray(i, obstaclesToDestroy) === -1) {
				tempObstacles.push(obstacleCharacters[i]);
			}
		}
		
		obstacleCharacters = tempObstacles;
	}
}

function checkPlayerCollision(obstacle) {
	var obstacleLeftX = obstacle.x + obstacle.collisionBox.x*worldScale - (obstacle.collisionBox.w*worldScale/2);
	var obstacleTopY = obstacle.y + obstacle.collisionBox.y*worldScale - (obstacle.collisionBox.h*worldScale/2);
	var obstacleRightX = obstacleLeftX + obstacle.collisionBox.w*worldScale;
	var obstacleBottomY = obstacleTopY + obstacle.collisionBox.h*worldScale;

	var snowballLeftX = snowballCharacter.x + snowballCharacter.collisionBox.x - ((snowballCharacter.collisionBox.w/2));
	var snowballTopY = snowballCharacter.y + snowballCharacter.collisionBox.y - ((snowballCharacter.collisionBox.h/2));
	var snowballRightX = snowballLeftX + snowballCharacter.collisionBox.w;
	var snowballBottomY = snowballTopY + snowballCharacter.collisionBox.h;

	return !(obstacleLeftX > snowballRightX
	        || obstacleRightX < snowballLeftX
	        || obstacleTopY > snowballBottomY
	        || obstacleBottomY < snowballTopY);	
}
