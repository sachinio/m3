module m3.geometry {
    export interface IPoint {
        x: number;
        y: number;
    }

    export interface ISpatialHashDataPoint {
        position: IPoint;
    }

    export class SpatialHash {
        private cellSize:number;
        private grid:any[];

        public constructor(cellSize:number) {
            this.cellSize = cellSize;
            this.grid = [];
        }

        public insert(dataPoint:ISpatialHashDataPoint):void {
            var key = this.createKey(dataPoint.position);
            var grid = this.grid;

            if (!grid[key]) {
                grid[key] = [];
            }

            grid[key].push(dataPoint);
        }

        public closest(point:ISpatialHashDataPoint) {
            return this.grid[this.createKey(point.position)];
        }

        private createKey(point:IPoint) {
            var cellSize = this.cellSize;
            return Math.floor(point.x / cellSize) * cellSize + ' ' +
                Math.floor(point.y / cellSize) * cellSize;
        }
    }
}