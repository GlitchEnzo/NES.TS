/// <reference path="NES.ts" />
/// <reference path="Utils.ts" />
/// <reference path="CPU.ts" />
/// <reference path="Keyboard.ts" />
/// <reference path="Mappers.ts" />
/// <reference path="PAPU.ts" />
/// <reference path="PPU.ts" />
/// <reference path="ROM.ts" />
/// <reference path="UI.ts" />
/// <reference path="AudioPlayer.ts" />

window.onload = () =>
{
    var emulator = <HTMLDivElement>document.getElementById('emulator');

    var ui = new NES.TS.UI(emulator, {
        "Homebrew": [
            ['Concentration Room', 'roms/croom/croom.nes'],
            ['LJ65', 'roms/lj65/lj65.nes']
        ]
    });

    var options = new NES.TS.Options();
    options.ui = ui;

    var nes = new NES.TS.NES(options);

    ui.setNes(nes);
};