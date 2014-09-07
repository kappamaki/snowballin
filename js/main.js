var SPLASH = 0;
var PLAYING = 1;
var GAME_OVER = 2;
var VICTORY = 3;

var gameState;
var musicPlayer;
var soundEffectPlayer;


$(document).ready(function(){
	musicPlayer = document.getElementById('musicPlayer');
	musicPlayer.loop = true;

	audioPlayer_impactEffect = document.getElementById('audioPlayer_impactEffect');
	audioPlayer_impactEffect.src = 'aud/impact.wav';
	var splashStartImage = new Image();
	splashStartImage.src = 'img/splash_start.jpg';
	
	var onloadCallback = function showSplashScreen() {
		displayImage(splashStartImage)
	};
	splashStartImage.onload = onloadCallback;
	musicPlayer.src = 'mus/intro.mp3';
	musicPlayer.play();
	
	gameState = SPLASH;
});