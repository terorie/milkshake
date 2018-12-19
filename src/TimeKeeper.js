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

class TimeKeeper {

  constructor(presetDuration, smoothDuration) {
    this.smoothDuration = smoothDuration;
    this.presetDuration = presetDuration;
    this.startTime = new Date();
    this.UpdateTimers();
  }

  UpdateTimers() {
    this.currentTime = TimeKeeper.getTicks(this.startTime) * 0.001;
    this.presetFrameA++;
    this.presetFrameB++;
  }

  StartPreset() {
    this.isSmoothing = false;
    this.presetTimeA = this.currentTime;
    this.presetFrameA = 1;
    this.presetDurationA = this.sampledPresetDuration();
  }

  StartSmoothing() {
    this.isSmoothing = true;
    this.presetTimeB = this.currentTime;
    this.presetFrameB = 1;
    this.presetDurationB = this.sampledPresetDuration();
  }

  EndSmoothing() {
    this.isSmoothing = false;
    this.presetTimeA = this.presetTimeB;
    this.presetFrameA = this.presetFrameB;
    this.presetDurationA = this.presetDurationB;
  }

  CanHardCut() {
    return this.currentTime - this.presetTimeA > 3;
  }

  SmoothRatio() {
    return (this.currentTime - this.presetTime) / this.smoothDuration;
  }

  IsSmoothing() {
    return this.isSmoothing;
  }

  GetRunningTime() {
    return this.currentTime;
  }

  PresetProgressA() {
    if (this.isSmoothing) return 1.0;
    else return (this.currentTime - this.presetTimeA) / this.presetDurationA;
  }

  PresetProgressB() {
    return (this.currentTime - this.presetTimeB) / this.presetDurationB;
  }

  PresetFrameB() {
    return this.presetFrameB;
  }

  PresetFrameA() {
    return this.presetFrameA;
  }

  sampledPresetDuration() {
    return 40;
    return Math.max(
      1,
      Math.min(60, RandomNumberGenerators.gaussian(this.presetDuration))
    );
  }

  static getTicks(start) {
    return new Date() - start;
  }

}

export { TimeKeeper };
