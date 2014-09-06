$(document).keydown(function(e){
	var key = e.which;
	switch(key) {
		case 37: //left
			snowballCharacter.speedX = (snowballCharacter.speedX-MOVEMENT) < -MAX_SPEED_X ? -MAX_SPEED_X : (snowballCharacter.speedX-MOVEMENT);
			break;
		case 38: //up/
			speedY = (speedY-1) < MIN_SPEED_Y ? MIN_SPEED_Y : (speedY-1);
			break;
		case 39: //right
			snowballCharacter.speedX = (snowballCharacter.speedX+MOVEMENT) > MAX_SPEED_X ? MAX_SPEED_X : (snowballCharacter.speedX+MOVEMENT);
			break;
		case 40: //down/
			speedY = (speedY+1) > MAX_SPEED_Y ? MAX_SPEED_Y : (speedY+1);
			break;
		case 189: //minus
			worldScale *= 0.99;
			break;
		case 187: //equals
			worldScale *= 1.01;
			break;
	}
});
