 module NES.TS {
     export class AudioPlayer {
         audioContext: AudioContext;

         audioNode: AudioBufferSourceNode;

         audioBuffer: AudioBuffer;
         leftData: Float32Array;
         rightData: Float32Array;

         constructor() {
             this.audioContext = new AudioContext();

             // 8192 = PAPU buffer size
             this.audioBuffer = this.audioContext.createBuffer(2, 8192, this.audioContext.sampleRate);
             this.leftData = this.audioBuffer.getChannelData(0);
             this.rightData = this.audioBuffer.getChannelData(1);
         }

         playRandomLoop() {
             // create a BufferSource and a Buffer and then get the channel data of the created buffer
             // NOTE: The BufferSource is actually a BufferSourceNode, it can be used only once. When it finished playing or when you stopped it you have to create a new one. 
             var audioNode = this.audioContext.createBufferSource();

             var buffer = this.audioContext.createBuffer(1, 4096, this.audioContext.sampleRate);
             var data = buffer.getChannelData(0);

             // fill the data with random noises
             for (var i = 0; i < 4096; i++) {
                 data[i] = Math.random();
             }

             // set the buffer on the node and connect it to the audio context
             audioNode.buffer = buffer;
             audioNode.loop = true;
             audioNode.connect(this.audioContext.destination);
             audioNode.start(0);
         }

         playInts(values: number[]) {
             this.audioNode = this.audioContext.createBufferSource();

             //var buffer = this.audioContext.createBuffer(2, values.length, this.audioContext.sampleRate);
             //this.leftData = this.audioBuffer.getChannelData(0);
             //this.rightData = this.audioBuffer.getChannelData(1);

             // fill the data
             var j = 0;
             for (var i = 0; i < values.length; i+=2) {
                 this.leftData[j] = values[i] / 32768;
                 this.rightData[j] = values[i + 1] / 32768;
                 j++;
             }

             // set the buffer on the node and connect it to the audio context
             this.audioNode.buffer = this.audioBuffer;
             //this.audioNode.loop = true;
             this.audioNode.connect(this.audioContext.destination);
             this.audioNode.start(0);
         }
     }
 }