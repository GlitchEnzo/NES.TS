module NES.TS {
    export class Options {
        ui: UI;
        swfPath = 'lib/';

        preferredFrameRate = 60;
        fpsInterval = 500; // Time between updating FPS in ms
        showDisplay = true;

        emulateSound = false;
        sampleRate = 44100; // Sound sample rate in hz

        CPU_FREQ_NTSC = 1789772.5; //1789772.72727272d;
        CPU_FREQ_PAL = 1773447.4;
    }
}