import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

type SceneMode = 'shadow' | 'reading' | 'manifold' | 'icf' | 'translate';

const demoScenes: readonly {
  id: string;
  mode: SceneMode;
  durationMs: number;
  titleJa: string;
  bodyJa: string;
}[] = [
  {
    id: 'reality-and-shadows',
    mode: 'shadow',
    durationMs: 12000,
    titleJa: '人間は、現実の「影」しか見られない',
    bodyJa:
      '透析も締切も、一人の「生きる・働く」の一部。でも見えるのは部分的な影だけ。そこから先入観・偏見や支援の縦割りが生まれてきた。',
  },
  {
    id: 'icf-reading-lens',
    mode: 'icf',
    durationMs: 12000,
    titleJa: 'ICFを、影を読むレンズにする',
    bodyJa:
      '生の情報から直接まとめると、バイアスがそのまま再生産される。だから先に、ICF（国際生活機能分類）の相互作用の全体像を、読みのレンズとして構える。',
  },
  {
    id: 'llm-reads-through-lens',
    mode: 'reading',
    durationMs: 10000,
    titleJa: '世界中の影を、レンズ越しに読む',
    bodyJa:
      'LLMは人間を遥かに超える文脈読解力で世界中の影を読む。ICFレンズで仮説・反対仮説を立てながら読むから、偏見の再生産ではなく構造の発見になる。',
  },
  {
    id: 'invariants-as-manifold',
    mode: 'manifold',
    durationMs: 14000,
    titleJa: '影の奥にある「不変量」を見出す',
    bodyJa:
      'レンズ越しの読みから、少数の基本パターンと、背景因子のパラメーターで現れ方だけが変わる構造＝数学的多様体が浮かび上がる。',
  },
  {
    id: 'first-principles-translation',
    mode: 'translate',
    durationMs: 12000,
    titleJa: '不変量から、人に届く形へ翻訳する',
    bodyJa:
      '複雑すぎる知識の網から、第一原理で捉え方と解き方を導き、図解・音楽・ことばへ翻訳。断定ではなく、仮説・反対仮説・確認の形で届ける。',
  },
] as const;

const demoMovieStyles = `
@keyframes tmtdm-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes tmtdm-pop {
  0% { opacity: 0; transform: translateY(8px) scale(0.95); }
  100% { opacity: 1; transform: none; }
}
@keyframes tmtdm-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
@keyframes tmtdm-dim {
  0% { opacity: 0; transform: translateY(6px); }
  12% { opacity: 1; transform: none; }
  70% { opacity: 1; }
  100% { opacity: 0.35; }
}
@keyframes tmtdm-slide {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(34px); }
}
@keyframes tmtdm-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.tmtdm-scene { animation: tmtdm-fade 0.6s ease both; }
.tmtdm-pop { animation: tmtdm-pop 0.7s ease both; }
.tmtdm-float { animation: tmtdm-float 3.4s ease-in-out infinite; }
.tmtdm-dim { animation: tmtdm-dim 8s ease both; }
.tmtdm-slide { animation: tmtdm-slide 3.6s ease-in-out infinite; }
.tmtdm-progress { animation: tmtdm-progress linear both; transform-origin: left; }
@media (prefers-reduced-motion: reduce) {
  .tmtdm-pop { animation-duration: 0.01s; }
  .tmtdm-float, .tmtdm-slide { animation: none; }
  .tmtdm-dim { animation: none; opacity: 0.75; }
}
`;

/* ---------- particle engine ---------- */

const PARTICLE_COUNT = 380;
const CLUSTER_COUNT = 6;

const clusterPalette: readonly [number, number, number][] = [
  [94, 234, 212], // teal
  [125, 211, 252], // sky
  [252, 211, 77], // amber
  [196, 181, 253], // violet
  [190, 242, 100], // lime
  [253, 164, 175], // rose
];

const shadowColor: [number, number, number] = [120, 132, 148];
const readingOuterColor: [number, number, number] = [148, 163, 184];
const barColor: [number, number, number] = [45, 212, 191];
const waveColor: [number, number, number] = [252, 211, 77];
const wordColor: [number, number, number] = [226, 232, 240];

// visual band: y fractions ~0.06-0.64 stay clear of the caption gradient
const shadowPatchCenters = [
  [0.82, 0.18],
  [0.82, 0.38],
  [0.82, 0.56],
] as const;

const shadowRealityCenter = [0.36, 0.34] as const;

