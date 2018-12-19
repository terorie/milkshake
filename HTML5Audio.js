class HTML5Audio {
  constructor(props) {
    this.context = null;
    this.source = null;

    if (typeof webkitAudioContext !== "undefined")
      this.audioAPI = new WebkitAudioAPI();
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
    this.loadSample("song.ogg");
  }

  loadSample(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = () => {
      this.context.decodeAudioData(request.response, (buffer) => {
        this.source.buffer = buffer;
        this.source.looping = true;
        this.source.noteOn(0);
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

export { HTML5Audio, WebkitAudioAPI }
