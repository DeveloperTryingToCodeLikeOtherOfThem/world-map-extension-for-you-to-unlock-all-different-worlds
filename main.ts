//% block="world map" groups=['world map']
namespace worldmap {
    interface World {
        worldMap: tiles.TileMap
        dataForMap: tiles.TileMapData
        tile?: tiles.Tile
        location: tiles.Location
        tiles: tiles.Tile[]
    }

    let _state: WorldMap
    export function state(): WorldMap {
        if (!_state) _state = new WorldMap()
        return _state
    }


    export class WorldMap {
        worldMap: World
        sprite: Sprite

        constructor(map?: World, tile?: tiles.Tile[]) {
            this.worldMap = map
            this.sprite = new Sprite(img`.`)
            this.worldMap.tiles = tile
        }

        getTileLocation(col: number, row: number) {
            return this.worldMap.location = tiles.getTileLocation(col, row)
        }

        setAllTiles(index: number) {
            this.worldMap.tiles.forEach(tile => {
                const loc = tiles.getTileLocation(tile.x, tile.y)
                this.setTile(loc.col, loc.row, index)
            })
        }


        setTile(col: number, row: number, index: number) {
            this.worldMap.worldMap.setTileAt(col, row, index)
        }

        setWall(col: number, row: number, on: boolean) {
            this.worldMap.worldMap.setWallAt(col, row, on)
        }

        addIfLevelIsClearedForTheWorldMap(level: number, cleared: number, col: number, row: number, index: number, on: boolean) {
            if (level === cleared) {
                this.setTile(col, row, index)
                this.setWall(col, row, on)
            } else {
                this.setTile(0, 0, 0)
                this.setWall(0, 0, false)
            }
        }

        removeIfLevelIsClearedForTheWorldMap(level: number, cleared: number, col: number, row: number, index: number, on: boolean) {
            if (level !== cleared) {
                this.setTile(col, row, 0)
                this.setWall(col, row, false)
            } else {
                this.addIfLevelIsClearedForTheWorldMap(level, cleared, col, row, index, on)
            }

        }

        // adapted from  https://github.com/microsoft/pxt-common-packages/blob/master/libs/game/tilemap.ts
        public getImageType(im: Image): number {
            const tileset = this.worldMap.dataForMap.getTileset();
            for (let i = 0; i < tileset.length; i++)
                if (tileset[i].equals(im)) return i;

            // not found; append to the tileset if there are spots left.
            const newIndex = tileset.length;
            if (!this.isInvalidIndex(newIndex)) {
                tileset.push(im);
                return newIndex;
            }

            return -1;
        }


        protected isInvalidIndex(index: number): boolean {
            return index < 0 || index > 0xff;
        }

    }

     /**
      * sets the tilemap for a specific level if it is passing alevel it can go to the next level
      */
    //% blockId="set_tilemap_for_level" block="set tilemap for level %level %cleared $loc $tile $on"
   //% loc.shadow=tileset_tile_picker 
   //% on.shadow=toggleOnOff
   //% group=['world map'] 
   //% weight=100
  export function setTileMapForLevel(level: number, cleared: number, loc: tiles.Location, tile: Image, on: boolean): void {
        if (!loc || !tile || !state().worldMap.dataForMap) return null;
        const scale = state().worldMap.dataForMap.scale;
        const index = state().getImageType(tile);
        state().setTile(loc.x >> scale, loc.y >> scale, index);
        state().addIfLevelIsClearedForTheWorldMap(level, cleared, loc.x >> scale, loc.y >> scale, index, on)
    }
/**
 * removes a tilemap level
 */
 //% blockId="remove_tilemap_for_level" block="remove tilemap for level %level %cleared $loc $tile $on"
   //% loc.shadow=tileset_tile_picker 
   //% on.shadow=toggleOnOff
//% group=['world map']
//% weight=99
    export function removeTileMapForLevel(level: number, cleared: number, loc: tiles.Location, tile: Image, on: boolean): void {
        if (!loc || !tile || !state().worldMap.dataForMap) return null;
        const scale = state().worldMap.dataForMap.scale;
        const index = state().getImageType(tile);
        state().setTile(loc.x >> scale, loc.y >> scale, index);
        state().removeIfLevelIsClearedForTheWorldMap(level, cleared, loc.x >> scale, loc.y >> scale, index, false)
    }
}

