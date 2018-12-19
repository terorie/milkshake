class VariablePool {

  constructor() {
    this.inputs = [];
    this.outputs = [];
    this.addInputs(["time","fps","frame","progress","bass","mid","treb",
      "bass_att","mid_att","treb_att"]);
    for (let i = 1; i <= 32; i++)
      this["q"+i] = 0;
  }

  addInputs(ownInputs){
    for (let i = 0; i < ownInputs.length; i++) {
      this.inputs.push(ownInputs[i]);
      this[ownInputs[i]] = 0;
    }
  }

  addOutputs(ownOutputs) {
    for (let i = 0; i < ownOutputs.length; i++) {
      this.outputs.push(ownOutputs[i]);
      this[ownOutputs[i]] = 0;
    }
  }

  pushQs(array) {
    for (var i = 1; i <= 32; i++)
      this["q"+i] = array[i-1];
  }

  popQs(array) {
    for (var i = 1; i <= 32; i++)
      array[i-1] = this["q"+i];
  }

  transferQs(pool) {
    for (var i = 1; i <= 32; i++)
      pool["q"+i] = this["q"+i];
  }

  pushOutputs(pool) {
    for (var i = 0; i < this.outputs.length; i++)
      this[this.outputs[i]] = pool[this.outputs[i]];
  }

  popOutputs(pool) {
    for (var i = 0; i < this.outputs.length; i++)
      pool[this.outputs[i]] = this[this.outputs[i]];
  }

  pushInputs(pool) {
    for (var i = 0; i < this.inputs.length; i++)
      this[this.inputs[i]] = pool[this.inputs[i]];
  }

}

VariablePool.cos = Math.cos;
VariablePool.sin = Math.sin;
VariablePool.tan = Math.tan;
VariablePool.asin = Math.asin;
VariablePool.acos = Math.acos;
VariablePool.atan = Math.atan;
VariablePool.abs = Math.abs;
VariablePool.pow = Math.pow;
VariablePool.min = Math.min;
VariablePool.max = Math.max;
VariablePool.sqrt = Math.sqrt;
VariablePool.log = Math.log;
VariablePool.exp = Math.exp;
VariablePool.atan2 = Math.atan2;
VariablePool.log10 = (arg1) => Math.log(arg1, 10);

VariablePool.above = (arg1, arg2) => arg1 > arg2;
VariablePool.below = (arg1, arg2) => arg1 < arg2;
VariablePool.equal = (arg1, arg2) => arg1 === arg2;
VariablePool.ifcond = (arg1, arg2, arg3) => arg1 ? arg2 : arg3;
VariablePool.sign = (arg1) => (arg1 > 0) - (arg1 < 0);
VariablePool.int = (arg1) => Math.floor(1);
VariablePool.sqr = (arg1) => Math.pow(arg1, 2);
VariablePool.sigmoid = (arg1, arg2) => 65534 / (1 + Math.exp(arg1 * arg2 / -32767) - 32767);
VariablePool.rand = (arg1) => Math.floor(Math.random()*arg1);
VariablePool.bor = (arg1,arg2) => (arg1 !== 0) || (arg2 !== 0);
VariablePool.band = (arg1,arg2) => (arg1 !== 0) && (arg2 !== 0);
VariablePool.bnot = (arg1) => arg1 === 0 ? 1 : 0;

class PresetVariablePool extends VariablePool {
  constructor() {
    super();

    this.addOutputs(['zoom','zoomexp','rot','warp','cx','cy','dx','dy','sx','sy']);
    this.addInputs(['meshx','meshy','aspectx','aspecty']);
  }
}

class PresetFrameVariablePool extends PresetVariablePool {
  constructor() {
    super();
    this.addOutputs(['wave_x','wave_y','wave_r','wave_g','wave_b','wave_a','wave_mode',
      'wave_mystery','wave_usedots','wave_thick','wave_additive','wave_brighten',
      'ob_size','ob_r','ob_g','ob_b','ob_a','ib_size','ib_r','ib_g','ib_b',
      'ib_a','mv_r','mv_g','mv_b','mv_a','mv_x','mv_y','mv_l','mv_dx','mv_dy',
      'decay','gamma','echo_zoom','echo_alpha','echo_orient','darken_center',
      'wrap','invert','brighten','darken','solarize']);
  }
}

class PresetPixelVariablePool extends PresetVariablePool {
  constructor() {
    super();
    this.addOutputs(['x','y','rad','ang']);
  }
}

class CustomVariablePool extends VariablePool {
  constructor() {
    super();
    this.addOutputs(['r','g','b','a']);
    for (var i = 1; i <= 8; i++)
      this["t"+i] = 0;
  }

  pushTs(array) {
    for (let i = 1; i <= 8; i++)
      this["t"+i] = array[i-1];
  }

  popTs(array) {
    for (let i = 1; i <= 8; i++)
      array[i-1] = this["t"+i];
  }

  transferTs(pool) {
    for (let i = 1; i <= 8; i++)
      pool["t"+i] = this["t"+i];
  }
}

class WaveFrameVariablePool extends CustomVariablePool {
}

class WavePointVariablePool extends CustomVariablePool {
  constructor() {
    super();
    this.addOutputs(['x','y','sample','value1','value2']);
  }
}

class ShapeFrameVariablePool extends CustomVariablePool {
  constructor() {
    super();
    this.addOutputs(['sides','thick','additive','textured','tex_zoom','tex_ang','x','y','rad',
      'ang','r2','g2','b2','a2','border_r','border_g','border_b','border_a']);
  }
}

export { VariablePool };
