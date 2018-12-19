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

class MPoint {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

}

class PerPixelContext {

  constructor(x, y, rad, theta, i, j) {
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.theta = theta;
    this.i = i;
    this.j = j;
  }

}

class PerPixelMesh {

  constructor(width, height){
    this.width = width;
    this.height = height;
    this.size = width * height;
    this.p = new Array(this.size);
    this.p_original = new Array(this.size);
    this.identity = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.p[i] = new MPoint(0,0);
      this.p_original[i] = new MPoint(0,0);
      this.identity[i] = new PerPixelContext(0,0,0,0,0);
    }
    for (let j = 0; j < this.height; j++)
      for (let i = 0; i < this.width; i++) {
        const index = j*this.width + i;
        const xval = i/(this.width-1.);
        const yval = -((j/(this.height-1.))-1.);
        this.p[index].x = xval;
        this.p[index].y = yval;
        this.p_original[index].x = xval;
        this.p_original[index].y = yval;
        this.identity[index].x = xval;
        this.identity[index].y = yval;
        this.identity[index].i = i;
        this.identity[index].j = j;
        this.identity[index].rad = Math.sqrt(Math.pow((xval-.5)*2,2) + Math.pow((yval-.5)*2,2));
        this.identity[index].theta = Math.atan2((yval-.5)*2, (xval-.5)*2);
      }
  }

  Reset() {
    for (let i = 0; i < this.size; i++) {
      this.p[i].x = this.p_original[i].x;
      this.p[i].y = this.p_original[i].y;
    }
  }

}

export { MPoint, PerPixelContext, PerPixelMesh };
