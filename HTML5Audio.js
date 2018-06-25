var HTML5Audio = Class.extend({
  init: function() {
    this.context = null;
    this.source = null;

    if (typeof webkitAudioContext != "undefined")
      this.audioAPI = new WebkitAudioAPI();
  }
});

var WebkitAudioAPI = Class.extend({
  init: function() {
    this.context = new webkitAudioContext();
    this.source = this.context.createBufferSource();
    this.processor = this.context.createJavaScriptNode(512);
    this.processor.onaudioprocess = this.audioAvailable;
    this.source.connect(this.processor);
    this.processor.connect(this.context.destination);
    this.loadSample("song.ogg");
  },

  loadSample: function(url) {
    var request = new XMLHttpRequest();
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
  },

  audioAvailable: function(event) {
    var inputArrayL = event.inputBuffer.getChannelData(0);
    var inputArrayR = event.inputBuffer.getChannelData(1);
    var outputArrayL = event.outputBuffer.getChannelData(0);
    var outputArrayR = event.outputBuffer.getChannelData(1);
    var n = inputArrayL.length;

    for (var i = 0; i < n; ++i) {
      outputArrayL[i] = inputArrayL[i];
      outputArrayR[i] = inputArrayR[i];
    }

    if (typeof shaker != "undefined")
      shaker.music.addPCM(inputArrayL, inputArrayR);
  }
});

