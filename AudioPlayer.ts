 module NES.TS {
     export class AudioPlayer {
         audioContext: AudioContext;

         //audioNode: AudioBufferSourceNode;

         audioBuffer: AudioBuffer;
         leftData: Float32Array;
         rightData: Float32Array;

         //private bufferSize = 4096;
         private bufferSize = 8192;
         sampleRate = 44100;

         constructor() {
             this.audioContext = new AudioContext();

             console.log("Sample Rate = " + this.audioContext.sampleRate);

             // 8192 = PAPU buffer size
             this.audioBuffer = this.audioContext.createBuffer(2, this.bufferSize, this.sampleRate);
             this.leftData = this.audioBuffer.getChannelData(0);
             this.rightData = this.audioBuffer.getChannelData(1);
         }

         playInts(values: number[]) {
             var audioNode = this.audioContext.createBufferSource();

             // fill the data
             var j = 0;
             for (var i = 0; i < values.length; i+=2) {
                 this.leftData[j] = values[i] / 32768;
                 this.rightData[j] = values[i + 1] / 32768;
                 j++;
             }

             // set the buffer on the node and connect it to the audio context
             audioNode.buffer = this.audioBuffer;
             audioNode.connect(this.audioContext.destination);
             audioNode.start(0);
         }
     }
 }