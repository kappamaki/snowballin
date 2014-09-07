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
		currentFrame: 0,
		currentTicks: 0, 
		ticksPerFrame: ticksPerFrame,
		
		stepAnimation: function(ticks) {
			this.currentTicks += ticks;
			
			if(this.currentTicks >= this.ticksPerFrame) {
				this.currentFrame += 1;
				if(this.currentFrame >= this.spriteImages.length) this.currentFrame = 0;
				this.currentTicks = 0;
			}
		},
	
		getCurrentFrameImage: function() {
			return this.spriteImages[this.currentFrame];
		},
		
		draw: function(context, x, y, scale) {
			var width = this.getCurrentFrameImage().width * scale;
			var height = this.getCurrentFrameImage().height * scale;
			context.drawImage(this.getCurrentFrameImage(), x - (width/2.0), y - (height/2.0), width, height);
		}
	}
}