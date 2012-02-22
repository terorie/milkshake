all: src/milkshake.js src/Class.js src/Shaker.js src/Music.js src/SoundCloudAudio.js src/Renderer.js src/Renderable.js src/RenderItemMatcher.js src 
		python merge-includes.py src/milkshake.js > out/milkshake.js
