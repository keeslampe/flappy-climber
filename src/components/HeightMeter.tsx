import {
  HEIGHT_METER_BOTTOM_OFFSET,
  HEIGHT_METER_TOP_OFFSET,
  HEIGHT_SCALE_MAX,
  PALETTE,
} from '../game/constants';
import { waistYForHeight } from '../game/world';
import type { World } from '../game/types';

interface Props {
  world: World;
  groundY: number;
}

// Vertical ruler on the left edge — chunky white ticks, every-10m labels with
// outlined text for crisp legibility against any background.
export function HeightMeter({ world, groundY }: Props) {
  const panelX = 0;
  const panelWidth = 58;
  const panelTop = 12;
  const panelBottom = groundY - 6;
  const railX = panelX + panelWidth - 6;
  const bottomBound = groundY - HEIGHT_METER_BOTTOM_OFFSET;
  const topBound = HEIGHT_METER_TOP_OFFSET;
  const indicatorY = Math.max(topBound, Math.min(bottomBound, world.climber.y + 8));
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
      {/* Teal target marker — shows the goal height from the workout */}
      {world.beamDisplayHeight > 0 && (() => {
        const targetY = Math.max(topBound, Math.min(bottomBound, waistYForHeight(world.beamDisplayHeight, groundY)));
        return (
          <g>
            <line x1={railX - 16} y1={targetY} x2={railX + 4} y2={targetY} stroke={PALETTE.teal} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="4 3" />
            <rect x={railX - 4} y={targetY - 4} width={8} height={8} fill={PALETTE.teal} rx={1.5} />
          </g>
        );
      })()}
      {/* Yellow arrow indicator — current climber position */}
      <line
        x1={railX - 8} y1={indicatorY}
        x2={railX + 4} y2={indicatorY}
        stroke={PALETTE.yellow} strokeWidth={3} strokeLinecap="round"
      />
    </g>
  );
}
