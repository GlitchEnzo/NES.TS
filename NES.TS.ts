/// <reference path="NES.ts" />
/// <reference path="Utils.ts" />
/// <reference path="CPU.ts" />
/// <reference path="Keyboard.ts" />
/// <reference path="Mappers.ts" />
/// <reference path="PAPU.ts" />
/// <reference path="PPU.ts" />
/// <reference path="ROM.ts" />
/// <reference path="UI.ts" />

var thelist: HTMLElement;
var header: HTMLElement;
var footer: HTMLElement;
var songTitle: HTMLElement;
var currentFolder: HTMLElement;
var progressBar: HTMLInputElement;
var searchbox: HTMLInputElement;
var currentTime: HTMLElement;
var duration: HTMLElement;
var volumeBar: HTMLInputElement;

window.onresize = () =>
{
    // The size of the header and footer are fixed.  The list should take up all remaining space.
    thelist.style.height = window.innerHeight - header.clientHeight - footer.clientHeight + "px";
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

function searchClicked()
{
    if (searchbox.value == "Search")
    {
        searchbox.value = "";
    }
}

window.onload = () =>
{
    thelist = document.getElementById('thelist');
    header = document.getElementById('header');
    footer = document.getElementById('footer');
    songTitle = document.getElementById('songTitle');
    currentFolder = document.getElementById('currentFolder');
    progressBar = <HTMLInputElement>document.getElementById('progressBar');
    searchbox = <HTMLInputElement>document.getElementById('searchbox');
    currentTime = document.getElementById('currentTime');
    duration = document.getElementById('duration');
    volumeBar = <HTMLInputElement>document.getElementById('volumeBar');
};