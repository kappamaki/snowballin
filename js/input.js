var PAUSED = false;

$(document).keydown(function(e){
	var key = e.which;
	switch(key) {
		case 37: //left
			snowballCharacter.speedX = (snowballCharacter.speedX-MOVEMENT) < -MAX_SPEED_X ? -MAX_SPEED_X : (snowballCharacter.speedX-MOVEMENT);
			break;
		case 38: //up/
			snowballCharacter.speedY = (snowballCharacter.speedY-1) < MIN_SPEED_Y ? MIN_SPEED_Y : (snowballCharacter.speedY-1);
			break;
		case 39: //right
			snowballCharacter.speedX = (snowballCharacter.speedX+MOVEMENT) > MAX_SPEED_X ? MAX_SPEED_X : (snowballCharacter.speedX+MOVEMENT);
			break;
		case 40: //down/
			snowballCharacter.speedY = (snowballCharacter.speedY+1) > MAX_SPEED_Y ? MAX_SPEED_Y : (snowballCharacter.speedY+1);
			break;
		case 90: //z
			console.log("Z pressed!");
			PAUSED = !PAUSED;
			break;			
		case 189: //minus
			worldScale *= 0.99;
			break;
		case 187: //equals
			worldScale *= 1.01;
			break;
		case 32: //spacebar
			initiateGameWorld();
			startGameLoop();
			break;
	}
});
