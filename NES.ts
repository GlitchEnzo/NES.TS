module NES.TS
{
    export class NES {
        opts: Options = new Options();
        isRunning = false;
        fpsFrameCount = 0;
        romData = null;
        static VERSION = "<%= version %>";

        frameTime: number;
        ui: UI;
        cpu: CPU;
        ppu: PPU;
        papu: PAPU;
        mmap: Mapper;
        keyboard: Keyboard;

        frameInterval: number;
        fpsInterval: number;
        lastFpsTime: number;
        rom: ROM;
        lastFrameTime: number;

        constructor(opts: Options) {
            this.opts = opts;

            this.frameTime = 1000 / this.opts.preferredFrameRate;

            this.ui = this.opts.ui;
            this.cpu = new CPU(this);
            this.ppu = new PPU(this);
            this.papu = new PAPU(this);
            this.mmap = null; // set in loadRom()
            this.keyboard = new Keyboard();

            this.ui.updateStatus("Ready to load a ROM.");
        }

        // Resets the system
        reset() {
            if (this.mmap !== null) {
                this.mmap.reset();
            }

            this.cpu.reset();
            this.ppu.reset();
            this.papu.reset();
        }

        start() {
            if (this.rom !== null && this.rom.valid) {
                if (!this.isRunning) {
                    this.isRunning = true;

                    this.frameInterval = setInterval(() => {
                        this.frame();
                    }, this.frameTime);
                    this.resetFps();
                    this.printFps();
                    this.fpsInterval = setInterval(() => {
                        this.printFps();
                    }, this.opts.fpsInterval);
                }
            }
            else {
                this.ui.updateStatus("There is no ROM loaded, or it is invalid.");
            }
        }

        frame() {
            this.ppu.startFrame();
            var cycles = 0;
            var emulateSound = this.opts.emulateSound;
            var cpu = this.cpu;
            var ppu = this.ppu;
            var papu = this.papu;
            FRAMELOOP: for (; ;) {
                if (cpu.cyclesToHalt === 0) {
                    // Execute a CPU instruction
                    cycles = cpu.emulate();
                    if (emulateSound) {
                        papu.clockFrameCounter(cycles);
                    }
                    cycles *= 3;
                }
                else {
                    if (cpu.cyclesToHalt > 8) {
                        cycles = 24;
                        if (emulateSound) {
                            papu.clockFrameCounter(8);
                        }
                        cpu.cyclesToHalt -= 8;
                    }
                    else {
                        cycles = cpu.cyclesToHalt * 3;
                        if (emulateSound) {
                            papu.clockFrameCounter(cpu.cyclesToHalt);
                        }
                        cpu.cyclesToHalt = 0;
                    }
                }

                for (; cycles > 0; cycles--) {
                    if (ppu.curX === ppu.spr0HitX &&
                        ppu.f_spVisibility === 1 &&
                        ppu.scanline - 21 === ppu.spr0HitY) {
                        // Set sprite 0 hit flag:
                        ppu.setStatusFlag(ppu.STATUS_SPRITE0HIT, true);
                    }

                    if (ppu.requestEndFrame) {
                        ppu.nmiCounter--;
                        if (ppu.nmiCounter === 0) {
                            ppu.requestEndFrame = false;
                            ppu.startVBlank();
                            break FRAMELOOP;
                        }
                    }

                    ppu.curX++;
                    if (ppu.curX === 341) {
                        ppu.curX = 0;
                        ppu.endScanline();
                    }
                }
            }
            this.fpsFrameCount++;
            this.lastFrameTime = +new Date();
        }

        printFps() {
            var now = +new Date();
            var s = 'Running';
            if (this.lastFpsTime) {
                s += ': ' + (
                    this.fpsFrameCount / ((now - this.lastFpsTime) / 1000)
                    ).toFixed(2) + ' FPS';
            }
            this.ui.updateStatus(s);
            this.fpsFrameCount = 0;
            this.lastFpsTime = now;
        }

        stop() {
            clearInterval(this.frameInterval);
            clearInterval(this.fpsInterval);
            this.isRunning = false;
        }

        reloadRom() {
            if (this.romData !== null) {
                this.loadRom(this.romData);
            }
        }

        // Loads a ROM file into the CPU and PPU.
        // The ROM file is validated first.
        loadRom(data: string) {
            if (this.isRunning) {
                this.stop();
            }

            this.ui.updateStatus("Loading ROM...");

            // Load ROM file:
            this.rom = new ROM(this);
            this.rom.load(data);

            if (this.rom.valid) {
                this.reset();
                this.mmap = this.rom.createMapper();
                if (!this.mmap) {
                    return;
                }
                this.mmap.loadROM();
                this.ppu.setMirroring(this.rom.getMirroringType());
                this.romData = data;

                this.ui.updateStatus("Successfully loaded. Ready to be started.");
            }
            else {
                this.ui.updateStatus("Invalid ROM!");
            }
            return this.rom.valid;
        }

        resetFps() {
            this.lastFpsTime = null;
            this.fpsFrameCount = 0;
        }

        setFramerate(rate: number) {
            this.opts.preferredFrameRate = rate;
            this.frameTime = 1000 / rate;
            //this.papu.setSampleRate(this.opts.sampleRate, false);
        }

        toJSON() {
            return {
                'romData': this.romData,
                'cpu': this.cpu.toJSON(),
                'mmap': this.mmap.toJSON(),
                'ppu': this.ppu.toJSON()
            };
        }

        fromJSON(s) {
            this.loadRom(s.romData);
            this.cpu.fromJSON(s.cpu);
            this.mmap.fromJSON(s.mmap);
            this.ppu.fromJSON(s.ppu);
        }
    }
}
