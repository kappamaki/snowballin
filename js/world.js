var DRAW_HITBOXES = false;

//constants
var REDRAW_MS = 50;

var MOVEMENT = 3;

var MAX_SPEED_X = 20;
var MIN_SPEED_Y = 5;
var MAX_SPEED_Y = 15;

var WORLD_MAX_SCALE = 1.0;
var WORLD_MIN_SCALE = 0.05;

var WORLD_GROWTH_CONSTANT = 1.15;
var WORLD_SHRINK_CONSTANT = 0.995;

var DIRT = 0;
var SNOW = 1;

var TERRAIN_SCALE = 2;
var TERRAIN_BUFFER = 100;
var TERRAIN_MIN_WIDTH;

var LEVEL0_THRESHOLD = 1.0;
var LEVEL1_THRESHOLD = 0.4;
var LEVEL2_THRESHOLD = 0.2;
var BUNNY_SPEED = 10;
var SKIER_SPEED_X = 7;
var SKIER_SPEED_Y = 7;

var BUNNY = 0;
var ROCK = 1;
var TREE = 2;
var SKIER = 3;

var KILL_THRESHOLD = [0.5, 0.2, 0.09, 0.2];

var OBSTACLE_SPAWN_CHANCE = [ [0.15, 0.05, 0.01, 0.01], [0.15, 0.10, 0.05, 0.02], [0.15, 0.15, 0.15, 0.03], [0.25, 0.25, 0.25, 0.05]];
var OBSTACLE_SPAWN_LIMIT = [ [20, 5, 2, 3], [300, 10, 5, 10], [5000, 50, 30, 5000], [5000, 5000, 5000, 5000]];

var SPAWN_THRESHOLD = 300;

var game_loop;
var snowballIsDead;
var snowballIsVictorious;

//global variables
//sprite resources
var snowballSprite_stage1;
var snowballSprite_stage2;
var snowballSprite_stage3;
var snowballSprite_stage4;
var snowballSprite_ouch;
var bunnySpriteLeft;
var bunnySpriteRight;
var rockSprite;
var treeSprite;
var skierSpriteLeft;
var skierSpriteRight;

//collision boxes for sprites
var snowballCollisonBox;
var bunnyCollisonBox;
var rockCollisonBox;
var treeCollisonBox;
var skierCollisonBox;

var worldW;
var worldH;
var worldScale;

var snowballLevel;
var snowballHighestLevelAchieved;

var playerPoints;

var obstacleCount;
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
	bunnySpriteLeft = loadSprite('img/sprites/bunny_left/', 2, 800);
	bunnySpriteRight = loadSprite('img/sprites/bunny_right/', 2, 800);
	rockSprite = loadSprite('img/sprites/rock/', 1, 0);
	treeSprite = loadSprite('img/sprites/tree/', 1, 0);
	skierSpriteLeft = loadSprite('img/sprites/skier_left/', 2, 800);
	skierSpriteRight = loadSprite('img/sprites/skier_right/', 2, 800);

	snowballCollisonBox = createCollisonBox(0,0,50,62);
	bunnyCollisonBox = createCollisonBox(0,0,80,50);
	rockCollisonBox = createCollisonBox(0,10,230,130);
	treeCollisonBox = createCollisonBox(0,300,500,200);
	skierCollisonBox = createCollisonBox(0,50,160,100);
	
	initiateGameWorld();
});

function initiateGameWorld() {
	snowballIsDead = false;
	snowballIsVictorious = false;
	snowballLevel = 1;
	snowballHighestLevelAchieved = 1;
	playerPoints = 0.0;
	
	worldScale = WORLD_MAX_SCALE;
	snowballCharacter = createCharacter(snowballSprite_stage1, snowballCollisonBox);
	snowballCharacter.x = (worldW / 2);
	snowballCharacter.y = (worldH / 4);
	snowballCharacter.speedY = MIN_SPEED_Y;
	snowballCharacter.speedX = 0;
	
	obstacleCount = [0, 0, 0, 0];
	obstacleCharacters = new Array();
	effectCharacters = new Array();
	
	TERRAIN_MIN_WIDTH = 300;
	terrainGrid = seedTerrain();
}

function startGameLoop() {
	gameState = PLAYING;
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
		stepEffects();
		
		if(!snowballIsDead) {
			checkBounds(snowballCharacter);
			snowballCharacter.x += snowballCharacter.speedX;
			
			if(worldScale === WORLD_MIN_SCALE) {
				snowballIsVictorious = true;
				snowballCharacter.y += snowballCharacter.speedY;
			} else {
				terrainGrid = shiftTerrain(terrainGrid, parseInt(snowballCharacter.speedY / TERRAIN_SCALE));
			}
			
			checkSnow(terrainGrid, snowballCharacter);
			updateSnowballLevel();
			checkPlayerCollisions();

			if(snowballCharacter.speedY > 0) {
				spawnObstacles(snowballCharacter.speedY);
			}
		}
				paint(snowballIsDead);
	}
	
	if(snowballIsDead && gameState !== GAME_OVER) {
		gameState = GAME_OVER;
		setTimeout(gameOver, 2000);
	}
	
	if(snowballIsVictorious && gameState !== VICTORY) {
		gameState = VICTORY;
		setTimeout(victory, 5000);
	}
}

