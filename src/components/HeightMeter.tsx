import { PAL } from '../game/constants';
import type { World } from '../game/types';

interface Props {
  world: World;
  groundY: number;
}

// Vertical ruler on the left edge — chunky white ticks, every-10m labels with
// outlined text for crisp legibility against any background.
export function HeightMeter({ world, groundY }: Props) {
  const panelX = 0;
  const panelW = 58;
  const panelTop = 12;
  const panelBot = groundY - 6;
  const railX = panelX + panelW - 6;
  const bBot = groundY - 12;
  const bTop = 38;
  const indY = Math.max(bTop, Math.min(bBot, world.climber.y + 8));
  const pxPerM = (bBot - bTop) / 70;
  const ticks: number[] = [];
  for (let m = 10; m <= 70; m += 10) ticks.push(m);

  return (
    <g>
      <rect x={panelX} y={panelTop} width={panelW} height={panelBot - panelTop} fill="rgba(26,26,26,0.62)" />
      <rect x={panelX + panelW - 2} y={panelTop} width={2} height={panelBot - panelTop} fill="rgba(255,246,229,0.45)" />
      <line x1={railX} y1={panelTop + 6} x2={railX} y2={panelBot - 6} stroke={PAL.cream} strokeWidth={2.5} strokeLinecap="round" />
      <g style={{ font: '800 13px JetBrains Mono, ui-monospace, monospace' }} textAnchor="end" dominantBaseline="middle">
        {ticks.map((m) => {
          const ty = bBot - m * pxPerM;
          const tickLen = 14;
          return (
            <g key={m}>
              <line x1={railX - tickLen} y1={ty} x2={railX} y2={ty} stroke={PAL.cream} strokeWidth={2.4} strokeLinecap="round" />
              <text
                x={railX - tickLen - 3}
                y={ty}
                fill={PAL.cream}
                stroke={PAL.ink}
                strokeWidth={3.5}
                strokeLinejoin="round"
                paintOrder="stroke"
              >
                {m}kg
              </text>
            </g>
          );
        })}
      </g>
      {/* Arrow indicator */}
    </g>
  );
}
