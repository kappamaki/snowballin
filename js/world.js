var DRAW_HITBOXES = false;

//constants
var REDRAW_MS = 50;

var MOVEMENT = 3;

var MAX_SPEED_X = 20;
var MIN_SPEED_Y = 5;
var MAX_SPEED_Y = 15;

var WORLD_MAX_SCALE = 1.0;
var WORLD_MIN_SCALE = 0.05;

var WORLD_GROWTH_CONSTANT = 1.1;
var WORLD_SHRINK_CONSTANT = 0.995;

var DIRT = 0;
var SNOW = 1;

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
var snowballIsDead;

//global variables
//sprite resources
var snowballSprite_stage1;
var snowballSprite_stage2;
var snowballSprite_stage3;
var snowballSprite_stage4;
var snowballSprite_ouch;
var snowballSprite_die;
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

var snowballLevel = 1;

var snowballCharacter;
var obstacleCharacters;
var effectCharacters;

//terrain
var terrainGrid;

$(document).ready(function(){
	snowballSprite_stage1 = loadSprite('img/sprites/snowball1/', 12, 50);
	snowballSprite_stage2 = loadSprite('img/sprites/snowball2/', 12, 50);
	snowballSprite_stage3 = loadSprite('img/sprites/snowball3/', 12, 50);
	snowballSprite_stage4 = loadSprite('img/sprites/snowball4/', 12, 50);

	snowballSprite_ouch = loadSprite('img/sprites/ouch/', 4, 150);
	snowballSprite_die = loadSprite('img/sprites/die/', 11, 100);
	
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
	snowballIsDead = false;
	worldScale = 1.0;
	snowballCharacter = createCharacter(snowballSprite_stage1, snowballCollisonBox);
	snowballCharacter.x = (worldW / 2);
	snowballCharacter.y = (worldH / 4);
	snowballCharacter.speedY = MIN_SPEED_Y;
	snowballCharacter.speedX = 0;
	
	obstacleCharacters = new Array();
	effectCharacters = new Array();
	
	terrainGrid = seedTerrain();
}

function startGameLoop() {
	game_loop = setInterval(gameLoop, REDRAW_MS);
	musicPlayer.src = 'mus/jaunty_gumption.mp3';
	musicPlayer.load();
	musicPlayer.play();
}

function stopGameLoop() {
	clearInterval(game_loop);
	musicPlayer.pause();
}

function gameLoop() {

	if (!PAUSED)
	{
		//friction
		if(snowballCharacter.speedX > 0) snowballCharacter.speedX -= 1;
		if(snowballCharacter.speedX < 0) snowballCharacter.speedX += 1;

		stepObstacles();
		
		if(!snowballIsDead) {
			spawnObstacles();
			
			checkBounds(snowballCharacter);
			snowballCharacter.x += snowballCharacter.speedX;
			
			if(worldScale === WORLD_MIN_SCALE) {
				snowballCharacter.y += snowballCharacter.speedY;
			} else {
				terrainGrid = shiftTerrain(terrainGrid, snowballCharacter.speedY);
			}
			
			checkSnow(terrainGrid, snowballCharacter);
			updateSnowballLevel();
			checkPlayerCollisions();
		}
				paint(snowballIsDead);
	}
}

function updateSnowballLevel() {

	if(snowballLevel != 1)	 {
		MAX_SPEED_Y = 5;
		MAX_SPEED_Y = 15;
		snowballCharacter.sprite = snowballSprite_stage1;
		snowballLevel = 1;
	}
	if(snowballLevel != 2 && worldScale < KILL_THRESHOLD[BUNNY])	 {
		MIN_SPEED_Y = 8;
		MAX_SPEED_Y = 16;
		snowballCharacter.sprite = snowballSprite_stage2;
		snowballLevel = 2;
	}
	if(snowballLevel != 3 && worldScale < KILL_THRESHOLD[ROCK])	 {
		MIN_SPEED_Y = 12;
		MAX_SPEED_Y = 18;
		snowballCharacter.sprite = snowballSprite_stage3;
		snowballLevel = 3;
		
	}
	if(snowballLevel != 4 && worldScale < KILL_THRESHOLD[TREE])	 {
		MIN_SPEED_Y = 15;
		MAX_SPEED_Y = 22;
		snowballCharacter.sprite = snowballSprite_stage4;
		snowballLevel = 4;
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
		
		if(worldScale != WORLD_MIN_SCALE && !snowballIsDead) {
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
	
	var collided = false;
	
	for(var i=0; i<obstacleCharacters.length; i++) {
		if(checkPlayerCollision(obstacleCharacters[i]))
		{
			collided = true;
	
			if(worldScale <= KILL_THRESHOLD[obstacleCharacters[i].obstacleType]) {
				obstaclesToDestroy.push(i);
			} else {
				worldScale = (worldScale * WORLD_GROWTH_CONSTANT) > WORLD_MAX_SCALE ? WORLD_MAX_SCALE : (worldScale * WORLD_GROWTH_CONSTANT);
				
				if(worldScale === WORLD_MAX_SCALE)
					snowballIsDead = true;
				else
					snowballCharacter.speedY = -10;
			}
		}
	}
	
	if(collided) {
		if(snowballIsDead) {
			var deathEffect = createCharacter(snowballSprite_die, createCollisonBox(0,0,0,0));
			deathEffect.x = snowballCharacter.x;
			deathEffect.y = snowballCharacter.y;
			effectCharacters.push(deathEffect);
			
		} else {
			snowballCharacter.sprite = snowballSprite_ouch;
		}
	} else {
		switch(snowballLevel) {
			case 1:
				snowballCharacter.sprite = snowballSprite_stage1;
				break;
			case 2:
				snowballCharacter.sprite = snowballSprite_stage2;
				break;
			case 3:
				snowballCharacter.sprite = snowballSprite_stage3;
				break;
			case 4:
				snowballCharacter.sprite = snowballSprite_stage4;
				break;
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
