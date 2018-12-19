class HTML5Audio {

  constructor() {
    this.context = null;
    this.source = null;

    if (typeof webkitAudioContext !== "undefined")
      this.audioAPI = new WebkitAudioAPI();
    else
      this.audioAPI = new MozAudioAPI();
  }

  loadSample(url) {
    this.audioAPI.loadSample(url);
  }

}

class WebkitAudioAPI {

  constructor() {
    this.context = new webkitAudioContext();
    this.source = this.context.createBufferSource();
    this.processor = this.context.createJavaScriptNode(512);
    this.processor.onaudioprocess = this.audioAvailable;
    this.source.connect(this.processor);
    this.processor.connect(this.context.destination);
  }

  loadSample(url) {
    const request = new XMLHttpRequest();
    const context = this.context;
    const source = this.source;
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function () {
      context.decodeAudioData(request.response, function (buffer) {
        source.buffer = buffer;
        source.looping = true;
        source.noteOn(0);
      });
    };
    request.send();
  }

  audioAvailable(event) {
    const inputArrayL = event.inputBuffer.getChannelData(0);
    const inputArrayR = event.inputBuffer.getChannelData(1);
    const outputArrayL = event.outputBuffer.getChannelData(0);
    const outputArrayR = event.outputBuffer.getChannelData(1);
    const n = inputArrayL.length;

    for (let i = 0; i < n; ++i) {
      outputArrayL[i] = inputArrayL[i];
      outputArrayR[i] = inputArrayR[i];
    }

    if (typeof shaker !== "undefined")
      shaker.music.addPCM(inputArrayL, inputArrayR);
  }

}

class MozAudioAPI {

  constructor() {
    this.context = new Audio();
    this.context.src = "song.ogg";
    this.context.addEventListener('MozAudioAvailable', this.audioAvailable);
    this.context.addEventListener('loadedmetadata', this.loadedMetadata, false);
    this.context.play();
  }

  loadedMetadata() {
    this.channels = this.context.mozChannels;
    this.rate = this.context.mozSampleRate;
    this.frameBufferLength = this.context.mozFrameBufferLength;
  }

  audioAvailable(event) {
    const fb = event.frameBuffer;
    const signalL = new Float32Array(fb.length / 2);
    const signalR = new Float32Array(fb.length / 2);
    for (let i = 0; i < this.frameBufferLength / 2; i++) {
      signalL[i] = fb[2 * i];
      signalR[i] = fb[2 * i + 1];
    }

    if (typeof shaker !== "undefined")
      shaker.music.addPCM(signalL, signalR);
  }
}

export { HTML5Audio, WebkitAudioAPI, MozAudioAPI }
