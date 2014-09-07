var START_SCREEN = 0;
var PLAYING = 1;
var GAME_OVER = 2;
var VICTORY = 3;

var gameState;
var musicPlayer;

var splashStartImage;

$(document).ready(function(){
	musicPlayer = document.getElementById('musicPlayer');
	musicPlayer.loop = true;

	splashStartImage = new Image();
	splashStartImage.src = 'img/splash_start.png';
	
	var onloadCallback = function showSplashScreen() {
		displayImage(splashStartImage)
	};
	splashStartImage.onload = onloadCallback;
	musicPlayer.src = 'mus/intro.mp3';
	musicPlayer.play();
});
