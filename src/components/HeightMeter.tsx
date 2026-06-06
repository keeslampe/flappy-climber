import { HEIGHT_SCALE_MAX, PALETTE } from '../game/constants';
import { waistYForHeight } from '../game/world';
import type { World } from '../game/types';

interface Props {
  world: World;
  groundY: number;
}

// Vertical ruler on the left edge — chunky white ticks, every-10m labels with
// outlined text for crisp legibility against any background.
export function HeightMeter({ groundY }: Props) {
  const panelX = 0;
  const panelWidth = 58;
  const panelTop = 12;
  const panelBottom = groundY - 6;
  const railX = panelX + panelWidth - 6;
  const ticks: number[] = [];
  for (let value = 10; value <= HEIGHT_SCALE_MAX; value += 10) ticks.push(value);

  return (
    <g>
      <rect x={panelX} y={panelTop} width={panelWidth} height={panelBottom - panelTop} fill="rgba(26,26,26,0.62)" />
      <rect x={panelX + panelWidth - 2} y={panelTop} width={2} height={panelBottom - panelTop} fill="rgba(255,246,229,0.45)" />
      <line x1={railX} y1={panelTop + 6} x2={railX} y2={panelBottom - 6} stroke={PALETTE.cream} strokeWidth={2.5} strokeLinecap="round" />
      <g style={{ font: '800 13px JetBrains Mono, ui-monospace, monospace' }} textAnchor="end" dominantBaseline="middle">
        {ticks.map((meter) => {
          const tickY = waistYForHeight(meter, groundY);
          const tickLength = 14;
          return (
            <g key={meter}>
              <line x1={railX - tickLength} y1={tickY} x2={railX} y2={tickY} stroke={PALETTE.cream} strokeWidth={2.4} strokeLinecap="round" />
              <text
                x={railX - tickLength - 3}
                y={tickY}
                fill={PALETTE.cream}
                stroke={PALETTE.ink}
                strokeWidth={3.5}
                strokeLinejoin="round"
                paintOrder="stroke"
              >
                {meter}kg
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}
