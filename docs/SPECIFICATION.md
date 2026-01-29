# 作戦命令書 (Operational Specification) — TILE TEST Canvas Renderer

Project: tile_test  
Version: 1.1  
Date: 2026-01-30  
Author: 方面軍参謀長 (Cline)  
Approved by: 参謀総長 (Gemini)

---

## 1. Architecture

- HTML5 Canvas + Vanilla JS（ES Modules）
- 単一ページ（src/index.html）に canvas を1枚配置
- Renderer クラスが requestAnimationFrame で描画ループを管理
- 状態は原点 $O=(x_0,y_0)$ とタイル寸法 $w,\ h=\frac{w}{2}$ のみ
- マップは $10\times10$ の平坦グリッド（高度0）
- 出力要件: src/index.html および src/renderer.js を必須とし、src/main.js はエントリーポイントとして使用可（機能追加なし）
- 外部ライブラリ不使用。カメラ・ズーム・入力等は不採用（YAGNI）

---

## 2. Coordinate System

### 2.1 定義

- タイル形状: 菱形（ダイヤ）。幅 $w$、高さ $h=\frac{w}{2}$（$2:1$ 比率厳守）
- グリッド座標: $(u,v)\in\mathbb{Z}^2$（GHQ 記法の $(x,y)$ に一致）
- スクリーン座標: $(x,y)\in\mathbb{R}^2$（Canvas ピクセル）
- 原点: $O=(x_0,y_0)$

### 2.2 正変換（Grid → Pixel）

$$
x=(u-v)\cdot\frac{w}{2}+x_0
$$

$$
y=(u+v)\cdot\frac{h}{2}+y_0
$$

$h=\frac{w}{2}$ より

$$
y=(u+v)\cdot\frac{w}{4}+y_0
$$

### 2.3 逆変換（Pixel → Grid）

$$
u=\frac{1}{2}\left(\frac{x-x_0}{w/2}+\frac{y-y_0}{h/2}\right),\quad
v=\frac{1}{2}\left(\frac{y-y_0}{h/2}-\frac{x-x_0}{w/2}\right)
$$

$h=\frac{w}{2}$ より

$$
u=\frac{1}{2}\left(\frac{2(x-x_0)}{w}+\frac{4(y-y_0)}{w}\right),\quad
v=\frac{1}{2}\left(\frac{4(y-y_0)}{w}-\frac{2(x-x_0)}{w}\right)
$$

### 2.4 ラウンドトリップ要件

- $(u,v)\rightarrow(x,y)\rightarrow(u',v')$ で $u'=u,\ v'=v$ を満たすこと
- 丸め規約は GHQ DoD に準拠（現時点: 暫定で最近傍整数に丸め、GHQ 承認待ち）

---

## 3. Implementation Plan

### 3.1 src/index.html

- 単一の canvas（id="canvas"）を配置。親コンテナにフィット

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <title>tile_test</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
      html,body { height: 100%; margin: 0; }
      #canvas { width: 100%; height: 100%; display: block; }
    </style>
  </head>
  <body>
    <canvas id="canvas"></canvas>
    <script type="module" src="../src/main.js"></script>
  </body>
</html>
```

### 3.2 src/renderer.js

- 座標変換と描画ループを持つクラス設計
- デフォルト描画範囲: $u,v\in[0,9]$（$10\times10$）
- 原点オフセット $O$ は画面中央へ配置するよう設定

```javascript
// renderer.js
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x0 = 0; this.y0 = 0;
    this.w = 64; // h = w/2
    this._anim = null;
  }
  setOrigin(x0, y0) { this.x0 = x0; this.y0 = y0; }
  setTileSize(w) { this.w = w; }
  get h() { return this.w / 2; }

  toScreen(u, v) {
    const x = (u - v) * (this.w / 2) + this.x0;
    const y = (u + v) * (this.h / 2) + this.y0; // = (u+v)*(w/4)+y0
    return { x, y };
  }
  toGrid(x, y) {
    const u = 0.5 * ((x - this.x0) / (this.w / 2) + (y - this.y0) / (this.h / 2));
    const v = 0.5 * ((y - this.y0) / (this.h / 2) - (x - this.x0) / (this.w / 2));
    return { u, v };
  }

  drawTile(u, v, style = { stroke: '#555', fill: null }) {
    const { x, y } = this.toScreen(u, v);
    const w2 = this.w / 2, h2 = this.h / 2;
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x, y - h2);
    ctx.lineTo(x + w2, y);
    ctx.lineTo(x, y + h2);
    ctx.lineTo(x - w2, y);
    ctx.closePath();
    if (style.fill) { ctx.fillStyle = style.fill; ctx.fill(); }
    ctx.strokeStyle = style.stroke; ctx.stroke();
  }

  drawGrid(range = { u: [-5, 5], v: [-5, 5] }, style) {
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
    if (!this._anim) this._anim = window.requestAnimationFrame(step);
  }
  stop() { if (this._anim) { cancelAnimationFrame(this._anim); this._anim = null; } }

  resizeToCanvasPixels() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const needW = Math.round(rect.width * dpr);
    const needH = Math.round(rect.height * dpr);
    if (this.canvas.width !== needW) this.canvas.width = needW;
    if (this.canvas.height !== needH) this.canvas.height = needH;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
```

- 内部状態は原点・タイル寸法のみ。カメラ・ズーム・入力なし

### 3.3 src/main.js

- エントリーポイント。Canvas を取得し Renderer を初期化

```javascript
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
```

---

## 4. Acceptance Criteria（DoD）

- AC-1: ブラウザで 100 枚のタイルが整然と菱形に並ぶこと（$10\times10$）
- AC-2: 標準 Isometric 配置。$(0,0)$ が最上部、$(9,9)$ が最下部
- AC-3: スクリーン中央に表示されるようオフセット $O$ が適用されている
- AC-4: コンソールにエラーが一切出ない
- AC-5: タイル比率 $2:1$ を厳守し、歪みや重なりがない

---

## 5. 禁止事項（Policy）

- 大本営公文書に未記載の機能（カメラ、ズーム、パン、クリック操作、地形編集、過剰アニメーション等）
- 外部ライブラリ導入
- 仕様にない設定項目・モード追加
- YAGNI 原則に反する拡張

---

## 6. 前提・未確定事項とエスカレーション

- GHQ 戦略文書（docs/strategy/01_TILE_TEST_STRATEGY.md）は補完・承認済み
- 本作戦の DoD は GHQ 文書に準拠（100 タイル整然・エラーなし・標準 Isometric 配置）
- 逆変換・丸め規約は本作戦の範囲外（視覚検証が主目的）。必要時は別作戦で具申

---

## 7. 変更履歴

| 版 | 日付 | 変更者 | 変更内容 |
|:---|:-----|:-------|:---------|
| 1.0 | 2025-01-30 | 情報参謀 | テンプレート配備（電撃設営） |
| 1.1 | 2026-01-30 | 方面軍参謀長 | Architecture/Coordinate/Implementation/AC/禁止事項 を確定、GHQ 文書欠落のエスカレーション追記 |

---

## 8. 承認

| 役職 | 担当 | 承認日 | 署名 |
|:-----|:-----|:-------|:-----|
| 参謀総長 | Gemini | - | _____ |
| 幕僚長 | User | - | _____ |

---

（本仕様書は AGSP v2.4 に準拠。GHQ 戦略の提示後、DoD 項目を最終確定する）