function gameOver() {
	stopGameLoop();
	musicPlayer.src = 'mus/game_over.mp3';
	musicPlayer.load();
	musicPlayer.play();
	
	splashImage = new Image();
	splashImage.src = 'img/splash_lose.jpg';
	var onloadCallback = function showSplashScreen() {
		displayImage(splashImage)
		drawScore();
		gameState = GAME_OVER;
	};
	splashImage.onload = onloadCallback;
}

function victory() {
	stopGameLoop();

	splashImage = new Image();
	splashImage.src = 'img/splash_win.png';
	var onloadCallback = function showSplashScreen() {
		displayImage(splashImage)
		drawScore();
		gameState = VICTORY;
	};
	splashImage.onload = onloadCallback;
}


function updateSnowballLevel() {

	if(snowballLevel != 1 && worldScale >= KILL_THRESHOLD[BUNNY])	 {
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

		if(snowballHighestLevelAchieved < 2)
		{
			snowballHighestLevelAchieved = 2;
			playerPoints += 100;
		}
	}
	if(snowballLevel != 3 && worldScale < KILL_THRESHOLD[ROCK])	 {
		MIN_SPEED_Y = 12;
		MAX_SPEED_Y = 18;
		snowballCharacter.sprite = snowballSprite_stage3;
		snowballLevel = 3;

		if(snowballHighestLevelAchieved < 3)
		{
			snowballHighestLevelAchieved = 3;
			playerPoints += 500;
		}
	}
	if(snowballLevel != 4 && worldScale < KILL_THRESHOLD[TREE])	 {
		MIN_SPEED_Y = 15;
		MAX_SPEED_Y = 22;
		snowballCharacter.sprite = snowballSprite_stage4;
		snowballLevel = 4;
		TERRAIN_MIN_WIDTH = Number.MAX_VALUE;

		if(snowballHighestLevelAchieved < 4)
		{
			snowballHighestLevelAchieved = 4;
			playerPoints += 1000;
		}
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
	
	var terrainX = parseInt(character.x/TERRAIN_SCALE);
	var terrainY = parseInt(character.y/TERRAIN_SCALE) + TERRAIN_BUFFER;
	
	if(terrainGrid[terrainX][terrainY] === SNOW)
	{
		snowballCharacter.speedY = (snowballCharacter.speedY+1) > maxSpeedY ? maxSpeedY : (snowballCharacter.speedY+1);
		worldScale = (worldScale * WORLD_SHRINK_CONSTANT) < WORLD_MIN_SCALE ? WORLD_MIN_SCALE : (worldScale * WORLD_SHRINK_CONSTANT);
		playerPoints += 0.05;
	} else {	
		snowballCharacter.speedY = (snowballCharacter.speedY-1) < minSpeedY ? minSpeedY : (snowballCharacter.speedY-1);
	}
	
}

function spawnObstacles(verticalSpeed) {
	//adjust spawn rate based on player speed
	var spawnChanceModifier = (verticalSpeed/MAX_SPEED_Y);
	
	if(Math.random() < OBSTACLE_SPAWN_CHANCE[snowballLevel-1][BUNNY] * spawnChanceModifier)
	{
		if(obstacleCount[BUNNY] < OBSTACLE_SPAWN_LIMIT[snowballLevel-1][BUNNY])
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
			obstacleCount[BUNNY] += 1;
		}
	}

	if(Math.random() < OBSTACLE_SPAWN_CHANCE[snowballLevel-1][ROCK] * spawnChanceModifier)
	{
		if(obstacleCount[ROCK] < OBSTACLE_SPAWN_LIMIT[snowballLevel-1][ROCK])
		{
			var newCharacter;
			newCharacter = createCharacter(rockSprite, rockCollisonBox);
			newCharacter.obstacleType = ROCK;
			newCharacter.x = Math.random() * worldW;
			newCharacter.y = worldH + SPAWN_THRESHOLD;
			obstacleCharacters.push(newCharacter);
			obstacleCount[ROCK] += 1;
		}
	}
	
	if(Math.random() < OBSTACLE_SPAWN_CHANCE[snowballLevel-1][TREE] * spawnChanceModifier)
	{
		if(obstacleCount[TREE] < OBSTACLE_SPAWN_LIMIT[snowballLevel-1][TREE])
		{
			var newCharacter;
			newCharacter = createCharacter(treeSprite, treeCollisonBox);
			newCharacter.obstacleType = TREE;
			newCharacter.x = Math.random() * worldW;
			newCharacter.y = worldH + SPAWN_THRESHOLD;
			obstacleCharacters.push(newCharacter);
			obstacleCount[TREE] += 1;
		}
	}

	if(Math.random() < OBSTACLE_SPAWN_CHANCE[snowballLevel-1][SKIER] * spawnChanceModifier)
	{
		if(obstacleCount[SKIER] < OBSTACLE_SPAWN_LIMIT[snowballLevel-1][SKIER])
		{
			var newCharacter;
			var xPos = Math.random() * worldW;
			if(xPos < worldW/2.0) {
				newCharacter = createCharacter(skierSpriteLeft, skierCollisonBox);
				newCharacter.speedX = SKIER_SPEED_X;
				newCharacter.speedY = SKIER_SPEED_Y;
			} else {
				newCharacter = createCharacter(skierSpriteRight, skierCollisonBox);
				newCharacter.speedX = -SKIER_SPEED_X;
				newCharacter.speedY = SKIER_SPEED_Y;
			}
			newCharacter.obstacleType = SKIER;
			newCharacter.x = xPos
			newCharacter.y = worldH + SPAWN_THRESHOLD;
			obstacleCharacters.push(newCharacter);
			obstacleCount[SKIER] += 1;
		}
	}
}

