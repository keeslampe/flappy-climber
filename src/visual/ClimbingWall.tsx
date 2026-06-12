import { memo, useMemo } from 'react';
import { PALETTE, WALL_SEED } from '../game/constants';
import { sampleWallCrest } from '../game/mountainProfile';
import { createRandom } from '../game/randomNumberGenerator';
import type { World } from '../game/types';

const SAMPLE_COUNT = 64;

// Rock wall colour palette — granite tones from the Valley Climb design.
const ROCK = {
  base: '#8C8A86',
  dark: '#6E6C68',
  light: '#ABA9A4',
  deep: '#56544F',
  crack: '#2A2926',
  moss: '#5C7A4E',
};

interface Props {
  world: World;
  worldWidth: number;
  groundY: number;
}

// Pure SVG generative rock wall. The top edge (crest) follows the workout target
// height, rising on 'on Z height' events and dropping to the ground on 'rest'.
// The rock texture (strata, cracks, pockets, pebbles) is seeded and tiles
// seamlessly as it scrolls horizontally.
export function ClimbingWall({ world, worldWidth, groundY }: Props) {
  const crestPoints = sampleWallCrest(world, worldWidth, groundY, SAMPLE_COUNT);

  // Build the filled face polygon: crest points top → right-bottom → left-bottom
  const crestPath = crestPoints
    .map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');
  const facePath = `${crestPath} L ${worldWidth} ${groundY} L 0 ${groundY} Z`;

  // Ridge ink line path (just the top edge)
  const ridgePath = crestPoints
    .map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');

  const wallWidth = worldWidth;
  const wallHeight = groundY;
  const clipId = 'wall-clip';

  // The rock texture (strata, cracks, pockets, pebbles) depends only on the wall
  // dimensions, not on the scroll — recomputing and re-rendering its hundreds of
  // nodes every animation frame is what made mobile lag. Build it once per size and
  // render it through a memoized panel so React skips reconciling it each frame;
  // only the two panels' translate offsets change as the wall scrolls.
  const texture = useMemo(
    () => buildWallTexture(wallWidth, wallHeight),
    [wallWidth, wallHeight],
  );

  // Scroll offset — two panels side-by-side for seamless tiling
  const scrollOffset = world.backgroundScrollY % worldWidth;

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={facePath} />
        </clipPath>
        <linearGradient id="wall-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ROCK.light} />
          <stop offset="55%" stopColor={ROCK.base} />
          <stop offset="100%" stopColor={ROCK.dark} />
        </linearGradient>
      </defs>

      {/* Rock face fill */}
      <path d={facePath} fill={`url(#wall-gradient)`} />

      {/* Texture clipped to the face polygon */}
      <g clipPath={`url(#${clipId})`}>
        {/* Three copies (left/centre/right) for seamless scroll. A third tile is needed
            because cracks wander far outside their own tile width — with only two tiles
            a line whose origin sits in the off-screen tile would pop in late as it
            scrolled on. Only these transforms change per frame; the panel is memoized. */}
        {[-1, 0, 1].map((tile) => (
          <g key={tile} transform={`translate(${tile * worldWidth - scrollOffset} 0)`}>
            <WallTexturePanel texture={texture} wallWidth={wallWidth} wallHeight={wallHeight} />
          </g>
        ))}

        {/* Aerial perspective tint — makes the face read lit by the sky */}
        <path d={facePath} fill="rgba(180,220,255,0.42)" style={{ mixBlendMode: 'soft-light' }} opacity="0.6" />
      </g>

      {/* Ridge ink line */}
      <path d={ridgePath} fill="none" stroke={PALETTE.ink} strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
      {/* Sunlit rim just under the ridge */}
      <path d={ridgePath} fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" transform="translate(0 2)" opacity="0.5" />
    </g>
  );
}

interface WallTexture {
  strata: Array<{ path: string; dark: boolean }>;
  cracks: Array<{ path: string; strokeWidth: number; branches: string[] }>;
  pockets: Array<{ cx: number; cy: number; rx: number; ry: number }>;
  pebbles: Array<{ cx: number; cy: number; rx: number; ry: number; dark: boolean }>;
}

