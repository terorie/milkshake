# milkshake

> A browser-based WebGL music visualizer based on Milkdrop / projectM

Live Demo: http://gattis.github.io/milkshake/

Copyright (C) 2011 Matt Gattis and contributors
http://github.com/gattis/milkshake

## Overview

milkshake is a broswer-based music visualizer implemented using WebGL
APIs available in the latest browsers.  It is a rendering engine which
takes in preset scripts and outputs visualizations that sync in various ways
with music.  The preset format comes from MilkDrop, which was a rendering 
engine built with DirectX as a WinAmp plug-in (Windows only).  projectM
is a reimplementation of MilkDrop using OpenGL 1.0.  milkshake is yet another
reimplementation using WebGL, which is a browser-based implementation of
OpenGL 2.0 ES.  The main difference in implementations, besides being 
written in javascript, is that WebGL (OpenGL ES 2.0) has no fixed function 
pipeline like OpenGL 1.0, so all of that functionality has to be emulated 
in programmable shaders.

milkshake is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.


## Installing

See [milkshake.html](milkshake.html) for an example installation.


## Presets

The presets are stored in Presets.js.  They are very similar to milkdrop presets, 
except they are formatted in JSON.  The convert_preset.py script is a handy tool to
convert your favority mildrop presets.  Most milkdrop presets are now working, and I've
included a nice set of working ones already in Presets.js.


## Audio

By default, the SoundCloud API is used to provide music using the 
SoundCloudAudio.js backend, which depends on Flash.  The other backend
available is HTML5Audio.js, which can play MP3 encoded audio in Chrome
and Ogg Vorbis encoded audio in Firefox.  More backends will be added 
in the future.  A brief status of future backends:
    Rdio: Music is available via their Web playback API, but raw data is only frequency-domain.
    Spotify: No browser-based API available yet (?)
    Local uploads:  Available via the new File API. In development.


## Credit

 - Ryan Geiss - The creator of MilkDrop - http://www.geisswerks.com/about_milkdrop.html
 - projectM - OpenGL reimplementation of MilkDrop - http://projectm.sourceforge.net/
