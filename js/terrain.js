function seedTerrain() {
	var terrainWidth = worldW / TERRAIN_SCALE;
	var terrainHeight = (worldH / TERRAIN_SCALE) + TERRAIN_BUFFER * 2;
	
	var terrainGrid = new Array(terrainWidth);
	for(var x=0; x<terrainWidth; x++) {
		terrainGrid[x] = new Array(terrainHeight);
	}
	
	for(var y=0; y<terrainHeight; y++) {
		generateTerrainRow(terrainGrid, y);
	}
	
	return terrainGrid;
}

function generateFirstTerrainRow(terrainGrid) {
	var terrainWidth = worldW / TERRAIN_SCALE;
	
	var snowStart = (terrainWidth/2) - (TERRAIN_MIN_WIDTH/2); 
	var snowEnd = (terrainWidth/2) + (TERRAIN_MIN_WIDTH/2);
	
	for(var x=0; x<terrainWidth; x++) {
		if(x < snowStart || x > snowEnd)
			terrainGrid[x][0] = DIRT;
		else
			terrainGrid[x][0] = SNOW;
	}
}

function generateTerrainRow(terrainGrid, y) {
	var terrainWidth = worldW / TERRAIN_SCALE;
	
	if(y === 0) {
		generateFirstTerrainRow(terrainGrid);
	}
	else
	{
		var prevY = y-1;
		var snowStart = -1;
		
		var snowWidth = TERRAIN_MIN_WIDTH * worldScale * (Math.random() * 0.01 + 0.99)
		
		for(var x=0; x<terrainWidth; x++) {
			var prevX = x === 0 ? 0 : (x-1);
			var nextX = x === (terrainWidth-1) ? (terrainWidth-1) : (x+1);
		
			if(snowStart < 0 && x > (terrainWidth-snowWidth))
			{
				terrainGrid[x][y] = SNOW;
				snowStart = x;				
			} else if(snowStart < 0){
				if(x != 0 && terrainGrid[prevX][prevY] ===  SNOW && terrainGrid[x][prevY] === SNOW && terrainGrid[nextX][prevY] === SNOW) {
					terrainGrid[x][y] = SNOW;
					snowStart = x;
				} else if(terrainGrid[prevX][prevY] ===  SNOW || terrainGrid[x][prevY] === SNOW || terrainGrid[nextX][prevY] === SNOW) {
					if(Math.floor((Math.random() * 2.65)) == 1) //magic number =(
					{
						terrainGrid[x][y] = SNOW;
						snowStart = x;
					} else {
						terrainGrid[x][y] = DIRT;
					}
				} else {
					terrainGrid[x][y] = DIRT;
				}
				
			} else {
				if( (x-snowStart) < snowWidth)
						terrainGrid[x][y] = SNOW;
					else
						terrainGrid[x][y] = DIRT;
			}	
		}
	}
}

function shiftTerrain(terrainGrid, shiftY) {
	var terrainWidth = worldW / TERRAIN_SCALE;
	var terrainHeight = (worldH / TERRAIN_SCALE) + TERRAIN_BUFFER * 2;
	
	tempTerrain = new Array(terrainWidth);
	
	for(var x=0; x<terrainWidth; x++) {
		tempTerrain[x] = new Array(terrainHeight);
	}
	
	for(var y=shiftY; y<terrainHeight; y++) {
		for(var x=0; x<terrainWidth; x++) {
			tempTerrain[x][y-shiftY] = terrainGrid[x][y];
		}
	}
	
	for(var y=(terrainHeight-shiftY); y<terrainHeight; y++) {		generateTerrainRow(tempTerrain, y);
	}
	
	return tempTerrain;
}