// Builds the seeded rock texture for a wall of the given size. Pure and
// deterministic (WALL_SEED × 97 + 13 matches the design bundle's rng init) so the
// texture tiles seamlessly and doesn't swim as it scrolls.
function buildWallTexture(wallWidth: number, wallHeight: number): WallTexture {
  const textureRandom = createRandom(WALL_SEED * 97 + 13);

  // Strata bands — wavy horizontal lines
  const bandCount = Math.max(6, Math.round(wallHeight / 46));
  const strata: WallTexture['strata'] = [];
  for (let bandIndex = 1; bandIndex <= bandCount; bandIndex++) {
    const baseY = (bandIndex / (bandCount + 1)) * wallHeight + (textureRandom() - 0.5) * 12;
    const amp1 = 7 * (0.55 + textureRandom() * 0.6);
    const amp2 = 5 * (0.55 + textureRandom() * 0.6);
    const amp3 = 2.5 * (0.55 + textureRandom() * 0.6);
    const phase1 = textureRandom() * Math.PI * 2;
    const phase2 = textureRandom() * Math.PI * 2;
    const phase3 = textureRandom() * Math.PI * 2;
    const steps = 22;
    const points: string[] = [];
    for (let step = 0; step <= steps; step++) {
      const x = (step / steps) * wallWidth;
      const wave =
        amp1 * Math.sin((Math.PI * 2 * x) / wallWidth + phase1) +
        amp2 * Math.sin((2 * Math.PI * 2 * x) / wallWidth + phase2) +
        amp3 * Math.sin((3 * Math.PI * 2 * x) / wallWidth + phase3);
      points.push(`${step === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${(baseY + wave).toFixed(1)}`);
    }
    strata.push({ path: points.join(' '), dark: bandIndex % 2 === 0 });
  }

  // Cracks — jagged fissures
  const crackCount = Math.max(4, Math.round(wallWidth / 140));
  const cracks: WallTexture['cracks'] = [];
  for (let crackIndex = 0; crackIndex < crackCount; crackIndex++) {
    let crackX = textureRandom() * wallWidth;
    let crackY = -6;
    const points: string[] = [`M ${crackX.toFixed(1)} ${crackY}`];
    const branches: string[] = [];
    while (crackY < wallHeight - 20) {
      crackY += 16 + textureRandom() * 24;
      crackX += (textureRandom() - 0.5) * 44;
      points.push(`L ${crackX.toFixed(1)} ${crackY.toFixed(1)}`);
      if (textureRandom() > 0.8) {
        const branchX = crackX + (textureRandom() - 0.5) * 26;
        const branchY = crackY + 12 + textureRandom() * 18;
        branches.push(`M ${crackX.toFixed(1)} ${crackY.toFixed(1)} L ${branchX.toFixed(1)} ${branchY.toFixed(1)}`);
      }
    }
    cracks.push({ path: points.join(' '), strokeWidth: 2.2 + textureRandom() * 2, branches });
  }

  // Pockets / pock-marks
  const pocketCount = Math.round((wallWidth * wallHeight) / 10000);
  const pockets: WallTexture['pockets'] = [];
  for (let pocketIndex = 0; pocketIndex < pocketCount; pocketIndex++) {
    pockets.push({
      cx: textureRandom() * wallWidth,
      cy: textureRandom() * (wallHeight - 20),
      rx: 4 + textureRandom() * 8,
      ry: 3 + textureRandom() * 5,
    });
  }

  // Pebbles embedded in the rock surface
  const pebbleCount = Math.round((wallWidth * wallHeight) / 6200);
  const pebbles: WallTexture['pebbles'] = [];
  for (let pebbleIndex = 0; pebbleIndex < pebbleCount; pebbleIndex++) {
    pebbles.push({
      cx: textureRandom() * wallWidth,
      cy: textureRandom() * (wallHeight - 8),
      rx: 3 + textureRandom() * 6,
      ry: 2.4 + textureRandom() * 4,
      dark: textureRandom() > 0.5,
    });
  }

  return { strata, cracks, pockets, pebbles };
}

// Static rock texture for one tile. Memoized so React skips reconciling its
// hundreds of nodes on every scroll frame — only the wrapping <g translate> moves.
const WallTexturePanel = memo(function WallTexturePanel({
  texture,
  wallWidth,
  wallHeight,
}: {
  texture: WallTexture;
  wallWidth: number;
  wallHeight: number;
}) {
  const { strata, cracks, pockets, pebbles } = texture;
  return (
    <>
      {/* Strata bands */}
      {strata.map((band, index) => (
        <g key={index}>
          <path
            d={`${band.path} L ${wallWidth} ${wallHeight} L 0 ${wallHeight} Z`}
            fill={band.dark ? ROCK.dark : ROCK.light}
            opacity={band.dark ? 0.34 : 0.22}
          />
          <path d={band.path} fill="none" stroke={ROCK.crack} strokeWidth="1.7" opacity="0.4" />
        </g>
      ))}

      {/* Cracks */}
      {cracks.map((crack, index) => (
        <g key={index}>
          <path
            d={crack.path}
            fill="none"
            stroke={ROCK.crack}
            strokeWidth={crack.strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.72"
          />
          {crack.branches.map((branchPath, branchIndex) => (
            <path
              key={branchIndex}
              d={branchPath}
              fill="none"
              stroke={ROCK.crack}
              strokeWidth={crack.strokeWidth * 0.7}
              strokeLinecap="round"
              opacity="0.6"
            />
          ))}
          <path
            d={crack.path}
            fill="none"
            stroke={ROCK.light}
            strokeWidth="1.1"
            opacity="0.35"
            transform="translate(1.6 0)"
          />
        </g>
      ))}

      {/* Pockets */}
      {pockets.map((pocket, index) => (
        <g key={index}>
          <ellipse cx={pocket.cx} cy={pocket.cy} rx={pocket.rx} ry={pocket.ry} fill={ROCK.deep} opacity="0.45" />
          <ellipse cx={pocket.cx} cy={pocket.cy - pocket.ry * 0.4} rx={pocket.rx * 0.7} ry={pocket.ry * 0.5} fill={ROCK.light} opacity="0.28" />
        </g>
      ))}

      {/* Pebbles */}
      {pebbles.map((pebble, index) => (
        <g key={index} stroke={PALETTE.ink} strokeWidth="1.4" strokeLinejoin="round">
          <ellipse cx={pebble.cx} cy={pebble.cy} rx={pebble.rx} ry={pebble.ry} fill={pebble.dark ? ROCK.deep : ROCK.light} opacity="0.92" />
          <ellipse cx={pebble.cx - pebble.rx * 0.25} cy={pebble.cy - pebble.ry * 0.3} rx={pebble.rx * 0.4} ry={pebble.ry * 0.35} fill={PALETTE.cream} stroke="none" opacity="0.3" />
        </g>
      ))}
    </>
  );
});