const icfNodeCenters = [
  [0.5, 0.12], // 健康状態
  [0.16, 0.38], // 心身機能・身体構造
  [0.5, 0.38], // 活動
  [0.84, 0.38], // 参加
  [0.3, 0.56], // 環境因子
  [0.7, 0.56], // 個人因子
] as const;

const icfEdges = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [2, 3],
  [4, 1],
  [4, 2],
  [5, 2],
  [5, 3],
] as const;

const translateBarHeights = [0.1, 0.14, 0.18, 0.12, 0.16] as const;

function gauss() {
  return Math.random() + Math.random() + Math.random() - 1.5;
}

type Particle = {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  cluster: number;
  seed: number;
  g1: number;
  g2: number;
  p3: [number, number, number];
  departAt: number;
  glyph: number;
  glyphA: number;
  glyphB: number;
};

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const cluster = i % CLUSTER_COUNT;
    const angle = (cluster / CLUSTER_COUNT) * Math.PI * 2;
    const center: [number, number, number] = [
      Math.cos(angle) * 0.85,
      (cluster % 2 === 0 ? -0.32 : 0.32) + gauss() * 0.12,
      Math.sin(angle) * 0.85,
    ];
    const [r, g, b] = clusterPalette[cluster];
    return {
      x: Math.random(),
      y: Math.random(),
      r,
      g,
      b,
      cluster,
      seed: Math.random(),
      g1: gauss(),
      g2: gauss(),
      p3: [center[0] + gauss() * 0.4, center[1] + gauss() * 0.34, center[2] + gauss() * 0.4],
      departAt: (((i * 37) % 100) / 100) * 5.2 + 0.6,
      glyph: i % 5,
      glyphA: ((i * 13) % 40) / 40,
      glyphB: (i >> 2) % 3,
    };
  });
}

function buildManifoldEdges() {
  const edges: [number, number][] = [];
  for (let i = 0; i < PARTICLE_COUNT - CLUSTER_COUNT; i += 2) {
    edges.push([i, i + CLUSTER_COUNT]);
  }
  for (let i = 0; i < PARTICLE_COUNT; i += 16) {
    edges.push([i, (i * 11 + 30) % PARTICLE_COUNT]);
  }
  return edges;
}

function projectManifold(
  p: Particle,
  t: number,
  cx: number,
  cy: number,
  sx: number,
  sy: number,
  warp = 0,
) {
  // background-factor parameters deform the manifold while cluster identity persists
  const wx = p.p3[0] * (1 + warp * Math.sin(t * 0.9 + p.p3[1] * 2.3));
  const wy = p.p3[1] * (1 + warp * Math.sin(t * 0.6 + p.p3[2] * 1.9));
  const wz = p.p3[2] * (1 + warp * Math.sin(t * 0.75 + p.p3[0] * 2.1));
  const theta = t * 0.38;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const x1 = wx * cos + wz * sin;
  const z1 = -wx * sin + wz * cos;
  const tilt = 0.42;
  const y1 = wy * Math.cos(tilt) - z1 * Math.sin(tilt);
  const z2 = wy * Math.sin(tilt) + z1 * Math.cos(tilt);
  const persp = 2.1 / (2.1 + z2);
  return {
    x: cx + x1 * persp * sx,
    y: cy + y1 * persp * sy,
    depth: persp,
  };
}