function stepObstacles() {
	var obstaclesToDestroy = new Array();
	var tempObstacles = new Array();
	
	for(var i=0; i<obstacleCharacters.length; i++) {
		obstacleCharacters[i].x += obstacleCharacters[i].speedX * worldScale;
		obstacleCharacters[i].y += obstacleCharacters[i].speedY * worldScale;
		
		if(worldScale != WORLD_MIN_SCALE && !snowballIsDead) {
			obstacleCharacters[i].y -= snowballCharacter.speedY;
		}
		
		//despawn
		if(obstacleCharacters[i].y + SPAWN_THRESHOLD < 0 || obstacleCharacters[i].x + SPAWN_THRESHOLD < 0 || obstacleCharacters[i].x - SPAWN_THRESHOLD > worldW)
		{
			obstaclesToDestroy.push(i);
			obstacleCount[obstacleCharacters[i].obstacleType] -= 1;
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

function stepEffects() {
	for(var i=0; i<effectCharacters.length; i++) {
		if(worldScale != WORLD_MIN_SCALE && !snowballIsDead) {
			effectCharacters[i].y -= snowballCharacter.speedY;
		}
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
				obstacleCount[obstacleCharacters[i].obstacleType] -= 1;
				var deathSprite;

				switch(obstacleCharacters[i].obstacleType) {
					case BUNNY:
						deathSprite = loadSprite('img/sprites/bunny_die/', 7, 50);
						playerPoints += 10;
						break;
					case ROCK:
						deathSprite = loadSprite('img/sprites/rock_die/', 6, 50);
						playerPoints += 100;
						break;
					case TREE:
						deathSprite = loadSprite('img/sprites/tree_die/', 9, 50);
						playerPoints += 500;
						break;
					case SKIER:
						deathSprite = loadSprite('img/sprites/skier_die/', 6, 50);
						playerPoints += 2000;
						break;
				}

				var deathEffect = createCharacter(deathSprite, createCollisonBox(0,0,0,0));
				deathEffect.x = obstacleCharacters[i].x;
				deathEffect.y = obstacleCharacters[i].y;
				deathEffect.worldEffect = true;
				effectCharacters.push(deathEffect);
				
			} else {
				worldScale = (worldScale * WORLD_GROWTH_CONSTANT) > WORLD_MAX_SCALE ? WORLD_MAX_SCALE : (worldScale * WORLD_GROWTH_CONSTANT);
				
				if(worldScale === WORLD_MAX_SCALE)
				{
					snowballIsDead = true;
				} else {
					setSpeedAfterCollision(obstacleCharacters[i]);
				}
			}
				
			audioPlayer_impactEffect.currentTime = 0;
			audioPlayer_impactEffect.play();
		}
	}
	
	if(collided) {
		if(snowballIsDead) {
			var snowballSprite_die = loadSprite('img/sprites/die/', 11, 100);
			var deathEffect = createCharacter(snowballSprite_die, createCollisonBox(0,0,0,0));
			deathEffect.x = snowballCharacter.x;
			deathEffect.y = snowballCharacter.y;
			deathEffect.worldEffect = false;
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

function setSpeedAfterCollision(obstacle) {
	var vectorX = snowballCharacter.x - obstacle.x;
	var vectorY = snowballCharacter.y - obstacle.y;
	
	var vectorAbs = Math.sqrt(vectorX*vectorX + vectorY*vectorY);
	vectorX /= vectorAbs;
	vectorY /= vectorAbs;
	
	snowballCharacter.speedX = vectorX * MAX_SPEED_X;
	snowballCharacter.speedY = vectorY * MAX_SPEED_Y;
}
