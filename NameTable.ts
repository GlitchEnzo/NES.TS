module NES.TS {
    export class NameTable {
        width: number;
        height: number;
        name: string;
        tile: any[];
        attrib: number[];

        constructor(width: number, height: number, name: string) {
            this.width = width;
            this.height = height;
            this.name = name;

            this.tile = new Array(width * height);
            this.attrib = new Array(width * height);
        }

        getTileIndex(x: number, y: number) {
            return this.tile[y * this.width + x];
        }

        getAttrib(x: number, y: number) {
            return this.attrib[y * this.width + x];
        }

        writeAttrib(index: number, value: number) {
            var basex = (index % 8) * 4;
            var basey = Math.floor(index / 8) * 4;
            var add;
            var tx, ty;

            for (var sqy = 0; sqy < 2; sqy++) {
                for (var sqx = 0; sqx < 2; sqx++) {
                    add = (value >> (2 * (sqy * 2 + sqx))) & 3;
                    for (var y = 0; y < 2; y++) {
                        for (var x = 0; x < 2; x++) {
                            tx = basex + sqx * 2 + x;
                            ty = basey + sqy * 2 + y;
                            this.attrib[ty * this.width + tx] = (add << 2) & 12;
                        }
                    }
                }
            }
        }

        toJSON() {
            return {
                'tile': this.tile,
                'attrib': this.attrib
            };
        }

        fromJSON(s) {
            this.tile = s.tile;
            this.attrib = s.attrib;
        }
    }
} 