function startDemoEngine(
  canvas: HTMLCanvasElement,
  getState: () => { sceneIndex: number; playing: boolean; reduced: boolean },
) {
  if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
    return () => undefined;
  }

  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = canvas.getContext('2d');
  } catch {
    ctx = null;
  }
  if (!ctx) {
    return () => undefined;
  }

  const particles = createParticles();
  const manifoldEdges = buildManifoldEdges();
  let width = 0;
  let height = 0;
  let raf = 0;
  let last = performance.now();
  let sceneTime = 0;
  let lastScene = -1;
  let staticDrawn = false;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(rect.width, 1);
    height = Math.max(rect.height, 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    staticDrawn = false;
  };
  resize();
  const observer =
    typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => resize());
  observer?.observe(canvas);

  const targetFor = (p: Particle, index: number, mode: SceneMode, t: number) => {
    if (mode === 'shadow') {
      if (index % 4 === 3) {
        const patch = shadowPatchCenters[p.glyphB];
        return {
          x: (patch[0] + p.g1 * 0.05) * width,
          y: (patch[1] + p.g2 * 0.014) * height,
          color: shadowColor,
          size: 1.6,
          alpha: 0.6,
        };
      }
      const proj = projectManifold(
        p,
        t * 0.8,
        width * shadowRealityCenter[0],
        height * shadowRealityCenter[1],
        width * 0.17,
        height * 0.15,
      );
      return {
        x: proj.x,
        y: proj.y,
        color: clusterPalette[p.cluster],
        size: 0.8 + proj.depth * 1.9,
        alpha: 0.3 + proj.depth * 0.55,
      };
    }
    if (mode === 'reading') {
      const arrived = t > p.departAt;
      if (!arrived) {
        const angle = p.seed * Math.PI * 2 + t * 0.15;
        return {
          x: (0.5 + Math.cos(angle) * 0.44) * width,
          y: (0.36 + Math.sin(angle) * 0.3) * height,
          color: readingOuterColor,
          size: 1.6,
          alpha: 0.5,
        };
      }
      const radius = 0.05 + p.seed * 0.075;
      const angle = t * 1.1 + p.seed * Math.PI * 2;
      return {
        x: (0.5 + Math.cos(angle) * radius * 1.35) * width,
        y: (0.36 + Math.sin(angle) * radius) * height,
        color: p.seed > 0.5 ? clusterPalette[0] : clusterPalette[1],
        size: 1.9,
        alpha: 0.9,
      };
    }
    if (mode === 'manifold') {
      const proj = projectManifold(
        p,
        t,
        width * 0.5,
        height * 0.38,
        width * 0.32,
        height * 0.25,
        0.24,
      );
      return {
        x: proj.x,
        y: proj.y,
        color: clusterPalette[p.cluster],
        size: 0.9 + proj.depth * 2.1,
        alpha: 0.28 + proj.depth * 0.55,
      };
    }
    if (mode === 'icf') {
      const node = icfNodeCenters[p.cluster];
      return {
        x: (node[0] + p.g1 * 0.035) * width + Math.sin(t + p.seed * 8) * 2.5,
        y: (node[1] + p.g2 * 0.04) * height + Math.cos(t + p.seed * 6) * 2.5,
        color: clusterPalette[p.cluster],
        size: 1.9 + p.seed * 1.4,
        alpha: 0.9,
      };
    }
    // translate
    const departed = t > p.departAt && p.glyph >= 2;
    if (!departed) {
      const proj = projectManifold(p, t, width * 0.19, height * 0.38, width * 0.14, height * 0.12);
      return {
        x: proj.x,
        y: proj.y,
        color: clusterPalette[p.cluster],
        size: 0.7 + proj.depth * 1.5,
        alpha: 0.25 + proj.depth * 0.5,
      };
    }
    if (p.glyph === 2) {
      const bar = Math.floor(p.glyphA * 5);
      return {
        x: (0.52 + bar * 0.055 + (p.seed - 0.5) * 0.03) * width,
        y: (0.32 - translateBarHeights[bar] * ((p.glyphA * 5) % 1)) * height,
        color: barColor,
        size: 2.2,
        alpha: 0.95,
      };
    }
    if (p.glyph === 3) {
      const fx = 0.5 + p.glyphA * 0.44;
      return {
        x: fx * width,
        y:
          (0.44 + Math.sin(p.glyphA * Math.PI * 4) * 0.05) * height +
          Math.sin(t * 2.4 + fx * 14) * 3,
        color: waveColor,
        size: 2.1,
        alpha: 0.95,
      };
    }
    const rowWidth = p.glyphB === 2 ? 0.26 : 0.4;
    return {
      x: (0.52 + p.glyphA * rowWidth) * width,
      y: (0.52 + p.glyphB * 0.045) * height,
      color: wordColor,
      size: 1.9,
      alpha: 0.9,
    };
  };

  const drawEdges = (mode: SceneMode, t: number) => {
    if (mode === 'shadow') {
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 7]);
      ctx.lineDashOffset = -t * 14;
      for (const patch of shadowPatchCenters) {
        ctx.beginPath();
        ctx.moveTo(width * shadowRealityCenter[0], height * shadowRealityCenter[1]);
        ctx.lineTo(patch[0] * width, patch[1] * height);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }
    if (mode === 'reading') {
      ctx.save();
      ctx.strokeStyle = 'rgba(94, 234, 212, 0.5)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([5, 6]);
      ctx.lineDashOffset = -t * 12;
      ctx.beginPath();
      ctx.ellipse(width * 0.5, height * 0.36, width * 0.2, height * 0.155, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (mode === 'icf') {
      ctx.save();
      ctx.strokeStyle = 'rgba(94, 234, 212, 0.55)';
      ctx.lineWidth = 1.3;
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset = -t * 22;
      for (const [a, b] of icfEdges) {
        ctx.beginPath();
        ctx.moveTo(icfNodeCenters[a][0] * width, icfNodeCenters[a][1] * height);
        ctx.lineTo(icfNodeCenters[b][0] * width, icfNodeCenters[b][1] * height);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }
    if (mode === 'manifold' || mode === 'translate') {
      const formation = mode === 'manifold' ? Math.min(1, Math.max(0, (t - 1.2) / 2.4)) : 1;
      if (formation <= 0) {
        return;
      }
      ctx.save();
      ctx.lineWidth = 0.7;
      for (const [a, b] of manifoldEdges) {
        const pa = particles[a];
        const pb = particles[b];
        if (mode === 'translate' && t > pa.departAt && pa.glyph >= 2) continue;
        if (mode === 'translate' && t > pb.departAt && pb.glyph >= 2) continue;
        const [r, g, bl] = clusterPalette[pa.cluster];
        const alpha = formation * 0.16 * Math.min(1, 40 / Math.hypot(pa.x - pb.x, pa.y - pb.y));
        ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
      ctx.restore();
    }
    if (mode === 'translate') {
      // prism the particles stream through
      const px = 0.36 * width;
      const py = 0.38 * height;
      const s = Math.min(width, height) * 0.075;
      ctx.save();
      ctx.strokeStyle = 'rgba(252, 211, 77, 0.85)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(px, py - s);
      ctx.lineTo(px + s * 0.9, py + s * 0.75);
      ctx.lineTo(px - s * 0.9, py + s * 0.75);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  };

  const step = (dt: number, mode: SceneMode) => {
    const ease = Math.min(1, dt * 4.6);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      const target = targetFor(p, i, mode, sceneTime);
      p.x += (target.x - p.x) * ease;
      p.y += (target.y - p.y) * ease;
      p.r += (target.color[0] - p.r) * ease;
      p.g += (target.color[1] - p.g) * ease;
      p.b += (target.color[2] - p.b) * ease;
    }
  };

  const draw = (mode: SceneMode) => {
    ctx.clearRect(0, 0, width, height);
    drawEdges(mode, sceneTime);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      const target = targetFor(p, i, mode, sceneTime);
      ctx.beginPath();
      ctx.fillStyle = `rgba(${Math.round(p.r)}, ${Math.round(p.g)}, ${Math.round(p.b)}, ${target.alpha.toFixed(2)})`;
      ctx.arc(p.x, p.y, target.size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  let frameCount = 0;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const { sceneIndex, playing, reduced } = getState();
    const mode = demoScenes[sceneIndex].mode;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    // self-heal if the initial measurement happened before layout settled
    frameCount += 1;
    if (width < 2 || frameCount % 30 === 0) {
      const rect = canvas.getBoundingClientRect();
      if (Math.abs(rect.width - width) > 1 || Math.abs(rect.height - height) > 1) {
        resize();
      }
    }
    if (sceneIndex !== lastScene) {
      lastScene = sceneIndex;
      sceneTime = 0;
      staticDrawn = false;
    }
    if (reduced) {
      if (!staticDrawn) {
        sceneTime = 6.5;
        for (let k = 0; k < 90; k++) {
          step(1 / 30, mode);
        }
        draw(mode);
        staticDrawn = true;
      }
      return;
    }
    if (playing) {
      sceneTime += dt;
    }
    step(dt, mode);
    draw(mode);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    observer?.disconnect();
  };
}

/* ---------- scene overlays ---------- */

function OverlayChip({
  x,
  y,
  delay,
  className,
  children,
  animation = 'tmtdm-pop',
}: {
  x: string;
  y: string;
  delay: string;
  className: string;
  children: React.ReactNode;
  animation?: 'tmtdm-pop' | 'tmtdm-dim';
}) {
  return (
    <span className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
      <span className={`${animation} block ${className}`} style={{ animationDelay: delay }}>
        {children}
      </span>
    </span>
  );
}

const lifeChips = [
  { label: '週3回の透析がある', x: '40%', y: '8%', delay: '0.4s', hideOnMobile: false },
  { label: '月末だけ締切が重なる', x: '24%', y: '19%', delay: '1.1s', hideOnMobile: false },
  { label: '会議の音の洪水で消耗', x: '48%', y: '26%', delay: '1.8s', hideOnMobile: true },
  { label: '通勤で体力を使い切る', x: '18%', y: '48%', delay: '2.5s', hideOnMobile: false },
  { label: '家族の介護と両立中', x: '46%', y: '54%', delay: '3.2s', hideOnMobile: true },
] as const;

const lifeChipClass =
  'whitespace-nowrap rounded-full border border-white/20 bg-[#0b1f1c]/70 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-[2px] md:text-[11px]';

function ShadowOverlay() {
  return (
    <>
      {lifeChips.map((chip) => (
        <OverlayChip
          className={chip.hideOnMobile ? `hidden md:block ${lifeChipClass}` : lifeChipClass}
          delay={chip.delay}
          key={chip.label}
          x={chip.x}
          y={chip.y}
        >
          <span className="tmtdm-float block">{chip.label}</span>
        </OverlayChip>
      ))}
      {[
        { label: '「障害名」の影', x: '80%', y: '18%', delay: '1.4s' },
        { label: '「できない人」の影', x: '80%', y: '38%', delay: '2.1s' },
        { label: '「制度の枠」の影', x: '80%', y: '56%', delay: '2.8s' },
      ].map((patch) => (
        <OverlayChip
          className="whitespace-nowrap rounded-md border border-slate-400/50 bg-slate-900/70 px-2 py-0.5 text-[10px] font-semibold text-slate-300 md:text-[12px]"
          delay={patch.delay}
          key={patch.label}
          x={patch.x}
          y={patch.y}
        >
          {patch.label}
        </OverlayChip>
      ))}
      {[
        { label: '偏見・先入観', x: '60%', y: '30%', delay: '3.6s' },
        { label: '支援の縦割り', x: '60%', y: '47%', delay: '3.9s' },
      ].map((tag) => (
        <OverlayChip
          className="whitespace-nowrap rounded-full border border-rose-400/70 bg-rose-950/60 px-2.5 py-1 text-[10px] font-semibold text-rose-200 md:text-[11px]"
          delay={tag.delay}
          key={tag.label}
          x={tag.x}
          y={tag.y}
        >
          {tag.label}
        </OverlayChip>
      ))}
    </>
  );
}

const knowledgeSourceChips = [
  { label: '国内の調査研究', x: '16%', y: '22%', delay: '0.3s' },
  { label: 'NIVR研究資料', x: '44%', y: '13%', delay: '1.0s' },
  { label: 'JEED雇用・配慮事例', x: '82%', y: '24%', delay: '1.7s' },
  { label: '治療と仕事の両立支援資料', x: '28%', y: '48%', delay: '2.4s' },
  { label: 'JAN・EARN（米国）', x: '80%', y: '46%', delay: '3.1s' },
  { label: '英・EU・豪などの公開情報', x: '52%', y: '64%', delay: '3.8s' },
] as const;

function ReadingOverlay() {
  return (
    <>
      {knowledgeSourceChips.map((chip) => (
        <OverlayChip
          animation="tmtdm-dim"
          className="whitespace-nowrap rounded-full border border-white/15 bg-[#0b1f1c]/70 px-2 py-0.5 text-[9px] font-semibold text-sky-100/90 md:text-[11px]"
          delay={chip.delay}
          key={chip.label}
          x={chip.x}
          y={chip.y}
        >
          {chip.label}
        </OverlayChip>
      ))}
      <OverlayChip
        className="whitespace-nowrap rounded-full border border-teal-200/40 bg-[#0b1f1c]/85 px-2.5 py-1 text-[10px] font-semibold text-teal-100 md:text-[12px]"
        delay="2s"
        x="46%"
        y="21%"
      >
        ICFの相互作用レンズ
      </OverlayChip>
      <OverlayChip
        className="whitespace-nowrap rounded-full border border-white/20 bg-[#0b1f1c]/80 px-2 py-0.5 text-[9px] font-semibold text-white/85 md:text-[10px]"
        delay="5.2s"
        x="22%"
        y="36%"
      >
        仮説・反対仮説を立てながら
      </OverlayChip>
      <OverlayChip
        className="whitespace-nowrap rounded-full border border-teal-200/40 bg-[#0b1f1c]/85 px-2.5 py-1 text-[10px] font-semibold text-teal-100 md:text-[12px]"
        delay="4.5s"
        x="50%"
        y="57%"
      >
        人間を遥かに超える文脈読解力
      </OverlayChip>
    </>
  );
}

const invariantPatternChips = [
  { label: '体調と時間', x: '12%', y: '30%', delay: '3.2s' },
  { label: '情報アクセス', x: '44%', y: '9%', delay: '3.6s' },
  { label: '手順と認知', x: '88%', y: '26%', delay: '4.0s' },
  { label: '開示と評価', x: '12%', y: '52%', delay: '4.4s' },
  { label: '支援の接続', x: '32%', y: '62%', delay: '4.8s' },
  { label: '移動と接点', x: '88%', y: '52%', delay: '5.2s' },
] as const;

function ManifoldOverlay() {
  return (
    <>
      <OverlayChip
        className="whitespace-nowrap rounded-full border border-teal-200/40 bg-[#0b1f1c]/85 px-2.5 py-1 text-[10px] font-semibold text-teal-100 md:text-[12px]"
        delay="1.2s"
        x="30%"
        y="18%"
      >
        少数の基本パターン
      </OverlayChip>
      {invariantPatternChips.map((chip) => (
        <OverlayChip
          className="whitespace-nowrap rounded-full border border-white/15 bg-[#0b1f1c]/75 px-2 py-0.5 text-[9px] font-semibold text-white/85 md:text-[10px]"
          delay={chip.delay}
          key={chip.label}
          x={chip.x}
          y={chip.y}
        >
          {chip.label}
        </OverlayChip>
      ))}
      <OverlayChip
        className="rounded-md border border-amber-200/40 bg-[#0b1f1c]/85 px-2.5 py-1.5 text-[9px] font-semibold text-amber-100 md:text-[10px]"
        delay="6s"
        x="72%"
        y="64%"
      >
        <span className="flex items-center gap-2 whitespace-nowrap">
          背景因子のパラメーター
          <span className="relative inline-block h-1 w-12 rounded-full bg-white/20">
            <span className="tmtdm-slide absolute -top-[3px] left-0 inline-block h-2.5 w-2.5 rounded-full bg-amber-300" />
          </span>
        </span>
      </OverlayChip>
    </>
  );
}

const icfLabels = [
  { label: '健康状態', detail: '体調の波・治療', x: '50%', y: '12%', delay: '0.4s' },
  { label: '心身機能・構造', detail: '疲れやすさ', x: '16%', y: '38%', delay: '0.9s' },
  { label: '活動', detail: '商品管理の仕事', x: '50%', y: '38%', delay: '1.2s' },
  { label: '参加', detail: 'フルタイム勤務・評価', x: '84%', y: '38%', delay: '1.5s' },
  { label: '環境因子', detail: '通勤・上司の理解', x: '30%', y: '56%', delay: '2.0s' },
  { label: '個人因子', detail: 'キャリアの希望', x: '70%', y: '56%', delay: '2.3s' },
] as const;

function IcfOverlay() {
  return (
    <>
      {icfLabels.map((node) => (
        <OverlayChip
          className="flex flex-col items-center gap-0.5"
          delay={node.delay}
          key={node.label}
          x={node.x}
          y={node.y}
        >
          <span className="whitespace-nowrap rounded-full border border-teal-200/40 bg-[#0b1f1c]/80 px-2 py-0.5 text-[10px] font-semibold text-teal-50 md:text-[12px]">
            {node.label}
          </span>
          <span className="whitespace-nowrap text-[9px] font-semibold text-amber-200/90 md:text-[10px]">
            {node.detail}
          </span>
        </OverlayChip>
      ))}
    </>
  );
}

function TranslateOverlay() {
  return (
    <>
      <OverlayChip
        className="whitespace-nowrap text-[9px] font-semibold text-white/70 md:text-[11px]"
        delay="0s"
        x="19%"
        y="60%"
      >
        複雑なままの知識の網
      </OverlayChip>
      <OverlayChip
        className="whitespace-nowrap rounded-full border border-amber-200/50 bg-[#0b1f1c]/85 px-2.5 py-1 text-[10px] font-semibold text-amber-200 md:text-[12px]"
        delay="0.8s"
        x="36%"
        y="14%"
      >
        第一原理で翻訳
      </OverlayChip>
      {[
        { label: '図解', x: '63%', y: '37%', delay: '2.2s' },
        { label: '音楽', x: '90%', y: '32%', delay: '3.0s' },
        { label: '仮説・反対仮説・確認したいこと', x: '72%', y: '64%', delay: '3.8s' },
      ].map((tag) => (
        <OverlayChip
          className="whitespace-nowrap text-[10px] font-semibold text-white/85 md:text-[12px]"
          delay={tag.delay}
          key={tag.label}
          x={tag.x}
          y={tag.y}
        >
          {tag.label}
        </OverlayChip>
      ))}
    </>
  );
}

const sceneOverlays = [
  ShadowOverlay,
  IcfOverlay,
  ReadingOverlay,
  ManifoldOverlay,
  TranslateOverlay,
] as const;

/* ---------- component ---------- */

export default function TheoryMethodTrustHeroDemoMovie() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ sceneIndex: 0, playing: true, reduced: false });

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mediaQuery) {
      return;
    }
    setPrefersReducedMotion(mediaQuery.matches);
    const onChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener?.('change', onChange);
    return () => mediaQuery.removeEventListener?.('change', onChange);
  }, []);

  const autoPlaying = isPlaying && !prefersReducedMotion;
  stateRef.current = {
    sceneIndex,
    playing: autoPlaying,
    reduced: prefersReducedMotion,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    return startDemoEngine(canvas, () => stateRef.current);
  }, []);

  useEffect(() => {
    if (!autoPlaying) {
      return;
    }
    const timer = setTimeout(
      () => setSceneIndex((index) => (index + 1) % demoScenes.length),
      demoScenes[sceneIndex].durationMs,
    );
    return () => clearTimeout(timer);
  }, [autoPlaying, sceneIndex]);

  const scene = demoScenes[sceneIndex];
  const SceneOverlay = sceneOverlays[sceneIndex];

  return (
    <div
      aria-label="NBLの専門性を伝える約1分のデモ"
      className="relative h-[320px] w-full overflow-hidden bg-[#0b1f1c] md:h-[390px]"
      role="group"
    >
      <style>{demoMovieStyles}</style>
      <canvas aria-hidden="true" className="absolute inset-0 h-full w-full" ref={canvasRef} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0b1f1c] via-[#0b1f1c]/85 to-transparent"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 flex gap-1.5 px-3 pt-2.5">
        {demoScenes.map((item, index) => (
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/25" key={item.id}>
            {index < sceneIndex ? (
              <div className="h-full w-full bg-amber-300" />
            ) : index === sceneIndex ? (
              <div
                className="tmtdm-progress h-full w-full bg-amber-300"
                key={`progress-${sceneIndex}-${autoPlaying}`}
                style={{
                  animationDuration: `${item.durationMs}ms`,
                  animationPlayState: autoPlaying ? 'running' : 'paused',
                }}
              />
            ) : null}
          </div>
        ))}
      </div>
      <span className="absolute left-3 top-6 z-10 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-amber-100">
        約1分デモ
      </span>
      <div className="tmtdm-scene absolute inset-0 z-[5]" key={scene.id}>
        <div className="pointer-events-none absolute inset-0">
          <SceneOverlay />
        </div>
        <div className="absolute inset-x-0 bottom-0 px-4 pb-3 md:px-5 md:pb-4">
          <p className="text-[15px] font-semibold leading-6 text-amber-100 md:text-[17px]">
            {scene.titleJa}
          </p>
          <p className="mt-1 text-xs leading-5 text-white/85 md:text-[13px] md:leading-6">
            {scene.bodyJa}
          </p>
        </div>
      </div>
      <div className="absolute right-3 top-5 z-10 flex items-center gap-2">
        <div aria-label="デモのシーン選択" className="flex items-center gap-1.5" role="tablist">
          {demoScenes.map((item, index) => (
            <button
              aria-label={`シーン${index + 1}: ${item.titleJa}`}
              aria-selected={index === sceneIndex}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === sceneIndex ? 'bg-amber-300' : 'bg-white/35 hover:bg-white/60'
              }`}
              key={item.id}
              onClick={() => setSceneIndex(index)}
              role="tab"
              type="button"
            />
          ))}
        </div>
        <button
          aria-label={isPlaying ? 'デモを一時停止' : 'デモを再生'}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
          onClick={() => setIsPlaying((playing) => !playing)}
          type="button"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
      </div>
    </div>
  );
}
