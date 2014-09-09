function loadSprite(spriteImageFolder, imageCount, ticksPerFrame) {
	var img;
	var spriteImages = new Array();
	
    for (var i=0; i<imageCount; i++){
        bCheckEnabled = false;
        img = new Image();
        img.src = spriteImageFolder + i + '.png';
	    spriteImages.push(img);
    }
    
	return  {
		spriteImages: spriteImages,
		ticksPerFrame: ticksPerFrame
	}
}
