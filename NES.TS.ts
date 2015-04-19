/// <reference path="NES.ts" />
/// <reference path="Utils.ts" />
/// <reference path="CPU.ts" />
/// <reference path="Keyboard.ts" />
/// <reference path="Mappers.ts" />
/// <reference path="PAPU.ts" />
/// <reference path="PPU.ts" />
/// <reference path="ROM.ts" />
/// <reference path="UI.ts" />

window.onresize = () =>
{
}

//function search(event: KeyboardEvent)
//{
//    var query: string;
//    if (event.keyCode == 8) // Backspace
//    {
//        query = searchbox.value.substr(0, searchbox.value.length - 1);
//    }
//    else if (event.keyCode == 13) // Enter
//    {
//        query = searchbox.value;
//    }
//    else
//    {
//        query = searchbox.value + String.fromCharCode(event.keyCode);
//    }

//    console.log("Searching: " + query);
//    playlist.Search(query, true);
//}

//function searchClicked()
//{
//    if (searchbox.value == "Search")
//    {
//        searchbox.value = "";
//    }
//}

window.onload = () =>
{
    var emulator = <HTMLDivElement>document.getElementById('emulator');

    var ui = new NES.TS.UI(emulator, {
        "Homebrew": [
            ['Concentration Room', 'roms/croom/croom.nes'],
            ['LJ65', 'roms/lj65/lj65.nes'],
        ]
    });

    var options = new NES.TS.Options();
    options.ui = ui;

    var nes = new NES.TS.NES(options);

    ui.setNes(nes);
};