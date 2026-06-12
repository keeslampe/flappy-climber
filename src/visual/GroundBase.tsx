interface Props {
  worldWidth: number;
  groundY: number;
  viewportHeight: number;
  groundOffset: number;
}

function GroundTile({ x }: { x: number }) {
  return (
    <g transform={`translate(${x}, 0)`}>
      <rect x="0" y="0" width="800" height="120" fill="#7A4F2E" />
      <rect x="0" y="66" width="800" height="54" fill="#5C3A20" />
      <g fill="#3C2412">
        <circle cx="0"   cy="29.6"  r="1.5" />
        <circle cx="71"  cy="66.6"  r="2.5" />
        <circle cx="142" cy="103.6" r="3.5" />
        <circle cx="213" cy="54.2"  r="1.5" />
        <circle cx="284" cy="91.2"  r="2.5" />
        <circle cx="355" cy="41.8"  r="3.5" />
        <circle cx="426" cy="78.8"  r="1.5" />
        <circle cx="497" cy="115.8" r="2.5" />
        <circle cx="568" cy="66.4"  r="3.5" />
        <circle cx="639" cy="103.4" r="1.5" />
        <circle cx="710" cy="54.0"  r="2.5" />
        <circle cx="781" cy="91.0"  r="3.5" />
        <circle cx="52"  cy="41.6"  r="1.5" />
        <circle cx="123" cy="78.6"  r="2.5" />
        <circle cx="194" cy="115.6" r="3.5" />
        <circle cx="265" cy="66.2"  r="1.5" />
        <circle cx="336" cy="103.2" r="2.5" />
        <circle cx="407" cy="53.8"  r="3.5" />
        <circle cx="478" cy="90.8"  r="1.5" />
        <circle cx="549" cy="41.4"  r="2.5" />
        <circle cx="620" cy="78.4"  r="3.5" />
        <circle cx="691" cy="115.4" r="1.5" />
        <circle cx="762" cy="66.0"  r="2.5" />
        <circle cx="33"  cy="103.0" r="3.5" />
        <circle cx="104" cy="53.6"  r="1.5" />
        <circle cx="175" cy="90.6"  r="2.5" />
        <circle cx="246" cy="41.2"  r="3.5" />
        <circle cx="317" cy="78.2"  r="1.5" />
      </g>
      <g stroke="#1A1A1A" strokeWidth="1.6" strokeLinejoin="round">
        <ellipse cx="40"  cy="106" rx="10" ry="4.5" fill="#A98266" />
        <ellipse cx="177" cy="99"  rx="10" ry="4.5" fill="#A98266" />
        <ellipse cx="314" cy="100" rx="10" ry="4.5" fill="#A98266" />
        <ellipse cx="451" cy="101" rx="10" ry="4.5" fill="#A98266" />
        <ellipse cx="588" cy="102" rx="10" ry="4.5" fill="#A98266" />
        <ellipse cx="725" cy="103" rx="10" ry="4.5" fill="#A98266" />
      </g>
      <path
        d="M 0 21.6 L 50 18.6 L 100 22.6 L 150 19.6 L 200 23.6 L 250 15.6 L 300 24.6 L 350 16.6 L 400 25.6 L 450 17.6 L 500 21.6 L 550 18.6 L 600 22.6 L 650 19.6 L 700 23.6 L 750 15.6 L 800 21.6 L 800 0 L 0 0 Z"
        fill="#4F8252"
      />
      <path
        d="M -1 21.6 L 50 18.6 L 100 22.6 L 150 19.6 L 200 23.6 L 250 15.6 L 300 24.6 L 350 16.6 L 400 25.6 L 450 17.6 L 500 21.6 L 550 18.6 L 600 22.6 L 650 19.6 L 700 23.6 L 750 15.6 L 801 21.6"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="butt"
      />
      <path d="M -1 11.9 L 801 11.9" stroke="#7BB07F" strokeWidth="3" opacity="0.6" />
      <g stroke="#2A4A2E" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M 10 19.6 L 8 12.6" />
        <path d="M 57 19.6 L 59 12.6" />
        <path d="M 104 19.6 L 102 12.6" />
        <path d="M 151 19.6 L 153 12.6" />
        <path d="M 198 19.6 L 196 12.6" />
        <path d="M 245 19.6 L 247 12.6" />
        <path d="M 292 19.6 L 290 12.6" />
        <path d="M 339 19.6 L 341 12.6" />
        <path d="M 386 19.6 L 384 12.6" />
        <path d="M 433 19.6 L 435 12.6" />
        <path d="M 480 19.6 L 478 12.6" />
        <path d="M 527 19.6 L 529 12.6" />
        <path d="M 574 19.6 L 572 12.6" />
        <path d="M 621 19.6 L 623 12.6" />
        <path d="M 668 19.6 L 666 12.6" />
        <path d="M 715 19.6 L 717 12.6" />
        <path d="M 762 19.6 L 760 12.6" />
        <path d="M 9 19.6 L 11 12.6" />
        <path d="M 56 19.6 L 54 12.6" />
        <path d="M 103 19.6 L 105 12.6" />
        <path d="M 150 19.6 L 148 12.6" />
        <path d="M 197 19.6 L 199 12.6" />
      </g>
    </g>
  );
}

const TILE_WIDTH = 800;
// The tile is 120 tall with the grass cap (green fill + blades) in its top ~30 units.
// We draw that grass band into a FIXED-height strip so the climber's feet (which sit a
// little below groundY) always land on green, then squash the remaining dirt into a
// thin strip below it — independent of how short the whole ground band is.
const TILE_GRASS_VIEWBOX = 30; // tile units allotted to the grass cap
const GRASS_STRIP_HEIGHT = 18; // on-screen (logical) height of the grass cap

export function GroundBase({ worldWidth, groundY, viewportHeight, groundOffset }: Props) {
  const scrollX = (groundOffset % worldWidth) / worldWidth * TILE_WIDTH;
  const bandHeight = viewportHeight - groundY;
  const grassHeight = Math.min(GRASS_STRIP_HEIGHT, bandHeight);
  const dirtHeight = bandHeight - grassHeight;

  return (
    <>
      {/* Grass cap — fixed height so the climber walks on green regardless of band size */}
      <svg
        x={0}
        y={groundY}
        width={worldWidth}
        height={grassHeight}
        viewBox={`0 0 ${TILE_WIDTH} ${TILE_GRASS_VIEWBOX}`}
        preserveAspectRatio="none"
      >
        <GroundTile x={-scrollX} />
        <GroundTile x={TILE_WIDTH - scrollX} />
      </svg>

      {/* Dirt below the grass — the remainder of the tile squashed into a thin strip */}
      {dirtHeight > 0 && (
        <svg
          x={0}
          y={groundY + grassHeight}
          width={worldWidth}
          height={dirtHeight}
          viewBox={`0 ${TILE_GRASS_VIEWBOX} ${TILE_WIDTH} ${120 - TILE_GRASS_VIEWBOX}`}
          preserveAspectRatio="none"
        >
          <GroundTile x={-scrollX} />
          <GroundTile x={TILE_WIDTH - scrollX} />
        </svg>
      )}
    </>
  );
}
