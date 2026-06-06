// Logical world dimensions and physics constants.
// The world renders into a fixed-width SVG that scales to the viewport.
export const WORLD_WIDTH = 420;
export const GROUND_OFFSET_FROM_BOTTOM = 60;

export const MOVE_SPEED = 3.0;
export const SCROLL_SPEED = 1.5;
export const ANCHOR_SPAWN_INTERVAL = 60; // fixed steps between anchor spawns (60/sec → 1s)
export const ANCHOR_SPACING_PIXELS = ANCHOR_SPAWN_INTERVAL * SCROLL_SPEED; // scroll distance between clips
export const ANCHOR_CLIP_HEIGHT_TOLERANCE = 14;
export const ANCHOR_CLIP_X_TOLERANCE = 10;
// Height/force meter geometry. The climber's waist spans heights 0..HEIGHT_SCALE_MAX
// between HEIGHT_METER_TOP_OFFSET (px from the world top) and groundY - HEIGHT_METER_BOTTOM_OFFSET.
// The ruler, the target marker, the force-driven climber position, and the bolt
// anchors ALL use this single mapping (see waistYForHeight) so a given program
// height lines up everywhere.
export const HEIGHT_SCALE_MAX = 50;
export const HEIGHT_METER_TOP_OFFSET = 38;
export const HEIGHT_METER_BOTTOM_OFFSET = 12;

export const WALL_SEED = 5;
export const WALL_HEADROOM_PIXELS = 28;        // rock always rises this far above an elevated clip
export const WALL_PEAK_AMPLITUDE_PIXELS = 72;  // extra rolling peak height layered on for variation
export const WALL_FADE_UNITS = 6;              // target height below which the wall fades to bare ground
export const ROPE_SAMPLE_FRAMES = 2;
export const ROPE_PIXEL_STEP = SCROLL_SPEED * ROPE_SAMPLE_FRAMES;
export const ROPE_MAX_SAMPLES = 52;

export const GRASS_CAP_HEIGHT = 20;
export const CLIMBER_DRAW_SIZE = 80;
export const CLIMBER_WAIST_RATIO = 92 / 128; // matches the y=92 waist anchor in the 128×128 SVGs

// Tindeq BLE
export const PROGRESSOR_SERVICE = '7e4e1701-1ea6-40c9-9dcc-13d34ffead57';
export const DATA_CHARACTERISTIC_UUID = '7e4e1702-1ea6-40c9-9dcc-13d34ffead57';
export const CONTROL_POINT_UUID = '7e4e1703-1ea6-40c9-9dcc-13d34ffead57';
export const COMMAND_TARE_SCALE = 100;
export const COMMAND_START_WEIGHT_MEASUREMENT = 101;
export const RESPONSE_WEIGHT_MEASUREMENT = 1;

export const PALETTE = {
  ink: '#1A1A1A',
  cream: '#FFF6E5',
  teal: '#1FD5C8',
  pink: '#FF3D8A',
  yellow: '#FFD23F',
  purple: '#7A2BD9',
  skin: '#F2C9A0',
  skyTop: '#5BB8EE',
  skyMid: '#8FD2F2',
  skyBottom: '#CDEBF8',
  farPeaks: '#AFC8DC',
  midPeaks: '#88A8C6',
  horizonHaze: '#DCEBF6',
  valleyFloor: '#3E6B43',
  valleyTop: '#5E8C4E',
} as const;
