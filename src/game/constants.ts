// Logical world dimensions and physics constants.
// The world renders into a fixed-width SVG that scales to the viewport.
export const WORLD_WIDTH = 420;
export const GROUND_OFFSET_FROM_BOTTOM = 60;

export const MOVE_SPEED = 3.0;
export const SCROLL_SPEED = 1.5;
export const OBSTACLE_INTERVAL = 115;
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
} as const;
