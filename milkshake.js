/**
 * milkshake -- WebGL Milkdrop-esque visualisation (port of projectM)
 * Copyright (C)2011 Matt Gattis and contributors
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 * See 'LICENSE.txt' included within this release
 *
 */

import {Shaker} from "./src/Shaker";
import {HTML5Audio} from "./src/HTML5Audio";

const milk = (() => {

  /*
   * Core Animation Interface
   */

  let shaker;
  let canvas;
  let audio;
  let queue = [];

  function load(url) {
    audio.loadSample(url);
  }

  function shake(element) {
    canvas = (element instanceof HTMLCanvasElement) ? element : document.getElementById(element);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    try {
      initGL(function () {
        shaker = new Shaker();
        audio = new HTML5Audio();
        animationLoop();
        setInterval(function () {
          shaker.selectNext(true);
        }, 10000);
      });
    } catch (e) {
      canvas.outerHTML = "<div id='" + elementId + "' style='padding:20px;'>" + canvas.innerHTML + "</div>";
    }

  }

  const requestAnimFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
    function (callback, element) {
      window.setTimeout(callback, 1000 / 60);
    };

  function animationLoop() {
    shaker.renderFrame.call(shaker);
    requestAnimFrame(animationLoop, canvas);
  }


  /*
   * Global WebGL, Programmable Shader, and Linear Algebra Routines
   */

  let gl;

  const U_PROJECTION = 0;
  const U_MODELVIEW = 1;
  const U_TEXTURE = 2;

  const U_VERTEX_ARRAY = 0;
  const U_TEXTURE_COORD_ARRAY = 1;
  const U_COLOR_ARRAY = 2;

  const mvMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  const prMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  const mvpMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  const txMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  let activeMatrix = prMatrix;

  const mvStack = [];
  const prStack = [];
  const txStack = [];
  let activeStack = prStack;
  let enablestex = false;
  let enablevco = false;
  let upointsize = 1.0;
  let ucolr = 1.0;
  let ucolg = 1.0;
  let ucolb = 1.0;
  let ucola = 1.0;

  let vertexPos;
  let colorPos;
  let texCoordPos;

  let ucolorloc;
  let stextureloc;
  let upointsizeloc;
  let mvpmatrixloc;
  let txmatrixloc;
  let enablestexloc;
  let enablevcoloc;

  const textures = {};
  const texture_list = ["title.png"];
  let texloads = 0;

  function initGL(callback) {
    gl = canvas.getContext("webgl", {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false
    });

    const vertexShader = loadShader(gl.VERTEX_SHADER,
      "precision mediump float; \
       attribute vec4 a_position; \
       attribute vec4 a_texCoord; \
       varying vec4 v_texCoord; \
       attribute vec4 a_color; \
       uniform vec4 u_color; \
       varying vec4 v_color; \
       uniform bool enable_v_color; \
       uniform float u_pointsize; \
       uniform mat4 mvp_matrix; \
       uniform mat4 tx_matrix; \
       void main() { \
         gl_Position = mvp_matrix * a_position; \
         v_texCoord = tx_matrix * a_texCoord; \
         if (enable_v_color) \
           v_color = a_color; \
         else \
           v_color = u_color; \
         gl_PointSize = u_pointsize; \
       }");

    const fragmentShader = loadShader(gl.FRAGMENT_SHADER,
      "precision mediump float; \
             varying vec4 v_texCoord; \
              uniform sampler2D s_texture; \
         varying vec4 v_color; \
         uniform bool enable_s_texture; \
         void main() { \
           if (enable_s_texture) \
             gl_FragColor = v_color * texture2D(s_texture, v_texCoord.st); \
           else \
             gl_FragColor = v_color; \
         }");

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
      throw Error("Unable to initialize the shader program.");
    gl.useProgram(shaderProgram);

    vertexPos = gl.getAttribLocation(shaderProgram, "a_position");
    colorPos = gl.getAttribLocation(shaderProgram, "a_color");
    texCoordPos = gl.getAttribLocation(shaderProgram, "a_texCoord");
    ucolorloc = gl.getUniformLocation(shaderProgram, "u_color");
    stextureloc = gl.getUniformLocation(shaderProgram, "s_texture");
    upointsizeloc = gl.getUniformLocation(shaderProgram, "u_pointsize");
    mvpmatrixloc = gl.getUniformLocation(shaderProgram, "mvp_matrix");
    txmatrixloc = gl.getUniformLocation(shaderProgram, "tx_matrix");
    enablestexloc = gl.getUniformLocation(shaderProgram, "enable_s_texture");
    enablevcoloc = gl.getUniformLocation(shaderProgram, "enable_v_color");

    for (let i = 0; i < texture_list.length; i++) {
      const img = new Image();
      img.tex = gl.createTexture();
      img.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        textures[this.src.split("/").pop()] = this.tex;
        texloads += 1;
        if (texloads === texture_list.length)
          callback();
      };
      img.src = texture_list[i];
    }

  }

  function loadShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw Error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return shader;
  }

  function uMatrixMode(mode) {
    switch (mode) {
      case U_PROJECTION:
        activeMatrix = prMatrix;
        activeStack = prStack;
        break;
      case U_MODELVIEW:
        activeMatrix = mvMatrix;
        activeStack = mvStack;
        break;
      case U_TEXTURE:
        activeMatrix = txMatrix;
        activeStack = txStack;
        break;
    }
  }

  function uLoadIdentity() {
    activeMatrix[0] = 1;
    activeMatrix[1] = 0;
    activeMatrix[2] = 0;
    activeMatrix[3] = 0;
    activeMatrix[4] = 0;
    activeMatrix[5] = 1;
    activeMatrix[6] = 0;
    activeMatrix[7] = 0;
    activeMatrix[8] = 0;
    activeMatrix[9] = 0;
    activeMatrix[10] = 1;
    activeMatrix[11] = 0;
    activeMatrix[12] = 0;
    activeMatrix[13] = 0;
    activeMatrix[14] = 0;
    activeMatrix[15] = 1;
  }

  function multiply(result, srcA, srcB) {
    const tmp = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    for (let i = 0; i < 4; i++) {
      const a = 4 * i;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      tmp[a] = srcA[a] * srcB[0] +
        srcA[b] * srcB[4] +
        srcA[c] * srcB[8] +
        srcA[d] * srcB[12];
      tmp[b] = srcA[a] * srcB[1] +
        srcA[b] * srcB[5] +
        srcA[c] * srcB[9] +
        srcA[d] * srcB[13];
      tmp[c] = srcA[a] * srcB[2] +
        srcA[b] * srcB[6] +
        srcA[c] * srcB[10] +
        srcA[d] * srcB[14];
      tmp[d] = srcA[a] * srcB[3] +
        srcA[b] * srcB[7] +
        srcA[c] * srcB[11] +
        srcA[d] * srcB[15];
    }
    for (var i = 0; i < 16; i++)
      result[i] = tmp[i];
  }

  function uMultMatrix(mat) {
    multiply(activeMatrix, mat, activeMatrix);
  }

  function uTranslatef(x, y, z) {
    const m = activeMatrix;
    m[12] += m[0] * x + m[4] * y + m[8] * z;
    m[13] += m[1] * x + m[5] * y + m[9] * z;
    m[14] += m[2] * x + m[6] * y + m[10] * z;
    m[15] += m[3] * x + m[7] * y + m[11] * z;
  }

  function uRotatef(angle, x, y, z) {
    angle = -angle;
    const c = Math.cos(angle * Math.PI / 180.0);
    const s = Math.sin(angle * Math.PI / 180.0);
    const omc = 1.0 - c;
    const mag = Math.sqrt(x * x + y * y + z * z);
    if (mag !== 0.0 && mag !== 1.0) {
      x = x / mag;
      y = y / mag;
      z = z / mag;
    }

    const xy = x * y;
    const yz = y * z;
    const zx = z * x;
    const ys = y * s;
    const xs = x * s;
    const zs = z * s;

    const rot = new Float32Array([omc * x * x + c, omc * xy - zs, omc * zx + ys, 0.0,
      omc * xy + zs, omc * y * y + c, omc * yz - xs, 0.0,
      omc * zx - ys, omc * yz + xs, omc * z * z + c, 0.0,
      0.0, 0.0, 0.0, 1.0]);
    uMultMatrix(rot);
  }

  function uScalef(x, y, z) {
    activeMatrix[0] *= x;
    activeMatrix[1] *= x;
    activeMatrix[2] *= x;
    activeMatrix[3] *= x;

    activeMatrix[4] *= y;
    activeMatrix[5] *= y;
    activeMatrix[6] *= y;
    activeMatrix[7] *= y;

    activeMatrix[8] *= z;
    activeMatrix[9] *= z;
    activeMatrix[10] *= z;
    activeMatrix[11] *= z;
  }

  function uOrthof(left, right, bottom, top, near, far) {
    const dX = right - left;
    const dY = top - bottom;
    const dZ = far - near;
    const orth = new Float32Array([2 / dX, 0, 0, 0,
      0, 2 / dY, 0, 0,
      0, 0, -2 / dZ, 0,
      -(right + left) / dX, -(top + bottom) / dY, -(near + far) / dZ, 1.0]);
    uMultMatrix(orth);
  }

  function uPushMatrix() {
    const store = new Float32Array(16);
    for (let i = 0; i < 16; i++)
      store[i] = activeMatrix[i];
    activeStack.push(store);
  }

  function uPopMatrix() {
    const restore = activeStack.pop();
    for (let i = 0; i < 16; i++)
      activeMatrix[i] = restore[i];
  }

  function uColor4f(r, g, b, a) {
    ucolr = r;
    ucolg = g;
    ucolb = b;
    ucola = a;
  }

  function uPointSize(size) {
    upointsize = size;
  }

  function uVertexPointer(size, type, stride, buf) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(vertexPos, size, type, false, size * 4, 0);
    gl.enableVertexAttribArray(vertexPos);
  }


  function uColorPointer(size, type, stride, buf) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(colorPos, size, type, false, size * 4, 0);
    gl.enableVertexAttribArray(colorPos);
  }

  function uTexCoordPointer(size, type, stride, buf) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(texCoordPos, size, type, false, size * 4, 0);
    gl.enableVertexAttribArray(texCoordPos);
  }


  function uEnableClientState(state) {
    switch (state) {
      case U_TEXTURE_COORD_ARRAY:
        enablestex = true;
        break;
      case U_COLOR_ARRAY:
        enablevco = true;
        break;
    }
  }

  function uDisableClientState(state) {
    switch (state) {
      case U_TEXTURE_COORD_ARRAY:
        enablestex = false;
        break;
      case U_COLOR_ARRAY:
        enablevco = false;
        break;
    }
  }

  function uDrawArrays(mode, first, count) {
    gl.uniform1i(enablestexloc, enablestex);
    gl.uniform1i(enablevcoloc, enablevco);
    gl.uniform1f(upointsizeloc, upointsize);
    gl.uniform4f(ucolorloc, ucolr, ucolg, ucolb, ucola);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(stextureloc, 0);
    multiply(mvpMatrix, mvMatrix, prMatrix);
    gl.uniformMatrix4fv(mvpmatrixloc, false, mvpMatrix);
    gl.uniformMatrix4fv(txmatrixloc, false, txMatrix);
    if (!enablestex)
      gl.disableVertexAttribArray(texCoordPos);
    if (!enablevco)
      gl.disableVertexAttribArray(colorPos);
    gl.drawArrays(mode, first, count);
  }

  function checkError(source) {
    const error = gl.getError();
    if (error === gl.NO_ERROR)
      return;
    throw Error("OpenGL Error from " + source + ": " + error);
  }

  return {
    shake: shake,
    load: load
  };

})();

export default milk;
window.milk = milk;
