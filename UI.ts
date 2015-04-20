module NES.TS {
    export class DummyUI {
        nes;

        constructor(nes)
        {
            this.nes = nes;
        }

        enable() { }
        updateStatus() { }
        writeAudio() { }
        writeFrame() { }
    }

    export class RealUI {
        constructor(roms) {

        }
    }

    export class UI {
        nes;
        root: HTMLDivElement;
        screen: HTMLCanvasElement;
        romContainer: HTMLDivElement;
        romSelect: HTMLSelectElement;
        controls: HTMLDivElement;
        pauseButton: HTMLInputElement;
        restartButton: HTMLInputElement;
        soundButton: HTMLInputElement;
        zoomButton: HTMLInputElement;
        status: HTMLParagraphElement;
        zoomed = false;
        canvasContext: CanvasRenderingContext2D;
        canvasImageData;
        dynamicaudio;

        constructor(parent: HTMLDivElement, roms) {
            var self = this;

            /*
             * Create UI
             */
            self.root = document.createElement("div");
            self.screen = document.createElement("canvas");
            self.screen.width = 256; 
            self.screen.height = 240; 
            self.root.appendChild(self.screen);

            self.romContainer = document.createElement("div");
            self.root.appendChild(self.romContainer);

            self.romSelect = document.createElement("select");
            self.romContainer.appendChild(self.romSelect);

            self.controls = document.createElement("div");;
            self.root.appendChild(self.controls);

            //self.pauseButton = $('<input type="button" value="pause" class="nes-pause" disabled="disabled">');
            self.pauseButton = document.createElement("input");
            self.pauseButton.type = "button";
            self.pauseButton.value = "pause";
            self.controls.appendChild(self.pauseButton);

            //self.restartButton = $('<input type="button" value="restart" class="nes-restart" disabled="disabled">');
            self.restartButton = document.createElement("input");
            self.restartButton.type = "button";
            self.restartButton.value = "restart";
            self.controls.appendChild(self.restartButton);

            //self.soundButton = $('<input type="button" value="enable sound" class="nes-enablesound">');
            self.soundButton = document.createElement("input");
            self.soundButton.type = "button";
            self.soundButton.value = "enable sound";
            self.controls.appendChild(self.soundButton);

            //self.zoomButton = $('<input type="button" value="zoom in" class="nes-zoom">');
            self.zoomButton = document.createElement("input");
            self.zoomButton.type = "button";
            self.zoomButton.value = "zoom in";
            self.controls.appendChild(self.zoomButton);

            self.status = document.createElement("p");
            self.root.appendChild(self.status);

            parent.appendChild(self.root);

            /*
             * ROM loading
             */
            self.romSelect.onchange = () => { self.loadROM(); };

            /*
             * Buttons
             */
            self.pauseButton.onclick = () => {
                if (self.nes.isRunning) {
                    self.nes.stop();
                    self.updateStatus("Paused");
                    self.pauseButton.setAttribute("value", "resume");
                }
                else {
                    self.nes.start();
                    self.pauseButton.setAttribute("value", "pause");
                }
            };

            self.restartButton.onclick = () => {
                self.nes.reloadRom();
                self.nes.start();
            };

            self.soundButton.onclick = () => {
                if (self.nes.opts.emulateSound) {
                    self.nes.opts.emulateSound = false;
                    self.soundButton.setAttribute("value", "enable sound");
                }
                else {
                    self.nes.opts.emulateSound = true;
                    self.soundButton.setAttribute("value", "disable sound");
                }
            };

            self.zoomed = false;
            self.zoomButton.onclick = () => {
                if (self.zoomed) {
                    self.screen.style.width = "256px";
                    self.screen.style.height = "240px";
                    self.zoomButton.setAttribute("value", "zoom in");
                    self.zoomed = false;
                }
                else {
                    self.screen.style.width = "512px";
                    self.screen.style.height = "480px";
                    self.zoomButton.setAttribute("value", "zoom out");
                    self.zoomed = true;
                }
            };

            /*
             * Lightgun experiments with mouse
             * (Requires jquery.dimensions.js)
             */
            //if ($.offset) {
            //    self.screen.mousedown(function (e) {
            //        if (self.nes.mmap) {
            //            self.nes.mmap.mousePressed = true;
            //            // FIXME: does not take into account zoom
            //            self.nes.mmap.mouseX = e.pageX - self.screen.offset().left;
            //            self.nes.mmap.mouseY = e.pageY - self.screen.offset().top;
            //        }
            //    }).mouseup(function () {
            //            setTimeout(function () {
            //                if (self.nes.mmap) {
            //                    self.nes.mmap.mousePressed = false;
            //                    self.nes.mmap.mouseX = 0;
            //                    self.nes.mmap.mouseY = 0;
            //                }
            //            }, 500);
            //        });
            //}

            if (typeof roms != 'undefined') {
                self.setRoms(roms);
            }

            /*
             * Canvas
             */
            self.canvasContext = self.screen.getContext('2d');
            self.canvasImageData = self.canvasContext.getImageData(0, 0, 256, 240);
            self.resetCanvas();
        }

        setNes(nes) {
            this.nes = nes;

            /*
             * Keyboard
             */
            document.onkeydown = (evt) => {
                this.nes.keyboard.keyDown(evt);
            };

            document.onkeyup = (evt) => {
                this.nes.keyboard.keyUp(evt);
            };

            document.onkeypress = (evt) => {
                this.nes.keyboard.keyPress(evt);
            };

            /*
             * Sound
             */
            //self.dynamicaudio = new DynamicAudio({
            //    swf: this.nes.opts.swfPath + 'dynamicaudio.swf'
            //});
        }

        loadROM() {
            var self = this;
            self.updateStatus("Downloading...");
            var request: XMLHttpRequest = new XMLHttpRequest();
            request.overrideMimeType('text/plain; charset=x-user-defined');
            request.open("GET", self.romSelect.value, false);
            request.send();

            if (request.status != 200) {
                console.log("FileDownloader Error! " + request.status.toString() + " " + request.statusText);
            }

            var data = request.responseText;
            self.nes.loadRom(data);
            self.nes.start();
            self.enable();
         }

        resetCanvas() {
            this.canvasContext.fillStyle = 'black';
            // set alpha to opaque
            this.canvasContext.fillRect(0, 0, 256, 240);

            // Set alpha
            for (var i = 3; i < this.canvasImageData.data.length - 3; i += 4) {
                this.canvasImageData.data[i] = 0xFF;
            }
        }

        /*
        *
        * nes.ui.screenshot() --> return <img> element :)
        */
        screenshot() {
            var data = this.screen.toDataURL("image/png"),
                img = new Image();
            img.src = data;
            return img;
        }

        /*
        * Enable and reset UI elements
        */
        enable() {
            //this.pauseButton.setAttribute("disabled", null);
            if (this.nes.isRunning) {
                this.pauseButton.setAttribute("value", "pause");
            }
            else {
                this.pauseButton.setAttribute("value", "resume");
            }

            //this.restartButton.setAttribute("disabled", null);

            if (this.nes.opts.emulateSound) {
                this.soundButton.setAttribute("value", "disable sound");
            }
            else {
                this.soundButton.setAttribute("value", "enable sound");
            }
        }

        updateStatus(s) {
            this.status.textContent = s;
        }

        setRoms(roms) {
            // clear the list.  see: http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
            while (this.romSelect.firstChild) {
                this.romSelect.removeChild(this.romSelect.firstChild);
            }

            var option = document.createElement("option");
            option.innerText = "Select a ROM...";
            this.romSelect.appendChild(option);

            for (var groupName in roms) {
                if (roms.hasOwnProperty(groupName)) {
                    var optgroup = document.createElement("optgroup");
                    optgroup.setAttribute("label", groupName);

                    for (var i = 0; i < roms[groupName].length; i++) {
                        option = document.createElement("option");
                        option.innerText = roms[groupName][i][0];
                        option.setAttribute("value", roms[groupName][i][1]);
                        optgroup.appendChild(option);
                    }

                    this.romSelect.appendChild(optgroup);
                }
            }
        }

        writeAudio(samples) {
            return this.dynamicaudio.writeInt(samples);
        }

        writeFrame(buffer, prevBuffer) {
            var imageData = this.canvasImageData.data;
            var pixel, i, j;

            for (i = 0; i < 256 * 240; i++) {
                pixel = buffer[i];

                if (pixel != prevBuffer[i]) {
                    j = i * 4;
                    imageData[j] = pixel & 0xFF;
                    imageData[j + 1] = (pixel >> 8) & 0xFF;
                    imageData[j + 2] = (pixel >> 16) & 0xFF;
                    prevBuffer[i] = pixel;
                }
            }            

            this.canvasContext.putImageData(this.canvasImageData, 0, 0);
        }
    }
}


