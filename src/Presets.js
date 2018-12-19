const Presets = {};
export default Presets;

Presets["Aderrasi - Blender.milk"] = {
  fRating: 3.0,
  fGammaAdj: 1.0,
  fDecay: 0.98,
  fVideoEchoZoom: 0.999997,
  fVideoEchoAlpha: 0.4,
  nVideoEchoOrientation: 0,
  nWaveMode: 0,
  bAdditiveWaves: 0,
  bWaveDots: 0,
  bWaveThick: 1,
  bModWaveAlphaByVolume: 0,
  bMaximizeWaveColor: 0,
  bTexWrap: 1,
  bDarkenCenter: 1,
  bRedBlueStereo: 0,
  bBrighten: 0,
  bDarken: 0,
  bSolarize: 0,
  bInvert: 0,
  fWaveAlpha: 100.0,
  fWaveScale: 3.91582,
  fWaveSmoothing: 0.5,
  fWaveParam: -0.4,
  fModWaveAlphaStart: 0.5,
  fModWaveAlphaEnd: 1.0,
  fWarpAnimSpeed: 1.0,
  fWarpScale: 1.0,
  fZoomExponent: 1.0,
  fShader: 0.0,
  zoom: 1.0,
  rot: 0.0,
  cx: 0.5,
  cy: 0.5,
  dx: 1e-5,
  dy: 1e-5,
  warp: 0.01,
  sx: 1.0,
  sy: 1.0,
  wave_r: 1.0,
  wave_g: 1.0,
  wave_b: 1.0,
  wave_x: 0.5,
  wave_y: 0.5,
  ob_size: 0.005,
  ob_r: 1.0,
  ob_g: 0.0,
  ob_b: 0.0,
  ob_a: 1.0,
  ib_size: 0.005,
  ib_r: 1.0,
  ib_g: 1.0,
  ib_b: 1.0,
  ib_a: 1.0,
  nMotionVectorsX: 0.0,
  nMotionVectorsY: 0.0,
  mv_dx: 0.0,
  mv_dy: 0.0,
  mv_l: 1.0,
  mv_r: 1.0,
  mv_g: 1.0,
  mv_b: 1.0,
  mv_a: 0.0,
  per_pixel_code: (x) => {
    x.rot = x.rot - 0.1 * Math.min((2 - x.rad) * x.bass_att, (2 - x.rad) * x.treb_att);
    x.grad = Math.sqrt(x.x * x.x + x.y * x.y) * 2;
    x.dx -= 0.02 * (1 - x.rad);
    x.dy += 0.02 * (1 - x.rad);
    x.zoom -= Math.max(x.grad * (x.bass / 8 - x.treb / 8), 0);
  },
  per_frame_code: (x) => {
    x.wave_r += 0.9;
    x.wave_g = 0.9 - 0.5 * x.bass;
    x.wave_b = 0.9 - 0.5 * x.bass;
    x.q1 = 0.05 * sin(x.time * 1.14);
    x.q2 = 0.03 * sin(x.time * 0.93 + 2);
    x.wave_x += q1;
    x.wave_y += q2;
  },
  shapes: [
    {
      enabled: 1,
      sides: 4,
      thickOutline: 0,
      textured: 1,
      ImageUrl: "title.png",
      x: 0.5,
      y: 0.5,
      rad: 1.0,
      ang: 0,
      tex_ang: 0,
      tex_zoom: 0.5,
      r: 1,
      g: 1,
      b: 1,
      a: 1,
      r2: 1,
      g2: 1,
      b2: 1,
      a2: 1,
      border_r: 0,
      border_g: 0,
      border_b: 0,
      border_a: 0,
      per_frame_code: () => {
        this.x += q1;
        this.y += q2;
        this.r += 0.9;
        this.g = 0.9 - 0.5 * this.bass;
        this.b = 0.9 - 0.5 * this.bass;
        this.rad += 0.1 * this.bass_att;
      }
    }
  ],
  waves: []
};

