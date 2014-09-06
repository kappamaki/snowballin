var REDRAW_MS = 50;

var snowballX = 0;
var snowballY = 0;


$(document).ready(function(){
	game_loop = setInterval(paint, REDRAW_MS);
});
