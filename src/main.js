// main.js
import { Renderer } from './renderer.js';

function init() {
  const canvas = document.getElementById('canvas');
  const r = new Renderer(canvas);
  const rect = canvas.getBoundingClientRect();
  r.setOrigin(rect.width / 2, rect.height / 4);
  r.setTileSize(64);
  r.start();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
