function seedTerrain() {
	var terrainGrid = new Array(worldW);
	for(var x=0; x<worldW; x++) {
		terrainGrid[x] = new Array(worldH);
	}
	
	for(var y=0; y<worldH; y++) {
		generateTerrainRow(terrainGrid, y);
	}
	
	return terrainGrid;
}

function generateFirstTerrainRow(terrainGrid) {
	var snowStart = (worldW/2) - (TERRAIN_MIN_WIDTH/2); 
	var snowEnd = (worldW/2) + (TERRAIN_MIN_WIDTH/2); 
	
	for(var x=0; x<worldW; x++) {
		if(x < snowStart || x > snowEnd)
			terrainGrid[x][0] = DIRT;
		else
			terrainGrid[x][0] = SNOW;
	}
}

function generateTerrainRow(terrainGrid, y) {
	if(y === 0) {
		generateFirstTerrainRow(terrainGrid);
	}
	else
	{
		var prevY = y-1;
		var snowStart = -1;
		
		var snowWidth = TERRAIN_MIN_WIDTH * worldScale * (Math.random() * 0.01 + 0.99)
		
		for(var x=0; x<worldW; x++) {
			var prevX = x === 0 ? 0 : (x-1);
			var nextX = x === (worldW-1) ? (worldW-1) : (x+1);
		
			if(snowStart < 0 && x > (worldW-snowWidth))
			{
				terrainGrid[x][y] = SNOW;
				snowStart = x;				
			} else if(snowStart < 0){
				if(x != 0 && terrainGrid[prevX][prevY] ===  SNOW && terrainGrid[x][prevY] === SNOW && terrainGrid[nextX][prevY] === SNOW) {
					terrainGrid[x][y] = SNOW;
					snowStart = x;
				} else if(terrainGrid[prevX][prevY] ===  SNOW || terrainGrid[x][prevY] === SNOW || terrainGrid[nextX][prevY] === SNOW) {
					if(Math.floor((Math.random() * 2.6)) == 1)
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
	tempTerrain = new Array(worldW);
	for(var x=0; x<worldW; x++) {
		tempTerrain[x] = new Array(worldH);
	}
	
	for(var y=shiftY; y<worldH; y++) {
		for(var x=0; x<worldW; x++) {
			tempTerrain[x][y-shiftY] = terrainGrid[x][y];
		}
	}
	
	for(var y=(worldH-shiftY); y<worldH; y++) {		generateTerrainRow(tempTerrain, y);
	}
	
	return tempTerrain;
}