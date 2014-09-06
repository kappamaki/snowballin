var MOVEMENT = 5;

$(document).keydown(function(e){
	var key = e.which;
	switch(key) {
		case 37: //left
			snowballX -= MOVEMENT;
			break;
		case 38: //up/
			snowballY -= MOVEMENT;
			break;
		case 39: //right
			snowballX += MOVEMENT;
			break;
		case 40: //down/
			snowballY += MOVEMENT;
			break;
	}
});
