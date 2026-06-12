import { HEIGHT_SCALE_MAX, PALETTE } from '../game/constants';
import { waistYForHeight } from '../game/world';
import type { World } from '../game/types';

interface Props {
  world: World;
  groundY: number;
}

// Thin vertical ruler on the left edge. Labels sit just below their tick marks (not
// beside them) so the bar can stay narrow. It starts just above the top tick (50 kg),
// which the height scale keeps below the HUD pills.
export function HeightMeter({ groundY }: Props) {
  const panelX = 0;
  const panelWidth = 24;
  const panelTop = Math.max(12, waistYForHeight(HEIGHT_SCALE_MAX, groundY) - 8);
  const panelBottom = groundY - 6;
  const railX = panelX + panelWidth / 2;
  // Start at 0 so the ground line shows a tick — but it gets no text label.
  const ticks: number[] = [];
  for (let value = 0; value <= HEIGHT_SCALE_MAX; value += 10) ticks.push(value);

  return (
    <g>
      <rect x={panelX} y={panelTop} width={panelWidth} height={panelBottom - panelTop} fill="rgba(26,26,26,0.55)" />
      <line x1={railX} y1={panelTop + 4} x2={railX} y2={panelBottom - 4} stroke={PALETTE.cream} strokeWidth={2} strokeLinecap="round" />
      <g style={{ font: '800 8px JetBrains Mono, ui-monospace, monospace' }} textAnchor="middle">
        {ticks.map((meter) => {
          const tickY = waistYForHeight(meter, groundY);
          // Skip ticks that would fall above the panel (i.e. behind the pills).
          if (tickY < panelTop + 2) return null;
          const tickLength = 12;
          return (
            <g key={meter}>
              <line
                x1={railX - tickLength / 2}
                y1={tickY}
                x2={railX + tickLength / 2}
                y2={tickY}
                stroke={PALETTE.cream}
                strokeWidth={2}
                strokeLinecap="round"
              />
              {meter > 0 && (
                <text
                  x={railX}
                  y={tickY + 8}
                  fill={PALETTE.cream}
                  stroke={PALETTE.ink}
                  strokeWidth={2.4}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  dominantBaseline="middle"
                >
                  {meter}kg
                </text>
              )}
            </g>
          );
        })}
      </g>
    </g>
  );
}
