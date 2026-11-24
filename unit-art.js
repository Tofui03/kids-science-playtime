'use strict';
(() => {
  let k = 0;
  const P = (d, cls = '', extra = '') => `<path class="d ${cls}" pathLength="1" style="--k:${k++}" d="${d}" ${extra}/>`;
  const Tx = (x, y, s, size = 24, cls = '', anchor = 'start') => `<text class="t ${cls}" style="--k:${k++}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
  const C = (cx, cy, r, cls = '') => `<circle class="d ${cls}" pathLength="1" style="--k:${k++}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const reset = s => { k = 0; return s; };

  window.UNIT_ART = [
    reset(
      C(300, 84, 34) +
      C(288, 78, 5, 'a') +
      C(312, 78, 5, 'a') +
      P('M286 92 Q300 105 314 92', 'a') +
      P('M375 56 C392 44 410 56 410 74 C410 92 385 110 375 118 C365 110 340 92 340 74 C340 56 358 44 375 56 Z') +
      P('M445 114 L465 54 L485 114 M452 94 H478') +
      Tx(265, 152, '身体 · 五官 · 刷牙 · 眼睛', 20, 'a')
    ),
    reset(
      C(290, 90, 34) +
      P('M355 56 H415 V116 H355 Z') +
      P('M445 116 L485 48 L525 116 Z') +
      Tx(265, 152, '颜色 · 混色 · 形状 · 分类', 20, 'a')
    ),
  ];
})();
