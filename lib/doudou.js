/* doudou.js — 小探险家豆豆（全书统一绘本级主角）
   设计原则：全部使用有机贝塞尔曲线、温润栗棕色描边（#5a3b2c）与柔和明暗渐变，
   彻底告别“圆形+长方形”几何拼凑感；每个身体/脸部部位都有独立语义 data-part 分组，
   支持 Unit 1-6 听音点部位、换瞳色、7 种表情、光脚/穿鞋、戴帽/摘帽与手持道具。 */
'use strict';

(() => {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const INK = '#5a3b2c';

  const EYE_PRESETS = {
    brown: { dark: '#4a2918', mid: '#7c4828', light: '#b87646' },
    blue:  { dark: '#1e4e8c', mid: '#3b82d6', light: '#85c4ff' },
    green: { dark: '#1f5e3b', mid: '#3a9b63', light: '#84dca3' },
    hazel: { dark: '#5b4a1e', mid: '#8e7430', light: '#cbb05e' },
  };

  function el(tag, attrs = {}, parent = null) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v !== undefined && v !== null) node.setAttribute(k, String(v));
    }
    if (parent) parent.appendChild(node);
    return node;
  }

  function ensureDefs(node) {
    const svg = node.ownerSVGElement || (node.tagName?.toLowerCase() === 'svg' ? node : null);
    if (!svg || svg.querySelector('#dd-skin')) return;
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = el('defs', {});
      svg.insertBefore(defs, svg.firstChild);
    }
    defs.insertAdjacentHTML('beforeend', `
      <radialGradient id="dd-skin" cx="42%" cy="35%" r="68%">
        <stop offset="0%" stop-color="#ffebd9"/>
        <stop offset="68%" stop-color="#ffd5b6"/>
        <stop offset="100%" stop-color="#f2ba94"/>
      </radialGradient>
      <linearGradient id="dd-skin-shade" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#e3a47d"/>
        <stop offset="100%" stop-color="#f7c8a6"/>
      </linearGradient>
      <linearGradient id="dd-hair" x1="25%" y1="0%" x2="75%" y2="100%">
        <stop offset="0%" stop-color="#76472d"/>
        <stop offset="55%" stop-color="#53301d"/>
        <stop offset="100%" stop-color="#3c2113"/>
      </linearGradient>
      <linearGradient id="dd-shirt" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fffaf0"/>
        <stop offset="100%" stop-color="#ffe7aa"/>
      </linearGradient>
      <linearGradient id="dd-overalls" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#5b8ec2"/>
        <stop offset="60%" stop-color="#4575a8"/>
        <stop offset="100%" stop-color="#355d89"/>
      </linearGradient>
      <linearGradient id="dd-overalls-cuff" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#73a4d4"/>
        <stop offset="100%" stop-color="#4e7eb0"/>
      </linearGradient>
      <linearGradient id="dd-scarf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff7a66"/>
        <stop offset="100%" stop-color="#e34d3d"/>
      </linearGradient>
      <linearGradient id="dd-hat" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color="#f7da9c"/>
        <stop offset="65%" stop-color="#e5bc6f"/>
        <stop offset="100%" stop-color="#cfa04d"/>
      </linearGradient>
      <linearGradient id="dd-shoe" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ff6b6b"/>
        <stop offset="100%" stop-color="#d64247"/>
      </linearGradient>
      <radialGradient id="dd-cheek" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ff7e95" stop-opacity="0.62"/>
        <stop offset="65%" stop-color="#ff93a6" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#ff93a6" stop-opacity="0"/>
      </radialGradient>
      <filter id="dd-soft-shadow" x="-15%" y="-12%" width="130%" height="135%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.6" flood-color="#5a3b2c" flood-opacity="0.14"/>
      </filter>
    `);
  }

  function buildHand(parent, side = 1) {
    const g = el('g', { 'data-part': 'hand', transform: side < 0 ? 'scale(-1, 1)' : '' }, parent);
    const fingers = el('g', { 'data-part': 'finger' }, g);
    el('path', {
      d: 'M-8,-1 C-12,3 -14,9 -12,15 C-11,18 -7,18 -6,15 C-5,19 -2,23 1,22 C3,24 7,23 8,19 C10,21 14,19 13,14 C15,14 17,11 15,7 C13,2 10,-2 6,-3 Z',
      fill: 'url(#dd-skin)', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round', 'stroke-linecap': 'round',
    }, fingers);
    el('path', { d: 'M-6,12 L-5,15 M0,14 L1,20 M6,13 L7,18 M11,10 L13,14', stroke: '#d69974', 'stroke-width': 1.5, 'stroke-linecap': 'round', fill: 'none' }, fingers);
    return g;
  }

  function buildProp(parent, prop) {
    if (!prop) return null;
    const g = el('g', { 'data-part': `prop-${prop}` }, parent);
    if (prop === 'magnifier') {
      const wrap = el('g', { transform: 'translate(-2, 12) rotate(-28)' }, g);
      el('path', { d: 'M-4,0 L-5,34 C-5,39 5,39 5,34 L4,0 Z', fill: '#d98a4e', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round' }, wrap);
      el('path', { d: 'M-5,0 L5,0 L5,-10 L-5,-10 Z', fill: '#ffd15c', stroke: INK, 'stroke-width': 2.5 }, wrap);
      el('circle', { cx: 0, cy: -38, r: 28, fill: '#3d7ea6', stroke: INK, 'stroke-width': 3 }, wrap);
      el('circle', { cx: 0, cy: -38, r: 21, fill: '#d8f3ff', stroke: INK, 'stroke-width': 2.2 }, wrap);
      el('path', { d: 'M-12,-48 C-6,-55 5,-55 11,-48', fill: 'none', stroke: '#ffffff', 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: 0.85 }, wrap);
      el('circle', { cx: -11, cy: -36, r: 2.5, fill: '#ffffff', opacity: 0.8 }, wrap);
    } else if (prop === 'toothbrush') {
      const wrap = el('g', { transform: 'translate(0, 8) rotate(-40)' }, g);
      el('path', { d: 'M-4,18 C-4,8 -3,-36 -2,-46 C-1,-52 4,-52 4,-46 L4,18 C4,23 -4,23 -4,18 Z', fill: '#64dfdf', stroke: INK, 'stroke-width': 2.6 }, wrap);
      el('path', { d: 'M3,-45 L14,-45 C17,-45 17,-31 14,-31 L3,-31 Z', fill: '#ffffff', stroke: INK, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, wrap);
      el('path', { d: 'M6,-41 L12,-41 M6,-36 L12,-36', stroke: '#90e0ef', 'stroke-width': 1.8, 'stroke-linecap': 'round' }, wrap);
      el('path', { d: 'M12,-45 C14,-51 9,-53 7,-49 C5,-47 8,-45 12,-45 Z', fill: '#ff7aa2', stroke: INK, 'stroke-width': 1.8 }, wrap);
    } else if (prop === 'badge') {
      const wrap = el('g', { transform: 'translate(2, 26)' }, g);
      el('path', { d: 'M-6,-22 L0,-14 L6,-22', fill: 'none', stroke: '#e34d3d', 'stroke-width': 4, 'stroke-linecap': 'round' }, wrap);
      el('circle', { cx: 0, cy: 0, r: 17, fill: '#ffd93d', stroke: INK, 'stroke-width': 2.8 }, wrap);
      el('polygon', { points: '0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3', fill: '#fff8d6', stroke: '#b87b14', 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, wrap);
    }
    return g;
  }

  function buildArm(parent, side, prop = null) {
    const sx = side * 35, sy = -26;
    const g = el('g', { 'data-part': 'arm', 'data-side': side < 0 ? 'L' : 'R', transform: `translate(${sx}, ${sy})` }, parent);
    const rotG = el('g', {}, g);

    const armPath = side < 0
      ? 'M3,-4 C-8,12 -14,34 -14,56 C-14,61 -4,61 -2,56 C0,36 6,16 12,2 Z'
      : 'M-3,-4 C8,12 14,34 14,56 C14,61 4,61 2,56 C0,36 -6,16 -12,2 Z';
    el('path', { d: armPath, fill: 'url(#dd-skin)', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round' }, rotG);

    const sleevePath = side < 0
      ? 'M6,-8 C-4,-8 -13,0 -15,15 C-11,19 -2,21 6,18 C11,12 12,-2 6,-8 Z'
      : 'M-6,-8 C4,-8 13,0 15,15 C11,19 2,21 -6,18 C-11,12 -12,-2 -6,-8 Z';
    el('path', { d: sleevePath, fill: 'url(#dd-shirt)', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round' }, rotG);

    const wrist = el('g', { transform: `translate(${side * 9}, 57)` }, rotG);
    if (prop) buildProp(wrist, prop);
    buildHand(wrist, side);

    return { root: g, rotG, wrist };
  }

  function buildLegAndFoot(parent, side) {
    const lx = side * 19;
    const legG = el('g', { 'data-part': 'leg', 'data-side': side < 0 ? 'L' : 'R' }, parent);

    const dLeg = side < 0
      ? 'M-30,68 C-30,88 -28,112 -25,134 L-11,134 C-9,112 -7,88 -7,68 Z'
      : 'M7,68 C7,88 9,112 11,134 L25,134 C28,112 30,88 30,68 Z';
    el('path', { d: dLeg, fill: 'url(#dd-skin)', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round' }, legG);

    const knee = el('g', { 'data-part': 'knee' }, legG);
    el('ellipse', { cx: lx, cy: 96, rx: 11, ry: 9, fill: 'transparent' }, knee);
    el('path', {
      d: `M${lx - 5},95 Q${lx},99 ${lx + 5},95`,
      fill: 'none', stroke: '#dc9f7a', 'stroke-width': 2, 'stroke-linecap': 'round',
    }, knee);

    // Sneakers
    const footSneaker = el('g', { 'data-part': 'foot', 'data-footwear': 'sneaker' }, legG);
    el('path', {
      d: `M${lx - 8},125 Q${lx},129 ${lx + 8},125 L${lx + 9},138 L${lx - 9},138 Z`,
      fill: '#ffffff', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round',
    }, footSneaker);
    const shoeD = side < 0
      ? `M${lx - 11},135 C${lx - 21},137 ${lx - 27},146 ${lx - 25},154 L${lx + 11},154 C${lx + 13},145 ${lx + 10},135 ${lx + 8},135 Q${lx},140 ${lx - 11},135 Z`
      : `M${lx - 8},135 C${lx - 10},135 ${lx - 13},145 ${lx - 11},154 L${lx + 25},154 C${lx + 27},146 ${lx + 21},137 ${lx + 11},135 Q${lx},140 ${lx - 8},135 Z`;
    el('path', { d: shoeD, fill: 'url(#dd-shoe)', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round' }, footSneaker);
    const toeCap = side < 0
      ? `M${lx - 16},141 C${lx - 24},143 ${lx - 26},149 ${lx - 24},153 L${lx - 12},153 C${lx - 11},147 ${lx - 13},143 ${lx - 16},141 Z`
      : `M${lx + 16},141 C${lx + 24},143 ${lx + 26},149 ${lx + 24},153 L${lx + 12},153 C${lx + 11},147 ${lx + 13},143 ${lx + 16},141 Z`;
    el('path', { d: toeCap, fill: '#fff8ec', stroke: INK, 'stroke-width': 2.2 }, footSneaker);
    const soleX = side < 0 ? lx - 26 : lx - 12;
    el('rect', { x: soleX, y: 151, width: 38, height: 7.5, rx: 4, fill: '#fff8ec', stroke: INK, 'stroke-width': 2.6 }, footSneaker);
    el('path', {
      d: `M${lx - 4},140 L${lx + 4},143 M${lx - 5},145 L${lx + 4},147`,
      stroke: '#fff8ec', 'stroke-width': 2.2, 'stroke-linecap': 'round',
    }, footSneaker);

    // Bare feet with 5 distinct rounded toes
    const footBare = el('g', { 'data-part': 'foot', 'data-footwear': 'bare', display: 'none' }, legG);
    const bareD = side < 0
      ? `M${lx - 7},133 C${lx - 11},140 ${lx - 23},147 ${lx - 22},154 C${lx - 21},159 -${3 - lx * 0},159 ${lx + 8},157 C${lx + 11},153 ${lx + 9},140 ${lx + 7},133 Z`
      : `M${lx - 7},133 C${lx - 9},140 ${lx - 11},153 ${lx - 8},157 C${lx + 3},159 ${lx + 21},159 ${lx + 22},154 C${lx + 23},147 ${lx + 11},140 ${lx + 7},133 Z`;
    el('path', { d: bareD, fill: 'url(#dd-skin)', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round' }, footBare);
    const toesG = el('g', { 'data-part': 'toe' }, footBare);
    const toeOffsets = [
      { dx: -20, dy: 153, r: 3.1 },
      { dx: -15, dy: 156, r: 2.9 },
      { dx: -9.5, dy: 157.5, r: 2.8 },
      { dx: -4, dy: 157.5, r: 2.7 },
      { dx: 1.5, dy: 156, r: 2.6 },
    ];
    toeOffsets.forEach(({ dx, dy, r }) => {
      const tx = lx + (side < 0 ? dx : -dx);
      el('circle', { cx: tx, cy: dy, r, fill: 'url(#dd-skin)', stroke: INK, 'stroke-width': 2.1 }, toesG);
    });

    return { legG, knee, footSneaker, footBare };
  }

  function buildEye(parent, side, presetName) {
    // Head pivot is at (0, -40); eyes sit at y = -46 in head coords (= -86 in root)
    const cx = side * 22, cy = -46;
    const preset = EYE_PRESETS[presetName] || EYE_PRESETS.brown;
    const g = el('g', { 'data-part': 'eye', 'data-side': side < 0 ? 'L' : 'R', transform: `translate(${cx}, ${cy})` }, parent);

    const openG = el('g', { class: 'dd-eye-open' }, g);
    el('ellipse', { cx: 0, cy: 0, rx: 12.2, ry: 14.2, fill: '#fffdf9', stroke: INK, 'stroke-width': 2.2 }, openG);
    el('path', { d: 'M-11,-5 C-6,-13 6,-13 11,-5 C6,-9 -6,-9 -11,-5 Z', fill: '#e5ddd5' }, openG);

    const ix = side * -1.2, iy = 0.8;
    const irisOuter = el('circle', { cx: ix, cy: iy, r: 8.6, fill: preset.mid }, openG);
    const irisUpper = el('path', {
      d: `M${ix - 8.4},${iy - 0.5} A8.5,8.5 0 0 1 ${ix + 8.4},${iy - 0.5} Q${ix},${iy - 2.5} ${ix - 8.4},${iy - 0.5} Z`,
      fill: preset.dark,
    }, openG);
    const irisGlow = el('path', {
      d: `M${ix - 6.2},${iy + 2.4} A7,7 0 0 0 ${ix + 6.2},${iy + 2.4} Q${ix},${iy + 5.6} ${ix - 6.2},${iy + 2.4} Z`,
      fill: preset.light, opacity: 0.85,
    }, openG);
    el('circle', { cx: ix, cy: iy, r: 4.5, fill: '#22150e' }, openG);
    el('circle', { cx: ix - 3.0, cy: iy - 3.6, r: 2.9, fill: '#ffffff' }, openG);
    el('circle', { cx: ix + 2.6, cy: iy + 3.2, r: 1.3, fill: '#ffffff' }, openG);

    const lashD = side < 0
      ? 'M-14.5,-2.5 C-10,-15 9,-15.5 13,-4'
      : 'M-13,-4 C-9,-15.5 10,-15 14.5,-2.5';
    el('path', { d: lashD, fill: 'none', stroke: '#3d2214', 'stroke-width': 3.6, 'stroke-linecap': 'round' }, openG);

    const closedG = el('g', { class: 'dd-eye-closed', display: 'none' }, g);
    el('path', { d: 'M-12,0 Q0,-8 12,0', fill: 'none', stroke: '#3d2214', 'stroke-width': 3.4, 'stroke-linecap': 'round' }, closedG);

    const squintG = el('g', { class: 'dd-eye-squint', display: 'none' }, g);
    const sqD = side < 0 ? 'M-9,-7 L7,0 L-9,7' : 'M9,-7 L-7,0 L9,7';
    el('path', { d: sqD, fill: 'none', stroke: '#3d2214', 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, squintG);

    return {
      g, openG, closedG, squintG,
      setColor(name) {
        const c = EYE_PRESETS[name] || EYE_PRESETS.brown;
        irisOuter.setAttribute('fill', c.mid);
        irisUpper.setAttribute('fill', c.dark);
        irisGlow.setAttribute('fill', c.light);
      },
      setMode(mode) {
        openG.setAttribute('display', mode === 'open' ? '' : 'none');
        closedG.setAttribute('display', mode === 'closed' ? '' : 'none');
        squintG.setAttribute('display', mode === 'squint' ? '' : 'none');
      },
    };
  }

  function buildMouths(parent) {
    // Mouth sits at y = -16 in head coords (= -56 in root)
    const g = el('g', { 'data-part': 'mouth', transform: 'translate(0, -16)' }, parent);
    const variants = {};

    variants.happy = el('g', {}, g);
    el('path', { d: 'M-13,-2 C-8,11 8,11 13,-2 C7,2 -7,2 -13,-2 Z', fill: '#c94a4a', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, variants.happy);
    el('path', { d: 'M-6,4 Q0,9 6,4 Q0,2 -6,4 Z', fill: '#ff8ea1' }, variants.happy);

    variants.open = el('g', { display: 'none' }, g);
    el('path', { d: 'M-11,-3 C-10,12 10,12 11,-3 C5,-5 -5,-5 -11,-3 Z', fill: '#a9343b', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, variants.open);
    el('ellipse', { cx: 0, cy: 4.5, rx: 6, ry: 3.2, fill: '#ff8ea1' }, variants.open);

    variants.teeth = el('g', { 'data-part': 'teeth', display: 'none' }, g);
    el('path', { d: 'M-17,-4 C-15,12 15,12 17,-4 C8,-6 -8,-6 -17,-4 Z', fill: '#b83c42', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, variants.teeth);
    el('path', { d: 'M-14,-3 C-6,-4 6,-4 14,-3 L13,1.5 C5,2 -5,2 -13,1.5 Z', fill: '#ffffff' }, variants.teeth);
    el('path', { d: 'M-11,4 C-4,4.5 4,4.5 11,4 L10,8 C4,9.5 -4,9.5 -10,8 Z', fill: '#ffffff' }, variants.teeth);
    el('path', { d: 'M-14,-3 C-6,-4 6,-4 14,-3', fill: 'none', stroke: INK, 'stroke-width': 1.4 }, variants.teeth);

    variants.amazed = el('g', { display: 'none' }, g);
    el('ellipse', { cx: 0, cy: 2, rx: 7.5, ry: 9.5, fill: '#a9343b', stroke: INK, 'stroke-width': 2.5 }, variants.amazed);
    el('ellipse', { cx: 0, cy: 6.5, rx: 4.5, ry: 3, fill: '#ff8ea1' }, variants.amazed);

    variants.curious = el('g', { display: 'none' }, g);
    el('path', { d: 'M-10,2 Q-1,4 10,-3', fill: 'none', stroke: INK, 'stroke-width': 3.0, 'stroke-linecap': 'round' }, variants.curious);

    variants.sour = el('g', { display: 'none' }, g);
    el('path', { d: 'M-13,-1 Q-6,6 0,-1 Q6,6 13,-1', fill: 'none', stroke: INK, 'stroke-width': 3.0, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, variants.sour);

    variants.yuck = el('g', { display: 'none' }, g);
    el('path', { d: 'M-14,0 Q0,-6 14,0', fill: 'none', stroke: INK, 'stroke-width': 2.8, 'stroke-linecap': 'round' }, variants.yuck);
    el('path', { d: 'M-5,-2 C-6,12 6,12 5,-2 Z', fill: '#ff7d93', stroke: INK, 'stroke-width': 2.3 }, variants.yuck);
    el('path', { d: 'M0,-1 L0,6', stroke: '#d65269', 'stroke-width': 1.5, 'stroke-linecap': 'round' }, variants.yuck);

    return {
      g, variants,
      set(name) {
        const target = variants[name] ? name : 'happy';
        for (const [k, node] of Object.entries(variants)) {
          node.setAttribute('display', k === target ? '' : 'none');
        }
      },
    };
  }

  function create(parent, opts = {}) {
    const {
      x = 0, y = 0, s = 1,
      hat = true, scarf = true, barefoot = false,
      prop = null, propSide = 'L',
      eyeColor = 'brown', expr = 'happy',
      headR = 0, armL: initArmL = 12, armR: initArmR = -12,
    } = opts;

    ensureDefs(parent);
    const g = el('g', {
      'data-doudou': '1',
      transform: `translate(${x}, ${y}) scale(${s})`,
    }, parent);

    const shadow = el('ellipse', { cx: 0, cy: 158, rx: 56, ry: 11, fill: 'rgba(90, 59, 44, 0.14)' }, g);
    const bodyG = el('g', { filter: 'url(#dd-soft-shadow)' }, g);

    // Legs & feet
    const legL = buildLegAndFoot(bodyG, -1);
    const legR = buildLegAndFoot(bodyG, 1);

    // Torso: cream raglan tee + denim-teal overalls
    const torsoG = el('g', { 'data-part': 'torso' }, bodyG);
    const shirtG = el('g', { 'data-part': 'shoulder' }, torsoG);
    el('path', {
      d: 'M-15,-34 C-29,-34 -37,-25 -38,-14 L-33,36 C-20,42 20,42 33,36 L38,-14 C37,-25 29,-34 15,-34 Z',
      fill: 'url(#dd-shirt)', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round',
    }, shirtG);
    el('path', { d: 'M-34,4 Q0,11 34,4 M-33,18 Q0,25 33,18', fill: 'none', stroke: '#ffd085', 'stroke-width': 4.2, 'stroke-linecap': 'round' }, shirtG);

    const overallsG = el('g', {}, torsoG);
    el('path', {
      d: 'M-26,-11 Q0,-16 26,-11 L32,20 C37,38 38,54 34,70 Q18,75 4,71 L0,50 L-4,71 Q-18,75 -34,70 C-38,54 -37,38 -32,20 Z',
      fill: 'url(#dd-overalls)', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round',
    }, overallsG);
    el('path', { d: 'M-35,64 Q-19,69 -4,65 L-3,73 Q-19,77 -35,72 Z', fill: 'url(#dd-overalls-cuff)', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, overallsG);
    el('path', { d: 'M4,65 Q19,69 35,64 L35,72 Q19,77 3,73 Z', fill: 'url(#dd-overalls-cuff)', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, overallsG);
    el('path', { d: 'M-24,-33 C-26,-23 -25,-15 -22,-8 L-13,-9 C-15,-17 -16,-24 -15,-33 Z', fill: 'url(#dd-overalls)', stroke: INK, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, overallsG);
    el('path', { d: 'M24,-33 C26,-23 25,-15 22,-8 L13,-9 C15,-17 16,-24 15,-33 Z', fill: 'url(#dd-overalls)', stroke: INK, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, overallsG);
    el('circle', { cx: -18, cy: -8, r: 4.2, fill: '#ffd15c', stroke: '#9c6d1b', 'stroke-width': 1.8 }, overallsG);
    el('circle', { cx: 18, cy: -8, r: 4.2, fill: '#ffd15c', stroke: '#9c6d1b', 'stroke-width': 1.8 }, overallsG);
    el('path', { d: 'M-14,6 Q0,10 14,6 L12,26 C8,34 -8,34 -12,26 Z', fill: '#4f82b8', stroke: INK, 'stroke-width': 2.3, 'stroke-linejoin': 'round' }, overallsG);
    el('path', { d: 'M-11,10 Q0,13 11,10', fill: 'none', stroke: '#9fc5eb', 'stroke-width': 1.4, 'stroke-dasharray': '3 3' }, overallsG);
    el('polygon', { points: '0,14 2,19 7,19 3,22 4.5,27 0,24 -4.5,27 -3,22 -7,19 -2,19', fill: '#ffd93d', stroke: '#9c6d1b', 'stroke-width': 1.1, 'stroke-linejoin': 'round' }, overallsG);

    // Arms
    const armL = buildArm(bodyG, -1, propSide === 'L' ? prop : null);
    const armR = buildArm(bodyG, 1, propSide === 'R' ? prop : null);

    // Neck (joins smoothly from y=-44 into chin at y=-36)
    const neckG = el('g', { 'data-part': 'neck' }, bodyG);
    el('path', {
      d: 'M-11,-46 C-11,-36 -12,-30 -15,-27 Q0,-20 15,-27 C12,-30 11,-36 11,-46 Z',
      fill: 'url(#dd-skin-shade)', stroke: INK, 'stroke-width': 2.5,
    }, neckG);

    // Explorer coral neckerchief
    const scarfG = el('g', { 'data-part': 'scarf', display: scarf ? '' : 'none' }, bodyG);
    const scarfTails = el('g', { transform: 'translate(16, -24)' }, scarfG);
    el('path', { d: 'M0,0 C11,-2 23,4 28,15 C20,18 11,15 3,8 Z', fill: 'url(#dd-scarf)', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, scarfTails);
    el('path', { d: 'M-2,2 C5,12 10,22 5,30 C-1,29 -6,20 -5,7 Z', fill: 'url(#dd-scarf)', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, scarfTails);
    el('path', {
      d: 'M-18,-31 C-10,-22 10,-22 18,-31 C19,-25 14,-16 0,-15 C-14,-16 -19,-25 -18,-31 Z',
      fill: 'url(#dd-scarf)', stroke: INK, 'stroke-width': 2.6, 'stroke-linejoin': 'round',
    }, scarfG);
    el('circle', { cx: 14, cy: -22, r: 5.5, fill: '#ff6f59', stroke: INK, 'stroke-width': 2.4 }, scarfG);
    el('circle', { cx: -7, cy: -21, r: 2, fill: '#fff5ee', opacity: 0.9 }, scarfG);
    el('circle', { cx: 4, cy: -20, r: 1.8, fill: '#fff5ee', opacity: 0.9 }, scarfG);

    // Head pivoting at neck joint (0, -40); chin sits snugly at y = +3 (= -37 root)
    const headPivot = el('g', { 'data-part': 'head', transform: 'translate(0, -40)' }, bodyG);
    const headG = el('g', {}, headPivot);

    // Back hair tufts
    const hairBack = el('g', { 'data-part': 'hair' }, headG);
    el('path', {
      d: 'M-58,-28 C-68,-52 -62,-88 -36,-106 C-16,-119 16,-119 36,-106 C62,-88 68,-52 58,-28 C53,-18 46,-14 40,-14 L-40,-14 C-46,-14 -53,-18 -58,-28 Z',
      fill: 'url(#dd-hair)', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round',
    }, hairBack);

    // Ears
    const earL = el('g', { 'data-part': 'ear', 'data-side': 'L' }, headG);
    el('path', { d: 'M-54,-52 C-68,-55 -70,-32 -56,-28 C-51,-27 -49,-34 -50,-44 Z', fill: 'url(#dd-skin)', stroke: INK, 'stroke-width': 2.8 }, earL);
    el('path', { d: 'M-58,-45 C-62,-44 -62,-35 -56,-34', fill: 'none', stroke: '#cf8f6b', 'stroke-width': 2, 'stroke-linecap': 'round' }, earL);

    const earR = el('g', { 'data-part': 'ear', 'data-side': 'R' }, headG);
    el('path', { d: 'M54,-52 C68,-55 70,-32 56,-28 C51,-27 49,-34 50,-44 Z', fill: 'url(#dd-skin)', stroke: INK, 'stroke-width': 2.8 }, earR);
    el('path', { d: 'M58,-45 C62,-44 62,-35 56,-34', fill: 'none', stroke: '#cf8f6b', 'stroke-width': 2, 'stroke-linecap': 'round' }, earR);

    // Sculpted pear-cheeked organic face (chin at y = +2 -> overlaps neck cleanly)
    el('path', {
      d: 'M-56,-54 C-58,-86 -35,-108 0,-108 C35,-108 58,-86 56,-54 C60,-28 48,-7 24,0 C10,4 -10,4 -24,0 C-48,-7 -60,-28 -56,-54 Z',
      fill: 'url(#dd-skin)', stroke: INK, 'stroke-width': 2.9, 'stroke-linejoin': 'round',
    }, headG);

    const forehead = el('ellipse', { 'data-part': 'forehead', cx: 0, cy: -75, rx: 32, ry: 11, fill: 'transparent' }, headG);

    const cheekL = el('g', { 'data-part': 'cheek', 'data-side': 'L' }, headG);
    el('ellipse', { cx: -35, cy: -28, rx: 14, ry: 8.5, fill: 'url(#dd-cheek)' }, cheekL);
    el('path', { d: 'M-38,-30 L-35,-26 M-32,-30 L-29,-26', stroke: '#ffffff', 'stroke-width': 1.5, 'stroke-linecap': 'round', opacity: 0.65 }, cheekL);

    const cheekR = el('g', { 'data-part': 'cheek', 'data-side': 'R' }, headG);
    el('ellipse', { cx: 35, cy: -28, rx: 14, ry: 8.5, fill: 'url(#dd-cheek)' }, cheekR);
    el('path', { d: 'M32,-30 L35,-26 M38,-30 L41,-26', stroke: '#ffffff', 'stroke-width': 1.5, 'stroke-linecap': 'round', opacity: 0.65 }, cheekR);

    const eyeL = buildEye(headG, -1, eyeColor);
    const eyeR = buildEye(headG, 1, eyeColor);

    const browL = el('path', { 'data-part': 'eyebrow', 'data-side': 'L', d: 'M-33,-65 Q-22,-72 -11,-66', fill: 'none', stroke: '#4a2919', 'stroke-width': 3.4, 'stroke-linecap': 'round' }, headG);
    const browR = el('path', { 'data-part': 'eyebrow', 'data-side': 'R', d: 'M11,-66 Q22,-72 33,-65', fill: 'none', stroke: '#4a2919', 'stroke-width': 3.4, 'stroke-linecap': 'round' }, headG);

    const noseG = el('g', { 'data-part': 'nose' }, headG);
    el('ellipse', { cx: 0, cy: -35, rx: 7, ry: 5, fill: 'transparent' }, noseG);
    el('path', { d: 'M-3.8,-36.5 Q0,-31.5 3.8,-36.5', fill: 'none', stroke: '#b86e49', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, noseG);
    el('ellipse', { cx: 0, cy: -33, rx: 3.2, ry: 1.4, fill: '#e59f79', opacity: 0.7 }, noseG);

    const mouth = buildMouths(headG);

    const hairFront = el('g', { 'data-part': 'hair' }, headG);
    el('path', {
      d: 'M-57,-50 C-59,-88 -36,-112 0,-112 C36,-112 59,-88 57,-50 C54,-63 47,-71 38,-75 C32,-64 26,-61 20,-65 C14,-76 6,-79 -2,-65 C-11,-78 -23,-77 -30,-63 C-38,-72 -49,-67 -57,-50 Z',
      fill: 'url(#dd-hair)', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round',
    }, hairFront);
    el('path', {
      d: 'M-34,-88 C-18,-98 14,-100 34,-87',
      fill: 'none', stroke: '#935d3b', 'stroke-width': 4.5, 'stroke-linecap': 'round', opacity: 0.75,
    }, hairFront);

    const cowlick = el('g', { display: hat ? 'none' : '' }, hairFront);
    el('path', {
      d: 'M-4,-110 C-14,-126 8,-130 12,-113 C18,-124 31,-118 22,-107 Z',
      fill: 'url(#dd-hair)', stroke: INK, 'stroke-width': 2.6, 'stroke-linejoin': 'round',
    }, cowlick);

    // Explorer khaki bucket hat
    const hatG = el('g', { 'data-part': 'hat', display: hat ? '' : 'none' }, headG);
    el('path', {
      d: 'M-44,-90 C-44,-120 -24,-130 0,-130 C24,-130 44,-120 44,-90 Z',
      fill: 'url(#dd-hat)', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round',
    }, hatG);
    el('path', {
      d: 'M-44,-96 Q0,-87 44,-96 L44,-87 Q0,-78 -44,-87 Z',
      fill: '#3d7ea6', stroke: INK, 'stroke-width': 2.4, 'stroke-linejoin': 'round',
    }, hatG);
    el('path', {
      d: 'M-64,-78 C-48,-93 48,-93 64,-78 C67,-71 56,-68 42,-73 C18,-81 -18,-81 -42,-73 C-56,-68 -67,-71 -64,-78 Z',
      fill: 'url(#dd-hat)', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round',
    }, hatG);
    const leafWrap = el('g', { transform: 'translate(-28, -95) rotate(-20)' }, hatG);
    el('path', { d: 'M0,0 C-10,-12 4,-22 14,-10 C12,0 4,3 0,0 Z', fill: '#57cc71', stroke: INK, 'stroke-width': 2.1, 'stroke-linejoin': 'round' }, leafWrap);
    el('path', { d: 'M1,-2 L9,-9', stroke: '#2c7a4b', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, leafWrap);

    const parts = {
      shadow, bodyG, torsoG, shirtG, overallsG, neckG, scarfG, scarfTails,
      head: headPivot, hair: hairFront, hairBack, earL, earR, forehead,
      cheekL, cheekR, eyeL: eyeL.g, eyeR: eyeR.g, browL, browR, nose: noseG,
      mouth: mouth.g, teeth: mouth.variants.teeth, hat: hatG,
      armL: armL.root, armR: armR.root,
      handL: armL.wrist, handR: armR.wrist,
      legL: legL.legG, legR: legR.legG,
      kneeL: legL.knee, kneeR: legR.knee,
      footL: legL.footSneaker, footR: legR.footSneaker,
      bareL: legL.footBare, bareR: legR.footBare,
    };

    let curExpr = expr;
    function setExpr(name = 'happy') {
      mouth.set(name);
      if (name === 'sour') {
        eyeL.setMode('squint');
        eyeR.setMode('squint');
        browL.setAttribute('d', 'M-33,-68 Q-21,-63 -11,-59');
        browR.setAttribute('d', 'M11,-59 Q21,-63 33,-68');
      } else {
        eyeL.setMode('open');
        eyeR.setMode('open');
        if (name === 'amazed') {
          browL.setAttribute('d', 'M-33,-70 Q-22,-80 -11,-71');
          browR.setAttribute('d', 'M11,-71 Q22,-80 33,-70');
        } else if (name === 'curious') {
          browL.setAttribute('d', 'M-33,-64 Q-22,-69 -11,-64');
          browR.setAttribute('d', 'M11,-69 Q22,-77 33,-69');
        } else if (name === 'yuck') {
          browL.setAttribute('d', 'M-33,-67 Q-22,-63 -11,-61');
          browR.setAttribute('d', 'M11,-61 Q22,-63 33,-67');
        } else {
          browL.setAttribute('d', 'M-33,-65 Q-22,-72 -11,-66');
          browR.setAttribute('d', 'M11,-66 Q22,-72 33,-65');
        }
      }
      curExpr = name;
    }

    function setBlink(isClosed) {
      if (curExpr === 'sour') return;
      eyeL.setMode(isClosed ? 'closed' : 'open');
      eyeR.setMode(isClosed ? 'closed' : 'open');
    }

    function setEyeColor(preset) {
      eyeL.setColor(preset);
      eyeR.setColor(preset);
    }

    function setHat(on) {
      hatG.setAttribute('display', on ? '' : 'none');
      cowlick.setAttribute('display', on ? 'none' : '');
    }

    function setBarefoot(on) {
      legL.footSneaker.setAttribute('display', on ? 'none' : '');
      legR.footSneaker.setAttribute('display', on ? 'none' : '');
      legL.footBare.setAttribute('display', on ? '' : 'none');
      legR.footBare.setAttribute('display', on ? '' : 'none');
    }

    function setPose(p = {}) {
      if ('bob' in p || 'lean' in p) {
        bodyG.setAttribute('transform', `translate(0, ${(p.bob || 0).toFixed(2)}) rotate(${(p.lean || 0).toFixed(2)}, 0, 50)`);
      }
      if ('headR' in p) headG.setAttribute('transform', `rotate(${p.headR.toFixed(2)})`);
      if ('armL' in p) armL.rotG.setAttribute('transform', `rotate(${p.armL.toFixed(2)})`);
      if ('armR' in p) armR.rotG.setAttribute('transform', `rotate(${p.armR.toFixed(2)})`);
      if ('scarfR' in p) scarfTails.setAttribute('transform', `translate(16, -24) rotate(${p.scarfR.toFixed(2)})`);
    }

    function highlightPart(partName, on = true) {
      const targets = g.querySelectorAll(`[data-part="${partName}"]`);
      targets.forEach(node => {
        node.style.filter = on ? 'drop-shadow(0 0 10px #ffbe0b) drop-shadow(0 0 4px #ff5a5f)' : '';
        node.style.transition = 'filter 0.2s ease';
      });
    }

    setExpr(expr);
    setBarefoot(barefoot);
    setPose({ armL: initArmL, armR: initArmR, headR });

    return {
      g, parts, setExpr, setBlink, setEyeColor, setHat, setBarefoot, setPose, highlightPart,
      setTalk(open) { mouth.set(open ? 'open' : curExpr); },
    };
  }

  function animateIdle(inst, t, base = {}) {
    const bob = Math.sin(t * 2.4) * 2.6;
    const headR = (base.headR || 0) + Math.sin(t * 1.3) * 2.2;
    const armL = (base.armL ?? 12) + Math.sin(t * 1.9) * 3.5;
    const armR = (base.armR ?? -12) - Math.sin(t * 1.9 + 0.5) * 3.5;
    const scarfR = Math.sin(t * 2.8) * 4.5;
    inst.setPose({ bob, headR, armL, armR, scarfR });
    const blink = (t % 3.6) > 3.44;
    inst.setBlink(blink);
  }

  function createFacePortrait(parent, opts = {}) {
    const {
      x = 0, y = 0, r = 104,
      bg = '#fff5e4', frameColor = '#f2cf8d', showFrame = true,
      hat = false, scarf = true, eyeColor = 'brown', expr = 'happy',
      scale = 1,
    } = opts;
    ensureDefs(parent);
    const wrap = el('g', { transform: `translate(${x}, ${y})` }, parent);
    const clipId = `dd-clip-${Math.random().toString(36).slice(2, 8)}`;
    const svg = parent.ownerSVGElement || parent;
    const defs = svg.querySelector('defs');
    const cp = el('clipPath', { id: clipId }, defs);
    el('circle', { cx: 0, cy: 0, r: r - 6 }, cp);

    if (showFrame) {
      el('circle', { cx: 0, cy: 5, r: r + 7, fill: 'rgba(90, 59, 44, 0.14)' }, wrap);
      el('circle', { cx: 0, cy: 0, r: r + 5, fill: frameColor, stroke: INK, 'stroke-width': 3.5 }, wrap);
    }
    el('circle', { cx: 0, cy: 0, r: r - 5, fill: bg, stroke: INK, 'stroke-width': 2.5 }, wrap);

    const clipped = el('g', { 'clip-path': `url(#${clipId})` }, wrap);
    const s = (r / 104) * 1.25 * scale;
    const inst = create(clipped, {
      x: 0, y: 110 * (r / 104), s, hat, scarf, eyeColor, expr, armL: 6, armR: -6,
    });
    if (showFrame) {
      el('path', { d: `M${-r * 0.56},${-r * 0.44} L${-r * 0.26},${-r * 0.70}`, stroke: '#ffffff', 'stroke-width': 5.5, 'stroke-linecap': 'round', opacity: 0.45 }, wrap);
    }
    el('circle', { cx: 0, cy: 0, r: r - 5, fill: 'none', stroke: INK, 'stroke-width': 2.5 }, wrap);
    return { wrap, inst };
  }

  window.Doudou = { create, animateIdle, createFacePortrait, ensureDefs, EYE_PRESETS };
})();
