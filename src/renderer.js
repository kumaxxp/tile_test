// renderer.js
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x0 = 0;
    this.y0 = 0;
    this.w = 64; // h = w/2
    this._anim = null;
  }

  setOrigin(x0, y0) {
    this.x0 = x0;
    this.y0 = y0;
  }

  setTileSize(w) {
    this.w = w;
  }

  get h() {
    return this.w / 2;
  }

  /**
   * 正変換（Grid → Pixel）
   * x = (u - v) * (w / 2) + x0
   * y = (u + v) * (h / 2) + y0 = (u + v) * (w / 4) + y0
   */
  toScreen(u, v) {
    const x = (u - v) * (this.w / 2) + this.x0;
    const y = (u + v) * (this.h / 2) + this.y0;
    return { x, y };
  }

  /**
   * 逆変換（Pixel → Grid）
   */
  toGrid(x, y) {
    const u = 0.5 * ((x - this.x0) / (this.w / 2) + (y - this.y0) / (this.h / 2));
    const v = 0.5 * ((y - this.y0) / (this.h / 2) - (x - this.x0) / (this.w / 2));
    return { u, v };
  }

  /**
   * 菱形タイルを描画
   * 頂点: 上(x, y-h/2), 右(x+w/2, y), 下(x, y+h/2), 左(x-w/2, y)
   */
  drawTile(u, v, style = { stroke: '#555', fill: null }) {
    const { x, y } = this.toScreen(u, v);
    const w2 = this.w / 2;
    const h2 = this.h / 2;
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.moveTo(x, y - h2);       // 上
    ctx.lineTo(x + w2, y);       // 右
    ctx.lineTo(x, y + h2);       // 下
    ctx.lineTo(x - w2, y);       // 左
    ctx.closePath();

    if (style.fill) {
      ctx.fillStyle = style.fill;
      ctx.fill();
    }
    ctx.strokeStyle = style.stroke;
    ctx.stroke();
  }

  /**
   * グリッド全体を描画
   * デフォルト描画範囲: u,v∈[0,9]（10×10）
   */
  drawGrid(range = { u: [0, 9], v: [0, 9] }, style) {
    for (let U = range.u[0]; U <= range.u[1]; U++) {
      for (let V = range.v[0]; V <= range.v[1]; V++) {
        this.drawTile(U, V, style);
      }
    }
  }

  start() {
    const step = () => {
      this.resizeToCanvasPixels();
      this.clear();
      this.drawGrid();
      this._anim = window.requestAnimationFrame(step);
    };
    if (!this._anim) {
      this._anim = window.requestAnimationFrame(step);
    }
  }

  stop() {
    if (this._anim) {
      cancelAnimationFrame(this._anim);
      this._anim = null;
    }
  }

  resizeToCanvasPixels() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const needW = Math.round(rect.width * dpr);
    const needH = Math.round(rect.height * dpr);
    if (this.canvas.width !== needW) {
      this.canvas.width = needW;
    }
    if (this.canvas.height !== needH) {
      this.canvas.height = needH;
    }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
