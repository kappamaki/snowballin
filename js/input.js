var PAUSED = false;

$(document).keydown(function(e){
	var key = e.which;
	
	if(key === 37) { //left
		snowballCharacter.speedX = (snowballCharacter.speedX-MOVEMENT) < -MAX_SPEED_X ? -MAX_SPEED_X : (snowballCharacter.speedX-MOVEMENT);
	}
	if(key === 38) { //up
		snowballCharacter.speedY = (snowballCharacter.speedY-MOVEMENT) < MIN_SPEED_Y ? MIN_SPEED_Y : (snowballCharacter.speedY-MOVEMENT);
	}
	if(key === 39) { //right/
		snowballCharacter.speedX = (snowballCharacter.speedX+MOVEMENT) > MAX_SPEED_X ? MAX_SPEED_X : (snowballCharacter.speedX+MOVEMENT);
	}
	if(key === 40) { //down/
		snowballCharacter.speedY = (snowballCharacter.speedY+MOVEMENT) > MAX_SPEED_Y ? MAX_SPEED_Y : (snowballCharacter.speedY+MOVEMENT);
	}
	if(key === 192) { //grave
		if(WORLD_MAX_SCALE === 1.0)
			WORLD_MAX_SCALE = 0.2;
		else
			WORLD_MAX_SCALE = 1.0;
	}
	if(key === 90) { //z
		console.log("Z pressed!");
		PAUSED = !PAUSED;
	}
	if(key === 32) {  //spacebar
		if(gameState !== PLAYING)
		{
			initiateGameWorld();
			stopGameLoop();
			startGameLoop();
		}
	}
});
